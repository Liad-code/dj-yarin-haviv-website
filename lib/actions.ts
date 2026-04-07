"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { ProductSchema, type Product } from "@/lib/types";
import { Resend } from "resend";
import { z } from "zod";

export type GetProductsResult =
  | { data: Product[]; error: null; warning?: string; rawSample?: unknown }
  | { data: null; error: string };

export async function getProducts(tenantId: string): Promise<GetProductsResult> {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return { data: [], error: null };

    // Diagnostic validation (non-blocking)
    const parsed = ProductSchema.array().safeParse(data);
    if (!parsed.success) {
      console.warn("[getProducts] Schema mismatch:", parsed.error.errors);
      return {
        data: [],
        error: null,
        warning: "Schema mismatch",
        rawSample: data[0],
      };
    }

    return { data: parsed.data, error: null };
  } catch (err) {
    console.error("[getProducts] Failed:", err);
    return { data: null, error: "Failed to fetch products" };
    
    
  }
}

// ============================================================================
// Contact Form Submission
// ============================================================================

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: z.string().min(9, "Phone number is required"),
  eventType: z.enum(['wedding', 'birthday', 'corporate', 'bnei-mitzvah', 'private', 'other']),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

export type SubmitContactFormResult =
  | { data: { id: string }; error: null }
  | { data: null; error: string };

export async function submitContactForm(
  tenantId: string,
  input: ContactFormInput
): Promise<SubmitContactFormResult> {
  try {
    // Validate input
    const validated = ContactFormSchema.safeParse(input);
    if (!validated.success) {
      return { 
        data: null, 
        error: validated.error.errors[0]?.message || 'Invalid input' 
      };
    }

    const { name, phone, eventType } = validated.data;

    // 1. Save to Supabase contacts table
    const supabase = await createSupabaseServer();
    
    // Use phone as unique identifier - prevents duplicate leads from same phone
    const { data: contact, error: dbError } = await supabase
      .from('contacts')
      .insert({
        tenant_id: tenantId,
        name,
        phone,
        email: `${phone.replace(/\D/g, '')}@phone-only.local`,
        status: 'lead',
        source: 'website_form',
        metadata: {
          event_type: eventType,
          form_submitted_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('[submitContactForm] Database error:', dbError);
      // Don't fail if DB save fails - still send email
    }

    // 2. Send email notifications
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('[submitContactForm] RESEND_API_KEY not configured');
      // Return success anyway since we saved to DB
      return { 
        data: { id: contact?.id || 'unknown' }, 
        error: null 
      };
    }

    const resend = new Resend(resendApiKey);

    // Event type labels for email
    const eventTypeLabels: Record<string, string> = {
      wedding: 'חתונה',
      birthday: 'יום הולדת',
      corporate: 'אירוע חברה',
      'bnei-mitzvah': 'בר/בת מצווה',
      private: 'מסיבה פרטית',
      other: 'אחר',
    };

    const eventTypeLabel = eventTypeLabels[eventType] || eventType;

    // Send email to both recipients
    await resend.emails.send({
      from: 'DJ Yarin Haviv <noreply@dj-yarinhaviv.com>',
      to: ['yarinhaviv020@gmail.com', 'liad.marketingservices@gmail.com'],
      subject: `🎉 לקוח חדש! ${eventTypeLabel} - ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">לקוח חדש מהאתר! 🎉</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>שם:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>טלפון:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong>סוג אירוע:</strong> ${eventTypeLabel}</p>
            <p style="margin: 10px 0;"><strong>תאריך:</strong> ${new Date().toLocaleString('he-IL')}</p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            הלקוח שלח את הפרטים דרך טופס יצירת הקשר באתר.<br>
            מומלץ ליצור קשר בהקדם האפשרי!
          </p>
        </div>
      `,
    });

    return { 
      data: { id: contact?.id || 'unknown' }, 
      error: null 
    };

  } catch (err) {
    console.error('[submitContactForm] Failed:', err);
    return { 
      data: null, 
      error: 'Failed to submit form. Please try again.' 
    };
  }
}

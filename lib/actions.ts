"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase";
import { ProductSchema, type Product } from "@/lib/types";
import { Resend } from "resend";
import { z } from "zod";

export type GetProductsResult =
  | { data: Product[]; error: null; warning?: string; rawSample?: unknown }
  | { data: null; error: string };

function tsToIso(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return value;
}

export async function getProducts(tenantId: string): Promise<GetProductsResult> {
  try {
    const db = getDb();

    const snapshot = await db
      .collection("products")
      .where("tenant_id", "==", tenantId)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .get();

    if (snapshot.empty) return { data: [], error: null };

    const docs = snapshot.docs.map((doc) => {
      const raw = doc.data();
      return {
        ...raw,
        id: doc.id,
        created_at: tsToIso(raw.created_at),
        updated_at: tsToIso(raw.updated_at),
      };
    });

    const parsed = ProductSchema.array().safeParse(docs);
    if (!parsed.success) {
      console.warn("[getProducts] Schema mismatch:", parsed.error.errors);
      return {
        data: [],
        error: null,
        warning: "Schema mismatch",
        rawSample: docs[0],
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
    const validated = ContactFormSchema.safeParse(input);
    if (!validated.success) {
      return {
        data: null,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { name, phone, eventType } = validated.data;

    // 1. Save to Firestore `contacts` collection
    let contactId = 'unknown';
    try {
      const db = getDb();
      const ref = await db.collection('contacts').add({
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
        created_at: FieldValue.serverTimestamp(),
      });
      contactId = ref.id;
    } catch (dbError) {
      console.error('[submitContactForm] Firestore error:', dbError);
      // Don't fail if DB save fails - still send email
    }

    // 2. Send email notifications
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('[submitContactForm] RESEND_API_KEY not configured');
      return { data: { id: contactId }, error: null };
    }

    const resend = new Resend(resendApiKey);

    const eventTypeLabels: Record<string, string> = {
      wedding: 'חתונה',
      birthday: 'יום הולדת',
      corporate: 'אירוע חברה',
      'bnei-mitzvah': 'בר/בת מצווה',
      private: 'מסיבה פרטית',
      other: 'אחר',
    };

    const eventTypeLabel = eventTypeLabels[eventType] || eventType;

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

    return { data: { id: contactId }, error: null };

  } catch (err) {
    console.error('[submitContactForm] Failed:', err);
    return {
      data: null,
      error: 'Failed to submit form. Please try again.'
    };
  }
}

"use server";

import crypto from "crypto";

interface FacebookLeadData {
  eventId: string;
  name: string;
  phone: string;
  eventType: string;
  fbc?: string;      // Facebook click ID cookie (_fbc) for campaign attribution
  fbp?: string;      // Facebook browser ID cookie (_fbp) for user matching
  sourceUrl?: string; // Actual page URL with UTM/fbclid params
}

/**
 * Server-only handler to send Lead event to Facebook Conversions API
 * This runs on the server to keep access tokens secure
 */
export async function trackFacebookLead(
  data: FacebookLeadData
): Promise<{ success: boolean }> {
  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error(
      "[trackFacebookLead] Missing FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN"
    );
    return { success: false };
  }

  try {
    // Hash phone number with SHA256 for privacy
    const hashedPhone = crypto
      .createHash("sha256")
      .update(data.phone.replace(/\D/g, "")) // Remove non-digits before hashing
      .digest("hex");

    // Build user_data with optional Facebook cookies for attribution
    const userData: Record<string, unknown> = {
      ph: [hashedPhone], // hashed phone
    };
    
    // Add Facebook cookies if available (critical for campaign attribution)
    if (data.fbc) userData.fbc = data.fbc;
    if (data.fbp) userData.fbp = data.fbp;

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          event_source_url: data.sourceUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://djyarinhaviv.com",
          action_source: "website",
          user_data: userData,
          custom_data: {
            content_name: data.eventType,
            content_category: "dj_event_inquiry",
            value: 0,
            currency: "ILS",
          },
        },
      ],
      test_event_code: process.env.FB_TEST_EVENT_CODE, // Optional: for testing
    };

    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[trackFacebookLead] API error:", response.status, errorText);
      return { success: false };
    }

    const result = await response.json();
    console.log("[trackFacebookLead] Success:", result);
    return { success: true };
  } catch (error) {
    // Swallow errors - tracking failures should never block user experience
    console.error("[trackFacebookLead] Failed:", error);
    return { success: false };
  }
}


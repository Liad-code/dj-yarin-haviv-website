import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { tenantConfig } from "../tenant.config";
import { siteConfig } from "../site.config";
import { AccessibilityWidget } from "./components/AccessibilityWidget";
import "./globals.css";

// Optimized font loading - eliminates render-blocking CSS
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap", // Show fallback font immediately, swap when loaded
  variable: "--font-heebo",
  preload: true,
});

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    locale: tenantConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
};

/**
 * Sanitize Facebook Pixel ID to prevent injection attacks
 * Only allows numeric characters (valid FB Pixel IDs are numeric)
 */
function sanitizeFbPixelId(pixelId: string | undefined): string | null {
  if (!pixelId) return null;
  // FB Pixel IDs are numeric only, typically 15-16 digits
  const sanitized = pixelId.replace(/\D/g, '');
  // Validate it looks like a real pixel ID (15-16 digits)
  if (sanitized.length >= 15 && sanitized.length <= 16) {
    return sanitized;
  }
  console.warn('[layout] Invalid FB Pixel ID format');
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fbPixelId = sanitizeFbPixelId(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

  return (
    <html lang={tenantConfig.locale} dir={tenantConfig.rtl ? "rtl" : "ltr"} className={heebo.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Font loaded via next/font for optimal performance - no external CSS needed */}
        
        {/* Facebook Pixel - ID is sanitized to numeric only */}
        {fbPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');
              `.trim(),
            }}
          />
        )}
        {fbPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body className="antialiased">
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  );
}

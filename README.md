# DJ Yarin Haviv - Website

Landing page for DJ Yarin Haviv. Built with Next.js 15, Tailwind CSS 4, and Supabase.

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook Pixel ID |
| `FB_PIXEL_ID` | Facebook Pixel ID (server-side) |
| `FB_CAPI_ACCESS_TOKEN` | Facebook Conversions API token |
| `RESEND_API_KEY` | Resend email API key |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Deploy

## Project Structure

```
├── app/
│   ├── components/     # All UI components (Hero, Gallery, etc.)
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout (font, meta, Facebook Pixel)
│   └── page.tsx        # Main landing page
├── lib/
│   ├── actions.ts      # Server actions (contact form, products)
│   ├── facebook.ts     # Facebook CAPI helpers
│   ├── supabase.ts     # Supabase server client
│   ├── types.ts        # Zod schemas and TypeScript types
│   └── utils.ts        # Utility functions (cn)
├── public/
│   └── images/         # Static images (hero, gallery, events)
├── site.config.ts      # All site content (texts, videos, contact)
├── tenant.config.ts    # Tenant settings (locale, currency, features)
└── types/
    └── facebook-pixel.d.ts
```

## Editing Content

Most content is in **`site.config.ts`** -- hero text, services, about section, videos, contact info, SEO, and special offers.

Testimonials are in **`app/components/Testimonials.tsx`** in the `reviews` array.

Gallery images go in **`public/images/Gallery/`**.

Hero background images go in **`public/images/`** and are referenced in `site.config.ts` under `hero.images`.

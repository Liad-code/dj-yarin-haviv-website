import { siteConfig } from '../../site.config';
import { ContactForm } from './ContactForm';

export function FinalCTA() {
  return (
    <section className="relative px-4 py-20 md:py-28 bg-transparent">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-in-up">
        {/* Headline */}
        <h2 className="mb-6 text-4xl font-black text-[var(--color-text-primary)] md:text-5xl lg:text-6xl drop-shadow-lg">
          {siteConfig.finalCta.headline}
        </h2>

        {/* Subheadline */}
        <p className="mb-10 text-xl text-[var(--color-text-secondary)] md:text-2xl">
          {siteConfig.finalCta.subheadline}
        </p>

        {/* Contact Form */}
        <div className="mb-8">
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          {/* Phone Number (Clickable on Mobile) */}
          <a
            href={`tel:+${siteConfig.contact.whatsapp}`}
            className="group inline-flex items-center gap-2 text-lg font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="group-hover:underline">{siteConfig.contact.whatsappDisplay}</span>
          </a>

          {/* Or Separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[var(--color-border)]" />
            <span className="text-sm text-[var(--color-text-muted)]">או</span>
            <div className="h-px w-16 bg-[var(--color-border)]" />
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {/* Instagram */}
            {siteConfig.contact.instagram && (
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[var(--color-text-muted)] transition-colors hover:text-pink-500"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-sm group-hover:underline">עקבו באינסטגרם</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


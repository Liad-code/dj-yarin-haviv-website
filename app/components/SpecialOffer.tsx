import { siteConfig } from '../../site.config';
import { WhatsAppButton } from './WhatsAppButton';

export function SpecialOffer() {
  // Don't render if offer is not active
  if (!siteConfig.offer.active) {
    return null;
  }

  return (
    <section className="px-4 py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        {/* Offer Card */}
        <div className="accent-gradient relative overflow-hidden rounded-2xl p-8 shadow-2xl md:p-12">
          {/* Decorative Corner Element */}
          <div className="absolute -end-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl" />
          <div className="absolute -bottom-8 -start-8 h-32 w-32 rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl" />

          <div className="relative z-10">
            {/* Title */}
            <div className="mb-4 text-center">
              <h2 className="mb-2 text-3xl font-black text-[var(--color-text-primary)] md:text-4xl">
                {siteConfig.offer.title}
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] md:text-xl">
                {siteConfig.offer.description}
              </p>
            </div>

            {/* What's Included */}
            <div className="my-8 rounded-xl bg-[var(--color-bg-card)]/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-center text-lg font-bold text-[var(--color-accent)]">
                החבילה כוללת:
              </h3>
              <ul className="space-y-3">
                {siteConfig.offer.includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {/* Checkmark Icon */}
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]">
                      <svg
                        className="h-4 w-4 text-[var(--color-bg-primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-[var(--color-text-primary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <WhatsAppButton
                text={siteConfig.offer.cta}
                size="lg"
                customMessage="היי ירין! רוצה לשמוע על ההטבה המיוחדת 🎉"
                className="shadow-lg"
              />
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                מקומות מוגבלים - אל תחמיצו!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


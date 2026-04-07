import { siteConfig } from '../../site.config';

export function Services() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl lg:text-5xl">
            כל מה שאירוע צריך
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] md:text-xl">
            חבילה מלאה שתהפוך את האירוע שלכם לבלתי נשכח
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.services.map((service, index) => (
            <div
              key={index}
              className="card-glow group rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-2"
            >
              {/* Title with Background Image */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundImage: 'url(/images/party-bg.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-pink-900/60" />
                <h3 className="relative px-4 py-6 text-xl font-black uppercase tracking-wide text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


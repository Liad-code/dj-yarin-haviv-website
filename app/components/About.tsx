import { siteConfig } from '../../site.config';
import Image from 'next/image';

export function About() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="card-glow overflow-hidden rounded-2xl">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Image Side */}
            <div className="relative hidden min-h-[400px] overflow-hidden bg-[var(--color-bg-secondary)] md:block">
              <Image
                src="/images/yarin-photo.jpg"
                alt="DJ Yarin Haviv"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center p-8 md:p-12">
              {/* Title */}
              <h2 className="mb-6 text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
                {siteConfig.about.title}
              </h2>

              {/* Bio Content */}
              <p className="mb-8 leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                {siteConfig.about.content}
              </p>

              {/* Signature/Highlight */}
              <div className="border-s-4 border-[var(--color-accent)] bg-[var(--color-bg-secondary)] p-4 ps-6">
                <p className="text-lg font-semibold italic text-[var(--color-accent)]">
                  "דיג'יי טוב שומע את המוזיקה.
                  <br />
                  דיג'יי אמיתי שומע את האנשים."
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">- ירין חביב</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


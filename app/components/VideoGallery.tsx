'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig } from '../../site.config';
import { VideoGalleryItem } from './VideoGalleryItem';

export function VideoGallery() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { videos } = siteConfig;
  
  // Don't render if no videos configured
  if (!videos?.items?.length) return null;

  const [featuredVideo, ...restVideos] = videos.items;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { rootMargin: '100px' } // Start loading when section is 100px away
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Separate shorts from regular videos for better grid layout
  const shorts = restVideos.filter((v) => v.type === 'short');
  const regularVideos = restVideos.filter((v) => v.type === 'video');

  return (
    <section className="relative py-20 bg-transparent" ref={sectionRef}>
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
          {videos.title}
        </h2>

        {shouldLoad ? (
          <div className="space-y-8">
            {/* Featured Video */}
            <div
              className={cn(
                'mx-auto',
                featuredVideo.type === 'short' ? 'max-w-sm' : 'max-w-4xl'
              )}
            >
              <VideoGalleryItem
                id={featuredVideo.id}
                type={featuredVideo.type}
                featured
              />
            </div>

            {/* Regular Videos Grid */}
            {regularVideos.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularVideos.map((video) => (
                  <VideoGalleryItem
                    key={video.id}
                    id={video.id}
                    type={video.type}
                  />
                ))}
              </div>
            )}

            {/* Shorts Grid */}
            {shorts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {shorts.map((video) => (
                  <VideoGalleryItem
                    key={video.id}
                    id={video.id}
                    type={video.type}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="animate-pulse text-[var(--color-text-muted)]">
              טוען סרטונים...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

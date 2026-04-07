'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoGalleryItemProps {
  id: string;
  type: 'video' | 'short';
  featured?: boolean;
}

export function VideoGalleryItem({ id, type, featured = false }: VideoGalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const isShort = type === 'short';

  // YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  // YouTube embed URL with all necessary params for reliable playback
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;

  const handleClick = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-black',
        featured ? 'card-glow' : '',
        isShort ? 'aspect-[9/16]' : 'aspect-video'
      )}
    >
      {isLoaded ? (
        // Use standard iframe embed - most reliable approach
        <iframe
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        // Thumbnail with play button
        <button
          onClick={handleClick}
          className="relative h-full w-full cursor-pointer"
          aria-label="הפעל סרטון"
        >
          <img
            src={thumbnailUrl}
            alt="תמונה ממוזערת של הסרטון"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
              <svg
                className="h-8 w-8 text-white md:h-10 md:w-10"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-2 end-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1">
            <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-xs text-white">YouTube</span>
          </div>
        </button>
      )}
    </div>
  );
}

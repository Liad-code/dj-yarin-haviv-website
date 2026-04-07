'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryGridProps {
  images: string[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div 
            key={image} 
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white/5 transition-all hover:border-[var(--color-accent)]/50 hover:shadow-lg hover:shadow-purple-500/20"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={`/images/Gallery/${image}`}
              alt={`Gallery image ${image}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Hover Overlay with Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg 
                className="h-8 w-8 text-white drop-shadow-lg transform scale-90 transition-transform duration-300 group-hover:scale-100" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:top-8 md:right-8"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Container */}
          <div 
            className="relative h-full w-full max-w-5xl overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()} 
          >
             <Image
                src={`/images/Gallery/${selectedImage}`}
                alt="Gallery preview"
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="100vw"
             />
          </div>
        </div>
      )}
    </>
  );
}


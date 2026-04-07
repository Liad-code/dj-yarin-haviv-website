'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  interval?: number;
  alt?: string;
}

export function ImageSlider({ images, interval = 5000, alt = 'Hero image' }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 hero-slide transition-opacity duration-1500 ${
            index === currentIndex ? 'active opacity-100' : 'inactive opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`${alt} ${index + 1}`}
            fill
            priority={index === 0}
            className={`object-cover object-center ${
              index === 0 ? 'md:object-[center_25%]' : 'md:object-center'
            }`}
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}
      
      {/* Dark overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
    </div>
  );
}


'use client';

import { useState } from 'react';
import { siteConfig } from '../../site.config';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Elegant icon mapping for each event type
const eventTypeData: Record<string, { icon: string; bg: string; overlay: string; text: string }> = {
  'חתונות': {
    icon: '♕',
    bg: '/images/events/wedding.jpg',
    overlay: 'from-rose-900/80 via-pink-900/70 to-purple-900/80',
    text: 'הרגע הכי חשוב בחיים שלכם צריך להיות בידיים טובות. 💍'
  },
  'ימי הולדת': {
    icon: '★',
    bg: '/images/events/birthday.jpg',
    overlay: 'from-amber-900/80 via-orange-900/70 to-red-900/80',
    text: 'כל האווירה, כל האנשים, כל האנרגיה – בערב אחד שמוקדש רק לך. 🎂'
  },
  'אירועי חברה': {
    icon: '◆',
    bg: '/images/events/corporate.jpg',
    overlay: 'from-slate-900/80 via-blue-900/70 to-indigo-900/80',
    text: 'מרימים את המורל של הצוות עם אנרגיות מטורפות 🔥'
  },
  'בר/בת מצווה': {
    icon: '✦',
    bg: '/images/events/bnei-mitzvah.jpg',
    overlay: 'from-cyan-900/80 via-teal-900/70 to-emerald-900/80',
    text: 'הילד/ה שלכם במרכז הבמה - חוויה שתיזכר לנצח ✡️'
  },
  'מסיבות פרטיות': {
    icon: '◈',
    bg: '/images/events/private.jpg',
    overlay: 'from-violet-900/80 via-purple-900/70 to-fuchsia-900/80',
    text: 'מסיבה פרטית ברמה של מועדון - אצלכם בבית 🎉'
  },
};

// Mobile order mapping (CSS order classes)
// Mobile: חתונות, אירועי חברה, מסיבות פרטיות, בר/בת מצווה, ימי הולדת
// Desktop: חתונות, ימי הולדת, אירועי חברה, בר/בת מצווה, מסיבות פרטיות (original)
const mobileOrderClass: Record<string, string> = {
  'חתונות': 'order-1 sm:order-1',
  'ימי הולדת': 'order-5 sm:order-2',
  'אירועי חברה': 'order-2 sm:order-3',
  'בר/בת מצווה': 'order-4 sm:order-4',
  'מסיבות פרטיות': 'order-3 sm:order-5',
};

function FlipCard({ eventType, data }: { eventType: string; data: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        'group relative h-32 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]',
        'cursor-pointer transition-transform duration-500 hover:scale-105',
        mobileOrderClass[eventType]
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative h-full w-full">
        {/* Front Side */}
        <div
          className={cn(
            'absolute inset-0 overflow-hidden rounded-2xl border border-white/10',
            'transition-all duration-500 group-hover:border-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/20',
            isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={data.bg}
              alt={eventType}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br transition-opacity duration-500',
              'group-hover:opacity-90',
              data.overlay
            )}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-4">
            {/* Elegant Icon */}
            <div className="text-3xl font-light text-white/90 transition-all duration-500 group-hover:scale-125 group-hover:text-white">
              {data.icon}
            </div>

            {/* Event Type Name */}
            <div className="text-lg font-bold text-white transition-all duration-300 group-hover:tracking-wide">
              {eventType}
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* Back Side */}
        <div
          className={cn(
            'absolute inset-0 overflow-hidden rounded-2xl border border-purple-500/50',
            'flex items-center justify-center p-4 text-center transition-opacity duration-500',
            isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Background for back side */}
          <div className={cn('absolute inset-0 bg-gradient-to-br', data.overlay)} />
          {/* Darken overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <p className="text-sm font-medium leading-relaxed text-white">
              {data.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceBadge() {
  return (
    <section className="relative z-10 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Event Types Showcase */}
        <div className="rounded-2xl p-8 text-center md:p-12">
          {/* Event Types Grid */}
          <div className="flex flex-wrap justify-center gap-4">
            {siteConfig.eventTypes.map((eventType, index) => {
              const data = eventTypeData[eventType] || {
                icon: '♪',
                bg: '/images/party-bg.jpg',
                overlay: 'from-gray-900/80 via-slate-900/70 to-zinc-900/80',
                text: 'אירוע בלתי נשכח'
              };

              return <FlipCard key={index} eventType={eventType} data={data} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

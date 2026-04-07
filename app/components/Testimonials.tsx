'use client';

import { useState } from 'react';

function StarIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

interface Review {
  id: string;
  name: string;
  date: string;
  type: string;
  rating: number;
  content: string;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'יפית',
    date: '25/9/25',
    type: 'בר/בת מצווה',
    rating: 5,
    content: 'אתה אחד ויחיד 🥰 עם המון רגש ואהבה הרמת לנו אירוע למופת!!! 🍀 אלפי תודות על ערב מושלם זכינו!!! תודה תודה ושוב תודה אין אלוף כמוך!!! מאחלת לך שתזכה לאושר שאתם גורם לאחרים!!!! אנחנו לא נשכח את הערב הבלתי נשכח הזה בזכותך ❤️ אלפי תודות',
  },
  {
    id: '2',
    name: 'שקד ועומר',
    date: '17/9/25',
    type: 'מסיבת רווקים/ות',
    rating: 5,
    content: 'אלוף אחד!!! היית מדהים אתמול, ענית בדיוק על הצורך של האירוע ועלית על הציפיות שלנו. ואיזה כיף שגם נשארת איתנו להרים עד הסוף! תודה ענקית ענקית על כל הערב ושוב על ההירתמות המהירה ❤️ מחכים להפגש שוב במאי 🥂',
  },
  {
    id: '3',
    name: 'הדר',
    date: '26/3/25',
    type: 'יום הולדת ילדים',
    rating: 5,
    content: 'ירין המון תודה על ערב מדהים. הילדים לא הפסיקו לרקוד!!! היה שמח וכיףףף אין עליך! 🙏🙏🙏',
  },
  {
    id: '4',
    name: 'בר',
    date: '29/1/25',
    type: 'יום הולדת מבוגרים',
    rating: 5,
    content: 'ירינוש, קודם כל ולפני הכל תודה ענקית. כל הבוקר אני מקבלת הודעות, על איזה מוסיקה טובה הייתה, איך קלעת בול למה שכולם אוהבים איך שמת הכל מהכל. מעריכה בטירוף שבאמת זרמת איתי ושמת כלללל מה שיכלתי לבקש. היה לא פחות ממושלם. הזרימה שלך לאורך המסיבה ואיך שהעפת לי את כולם זה לא מובן מאליו, לא שכחת שום דבר והיית פשוט מקצוען של החיים. לא שהיה לי ספק. תודה ענקית, ככ הרבה חברים שלי כבר דיברו על זה שהם רוצים אותך לאירועים ולחתונות.. אתה לא מבין. תודה ענקית ענקית ❤️ אתה הכי טוב',
  },
  {
    id: '5',
    name: 'אופק',
    date: '8/9/24',
    type: 'מסיבת רווקים/ות',
    rating: 5,
    content: 'תודה ירין אתה אלוף אין עליך בעולם הדיג״יי הכי טוב בפער!!!! הרמת את האווירה ויאללה משרינת אותך מעכשיו לאירועים שלי! תודה שוב ובהצלחה בימים הקרובים בהפקות מקווה שתספיק לנוח בין לבין שבת שלום ❤️',
  },
];

function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const MAX_LENGTH = 120;
  const shouldTruncate = review.content.length > MAX_LENGTH;
  const displayText = shouldTruncate && !isExpanded 
    ? review.content.slice(0, MAX_LENGTH) + '...'
    : review.content;

  return (
    <div className="card-glow break-inside-avoid rounded-xl p-6 transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-1">
        <span className="text-xl font-bold text-[var(--color-text-primary)]">5.0</span>
        <div className="flex text-[var(--color-neon-pink)]">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{review.name}</h3>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <span className="rounded bg-pink-500/10 px-2 py-0.5 text-pink-500 font-medium">
          {review.type}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--color-text-secondary)]">
        {displayText}
      </p>
      
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-bold text-[var(--color-neon-pink)] underline decoration-pink-500/30 underline-offset-4 hover:decoration-pink-500"
        >
          {isExpanded ? 'הצג פחות' : 'הצג יותר'}
        </button>
      )}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-20" id="testimonials">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-black text-[var(--color-text-primary)] md:text-4xl lg:text-5xl">
          חוגגים מספרים
        </h2>

        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}


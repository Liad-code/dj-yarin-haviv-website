export const siteConfig = {
  name: 'ירין חביב',
  title: 'DJ Yarin Haviv',
  
  // Hero Section
  hero: {
    headline: 'DJ YARIN HAVIV',
    subheadline: 'המוזיקה נולדת מהקהל, לא מהפלייליסט',
    cta: 'בואו נדבר על האירוע שלכם',
    images: [
      '/images/hero-1.jpg',
      '/images/hero-2.jpg',
      '/images/hero-3.jpg',
    ],
  },
  
  // Value Props (What He Offers)
  services: [
    { icon: '🎧', title: 'סאונד איכותי', description: 'מערכת הגברה מקצועית ברמה הגבוהה ביותר' },
    { icon: '🎤', title: 'עמדה מעוצבת', description: 'אסתטיקה ומוזיקה זה שילוב מנצח' },
    { icon: '💡', title: 'תאורת מסיבות', description: 'תאורה שהופכת כל אירוע למסיבה אמיתית' },
    { icon: '🔥', title: 'אנרגיות מטורפות', description: 'רחבה שעפה באוויר - מותאם לכל קהל' },
  ],
  
  // Social Proof
  experience: {
    years: '9+',
    yearsLabel: 'שנות ניסיון',
    tagline: 'מעל 9 שנים של אירועים בלתי נשכחים',
  },
  
  // Event Types
  eventTypes: ['חתונות', 'ימי הולדת', 'אירועי חברה', 'בר/בת מצווה', 'מסיבות פרטיות'],
  
  // About/Bio
  about: {
    title: 'מי אני?',
    content: 'אני ירין חביב, כבר מעל 9 שנים בתחום. המטרה שלי פשוטה: שהאורחים שלכם לא ישכחו את האירוע הזה. אני מביא איתי לא רק ציוד מקצועי, אלא את האנרגיה, הניסיון והיכולת לקרוא את הקהל ולהתאים את המוזיקה בדיוק לרגע.',
  },
  
  // Urgency/Offer (Optional - can toggle visibility)
  offer: {
    active: false,
    title: 'הטבת סוף שנה 🎉',
    description: 'לחמשת הלקוחות הראשונים שיסגרו אירוע - חבילה מלאה במחיר מיוחד',
    includes: ['עמדה מעוצבת', 'מערכת הגברה מקצועית', 'תאורת אירוע ברמה גבוהה'],
    cta: 'רוצה לשמוע פרטים',
  },
  
  // Video Gallery Section
  videos: {
    title: 'סרטונים מאירועים',
    items: [
      // Replace with actual YouTube video/short IDs
      // Regular video: youtube.com/watch?v=ABC123 -> id: 'ABC123', type: 'video'
      // Short: youtube.com/shorts/XYZ789 -> id: 'XYZ789', type: 'short'
      { id: 'yGKhP7UqUcs', type: 'video' as const },
      { id: 's4Am_f7jZgs', type: 'short' as const },
      { id: 'J4xn70_icck', type: 'short' as const },
      { id: '7-nFSyWNxiQ', type: 'short' as const },
    ],
  },
  
  // Final CTA Section
  finalCta: {
    headline: 'מתכננים אירוע בקרוב?',
    subheadline: 'בואו נדבר ונבנה יחד את האירוע המושלם שלכם',
    buttonText: 'דברו איתי בוואטסאפ',
  },
  
  // Contact
  contact: {
    whatsapp: '972529533448',
    whatsappDisplay: '052-953-3448',
    instagram: 'https://www.instagram.com/djyarinhaviv',
  },
  
  // SEO
  seo: {
    title: 'DJ Yarin Haviv | דיג׳יי לאירועים | חתונות, ימי הולדת ומסיבות',
    description: 'DJ ירין חביב - מעל 9 שנות ניסיון באירועים. סאונד איכותי, הנחייה מקצועית ואנרגיות מטורפות שיגרמו לאורחים שלכם לא להפסיק לדבר על האירוע.',
  },
  
  // WhatsApp Pre-filled Message
  whatsappMessage: 'היי ירין! מעוניין/ת לשמוע פרטים על DJ לאירוע 🎉',
};

export type SiteConfig = typeof siteConfig;
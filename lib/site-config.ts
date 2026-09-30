export const siteConfig = {
  name: 'TripGoals',
  tagline: 'Discover Incredible India',
  description:
    'Curated India tour packages by TripGoals: Kashmir, Kerala, Rajasthan, Goa, Himalayan treks, pilgrimages and adventure activities, booked on WhatsApp.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tripgoals.co.in',
  phone: '+91 77098 23098',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917709823098',
  email: 'tripgoals20@gmail.com',
  address: 'Chhatrapati Sambhajinagar, Maharashtra, India',
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/trip_goals._?igsh=aWFwZ2oxMG02eHZn',
  instagramReelUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_REEL_URL ??
    'https://www.instagram.com/reel/DC22Ob6ICGn/?igsh=eXo1cmszdjNmZmY=',
  // Social links that have no real URL yet are omitted from the UI.
  socials: {} as Partial<Record<'facebook' | 'twitter' | 'youtube', string>>,
} as const;

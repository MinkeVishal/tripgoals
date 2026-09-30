import { Heart, Luggage, MessageCircle, Search } from 'lucide-react';

/** Shared by the "How it works" section and the homepage's HowTo structured data. */
export const BOOKING_STEPS = [
  {
    icon: Search,
    title: 'Find your trip',
    body: 'Browse packages by destination, travel style or budget, or simply search for a place you have in mind.',
    image: '/hero/kashmir-meadow.jpg',
  },
  {
    icon: Heart,
    title: 'Save the ones you love',
    body: 'Tap the heart on any trip to keep it in your wishlist while you decide.',
    image: '/hero/crystal-river.jpg',
  },
  {
    icon: MessageCircle,
    title: 'Book on WhatsApp',
    body: 'Press Book Now and the trip details arrive in our chat, prefilled. We reply with dates and a quote.',
    image: '/hero/palm-beach.jpg',
  },
  {
    icon: Luggage,
    title: 'Pack your bags',
    body: 'We finalise stays, transfers and your day-by-day plan, and stay a message away throughout.',
    image: '/hero/mountain-lake.jpg',
  },
] as const;

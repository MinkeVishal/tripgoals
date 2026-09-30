export const SECTIONS = ['popular', 'special', 'adventure', 'other'] as const;
export type Section = (typeof SECTIONS)[number];

export const ROLES = ['customer', 'editor', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export interface ItineraryDay {
  title: string;
  points: string[];
}

export interface Amenity {
  /** Key into AMENITY_ICONS (lib/parsers/amenities.ts). */
  icon: string;
  label: string;
}

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  section: Section;
  price: number;
  nights: number | null;
  days: number | null;
  /** Human label, e.g. "5 Nights / 6 Days" or "1 Day". Empty when unknown. */
  durationLabel: string;
  destination: string;
  description: string;
  /** Appwrite file ids; first is the cover. */
  images: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  amenities: Amenity[];
  order: number;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string | null;
  updatedAt: string;
}

export interface CategoryStats {
  count: number;
  minPrice: number | null;
  minDays: number | null;
  maxDays: number | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  imageId: string | null;
  order: number;
  stats: CategoryStats;
}

export interface Banner {
  key: 'hero' | 'promo';
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  imageIds: string[];
  active: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

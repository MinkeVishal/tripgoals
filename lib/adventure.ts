import type { TravelPackage } from '@/types';

/** Activity types are inferred from the title, exactly as the previous site did. */
export const ADVENTURE_TYPES = [
  {
    value: 'water',
    label: 'Water sports',
    keywords: ['rafting', 'scuba', 'diving', 'kayak', 'water', 'snorkel', 'surf'],
  },
  { value: 'air', label: 'Air adventures', keywords: ['paragliding', 'bungee', 'zip', 'skydiv', 'gondola', 'cable'] },
  { value: 'land', label: 'Land activities', keywords: ['trek', 'camping', 'hiking', 'climb', 'rappel', 'safari'] },
] as const;
export type AdventureType = (typeof ADVENTURE_TYPES)[number]['value'];

export const ADVENTURE_PRICE_BANDS = [
  { value: 'low', label: 'Budget (up to ₹2,000)', min: 0, max: 2000 },
  { value: 'mid', label: 'Mid (₹2,000 – ₹4,000)', min: 2000, max: 4000 },
  { value: 'high', label: 'Premium (₹4,000+)', min: 4000, max: Infinity },
] as const;
export type AdventurePriceBand = (typeof ADVENTURE_PRICE_BANDS)[number]['value'];

export const ADVENTURE_DURATIONS = [
  { value: 'day-trip', label: 'Day trip' },
  { value: 'multi-day', label: 'Multi-day' },
] as const;
export type AdventureDuration = (typeof ADVENTURE_DURATIONS)[number]['value'];

export function matchesAdventureType(title: string, type: AdventureType): boolean {
  const t = title.toLowerCase();
  return ADVENTURE_TYPES.find((x) => x.value === type)?.keywords.some((k) => t.includes(k)) ?? false;
}

export interface AdventureFilters {
  q?: string;
  type?: AdventureType;
  price?: AdventurePriceBand;
  duration?: AdventureDuration;
}

export function filterAdventures(items: TravelPackage[], f: AdventureFilters): TravelPackage[] {
  const q = f.q?.trim().toLowerCase();
  return items.filter((p) => {
    if (q && !`${p.title} ${p.subtitle} ${p.destination}`.toLowerCase().includes(q)) return false;
    if (f.type && !matchesAdventureType(p.title, f.type)) return false;
    if (f.price) {
      const band = ADVENTURE_PRICE_BANDS.find((b) => b.value === f.price)!;
      if (!(p.price >= band.min && (p.price < band.max || band.max === Infinity))) return false;
    }
    if (f.duration) {
      const multi = (p.nights ?? 0) > 0 || (p.days ?? 1) > 1;
      if ((f.duration === 'multi-day') !== multi) return false;
    }
    return true;
  });
}

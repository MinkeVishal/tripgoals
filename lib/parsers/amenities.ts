import type { Amenity } from '@/types';

/**
 * Icon keys an editor can pick. The React component that maps them to lucide icons lives in
 * components/site/amenity-icon.tsx.
 */
export const AMENITY_ICON_KEYS = [
  'meals',
  'breakfast',
  'hotel',
  'stay',
  'car',
  'bus',
  'train',
  'flight',
  'guide',
  'camera',
  'wifi',
  'pool',
  'spa',
  'trek',
  'beach',
  'check',
] as const;

export type AmenityIconKey = (typeof AMENITY_ICON_KEYS)[number];

export const AMENITY_ICON_LABELS: Record<AmenityIconKey, string> = {
  meals: 'Meals',
  breakfast: 'Breakfast',
  hotel: 'Hotel',
  stay: 'Stay',
  car: 'Car',
  bus: 'Bus',
  train: 'Train',
  flight: 'Flight',
  guide: 'Guide / Location',
  camera: 'Photography',
  wifi: 'Wi-Fi',
  pool: 'Pool',
  spa: 'Spa',
  trek: 'Trek',
  beach: 'Beach',
  check: 'Other',
};

// Legacy values were FontAwesome classes, e.g. "fas fa-hotel".
const LEGACY_FA: Record<string, AmenityIconKey> = {
  'fa-utensils': 'meals',
  'fa-coffee': 'breakfast',
  'fa-hotel': 'hotel',
  'fa-bed': 'stay',
  'fa-car': 'car',
  'fa-bus': 'bus',
  'fa-train': 'train',
  'fa-plane': 'flight',
  'fa-map-marked-alt': 'guide',
  'fa-camera': 'camera',
  'fa-wifi': 'wifi',
  'fa-swimming-pool': 'pool',
  'fa-spa': 'spa',
  'fa-hiking': 'trek',
  'fa-umbrella-beach': 'beach',
};

const isKey = (v: string): v is AmenityIconKey =>
  (AMENITY_ICON_KEYS as readonly string[]).includes(v);

/** Parses "icon|label" where icon is either a v2 key ("hotel") or a legacy FA class ("fas fa-hotel"). */
export function parseAmenity(raw: string): Amenity | null {
  const [iconRaw = '', ...labelParts] = raw.split('|');
  const label = labelParts.join('|').trim();
  if (!label) return null;
  const icon = iconRaw.trim();
  if (isKey(icon)) return { icon, label };
  const fa = icon.split(/\s+/).find((c) => c in LEGACY_FA);
  return { icon: fa ? LEGACY_FA[fa]! : 'check', label };
}

export const encodeAmenity = (a: Amenity) => `${a.icon}|${a.label.trim()}`;

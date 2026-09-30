import { decodeItineraryDay, splitDescription } from '@/lib/parsers/itinerary';
import { parseAmenity } from '@/lib/parsers/amenities';
import { formatDuration, parseDuration } from '@/lib/parsers/duration';
import { slugify } from '@/lib/parsers/slug';
import { SECTIONS, type Amenity, type Banner, type Category, type ItineraryDay, type Section, type TravelPackage } from '@/types';

/** A row as returned by Appwrite: columns at the top level, values untyped until narrowed here. */
type Row = { $id: string; $createdAt: string; $updatedAt: string } & Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const int = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

export const normaliseName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

export function toCategoryBase(row: Row): Omit<Category, 'stats'> {
  const name = str(row.name);
  return {
    id: row.$id,
    slug: str(row.slug) || slugify(name),
    name,
    subtitle: str(row.subtitle),
    description: str(row.description),
    imageId: str(row.imageId) || null,
    order: int(row.order) ?? 0,
  };
}

type CategoryRef = Pick<Category, 'id' | 'slug' | 'name'>;

/**
 * Maps a packages row to the domain model. Works on both legacy rows (imageId, amenityIds,
 * itinerary, free-text duration, category name) and migrated rows (imageIds, amenities,
 * itineraryDays, nights/days, categoryId), so the app is correct before and after migration.
 */
export function toPackage(
  row: Row,
  categories: { byId: Map<string, CategoryRef>; byName: Map<string, CategoryRef> },
): TravelPackage {
  const title = str(row.title);
  const legacyDuration = parseDuration(str(row.duration));
  const nights = int(row.nights) ?? legacyDuration.nights;
  const days = int(row.days) ?? legacyDuration.days;

  const imageIds = strings(row.imageIds);
  const images = imageIds.length ? imageIds : str(row.imageId) ? [str(row.imageId)] : [];

  const amenitySource = strings(row.amenities).length ? strings(row.amenities) : strings(row.amenityIds);
  const amenities = amenitySource.map(parseAmenity).filter((a): a is Amenity => a !== null);

  const itinerarySource = strings(row.itineraryDays).length
    ? strings(row.itineraryDays)
    : strings(row.itinerary);
  let itinerary: ItineraryDay[] = itinerarySource.map(decodeItineraryDay);

  // Some packages keep their day plan inside the description.
  const { overview, days: descriptionDays } = splitDescription(str(row.description));
  if (itinerary.length === 0) itinerary = descriptionDays;

  const category =
    categories.byId.get(str(row.categoryId)) ?? categories.byName.get(normaliseName(str(row.category)));
  const section = str(row.section);

  return {
    id: row.$id,
    slug: str(row.slug) || slugify(title),
    title,
    subtitle: str(row.subtitle),
    section: (SECTIONS as readonly string[]).includes(section) ? (section as Section) : 'other',
    price: int(row.price) ?? (Number(row.price) || 0),
    nights,
    days,
    durationLabel: formatDuration({ nights, days }),
    destination: str(row.destination) || title,
    description: overview,
    images,
    itinerary,
    inclusions: strings(row.whatsIncluded).map((s) => s.trim()).filter(Boolean),
    amenities,
    order: int(row.order) ?? 0,
    categoryId: category?.id ?? null,
    categoryName: category?.name ?? str(row.category),
    categorySlug: category?.slug ?? null,
    updatedAt: row.$updatedAt,
  };
}

export function toBanner(row: Row): Banner {
  const key = str(row.key) === 'promo' ? 'promo' : 'hero';
  return {
    key,
    title: str(row.title),
    subtitle: str(row.subtitle),
    ctaLabel: str(row.ctaLabel),
    ctaUrl: str(row.ctaUrl),
    imageIds: strings(row.imageIds),
    active: row.active !== false,
  };
}

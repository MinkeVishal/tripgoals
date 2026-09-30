import { matchesDurationBand, type DurationBand } from '@/lib/parsers/duration';
import { matchesPriceBand, type PriceBand } from '@/lib/parsers/price';
import type { Category, Section, TravelPackage } from '@/types';

export const PACKAGE_SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration', label: 'Shortest first' },
] as const;
export type PackageSort = (typeof PACKAGE_SORTS)[number]['value'];

export interface PackageFilters {
  q?: string;
  category?: string; // category slug
  section?: Section;
  price?: PriceBand;
  duration?: DurationBand;
  sort?: PackageSort;
}

const haystack = (p: TravelPackage) =>
  `${p.title} ${p.subtitle} ${p.destination} ${p.categoryName}`.toLowerCase();

export function filterPackages(packages: TravelPackage[], f: PackageFilters): TravelPackage[] {
  const q = f.q?.trim().toLowerCase();
  const result = packages.filter((p) => {
    if (q && !haystack(p).includes(q)) return false;
    if (f.category && p.categorySlug !== f.category) return false;
    if (f.section && p.section !== f.section) return false;
    if (f.price && !matchesPriceBand(p.price, f.price)) return false;
    if (f.duration && !matchesDurationBand(p.days, f.duration)) return false;
    return true;
  });

  switch (f.sort) {
    case 'price-asc':
      return [...result].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    case 'price-desc':
      return [...result].sort((a, b) => b.price - a.price);
    case 'duration':
      return [...result].sort((a, b) => (a.days ?? Infinity) - (b.days ?? Infinity));
    default:
      return result;
  }
}

export const CATEGORY_SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'a-z', label: 'A – Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'popular', label: 'Most packages' },
] as const;
export type CategorySort = (typeof CATEGORY_SORTS)[number]['value'];

export interface CategoryFilters {
  q?: string;
  price?: PriceBand;
  duration?: DurationBand;
  sort?: CategorySort;
}

/**
 * Category price/duration filters run on the packages inside each category, so they work
 * without storing price/duration on the category itself.
 */
export function filterCategories(
  categories: Category[],
  packages: TravelPackage[],
  f: CategoryFilters,
): Category[] {
  const q = f.q?.trim().toLowerCase();
  const result = categories.filter((c) => {
    if (q && !`${c.name} ${c.subtitle} ${c.description}`.toLowerCase().includes(q)) return false;
    if (f.price || f.duration) {
      const inside = packages.filter((p) => p.categoryId === c.id);
      const ok = inside.some(
        (p) =>
          (!f.price || matchesPriceBand(p.price, f.price)) &&
          (!f.duration || matchesDurationBand(p.days, f.duration)),
      );
      if (!ok) return false;
    }
    return true;
  });

  switch (f.sort) {
    case 'a-z':
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return [...result].sort(
        (a, b) => (a.stats.minPrice ?? Infinity) - (b.stats.minPrice ?? Infinity),
      );
    case 'popular':
      return [...result].sort((a, b) => b.stats.count - a.stats.count);
    default:
      return result;
  }
}

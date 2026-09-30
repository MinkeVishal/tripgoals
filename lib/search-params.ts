import { DURATION_BANDS, type DurationBand } from '@/lib/parsers/duration';
import { PRICE_BANDS, type PriceBand } from '@/lib/parsers/price';
import {
  CATEGORY_SORTS,
  PACKAGE_SORTS,
  type CategoryFilters,
  type CategorySort,
  type PackageFilters,
  type PackageSort,
} from '@/lib/catalog-filter';

export type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

function oneOf<T extends string>(value: string | undefined, allowed: readonly { value: T }[]): T | undefined {
  return allowed.find((a) => a.value === value)?.value;
}

export function parsePackageFilters(sp: RawSearchParams): PackageFilters {
  return {
    q: first(sp.q)?.slice(0, 100),
    category: first(sp.category),
    price: oneOf<PriceBand>(first(sp.price), PRICE_BANDS),
    duration: oneOf<DurationBand>(first(sp.duration), DURATION_BANDS),
    sort: oneOf<PackageSort>(first(sp.sort), PACKAGE_SORTS),
  };
}

export function parseCategoryFilters(sp: RawSearchParams): CategoryFilters {
  return {
    q: first(sp.q)?.slice(0, 100),
    price: oneOf<PriceBand>(first(sp.price), PRICE_BANDS),
    duration: oneOf<DurationBand>(first(sp.duration), DURATION_BANDS),
    sort: oneOf<CategorySort>(first(sp.sort), CATEGORY_SORTS),
  };
}

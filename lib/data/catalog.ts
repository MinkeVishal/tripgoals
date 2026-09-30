import { cacheLife, cacheTag } from 'next/cache';
import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { listAllRows } from '@/lib/appwrite/server';
import { uniqueSlug } from '@/lib/parsers/slug';
import type { Category, TravelPackage } from '@/types';
import { normaliseName, toCategoryBase, toPackage } from './mappers';

export interface Catalog {
  packages: TravelPackage[];
  categories: Category[];
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/**
 * The whole catalogue (~40 packages, ~10 categories) in one cached read. Everything on the
 * public site derives from this; server actions call updateTag('packages' | 'categories').
 */
export async function getCatalog(): Promise<Catalog> {
  'use cache';
  cacheTag('packages', 'categories');
  cacheLife('hours');

  const [packageRows, categoryRows] = await Promise.all([
    listAllRows(appwriteConfig.tables.packages, [Query.orderAsc('$createdAt')]),
    listAllRows(appwriteConfig.tables.categories, [Query.orderAsc('$createdAt')]),
  ]);

  const categorySlugs: string[] = [];
  const categoryBases = categoryRows.map((row) => {
    const base = toCategoryBase(row);
    base.slug = uniqueSlug(base.slug, categorySlugs);
    categorySlugs.push(base.slug);
    return base;
  });
  const lookup = {
    byId: new Map(categoryBases.map((c) => [c.id, c])),
    byName: new Map(categoryBases.map((c) => [normaliseName(c.name), c])),
  };

  const packageSlugs: string[] = [];
  const packages = packageRows
    .map((row) => {
      const pkg = toPackage(row, lookup);
      pkg.slug = uniqueSlug(pkg.slug, packageSlugs);
      packageSlugs.push(pkg.slug);
      return pkg;
    })
    .sort(byOrder);

  const categories: Category[] = categoryBases
    .map((base) => {
      const mine = packages.filter((p) => p.categoryId === base.id);
      const prices = mine.map((p) => p.price).filter((p) => p > 0);
      const days = mine.map((p) => p.days).filter((d): d is number => d !== null);
      return {
        ...base,
        stats: {
          count: mine.length,
          minPrice: prices.length ? Math.min(...prices) : null,
          minDays: days.length ? Math.min(...days) : null,
          maxDays: days.length ? Math.max(...days) : null,
        },
      };
    })
    .sort(byOrder);

  return { packages, categories };
}

export async function getPackageBySlug(slug: string) {
  const { packages } = await getCatalog();
  return packages.find((p) => p.slug === slug) ?? null;
}

/** Resolves a legacy /package/:id link to its current slug. */
export async function getPackageSlugById(id: string) {
  const { packages } = await getCatalog();
  return packages.find((p) => p.id === id)?.slug ?? null;
}

export async function getCategoryBySlug(slug: string) {
  const { categories } = await getCatalog();
  return categories.find((c) => c.slug === slug) ?? null;
}

/** Resolves a legacy /category/:name link (URL-decoded name) to its current slug. */
export async function getCategorySlugByName(name: string) {
  const { categories } = await getCatalog();
  const wanted = normaliseName(name);
  return categories.find((c) => normaliseName(c.name) === wanted)?.slug ?? null;
}

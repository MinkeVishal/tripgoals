import { cacheLife, cacheTag } from 'next/cache';
import { appwriteConfig } from '@/lib/appwrite/config';
import { listAllRows } from '@/lib/appwrite/server';
import { siteConfig } from '@/lib/site-config';
import type { Banner } from '@/types';
import { toBanner } from './mappers';

/** Content shown until an admin edits the banner. */
export const DEFAULT_BANNERS: Record<Banner['key'], Banner> = {
  hero: {
    key: 'hero',
    title: siteConfig.tagline,
    subtitle: 'Experience the magic of India with our travel packages',
    ctaLabel: 'Explore All Packages',
    ctaUrl: '/packages',
    imageIds: [],
    active: true,
  },
  promo: {
    key: 'promo',
    title: 'Experience Fun',
    subtitle: 'Check our stunning tour experiences',
    ctaLabel: 'See More',
    ctaUrl: siteConfig.instagramReelUrl,
    imageIds: [],
    active: true,
  },
};

export async function getBanners(): Promise<Record<Banner['key'], Banner>> {
  'use cache';
  cacheTag('banners');
  cacheLife('hours');

  let rows: Awaited<ReturnType<typeof listAllRows>> = [];
  try {
    rows = await listAllRows(appwriteConfig.tables.banners);
  } catch {
    // The banners table does not exist until the v2 migration has run.
  }
  const stored = new Map(rows.map((row) => toBanner(row)).map((b) => [b.key, b]));
  const merge = (key: Banner['key']): Banner => {
    const found = stored.get(key);
    const fallback = DEFAULT_BANNERS[key];
    if (!found) return fallback;
    return {
      ...found,
      title: found.title || fallback.title,
      subtitle: found.subtitle || fallback.subtitle,
      ctaLabel: found.ctaLabel || fallback.ctaLabel,
      ctaUrl: found.ctaUrl || fallback.ctaUrl,
    };
  };
  return { hero: merge('hero'), promo: merge('promo') };
}

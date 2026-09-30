import type { MetadataRoute } from 'next';
import { imageUrl } from '@/lib/appwrite/image-url';
import { getCatalog } from '@/lib/data/catalog';
import { siteConfig } from '@/lib/site-config';

/** Generated from live catalogue data, so new packages and categories are indexed automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { packages, categories } = await getCatalog();
  const url = (path: string) => `${siteConfig.url}${path}`;
  const newest = (list: { updatedAt: string }[]) => list.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), '') || undefined;
  const latest = newest(packages);
  const adventures = packages.filter((p) => p.section === 'adventure');

  return [
    { url: url('/'), lastModified: latest, changeFrequency: 'weekly', priority: 1, images: [url('/hero/kashmir-meadow.jpg')] },
    { url: url('/packages'), lastModified: latest, changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/categories'), lastModified: latest, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/adventure'), lastModified: newest(adventures), changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/about'), changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.6 },
    ...categories.map((c) => ({
      url: url(`/categories/${c.slug}`),
      lastModified: newest(packages.filter((p) => p.categoryId === c.id)),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      images: c.imageId ? [imageUrl(c.imageId)] : undefined,
    })),
    ...packages.map((p) => ({
      url: url(`/packages/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: p.section === 'adventure' ? 0.6 : 0.8,
      images: p.images.slice(0, 5).map(imageUrl),
    })),
  ];
}

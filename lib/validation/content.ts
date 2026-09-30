import { z } from 'zod';
import { AMENITY_ICON_KEYS } from '@/lib/parsers/amenities';
import { SECTIONS } from '@/types';

const optionalInt = z.number().int().min(0).max(365).nullable();

export const packageSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title').max(200),
  subtitle: z.string().trim().max(200),
  categoryId: z.string().min(1, 'Choose a category'),
  section: z.enum(SECTIONS),
  price: z.number({ error: 'Enter a price' }).int().min(0).max(10_000_000),
  nights: optionalInt,
  days: optionalInt,
  destination: z.string().trim().max(120),
  description: z.string().trim().max(20_000),
  order: z.number().int().min(0).max(9999),
  images: z.array(z.string().min(1)).min(1, 'Add at least one image').max(12),
  inclusions: z.array(z.string().trim().min(1).max(200)).max(40),
  amenities: z
    .array(z.object({ icon: z.enum(AMENITY_ICON_KEYS), label: z.string().trim().min(1).max(40) }))
    .max(12),
  itinerary: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Give each day a title').max(200),
        points: z.array(z.string().trim().min(1).max(500)).max(30),
      }),
    )
    .max(30),
});
export type PackageInput = z.infer<typeof packageSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Enter a name').max(100),
  subtitle: z.string().trim().max(100),
  description: z.string().trim().min(1, 'Enter a description').max(1000),
  imageId: z.string().min(1, 'Add an image'),
  order: z.number().int().min(0).max(9999),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const bannerSchema = z.object({
  key: z.enum(['hero', 'promo']),
  title: z.string().trim().min(1, 'Enter a title').max(120),
  subtitle: z.string().trim().max(300),
  ctaLabel: z.string().trim().max(40),
  ctaUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === '' || v.startsWith('/') || /^https?:\/\//.test(v), 'Use a full https:// link or a /path'),
  imageIds: z.array(z.string().min(1)).max(30),
  active: z.boolean(),
});
export type BannerInput = z.infer<typeof bannerSchema>;

export const IMAGE_MAX_BYTES = 3.5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

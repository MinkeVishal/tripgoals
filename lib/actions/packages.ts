'use server';

import { updateTag } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient, listAllRows, type RawRow, type RowOf } from '@/lib/appwrite/server';
import { authorise } from '@/lib/auth';
import { deleteUnreferencedFiles } from '@/lib/data/files';
import { encodeAmenity } from '@/lib/parsers/amenities';
import { formatDuration } from '@/lib/parsers/duration';
import { encodeItineraryDay } from '@/lib/parsers/itinerary';
import { slugify, uniqueSlug } from '@/lib/parsers/slug';
import { packageSchema, type PackageInput } from '@/lib/validation/content';
import type { ActionResult } from '@/types';
import { fail, fieldErrorsFrom, messageFrom, succeed } from './helpers';

const { databaseId, tables } = appwriteConfig;

const idsOf = (row: Record<string, unknown>): string[] => {
  const many = Array.isArray(row.imageIds) ? (row.imageIds as string[]) : [];
  return many.length ? many : typeof row.imageId === 'string' && row.imageId ? [row.imageId] : [];
};

export async function savePackageAction(
  id: string | null,
  input: PackageInput,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const auth = await authorise('editor');
  if (!auth.ok) return fail(auth.error);

  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return fail('Please fix the highlighted fields.', fieldErrorsFrom(parsed.error));
  const v = parsed.data;

  try {
    const { tablesDB } = createAdminClient();
    const category = await tablesDB
      .getRow<RowOf<{ name: string }>>({ databaseId, tableId: tables.categories, rowId: v.categoryId })
      .catch(() => null);
    if (!category) return fail('That category no longer exists.', { categoryId: 'Choose a category' });

    const existingRows = await listAllRows(tables.packages);
    const current = id ? existingRows.find((r) => r.$id === id) : undefined;
    if (id && !current) return fail('This package no longer exists.');

    const otherSlugs = existingRows
      .filter((r) => r.$id !== id)
      .map((r) => (typeof r.slug === 'string' ? r.slug : ''));
    const slug =
      typeof current?.slug === 'string' && current.slug
        ? current.slug
        : uniqueSlug(slugify(v.title), otherSlugs);

    const data = {
      title: v.title,
      subtitle: v.subtitle,
      category: category.name.trim(),
      categoryId: v.categoryId,
      section: v.section,
      price: v.price,
      nights: v.nights,
      days: v.days,
      // Legacy free-text column, kept so the pre-v2 site still renders new packages.
      duration: formatDuration({ nights: v.nights, days: v.days }).slice(0, 20),
      destination: v.destination || v.title,
      description: v.description,
      order: v.order,
      slug,
      imageIds: v.images,
      imageId: v.images[0],
      whatsIncluded: v.inclusions,
      amenities: v.amenities.map(encodeAmenity),
      itineraryDays: v.itinerary.map(encodeItineraryDay),
    };

    const saved = id
      ? await tablesDB.updateRow({ databaseId, tableId: tables.packages, rowId: id, data })
      : await tablesDB.createRow({ databaseId, tableId: tables.packages, rowId: ID.unique(), data });

    if (current) {
      const removed = idsOf(current).filter((f) => !v.images.includes(f));
      await deleteUnreferencedFiles(removed);
    }
    updateTag('packages');
    return succeed({ id: saved.$id, slug });
  } catch (error) {
    return fail(messageFrom(error, 'Could not save the package.'));
  }
}

export async function duplicatePackageAction(id: string): Promise<ActionResult<{ id: string }>> {
  const auth = await authorise('editor');
  if (!auth.ok) return fail(auth.error);
  try {
    const { tablesDB } = createAdminClient();
    const row = await tablesDB.getRow<RawRow>({ databaseId, tableId: tables.packages, rowId: id });
    const all = await listAllRows(tables.packages);
    const title = `${String(row.title ?? '').trim()} (Copy)`;
    const slug = uniqueSlug(
      slugify(title),
      all.map((r) => (typeof r.slug === 'string' ? r.slug : '')),
    );
    // Strip Appwrite's system fields; the copy shares image files with the original, which is
    // safe because deletion only removes files nothing else references.
    const data = Object.fromEntries(Object.entries(row).filter(([k]) => !k.startsWith('$')));
    const created = await tablesDB.createRow({
      databaseId,
      tableId: tables.packages,
      rowId: ID.unique(),
      data: { ...data, title, slug },
    });
    updateTag('packages');
    return succeed({ id: created.$id });
  } catch (error) {
    return fail(messageFrom(error, 'Could not duplicate the package.'));
  }
}

export async function deletePackageAction(id: string): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);
  try {
    const { tablesDB } = createAdminClient();
    const row = await tablesDB.getRow<RawRow>({ databaseId, tableId: tables.packages, rowId: id });
    await tablesDB.deleteRow({ databaseId, tableId: tables.packages, rowId: id });

    // Remove wishlist entries pointing at the deleted package.
    const saved = await tablesDB
      .listRows({ databaseId, tableId: tables.wishlists, queries: [Query.equal('packageId', id), Query.limit(500)], total: false })
      .catch(() => null);
    await Promise.all(
      (saved?.rows ?? []).map((r) =>
        tablesDB.deleteRow({ databaseId, tableId: tables.wishlists, rowId: r.$id }).catch(() => undefined),
      ),
    );

    await deleteUnreferencedFiles(idsOf(row));
    updateTag('packages');
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not delete the package.'));
  }
}

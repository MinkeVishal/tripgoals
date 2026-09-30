'use server';

import { updateTag } from 'next/cache';
import { ID } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient, listAllRows, type RowOf } from '@/lib/appwrite/server';
import { authorise } from '@/lib/auth';
import { normaliseName } from '@/lib/data/mappers';
import { deleteUnreferencedFiles } from '@/lib/data/files';
import { slugify, uniqueSlug } from '@/lib/parsers/slug';
import { categorySchema, type CategoryInput } from '@/lib/validation/content';
import type { ActionResult } from '@/types';
import { fail, fieldErrorsFrom, messageFrom, succeed } from './helpers';

const { databaseId, tables } = appwriteConfig;

export async function saveCategoryAction(
  id: string | null,
  input: CategoryInput,
): Promise<ActionResult<{ id: string }>> {
  const auth = await authorise('editor');
  if (!auth.ok) return fail(auth.error);

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail('Please fix the highlighted fields.', fieldErrorsFrom(parsed.error));
  const v = parsed.data;

  try {
    const { tablesDB } = createAdminClient();
    const rows = await listAllRows(tables.categories);
    const current = id ? rows.find((r) => r.$id === id) : undefined;
    if (id && !current) return fail('This category no longer exists.');

    const clash = rows.some((r) => r.$id !== id && normaliseName(String(r.name ?? '')) === normaliseName(v.name));
    if (clash) return fail('A category with this name already exists.', { name: 'Already in use' });

    const slug =
      typeof current?.slug === 'string' && current.slug
        ? current.slug
        : uniqueSlug(
            slugify(v.name),
            rows.map((r) => (typeof r.slug === 'string' ? r.slug : '')),
          );

    const data = {
      name: v.name,
      slug,
      subtitle: v.subtitle,
      description: v.description,
      imageId: v.imageId,
      order: v.order,
    };
    const saved = id
      ? await tablesDB.updateRow({ databaseId, tableId: tables.categories, rowId: id, data })
      : await tablesDB.createRow({ databaseId, tableId: tables.categories, rowId: ID.unique(), data });

    // Packages keep a denormalised category name; keep it in sync on rename.
    if (current && normaliseName(String(current.name ?? '')) !== normaliseName(v.name)) {
      const pkgs = await listAllRows(tables.packages);
      await Promise.all(
        pkgs
          .filter((p) => p.categoryId === saved.$id || normaliseName(String(p.category ?? '')) === normaliseName(String(current.name ?? '')))
          .map((p) =>
            tablesDB.updateRow({
              databaseId,
              tableId: tables.packages,
              rowId: p.$id,
              data: { category: v.name, categoryId: saved.$id },
            }),
          ),
      );
      updateTag('packages');
    }
    if (current && typeof current.imageId === 'string' && current.imageId !== v.imageId) {
      await deleteUnreferencedFiles([current.imageId]);
    }
    updateTag('categories');
    return succeed({ id: saved.$id });
  } catch (error) {
    return fail(messageFrom(error, 'Could not save the category.'));
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);
  try {
    const { tablesDB } = createAdminClient();
    const category = await tablesDB.getRow<RowOf<{ name: string; imageId?: string }>>({
      databaseId,
      tableId: tables.categories,
      rowId: id,
    });
    const pkgs = await listAllRows(tables.packages);
    const inUse = pkgs.filter(
      (p) => p.categoryId === id || normaliseName(String(p.category ?? '')) === normaliseName(category.name),
    ).length;
    if (inUse > 0) {
      return fail(`${inUse} package${inUse === 1 ? ' is' : 's are'} still in this category. Move or delete them first.`);
    }
    await tablesDB.deleteRow({ databaseId, tableId: tables.categories, rowId: id });
    if (category.imageId) await deleteUnreferencedFiles([category.imageId]);
    updateTag('categories');
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not delete the category.'));
  }
}

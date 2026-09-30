'use server';

import { updateTag } from 'next/cache';
import { AppwriteException } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient, type RowOf } from '@/lib/appwrite/server';
import { authorise } from '@/lib/auth';
import { deleteUnreferencedFiles } from '@/lib/data/files';
import { bannerSchema, type BannerInput } from '@/lib/validation/content';
import type { ActionResult } from '@/types';
import { fail, fieldErrorsFrom, messageFrom, succeed } from './helpers';

const { databaseId, tables } = appwriteConfig;

/** Banners are singletons: the row id is the banner key ('hero' | 'promo'). */
export async function saveBannerAction(input: BannerInput): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);

  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return fail('Please fix the highlighted fields.', fieldErrorsFrom(parsed.error));
  const v = parsed.data;

  try {
    const { tablesDB } = createAdminClient();
    const previous = await tablesDB
      .getRow<RowOf<{ imageIds?: string[] }>>({ databaseId, tableId: tables.banners, rowId: v.key })
      .catch((e: unknown) => (e instanceof AppwriteException && e.code === 404 ? null : Promise.reject(e)));

    if (previous) {
      await tablesDB.updateRow({ databaseId, tableId: tables.banners, rowId: v.key, data: v });
    } else {
      await tablesDB.createRow({ databaseId, tableId: tables.banners, rowId: v.key, data: v });
    }
    const removed = (previous?.imageIds ?? []).filter((f) => !v.imageIds.includes(f));
    await deleteUnreferencedFiles(removed);
    updateTag('banners');
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not save the banner.'));
  }
}

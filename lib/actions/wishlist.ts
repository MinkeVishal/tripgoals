'use server';

import { ID, Permission, Query, Role } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient } from '@/lib/appwrite/server';
import { authorise, getCurrentUser } from '@/lib/auth';
import { getWishlistPackageIds } from '@/lib/data/wishlist';
import type { ActionResult } from '@/types';
import { fail, messageFrom, succeed } from './helpers';

const { databaseId, tables } = appwriteConfig;

/** Adds the package to the signed-in customer's wishlist, or removes it if already saved. */
export async function toggleWishlistAction(
  packageId: string,
): Promise<ActionResult<{ wishlisted: boolean }>> {
  const auth = await authorise('customer');
  if (!auth.ok) return fail(auth.error);
  if (!packageId || packageId.length > 36) return fail('Invalid package.');

  try {
    const { tablesDB } = createAdminClient();
    const existing = await tablesDB.listRows({
      databaseId,
      tableId: tables.wishlists,
      queries: [Query.equal('userId', auth.user.id), Query.equal('packageId', packageId), Query.limit(1)],
      total: false,
    });
    const row = existing.rows[0];
    if (row) {
      await tablesDB.deleteRow({ databaseId, tableId: tables.wishlists, rowId: row.$id });
      return succeed({ wishlisted: false });
    }
    await tablesDB.createRow({
      databaseId,
      tableId: tables.wishlists,
      rowId: ID.unique(),
      data: { userId: auth.user.id, packageId },
      permissions: [Permission.read(Role.user(auth.user.id)), Permission.delete(Role.user(auth.user.id))],
    });
    return succeed({ wishlisted: true });
  } catch (error) {
    return fail(messageFrom(error, 'Could not update your wishlist.'));
  }
}

/** The signed-in customer's name and saved package ids (empty for guests). Called once per navigation by the client provider. */
export async function getMyWishlistAction(): Promise<{ signedIn: boolean; name: string; ids: string[] }> {
  const user = await getCurrentUser();
  if (!user) return { signedIn: false, name: '', ids: [] };
  return { signedIn: true, name: user.name, ids: await getWishlistPackageIds(user.id) };
}

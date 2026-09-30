import 'server-only';
import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { listAllRows } from '@/lib/appwrite/server';

/** Package ids the user has saved. Dynamic (per user), so never cached. */
export async function getWishlistPackageIds(userId: string): Promise<string[]> {
  try {
    const rows = await listAllRows(appwriteConfig.tables.wishlists, [Query.equal('userId', userId)]);
    return rows.map((r) => String(r.packageId));
  } catch {
    return []; // table not created yet
  }
}

/** packageId → how many customers saved it (admin dashboard). */
export async function getWishlistCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  try {
    for (const row of await listAllRows(appwriteConfig.tables.wishlists)) {
      const id = String(row.packageId);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  } catch {
    /* table not created yet */
  }
  return counts;
}

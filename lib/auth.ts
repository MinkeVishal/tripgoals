import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { Models } from 'node-appwrite';
import { createSessionClient } from '@/lib/appwrite/server';
import type { Role, SessionUser } from '@/types';

const RANK: Record<Role, number> = { customer: 0, editor: 1, admin: 2 };

export const roleFromLabels = (labels: readonly string[]): Role =>
  labels.includes('admin') ? 'admin' : labels.includes('editor') ? 'editor' : 'customer';

export const hasRole = (user: Pick<SessionUser, 'role'> | null, min: Role) =>
  !!user && RANK[user.role] >= RANK[min];

export function toSessionUser(user: Models.User<Models.Preferences>): SessionUser {
  const phone = (user.prefs as { phone?: unknown }).phone;
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    phone: typeof phone === 'string' ? phone : '',
    role: roleFromLabels(user.labels),
    createdAt: user.$createdAt,
  };
}

/** The signed-in user for this request (memoised), or null. Reads cookies, so it is dynamic. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const client = await createSessionClient();
  if (!client) return null;
  try {
    return toSessionUser(await client.account.get());
  } catch {
    return null; // expired, revoked, or the user was blocked
  }
});

/** For pages/layouts: send guests to login and under-privileged users home. */
export async function requireRole(min: Role): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!hasRole(user, min)) redirect('/');
  return user;
}

/** For server actions: never redirect, report the failure so the UI can show it. */
export async function authorise(
  min: Role,
): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Please sign in to continue.' };
  if (!hasRole(user, min)) return { ok: false, error: 'You do not have permission to do that.' };
  return { ok: true, user };
}

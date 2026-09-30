'use server';

import { Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/server';
import { authorise, roleFromLabels } from '@/lib/auth';
import { ROLES, type ActionResult, type Role } from '@/types';
import { fail, messageFrom, succeed } from './helpers';

const MANAGED_LABELS = ['admin', 'editor'];

/** True when at least one other active admin would remain. */
async function otherAdminExists(excludeUserId: string) {
  const { users } = createAdminClient();
  const list = await users.list({ queries: [Query.equal('labels', 'admin'), Query.limit(100)] });
  return list.users.some((u) => u.$id !== excludeUserId && u.status);
}

export async function setUserRoleAction(userId: string, role: Role): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);
  if (!ROLES.includes(role)) return fail('Unknown role.');
  if (userId === auth.user.id) return fail('You cannot change your own role.');

  try {
    const { users } = createAdminClient();
    const target = await users.get({ userId });
    if (roleFromLabels(target.labels) === 'admin' && role !== 'admin' && !(await otherAdminExists(userId))) {
      return fail('There must always be at least one admin.');
    }
    const kept = target.labels.filter((l) => !MANAGED_LABELS.includes(l));
    await users.updateLabels({ userId, labels: role === 'customer' ? kept : [...kept, role] });
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not change the role.'));
  }
}

export async function setUserBlockedAction(userId: string, blocked: boolean): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);
  if (userId === auth.user.id) return fail('You cannot block yourself.');
  try {
    const { users } = createAdminClient();
    const target = await users.get({ userId });
    if (blocked && roleFromLabels(target.labels) === 'admin' && !(await otherAdminExists(userId))) {
      return fail('There must always be at least one admin.');
    }
    await users.updateStatus({ userId, status: !blocked });
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not update the user.'));
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const auth = await authorise('admin');
  if (!auth.ok) return fail(auth.error);
  if (userId === auth.user.id) return fail('You cannot delete your own account here.');
  try {
    const { users } = createAdminClient();
    const target = await users.get({ userId });
    if (roleFromLabels(target.labels) === 'admin' && !(await otherAdminExists(userId))) {
      return fail('There must always be at least one admin.');
    }
    await users.delete({ userId });
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not delete the user.'));
  }
}

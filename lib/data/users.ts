import 'server-only';
import { Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/server';
import { roleFromLabels } from '@/lib/auth';
import type { Role } from '@/types';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  blocked: boolean;
  createdAt: string;
  lastActive: string;
}

export async function listManagedUsers(): Promise<ManagedUser[]> {
  const { users } = createAdminClient();
  const result = await users.list({ queries: [Query.orderDesc('$createdAt'), Query.limit(200)] });
  return result.users.map((u) => {
    const phone = (u.prefs as { phone?: unknown }).phone;
    return {
      id: u.$id,
      name: u.name,
      email: u.email,
      phone: typeof phone === 'string' ? phone : '',
      role: roleFromLabels(u.labels),
      blocked: !u.status,
      createdAt: u.$createdAt,
      lastActive: u.accessedAt,
    };
  });
}

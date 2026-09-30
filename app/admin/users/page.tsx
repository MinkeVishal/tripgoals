import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/admin/page-header';
import { UsersTable } from '@/components/admin/users-table';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { listManagedUsers } from '@/lib/data/users';

export const metadata: Metadata = { title: 'Users' };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Customers and staff. Promote someone to Editor to let them manage content." />
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <List />
      </Suspense>
    </>
  );
}

async function List() {
  const admin = await requireRole('admin');
  const users = await listManagedUsers();
  return <UsersTable users={users} currentUserId={admin.id} />;
}

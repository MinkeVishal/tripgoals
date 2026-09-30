import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PackagesTable } from '@/components/admin/packages-table';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';

export const metadata: Metadata = { title: 'Packages' };

export default function AdminPackagesPage() {
  return (
    <>
      <PageHeader
        title="Packages"
        description="Create, edit and organise your travel packages."
        actions={
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus /> New package
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <List />
      </Suspense>
    </>
  );
}

async function List() {
  const user = await requireRole('editor');
  const { packages, categories } = await getCatalog();
  return (
    <PackagesTable
      packages={packages.filter((p) => p.section !== 'adventure')}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      role={user.role}
      emptyLabel="No packages yet — create your first one."
    />
  );
}

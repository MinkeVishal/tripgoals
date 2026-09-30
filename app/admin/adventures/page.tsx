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

export const metadata: Metadata = { title: 'Adventures' };

export default function AdminAdventuresPage() {
  return (
    <>
      <PageHeader
        title="Adventures"
        description="Day-trip activities shown on the Adventure page."
        actions={
          <Button asChild>
            <Link href="/admin/packages/new?section=adventure">
              <Plus /> New adventure
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
      packages={packages.filter((p) => p.section === 'adventure')}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      role={user.role}
      scopedSection
      emptyLabel="No adventures yet — add your first activity."
    />
  );
}

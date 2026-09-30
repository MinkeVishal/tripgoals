import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CategoriesManager } from '@/components/admin/categories-manager';
import { PageHeader } from '@/components/admin/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';

export const metadata: Metadata = { title: 'Categories' };

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader title="Categories" description="Organise packages into travel styles." />
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <List />
      </Suspense>
    </>
  );
}

async function List() {
  const user = await requireRole('editor');
  const { categories } = await getCatalog();
  return <CategoriesManager categories={categories} role={user.role} />;
}

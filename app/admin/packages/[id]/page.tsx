import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PackageEditor } from '@/components/admin/package-editor';
import { PageHeader } from '@/components/admin/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';

export const metadata: Metadata = { title: 'Edit package' };

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-2xl" />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('editor');
  const { id } = await params;
  const { packages, categories } = await getCatalog();
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) notFound();
  return (
    <>
      <PageHeader title={pkg.title} description={pkg.section === 'adventure' ? 'Editing adventure activity' : 'Editing package'} />
      {/* key resets the form when navigating between packages */}
      <PackageEditor key={`${pkg.id}-${pkg.updatedAt}`} pkg={pkg} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </>
  );
}

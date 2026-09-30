import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PackageEditor } from '@/components/admin/package-editor';
import { PageHeader } from '@/components/admin/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';
import { SECTIONS, type Section } from '@/types';

export const metadata: Metadata = { title: 'New package' };

export default function NewPackagePage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] rounded-2xl" />}>
      <Editor searchParams={searchParams} />
    </Suspense>
  );
}

async function Editor({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  await requireRole('editor');
  const { section } = await searchParams;
  const { categories } = await getCatalog();
  const preset = (SECTIONS as readonly string[]).includes(section ?? '') ? (section as Section) : undefined;
  return (
    <>
      <PageHeader title={preset === 'adventure' ? 'New adventure' : 'New package'} description="Fill in the details, add photos and save." />
      <PackageEditor pkg={null} categories={categories.map((c) => ({ id: c.id, name: c.name }))} defaultSection={preset} />
    </>
  );
}

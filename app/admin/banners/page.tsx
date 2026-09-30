import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BannerEditor } from '@/components/admin/banner-editor';
import { PageHeader } from '@/components/admin/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getBanners } from '@/lib/data/banners';

export const metadata: Metadata = { title: 'Banners' };

export default function AdminBannersPage() {
  return (
    <>
      <PageHeader title="Banners" description="Edit the home page hero and promo section." />
      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <Editors />
      </Suspense>
    </>
  );
}

async function Editors() {
  await requireRole('admin');
  const { hero, promo } = await getBanners();
  return (
    <div className="grid gap-8">
      <BannerEditor
        banner={hero}
        heading="Home hero"
        description="The first thing visitors see. Upload sharp, wide photos and the hero becomes a full-screen slideshow."
        maxImages={8}
        imageHint="Landscape photos, at least 1920px wide, work best · up to 8"
      />
      <BannerEditor
        banner={promo}
        heading="Promo banner"
        description="The full-width banner in the middle of the home page (previously “Experience Fun”)."
        maxImages={1}
        imageHint="One wide background photo, at least 1600px"
      />
    </div>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/site/empty-state';
import { PackageCard, PackageCardSkeleton } from '@/components/site/package-card';
import { PageHero } from '@/components/site/page-hero';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';
import { getWishlistPackageIds } from '@/lib/data/wishlist';

export const metadata: Metadata = { title: 'My Wishlist', robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHero eyebrow="Saved for later" title="My wishlist" subtitle="The trips you've fallen for." image="/hero/charminar-night.jpg" />
      <section className="shell pt-12 pb-28 sm:pt-16">
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <SavedTrips />
        </Suspense>
      </section>
    </>
  );
}

async function SavedTrips() {
  const user = await requireRole('customer');
  const [ids, { packages }] = await Promise.all([getWishlistPackageIds(user.id), getCatalog()]);
  const saved = packages.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Tap the heart on any trip to keep it here for later."
        actionHref="/packages"
        actionLabel="Browse packages"
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {saved.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}

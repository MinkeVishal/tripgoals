import { Suspense } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Compass,
  Heart,
  Package as PackageIcon,
  Plus,
  Shapes,
  Star,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { requireRole } from '@/lib/auth';
import { getCatalog } from '@/lib/data/catalog';
import { listManagedUsers } from '@/lib/data/users';
import { getWishlistCounts } from '@/lib/data/wishlist';
import { formatPrice } from '@/lib/parsers/price';
import type { TravelPackage } from '@/types';

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="How your catalogue is doing at a glance."
        actions={
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus /> New package
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

/** What an incomplete listing is missing, so editors know what to fix first. */
function gaps(pkg: TravelPackage): string[] {
  const missing: string[] = [];
  if (pkg.images.length === 0) missing.push('images');
  if (!pkg.price) missing.push('price');
  if (!pkg.durationLabel) missing.push('duration');
  if (pkg.section !== 'adventure' && pkg.itinerary.length === 0) missing.push('itinerary');
  if (!pkg.description) missing.push('description');
  return missing;
}

async function Overview() {
  const user = await requireRole('editor');
  const isAdmin = user.role === 'admin';

  const [{ packages, categories }, wishlistCounts, users] = await Promise.all([
    getCatalog(),
    getWishlistCounts(),
    isAdmin ? listManagedUsers() : Promise.resolve(null),
  ]);

  const count = (section: TravelPackage['section']) => packages.filter((p) => p.section === section).length;
  const totalWishlists = [...wishlistCounts.values()].reduce((a, b) => a + b, 0);

  const topWishlisted = packages
    .map((p) => ({ pkg: p, saves: wishlistCounts.get(p.id) ?? 0 }))
    .filter((x) => x.saves > 0)
    .sort((a, b) => b.saves - a.saves)
    .slice(0, 5);

  const incomplete = packages
    .map((pkg) => ({ pkg, missing: gaps(pkg) }))
    .filter((x) => x.missing.length > 0)
    .sort((a, b) => b.missing.length - a.missing.length);

  const recent = [...packages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const customers = users?.filter((u) => u.role === 'customer').length;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total packages" value={packages.length - count('adventure')} hint={`${count('popular')} popular · ${count('special')} special`} icon={PackageIcon} tone="blue" />
        <StatCard label="Adventures" value={count('adventure')} icon={Compass} tone="rose" />
        <StatCard label="Categories" value={categories.length} icon={Shapes} tone="violet" />
        {isAdmin ? (
          <StatCard label="Customers" value={customers ?? 0} hint={`${totalWishlists} saved trips`} icon={Users} tone="green" />
        ) : (
          <StatCard label="Saved trips" value={totalWishlists} hint="across all customers" icon={Heart} tone="green" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border-border bg-card rounded-2xl border p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Star className="size-4 text-amber-500" /> Most wishlisted
          </h2>
          {topWishlisted.length === 0 ? (
            <p className="text-muted-foreground text-sm">No one has saved a trip yet. Once customers start using the heart button, the favourites show up here.</p>
          ) : (
            <ol className="divide-border divide-y">
              {topWishlisted.map(({ pkg, saves }, i) => (
                <li key={pkg.id} className="flex items-center gap-3 py-3">
                  <span className="text-muted-foreground w-5 text-sm tabular-nums">{i + 1}</span>
                  <Link href={`/admin/packages/${pkg.id}`} className="min-w-0 flex-1 truncate font-medium hover:underline">
                    {pkg.title}
                  </Link>
                  <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                    <Heart className="size-3.5 fill-rose-500 text-rose-500" /> {saves}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="border-border bg-card rounded-2xl border p-6">
          <h2 className="mb-4 font-semibold">Recently updated</h2>
          <ul className="divide-border divide-y">
            {recent.map((pkg) => (
              <li key={pkg.id} className="flex items-center gap-3 py-3">
                <Link href={`/admin/packages/${pkg.id}`} className="min-w-0 flex-1 truncate font-medium hover:underline">
                  {pkg.title}
                </Link>
                <span className="text-muted-foreground text-sm">{formatPrice(pkg.price)}</span>
                <time className="text-muted-foreground w-24 text-right text-xs" dateTime={pkg.updatedAt}>
                  {new Date(pkg.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border-border bg-card rounded-2xl border p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4 text-amber-500" /> Content health
          </h2>
          <span className="text-muted-foreground text-sm">
            {incomplete.length === 0 ? 'Everything is complete' : `${incomplete.length} listing${incomplete.length === 1 ? '' : 's'} need attention`}
          </span>
        </div>
        {incomplete.length > 0 ? (
          <ul className="divide-border divide-y">
            {incomplete.slice(0, 8).map(({ pkg, missing }) => (
              <li key={pkg.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="min-w-0 flex-1 truncate font-medium">{pkg.title}</span>
                <span className="text-muted-foreground text-sm">Missing {missing.join(', ')}</span>
                <Link href={`/admin/packages/${pkg.id}`} className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline">
                  Fix <ArrowUpRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

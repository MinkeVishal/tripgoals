import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/site/empty-state';
import { FilterBar } from '@/components/site/filter-bar';
import { JsonLd } from '@/components/site/json-ld';
import { PackageCard } from '@/components/site/package-card';
import { PageHero } from '@/components/site/page-hero';
import { filterPackages, PACKAGE_SORTS, type PackageFilters } from '@/lib/catalog-filter';
import { getCatalog } from '@/lib/data/catalog';
import { DURATION_BANDS } from '@/lib/parsers/duration';
import { PRICE_BANDS } from '@/lib/parsers/price';
import { parsePackageFilters, type RawSearchParams } from '@/lib/search-params';
import { breadcrumbLd, collectionPageLd, graph, packageListLd, pageMetadata } from '@/lib/seo';
import type { TravelPackage } from '@/types';

const DESCRIPTION =
  'Compare India tour packages from TripGoals: Kashmir, Kerala, Rajasthan, Goa, the Northeast, Himalayan treks and pilgrimages. See itineraries and prices, then book on WhatsApp.';

export const metadata: Metadata = pageMetadata({
  title: 'India Tour Packages & Holiday Itineraries',
  description: DESCRIPTION,
  path: '/packages',
  image: { url: '/hero/palm-beach.jpg', alt: 'Beach huts under palm trees in Goa' },
});

// Day-trip adventures live on /adventure; they only appear here when someone searches for them.
const poolFor = (packages: TravelPackage[], filters: PackageFilters) =>
  filters.q ? packages : packages.filter((p) => p.section !== 'adventure');

export default async function PackagesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const { packages } = await getCatalog();
  const all = filterPackages(poolFor(packages, {}), {});

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageLd({ name: 'India tour packages', description: DESCRIPTION, path: '/packages', items: packageListLd('India tour packages', all) }),
          breadcrumbLd([{ name: 'Packages', path: '/packages' }]),
        )}
      />
      <PageHero
        eyebrow="Explore"
        title="All travel packages"
        subtitle="Discover amazing destinations across India, planned end to end."
        image="/hero/palm-beach.jpg"
      />
      <section className="shell -mt-8 pb-28 sm:-mt-10">
        <Suspense fallback={<div className="bg-muted h-[4.5rem] animate-pulse rounded-[1.75rem]" />}>
          <Filters />
        </Suspense>
        {/* The unfiltered list is in the static HTML, so crawlers that don't run JavaScript see every trip. */}
        <Suspense fallback={<PackageResults results={all} />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Filters() {
  const { categories } = await getCatalog();
  return (
    <FilterBar
      searchPlaceholder="Search destinations or packages"
      selects={[
        {
          name: 'category',
          label: 'Category',
          allLabel: 'All categories',
          options: categories.map((c) => ({ value: c.slug, label: c.name })),
        },
        { name: 'price', label: 'Price', allLabel: 'Any price', options: PRICE_BANDS },
        { name: 'duration', label: 'Duration', allLabel: 'Any duration', options: DURATION_BANDS },
        { name: 'sort', label: 'Sort by', allLabel: 'Sort: Featured', options: PACKAGE_SORTS.filter((s) => s.value !== 'featured') },
      ]}
    />
  );
}

async function Results({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = parsePackageFilters(await searchParams);
  const { packages } = await getCatalog();
  return <PackageResults results={filterPackages(poolFor(packages, filters), filters)} query={filters.q} />;
}

function PackageResults({ results, query }: { results: TravelPackage[]; query?: string }) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No packages match your search"
        description="Try a different destination or clear a few filters."
        actionHref="/packages"
        actionLabel="Clear all filters"
      />
    );
  }
  return (
    <>
      <p className="text-muted-foreground mt-8 mb-6 text-sm" aria-live="polite">
        Showing {results.length} package{results.length === 1 ? '' : 's'}
        {query ? <> for &ldquo;{query}&rdquo;</> : null}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} priority={i < 4} />
        ))}
      </div>
    </>
  );
}

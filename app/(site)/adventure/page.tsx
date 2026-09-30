import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/site/empty-state';
import { FilterBar } from '@/components/site/filter-bar';
import { JsonLd } from '@/components/site/json-ld';
import { PackageCard } from '@/components/site/package-card';
import { PageHero } from '@/components/site/page-hero';
import {
  ADVENTURE_DURATIONS,
  ADVENTURE_PRICE_BANDS,
  ADVENTURE_TYPES,
  filterAdventures,
  type AdventureDuration,
  type AdventurePriceBand,
  type AdventureType,
} from '@/lib/adventure';
import { getCatalog } from '@/lib/data/catalog';
import type { RawSearchParams } from '@/lib/search-params';
import { breadcrumbLd, collectionPageLd, graph, packageListLd, pageMetadata } from '@/lib/seo';
import type { TravelPackage } from '@/types';

const DESCRIPTION =
  'Book adventure activities in India with TripGoals: paragliding, river rafting, scuba diving, bungee jumping, rappelling, zip lining and water sports, with prices per person.';

export const metadata: Metadata = pageMetadata({
  title: 'Paragliding, Rafting & Scuba Adventures',
  description: DESCRIPTION,
  path: '/adventure',
  image: { url: '/hero/crystal-river.jpg', alt: 'A boat on the crystal-clear Umngot river at Dawki, Meghalaya' },
});

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const pick = <T extends string>(value: string | undefined, allowed: readonly { value: T }[]) =>
  allowed.find((a) => a.value === value)?.value;

export default async function AdventurePage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const { packages } = await getCatalog();
  const all = packages.filter((p) => p.section === 'adventure');

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageLd({ name: 'Adventure activities', description: DESCRIPTION, path: '/adventure', items: packageListLd('Adventure activities in India', all) }),
          breadcrumbLd([{ name: 'Adventure', path: '/adventure' }]),
        )}
      />
      <PageHero
        eyebrow="Adrenaline"
        title="Adventure activities"
        subtitle="Thrilling experiences for the brave, from the skies to the rapids."
        image="/hero/crystal-river.jpg"
      />
      <section className="shell -mt-8 pb-28 sm:-mt-10">
        <Suspense fallback={<div className="bg-muted h-[4.5rem] animate-pulse rounded-[1.75rem]" />}>
          <FilterBar
            searchPlaceholder="Search activities"
            selects={[
              { name: 'type', label: 'Activity type', allLabel: 'All types', options: ADVENTURE_TYPES },
              { name: 'price', label: 'Price', allLabel: 'Any price', options: ADVENTURE_PRICE_BANDS },
              { name: 'duration', label: 'Duration', allLabel: 'Any duration', options: ADVENTURE_DURATIONS },
            ]}
          />
        </Suspense>
        {/* Unfiltered list in the static HTML for crawlers; filtered results stream in over it. */}
        <Suspense fallback={<AdventureResults results={all} />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Results({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const sp = await searchParams;
  const { packages } = await getCatalog();
  const results = filterAdventures(
    packages.filter((p) => p.section === 'adventure'),
    {
      q: first(sp.q),
      type: pick<AdventureType>(first(sp.type), ADVENTURE_TYPES),
      price: pick<AdventurePriceBand>(first(sp.price), ADVENTURE_PRICE_BANDS),
      duration: pick<AdventureDuration>(first(sp.duration), ADVENTURE_DURATIONS),
    },
  );
  return <AdventureResults results={results} />;
}

function AdventureResults({ results }: { results: TravelPackage[] }) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No activities found"
        description="Try a different filter, or ask us about custom adventure plans."
        actionHref="/adventure"
        actionLabel="Clear all filters"
      />
    );
  }
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((pkg, i) => (
        <PackageCard key={pkg.id} pkg={pkg} priority={i < 4} />
      ))}
    </div>
  );
}

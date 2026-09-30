import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CategoryCard } from '@/components/site/category-card';
import { EmptyState } from '@/components/site/empty-state';
import { FilterBar } from '@/components/site/filter-bar';
import { JsonLd } from '@/components/site/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { CATEGORY_SORTS, filterCategories } from '@/lib/catalog-filter';
import { getCatalog } from '@/lib/data/catalog';
import { DURATION_BANDS } from '@/lib/parsers/duration';
import { PRICE_BANDS } from '@/lib/parsers/price';
import { parseCategoryFilters, type RawSearchParams } from '@/lib/search-params';
import { absoluteUrl, breadcrumbLd, cleanText, collectionPageLd, graph, pageMetadata } from '@/lib/seo';
import type { Category } from '@/types';

const DESCRIPTION =
  'Browse India trips by travel style: heritage and culture, beaches and islands, hill stations, treks, wildlife safaris, city breaks and pilgrimage circuits, with prices for each.';

export const metadata: Metadata = pageMetadata({
  title: 'Travel Styles: Beach, Heritage & Trek Tours',
  description: DESCRIPTION,
  path: '/categories',
  image: { url: '/hero/mysore-palace.jpg', alt: 'The Durbar Hall of Mysore Palace' },
});

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const { categories, packages } = await getCatalog();
  const all = filterCategories(categories, packages, {});

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageLd({
            name: 'Travel styles',
            description: DESCRIPTION,
            path: '/categories',
            items: {
              '@type': 'ItemList',
              numberOfItems: all.length,
              itemListElement: all.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: absoluteUrl(`/categories/${c.slug}`),
                name: cleanText(c.name),
              })),
            },
          }),
          breadcrumbLd([{ name: 'Categories', path: '/categories' }]),
        )}
      />
      <PageHero
        eyebrow="Travel styles"
        title="Find your way to travel"
        subtitle="Heritage trails, hill stations, beaches and more. Choose a style and see every trip in it."
        image="/hero/mysore-palace.jpg"
      />
      <section className="shell -mt-8 pb-28 sm:-mt-10">
        <Suspense fallback={<div className="bg-muted h-[4.5rem] animate-pulse rounded-[1.75rem]" />}>
          <FilterBar
            searchPlaceholder="Search categories"
            selects={[
              { name: 'price', label: 'Price', allLabel: 'Any price', options: PRICE_BANDS },
              { name: 'duration', label: 'Duration', allLabel: 'Any duration', options: DURATION_BANDS },
              { name: 'sort', label: 'Sort by', allLabel: 'Sort: Featured', options: CATEGORY_SORTS.filter((s) => s.value !== 'featured') },
            ]}
          />
        </Suspense>
        {/* Unfiltered list in the static HTML for crawlers; filtered results stream in over it. */}
        <Suspense fallback={<CategoryResults results={all} />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Results({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = parseCategoryFilters(await searchParams);
  const { categories, packages } = await getCatalog();
  return <CategoryResults results={filterCategories(categories, packages, filters)} />;
}

function CategoryResults({ results }: { results: Category[] }) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No categories match"
        description="Try clearing a filter to see every travel style."
        actionHref="/categories"
        actionLabel="Clear all filters"
      />
    );
  }
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((category, i) => (
        <div key={category.id} className="h-80 sm:h-96">
          <CategoryCard category={category} priority={i < 3} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        </div>
      ))}
    </div>
  );
}

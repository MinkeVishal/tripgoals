import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/site/empty-state';
import { FilterBar } from '@/components/site/filter-bar';
import { JsonLd } from '@/components/site/json-ld';
import { PackageCard } from '@/components/site/package-card';
import { PageHero } from '@/components/site/page-hero';
import { imageUrl } from '@/lib/appwrite/image-url';
import { filterPackages } from '@/lib/catalog-filter';
import { getCatalog, getCategoryBySlug } from '@/lib/data/catalog';
import { formatPrice } from '@/lib/parsers/price';
import { parsePackageFilters, type RawSearchParams } from '@/lib/search-params';
import {
  breadcrumbLd,
  categoryDescription,
  categoryTitle,
  cleanText,
  collectionPageLd,
  graph,
  packageListLd,
  pageMetadata,
} from '@/lib/seo';
import type { TravelPackage } from '@/types';

// Category artwork is often small, so the banner uses one of the bundled landscapes (stable per category).
const BACKDROPS = ['/hero/kashmir-meadow.jpg', '/hero/mountain-lake.jpg', '/hero/crystal-river.jpg', '/hero/palm-beach.jpg', '/hero/mysore-palace.jpg'];
const backdropFor = (slug: string) => BACKDROPS[[...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % BACKDROPS.length];

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category not found', robots: { index: false } };
  return pageMetadata({
    title: categoryTitle(category),
    description: categoryDescription(category),
    path: `/categories/${category.slug}`,
    image: category.imageId ? { url: imageUrl(category.imageId), alt: `${cleanText(category.name)} trips with TripGoals` } : undefined,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const { packages } = await getCatalog();
  const all = packages.filter((p) => p.categoryId === category.id);
  const path = `/categories/${category.slug}`;

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageLd({
            name: categoryTitle(category),
            description: categoryDescription(category),
            path,
            items: packageListLd(categoryTitle(category), all),
          }),
          breadcrumbLd([
            { name: 'Categories', path: '/categories' },
            { name: cleanText(category.name), path },
          ]),
        )}
      />
      <PageHero
        eyebrow="Category"
        title={category.name}
        subtitle={category.description || category.subtitle}
        image={backdropFor(category.slug)}
        aside={
          category.imageId ? (
            <div className="hidden w-56 rounded-[1.4rem] bg-white/12 p-2 ring-1 ring-white/20 backdrop-blur-xl md:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]">
                <Image src={imageUrl(category.imageId)} alt={`${cleanText(category.name)} illustration`} fill sizes="224px" className="object-cover" />
              </div>
              <p className="px-2 pt-2.5 pb-1 text-sm text-white/85">
                {category.stats.count} {category.stats.count === 1 ? 'trip' : 'trips'}
                {category.stats.minPrice ? <> · from {formatPrice(category.stats.minPrice)}</> : null}
              </p>
            </div>
          ) : null
        }
      />
      <section className="shell -mt-8 pb-28 sm:-mt-10">
        <Suspense fallback={<div className="h-[4.5rem] animate-pulse rounded-[1.75rem] bg-muted" />}>
          <FilterBar searchPlaceholder={`Search in ${category.name}`} selects={[]} />
        </Suspense>
        {/* Unfiltered list in the static HTML for crawlers; search results stream in over it. */}
        <Suspense fallback={<CategoryPackages results={all} />}>
          <Results categoryId={category.id} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Results({ categoryId, searchParams }: { categoryId: string; searchParams: Promise<RawSearchParams> }) {
  const filters = parsePackageFilters(await searchParams);
  const { packages } = await getCatalog();
  return <CategoryPackages results={filterPackages(packages.filter((p) => p.categoryId === categoryId), { q: filters.q })} />;
}

function CategoryPackages({ results }: { results: TravelPackage[] }) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No packages here yet"
        description="We're adding new trips to this category all the time. Browse everything in the meantime."
        actionHref="/packages"
        actionLabel="Browse all packages"
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

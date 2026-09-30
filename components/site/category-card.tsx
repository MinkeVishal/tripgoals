import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { imageUrl } from '@/lib/appwrite/image-url';
import { formatPrice } from '@/lib/parsers/price';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** Photo tile: name bottom-left, "See details" pill bottom-right. The parent sets its height. */
export function CategoryCard({
  category,
  className,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: CategoryCardProps) {
  const { stats } = category;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn('group bg-forest-900 relative isolate block h-full min-h-72 overflow-hidden rounded-[1.6rem] text-white', className)}
    >
      {category.imageId ? (
        <Image
          src={imageUrl(category.imageId)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="-z-20 object-cover transition-transform duration-[1.4s] ease-soft group-hover:scale-[1.07]"
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/65 via-black/10 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

      <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur-md">
        {stats.count} {stats.count === 1 ? 'trip' : 'trips'}
        {stats.minPrice ? <> · from {formatPrice(stats.minPrice)}</> : null}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="text-2xl leading-tight font-medium tracking-tight sm:text-[1.7rem]">{category.name}</h3>
          {category.subtitle || category.description ? (
            <p className="mt-1 line-clamp-1 max-w-sm text-sm text-white/75">{category.subtitle || category.description}</p>
          ) : null}
        </div>
        <span className="text-foreground inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white pr-2 pl-4 text-xs font-medium transition-[padding] duration-500 ease-soft group-hover:pr-3">
          See details
          <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-soft group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}

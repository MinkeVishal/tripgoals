import { ViewTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, Compass } from 'lucide-react';
import { imageUrl } from '@/lib/appwrite/image-url';
import { formatPrice } from '@/lib/parsers/price';
import { cn } from '@/lib/utils';
import type { TravelPackage } from '@/types';
import { AmenityIcon } from './amenity-icon';
import { WishlistButton } from './wishlist-button';

interface PackageCardProps {
  pkg: TravelPackage;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** "tall" gives the photo most of the card, for editorial rows. */
  variant?: 'default' | 'tall';
}

/** Shared name so the cover morphs into the detail page's hero on navigation. */
export const coverTransitionName = (id: string) => `cover-${id}`;

export function PackageCard({
  pkg,
  priority = false,
  className,
  sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 90vw',
  variant = 'default',
}: PackageCardProps) {
  const cover = pkg.images[0];
  const tall = variant === 'tall';

  return (
    <article
      className={cn(
        'group bg-card ring-border relative flex h-full flex-col rounded-[1.6rem] p-2 ring-1 transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_oklch(0.3_0.06_138/0.35)]',
        className,
      )}
    >
      <div className={cn('bg-muted relative overflow-hidden rounded-[1.2rem]', tall ? 'aspect-[3/4]' : 'aspect-[5/4]')}>
        {cover ? (
          <ViewTransition name={coverTransitionName(pkg.id)} share="morph" default="none">
            <Image
              src={imageUrl(cover)}
              alt={pkg.title}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.06]"
            />
          </ViewTransition>
        ) : (
          <div className="text-muted-foreground/50 flex size-full items-center justify-center">
            <Compass className="size-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/25 to-transparent" />

        {pkg.durationLabel ? (
          <span className="text-foreground absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Clock className="size-3.5" />
            {pkg.durationLabel}
          </span>
        ) : null}
        <WishlistButton packageId={pkg.id} packageTitle={pkg.title} className="absolute top-3 right-3 z-20" />
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[1.05rem] font-medium tracking-tight">
              <Link href={`/packages/${pkg.slug}`} className="after:absolute after:inset-0 after:z-10 after:rounded-[1.6rem]">
                {pkg.title}
              </Link>
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
              {pkg.subtitle || pkg.categoryName || pkg.destination}
            </p>
          </div>
          {tall ? (
            <span className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300">
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-soft group-hover:rotate-45" />
            </span>
          ) : null}
        </div>

        {!tall ? (
          <>
            {pkg.amenities.length > 0 ? (
              <ul className="text-muted-foreground mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs" aria-label="Highlights">
                {pkg.amenities.slice(0, 3).map((a) => (
                  <li key={`${a.icon}-${a.label}`} className="inline-flex items-center gap-1.5">
                    <AmenityIcon name={a.icon} className="text-primary size-3.5" />
                    {a.label}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <p className="text-lg font-semibold tracking-tight tabular-nums">
                {formatPrice(pkg.price)}
                {pkg.price > 0 ? <span className="text-muted-foreground text-sm font-normal"> / person</span> : null}
              </p>
              <span className="bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex size-9 items-center justify-center rounded-full transition-colors duration-300">
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-soft group-hover:rotate-45" />
              </span>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="bg-card ring-border rounded-[1.6rem] p-2 ring-1">
      <div className="bg-muted aspect-[5/4] animate-pulse rounded-[1.2rem]" />
      <div className="space-y-3 px-2.5 pt-4 pb-2">
        <div className="bg-muted h-5 w-2/3 animate-pulse rounded-full" />
        <div className="bg-muted h-4 w-1/3 animate-pulse rounded-full" />
        <div className="bg-muted mt-5 h-6 w-1/2 animate-pulse rounded-full" />
      </div>
    </div>
  );
}

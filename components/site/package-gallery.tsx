'use client';

import { useCallback, useEffect, useState, ViewTransition } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { imageUrl } from '@/lib/appwrite/image-url';
import { cn } from '@/lib/utils';

interface PackageHeroProps {
  images: string[];
  title: string;
  /** Shared with the package card's cover so it morphs into this banner. */
  transitionName: string;
  /** Title, breadcrumb and chips, rendered over the photo. */
  children: React.ReactNode;
}

const AUTO_ADVANCE_MS = 5500;

/** Full-width photo banner for a package: a gentle slideshow of its photos, plus a lightbox. */
export function PackageHero({ images, title, transitionName, children }: PackageHeroProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || open || paused || reduce) return;
    const id = setTimeout(() => go(index + 1), AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [count, open, paused, reduce, index, go]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, go]);

  return (
    <section className="p-2 sm:p-3">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="bg-forest-950 relative isolate flex h-[78svh] max-h-[52rem] min-h-[32rem] flex-col justify-end overflow-hidden rounded-[1.75rem] text-white sm:rounded-[2.25rem]"
      >
        {images.map((id, i) => {
          const image = (
            <Image
              src={imageUrl(id)}
              alt={i === index ? `${title}, photo ${i + 1} of ${count}` : ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn('object-cover transition-transform duration-[7s] ease-out', i === index ? 'scale-100' : 'scale-110')}
            />
          );
          return (
            <div
              key={id}
              aria-hidden={i !== index}
              className={cn(
                'absolute inset-0 -z-20 transition-opacity duration-[1.4s] ease-in-out',
                i === index ? 'opacity-100' : 'opacity-0',
              )}
            >
              {i === 0 ? (
                <ViewTransition name={transitionName} share="morph" default="none">
                  {image}
                </ViewTransition>
              ) : (
                image
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/15 to-black/40" />

        <div className="shell pb-8 sm:pb-12">
          <div className="flex flex-col gap-8 px-3 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">{children}</div>

            {count > 0 ? (
              <div className="flex items-center gap-3">
                {count > 1 ? (
                  <div className="flex items-center gap-1 rounded-full bg-white/12 p-1 ring-1 ring-white/20 backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => go(index - 1)}
                      aria-label="Previous photo"
                      className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="min-w-12 text-center text-sm tabular-nums" aria-live="polite">
                      {index + 1} / {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => go(index + 1)}
                      aria-label="Next photo"
                      className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-foreground inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Images className="size-4" /> View photos
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {count > 0 ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[min(96vw,80rem)] gap-3 rounded-3xl border-0 bg-black p-2 text-white sm:max-w-[min(96vw,80rem)]">
            <DialogTitle className="sr-only">{title} photos</DialogTitle>
            <DialogDescription className="sr-only">
              Photo {index + 1} of {count}. Use the arrow keys to browse.
            </DialogDescription>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <Image
                src={imageUrl(images[index]!)}
                alt={`${title}, photo ${index + 1} of ${count}`}
                fill
                sizes="96vw"
                className="object-contain"
              />
            </div>
            {count > 1 ? (
              <ul className="flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Photo thumbnails">
                {images.map((id, i) => (
                  <li key={id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        'relative block h-14 w-20 overflow-hidden rounded-lg ring-2 transition sm:h-16 sm:w-24',
                        i === index ? 'ring-white' : 'opacity-50 ring-transparent hover:opacity-100',
                      )}
                    >
                      <Image src={imageUrl(id)} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
}

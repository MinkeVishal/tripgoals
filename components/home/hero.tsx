'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  src: string;
  /** Where the photo was taken, shown under the slideshow. */
  place?: string;
}

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  slides: HeroSlide[];
  chips: { href: string; label: string }[];
}

const ease = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 7000;
const FADE_S = 1.8;

function Headline({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <h1 className="max-w-[13ch] text-[clamp(2.9rem,7.6vw,6.75rem)] leading-[0.95] font-medium tracking-[-0.035em]">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '105%', rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.25 + i * 0.1, ease }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h1>
  );
}

export function Hero({ title, subtitle, ctaLabel, ctaUrl, slides, chips }: HeroProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const count = slides.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const goTo = (next: number) => {
    if (next === index) return;
    setPrev(index);
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    if (count < 2 || reduce) return;
    const id = setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % count);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, count, reduce]);

  const current = slides[index];

  return (
    <section aria-label="Welcome" className="p-2 sm:p-3">
      <div
        ref={ref}
        className="bg-forest-950 relative isolate flex h-[calc(100svh-1rem)] max-h-[62rem] min-h-[38rem] flex-col overflow-hidden rounded-[1.75rem] text-white sm:h-[calc(100svh-1.5rem)] sm:rounded-[2.25rem]"
      >
        {/* Slides: the incoming photo fades in over the outgoing one while it slowly settles. */}
        <motion.div style={reduce ? undefined : { scale: imageScale }} className="absolute inset-0 -z-20">
          {slides.map((slide, i) => {
            const role = i === index ? 'active' : i === prev ? 'prev' : 'idle';
            return (
              <motion.div
                key={slide.src}
                aria-hidden={role !== 'active'}
                className="absolute inset-0"
                style={{ zIndex: role === 'active' ? 2 : role === 'prev' ? 1 : 0 }}
                initial={false}
                animate={{ opacity: role === 'idle' ? 0 : 1 }}
                transition={{ duration: role === 'active' ? FADE_S : 0, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: role === 'active' || reduce ? 1 : 1.14 }}
                  transition={role === 'active' ? { duration: SLIDE_MS / 1000 + FADE_S, ease: [0.25, 0.1, 0.25, 1] } : { duration: 0, delay: FADE_S }}
                >
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    priority={i === 0}
                    loading={i === 0 ? undefined : 'eager'}
                    sizes="100vw"
                    quality={80}
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legibility */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/45 via-black/5 to-black/60" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/40 via-black/10 to-transparent" />

        <motion.div
          style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
          className="shell flex flex-1 flex-col justify-between pt-28 pb-6 sm:pt-36 sm:pb-8"
        >
          <div className="px-3 sm:px-5">
            <Headline text={title} />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.75, ease }}
              className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href={ctaUrl}
                className="group text-foreground inline-flex h-13 w-fit items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-[0.95rem] font-medium transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {ctaLabel}
                <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full transition-transform duration-500 ease-soft group-hover:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
              </Link>

              <form action="/packages" method="get" role="search" className="relative w-full max-w-sm">
                <label htmlFor="hero-search" className="sr-only">
                  Search destinations or packages
                </label>
                <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-white/70" />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Where do you want to go?"
                  className="h-13 w-full rounded-full bg-black/20 pr-5 pl-12 text-[0.95rem] text-white ring-1 ring-white/25 backdrop-blur-xl transition-[background-color,box-shadow] outline-none placeholder:text-white/65 focus:bg-white/20 focus:ring-white/50"
                />
              </form>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="flex flex-col gap-5 px-3 sm:flex-row sm:items-end sm:justify-between sm:px-5"
          >
            {count > 1 ? (
              <div className="w-full max-w-xs">
                <div className="mb-3 flex h-5 items-center gap-2 overflow-hidden text-sm text-white/85">
                  <AnimatePresence mode="wait" initial={false}>
                    {current?.place ? (
                      <motion.span
                        key={current.place}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease }}
                        className="inline-flex items-center gap-1.5 text-white/75"
                      >
                        <MapPin className="size-3.5" /> {current.place}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
                <div className="flex gap-1.5" role="tablist" aria-label="Choose photo">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.src}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={slide.place ? `Show ${slide.place}` : `Show photo ${i + 1}`}
                      onClick={() => goTo(i)}
                      className="group relative h-6 flex-1"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40">
                        <span
                          key={i === index ? `on-${index}` : 'off'}
                          className={cn(
                            'absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white',
                            i < index ? 'scale-x-100' : 'scale-x-0',
                          )}
                          style={
                            i === index && !reduce
                              ? { animation: `hero-progress ${SLIDE_MS}ms linear forwards` }
                              : i === index
                                ? { transform: 'scaleX(1)' }
                                : undefined
                          }
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span />
            )}

            {chips.length > 0 ? (
              <ul className="flex flex-wrap gap-2 sm:justify-end" aria-label="Popular travel styles">
                {chips.map((chip, i) => (
                  <li key={chip.href} className={i >= 2 ? 'hidden sm:block' : undefined}>
                    <Link
                      href={chip.href}
                      className="inline-flex h-9 items-center rounded-full bg-white/12 px-4 text-sm text-white ring-1 ring-white/20 backdrop-blur-xl transition-colors hover:bg-white hover:text-foreground"
                    >
                      {chip.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

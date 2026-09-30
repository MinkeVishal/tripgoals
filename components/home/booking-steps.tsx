'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { RevealText } from '@/components/motion/reveal-text';
import { cn } from '@/lib/utils';
import { BOOKING_STEPS as STEPS } from './booking-steps-data';



const STEP_MS = 5000;

/** "How it works": steps auto-advance while visible; hovering or focusing one takes over. */
export function BookingSteps() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!inView || held || reduce) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, inView, held, reduce]);

  const step = STEPS[active]!;

  return (
    <div ref={ref} className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-[1.8rem] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[36rem]">
        <AnimatePresence initial={false}>
          <motion.div
            key={step.image}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={step.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
        <p className="absolute bottom-5 left-5 text-sm font-medium text-white/90 tabular-nums sm:bottom-6 sm:left-6">
          Step {active + 1} of {STEPS.length}
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <p className="eyebrow text-primary mb-4">How it works</p>
        <RevealText
          text="Planning your trip, made simple"
          className="text-[clamp(1.9rem,3.7vw,3.1rem)] leading-[1.06] font-medium tracking-[-0.035em]"
        />

        <ol className="mt-10 grid gap-2" onMouseLeave={() => setHeld(false)}>
          {STEPS.map(({ icon: Icon, title, body }, i) => {
            const on = i === active;
            return (
              <li key={title}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setActive(i);
                    setHeld(true);
                  }}
                  onFocus={() => {
                    setActive(i);
                    setHeld(true);
                  }}
                  onBlur={() => setHeld(false)}
                  onClick={() => setActive(i)}
                  aria-current={on ? 'step' : undefined}
                  className={cn(
                    'relative flex w-full items-start gap-4 overflow-hidden rounded-2xl p-4 text-left transition-colors duration-500 sm:p-5',
                    on ? 'bg-muted' : 'hover:bg-muted/60',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full ring-1 transition-colors duration-500',
                      on ? 'bg-primary text-primary-foreground ring-primary' : 'text-muted-foreground ring-border bg-background',
                    )}
                  >
                    <Icon className="size-[1.1rem]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium tracking-tight">{title}</span>
                    <motion.span
                      initial={false}
                      animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="text-muted-foreground block overflow-hidden text-sm leading-relaxed"
                    >
                      <span className="block pt-1.5">{body}</span>
                    </motion.span>
                  </span>
                  {on && !held && !reduce && inView ? (
                    <span
                      key={`bar-${active}`}
                      aria-hidden
                      className="bg-primary/70 absolute bottom-0 left-0 h-0.5 w-full origin-left"
                      style={{ animation: `hero-progress ${STEP_MS}ms linear forwards` }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

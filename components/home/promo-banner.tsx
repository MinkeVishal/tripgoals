'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { RevealText } from '@/components/motion/reveal-text';
import { Reveal } from '@/components/motion/reveal';
import { ArrowLink } from '@/components/site/arrow-link';

interface PromoBannerProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  image: string;
  secondary?: { href: string; label: string };
}

/**
 * Closing call to action (the admin-editable "promo" banner). The photo fades up out of the page
 * and down into the footer, which picks up the same forest colour.
 */
export function PromoBanner({ eyebrow = 'Experience', title, subtitle, ctaLabel, ctaUrl, image, secondary }: PromoBannerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '0%']);
  const external = /^https?:\/\//.test(ctaUrl);

  return (
    <section ref={ref} data-footer-lead className="relative isolate px-2 pt-24 sm:px-3 sm:pt-32">
      <div className="shell relative z-10 text-center">
        <Reveal y={8}>
          <p className="eyebrow text-primary mb-4">{eyebrow}</p>
        </Reveal>
        <RevealText
          text={title}
          className="mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.04em]"
        />
        <Reveal delay={0.15}>
          <p className="text-muted-foreground mx-auto mt-5 max-w-md">{subtitle}</p>
        </Reveal>
        <Reveal delay={0.25} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ArrowLink href={ctaUrl} external={external} size="lg">
            {ctaLabel}
          </ArrowLink>
          {secondary ? (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:bg-muted inline-flex h-13 items-center rounded-full px-6 text-[0.95rem] font-medium ring-1 ring-border transition-colors"
            >
              {secondary.label}
            </a>
          ) : null}
        </Reveal>
      </div>

      <div className="relative -mt-10 h-[22rem] overflow-hidden sm:-mt-16 sm:h-[34rem] lg:h-[40rem]">
        <motion.div style={reduce ? undefined : { scale, y }} className="absolute inset-0 origin-bottom">
          <Image src={image} alt="" fill sizes="100vw" className="object-cover object-center" />
        </motion.div>
        <div className="from-background absolute inset-x-0 top-0 h-1/2 bg-linear-to-b via-background/40 to-transparent" />
        <div className="to-forest-950 absolute inset-x-0 -bottom-px h-1/2 bg-linear-to-b from-transparent via-forest-950/55" />
      </div>
    </section>
  );
}

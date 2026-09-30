import Image from 'next/image';
import { Reveal } from '@/components/motion/reveal';
import { RevealText } from '@/components/motion/reveal-text';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Background photo; defaults to a bundled landscape so the banner never waits on the network. */
  image?: string;
  /** Optional slot rendered beside the title (e.g. a thumbnail). */
  aside?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/** Inset photo banner for inner pages, matching the home hero. The header floats over it. */
export function PageHero({ eyebrow, title, subtitle, image = '/hero/kashmir-meadow.jpg', aside, className, children }: PageHeroProps) {
  return (
    <section className={cn('p-2 sm:p-3', className)}>
      <div className="bg-forest-950 relative isolate flex h-[56svh] min-h-[25rem] max-h-[34rem] flex-col justify-end overflow-hidden rounded-[1.75rem] text-white sm:rounded-[2.25rem]">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-[hero-settle_2.2s_var(--ease-soft)_both] -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/20 to-black/35" />

        <div className="shell pb-10 sm:pb-14">
          <div className="flex flex-col gap-8 px-3 sm:px-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {eyebrow ? (
                <Reveal y={8}>
                  <p className="eyebrow mb-4 text-white/75">{eyebrow}</p>
                </Reveal>
              ) : null}
              <RevealText
                as="h1"
                text={title}
                className="text-[clamp(2.4rem,5.6vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.04em]"
              />
              {subtitle ? (
                <Reveal delay={0.2}>
                  <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{subtitle}</p>
                </Reveal>
              ) : null}
              {children ? <Reveal delay={0.3} className="mt-6">{children}</Reveal> : null}
            </div>
            {aside ? <Reveal delay={0.25} className="shrink-0">{aside}</Reveal> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

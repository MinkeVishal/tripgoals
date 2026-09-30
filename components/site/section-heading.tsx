import { Reveal } from '@/components/motion/reveal';
import { RevealText } from '@/components/motion/reveal-text';
import { cn } from '@/lib/utils';
import { ArrowLink } from './arrow-link';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  /** left: title left, action or description right. center: stacked and centred. */
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = 'Explore more',
  align = 'left',
  className,
}: SectionHeadingProps) {
  const center = align === 'center';
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 sm:mb-14',
        center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', center && 'mx-auto')}>
        {eyebrow ? (
          <Reveal y={8}>
            <p className="eyebrow text-primary mb-4">{eyebrow}</p>
          </Reveal>
        ) : null}
        <RevealText
          text={title}
          className="text-[clamp(1.9rem,3.7vw,3.1rem)] leading-[1.06] font-medium tracking-[-0.035em]"
        />
        {center && description ? (
          <Reveal delay={0.15}>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">{description}</p>
          </Reveal>
        ) : null}
      </div>

      {!center && (href || description) ? (
        <Reveal delay={0.15} className="flex max-w-sm flex-col gap-5 md:items-end md:text-right">
          {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
          {href ? <ArrowLink href={href}>{hrefLabel}</ArrowLink> : null}
        </Reveal>
      ) : null}
    </div>
  );
}

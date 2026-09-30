import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  /** "primary" = forest pill on light backgrounds, "light" = white pill on photos/dark. */
  tone?: 'primary' | 'light';
  size?: 'md' | 'lg';
  external?: boolean;
  className?: string;
}

/** Pill link with a round arrow badge that turns on hover. */
export function ArrowLink({ href, children, tone = 'primary', size = 'md', external, className }: ArrowLinkProps) {
  const classes = cn(
    'group inline-flex w-fit shrink-0 items-center gap-3 rounded-full py-1.5 pr-1.5 font-medium transition-[transform,background-color] duration-300 ease-soft hover:scale-[1.02] active:scale-[0.98]',
    size === 'lg' ? 'h-13 pl-6 text-[0.95rem]' : 'h-11 pl-5 text-sm',
    tone === 'primary' ? 'bg-primary text-primary-foreground hover:bg-forest-800' : 'text-foreground bg-white hover:bg-white/90',
    className,
  );
  const badge = cn(
    'flex items-center justify-center rounded-full transition-transform duration-500 ease-soft group-hover:-rotate-45',
    size === 'lg' ? 'size-10' : 'size-8',
    tone === 'primary' ? 'text-primary bg-white' : 'bg-primary text-primary-foreground',
  );
  const content = (
    <>
      {children}
      <span className={badge}>
        <ArrowRight className="size-4" />
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

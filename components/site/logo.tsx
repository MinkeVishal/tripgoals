import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Brand mark + wordmark. Text colour follows `currentColor`, so it works on photos and on white. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="TripGoals home" className={cn('flex shrink-0 items-center gap-2.5', className)}>
      <Image src="/Tripgoal_logo.png" alt="" width={34} height={34} priority={priority} className="rounded-full ring-1 ring-black/5" />
      <span className="text-[0.95rem] leading-none font-semibold tracking-[0.18em] uppercase">TripGoals</span>
    </Link>
  );
}

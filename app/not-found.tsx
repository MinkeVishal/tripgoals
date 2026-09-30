import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLink } from '@/components/site/arrow-link';
import { Logo } from '@/components/site/logo';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="bg-background min-h-svh p-2 sm:p-3">
      <div className="bg-forest-950 relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[1.75rem] text-white sm:min-h-[calc(100svh-1.5rem)] sm:rounded-[2.25rem]">
        <Image src="/hero/mountain-lake.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/50 via-black/30 to-black/65" />

        <div className="px-5 pt-5 sm:px-8 sm:pt-7">
          <Logo className="text-white" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
          <p aria-hidden className="text-[clamp(7rem,24vw,18rem)] leading-none font-medium tracking-[-0.06em] text-white/90">
            404
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight font-medium tracking-[-0.03em]">
            Lost in the mountains
          </h1>
          <p className="mt-3 max-w-md text-white/75">
            We couldn&apos;t find the page you were looking for. It may have moved or no longer exists.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ArrowLink href="/" tone="light" size="lg">
              Back to home
            </ArrowLink>
            <ArrowLink href="/packages" tone="primary" size="lg">
              Browse packages
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}

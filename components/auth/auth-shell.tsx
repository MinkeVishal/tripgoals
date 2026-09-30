import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Logo } from '@/components/site/logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Split layout: form on the left, an inset travel photo on the right (hidden on small screens). */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors">
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <Reveal y={16} className="w-full max-w-sm">
            <h1 className="text-[2.1rem] leading-tight font-medium tracking-[-0.03em]">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? <p className="text-muted-foreground mt-8 text-sm">{footer}</p> : null}
          </Reveal>
        </div>
      </div>

      <div className="hidden p-3 lg:block">
        <div className="bg-forest-950 relative isolate h-full overflow-hidden rounded-[2.25rem] text-white">
          <Image
            src="/hero/kashmir-meadow.jpg"
            alt=""
            fill
            priority
            sizes="50vw"
            className="animate-[hero-settle_2.4s_var(--ease-soft)_both] -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/5 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
            <p className="eyebrow mb-4 text-white/70">TripGoals · India</p>
            <p className="max-w-md text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.08] font-medium tracking-[-0.03em]">
              Save the trips you love and book them in one message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { HeaderShell } from './header-shell';
import { onHero } from './nav';
import { MobileUserLinks, UserMenu } from './user-menu';

function SignedOutLinks({ stacked = false }: { stacked?: boolean }) {
  if (stacked) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="lg" className={cn('px-4', onHero.ghost)}>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild size="lg" className={cn('px-5', onHero.pill)}>
        <Link href="/signup">Sign up</Link>
      </Button>
    </div>
  );
}

async function DesktopAuth() {
  const user = await getCurrentUser();
  return user ? <UserMenu user={user} /> : <SignedOutLinks />;
}

async function MobileAuth() {
  const user = await getCurrentUser();
  return user ? <MobileUserLinks user={user} /> : <SignedOutLinks stacked />;
}

/** Static shell + streamed per-user area, so the header can be prerendered. */
export function SiteHeader() {
  return (
    <HeaderShell
      desktopAuth={
        <Suspense fallback={<div className="h-10 w-40" aria-hidden />}>
          <DesktopAuth />
        </Suspense>
      }
      mobileAuth={
        <Suspense fallback={<div className="h-12" aria-hidden />}>
          <MobileAuth />
        </Suspense>
      }
    />
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-svh items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <p className="eyebrow text-primary">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em]">We hit a bump in the road</h1>
        <p className="text-muted-foreground mt-4">
          Please try again. If it keeps happening, message us on WhatsApp and we&apos;ll sort it out.
        </p>
        {error.digest ? <p className="text-muted-foreground/70 mt-3 text-xs">Reference: {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="xl" onClick={reset}>
            <RefreshCw /> Try again
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

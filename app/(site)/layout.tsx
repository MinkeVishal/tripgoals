import { Suspense } from 'react';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { FloatingContact } from '@/components/site/floating-contact';
import { HeaderFallback } from '@/components/site/header-fallback';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { WishlistProvider } from '@/components/site/wishlist-provider';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-svh">
      <SmoothScroll />
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-[60] rounded-md px-4 py-2 font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <WishlistProvider>
        <Suspense fallback={<HeaderFallback />}>
          <SiteHeader />
        </Suspense>
        <main id="main">{children}</main>
        <SiteFooter />
        <FloatingContact />
      </WishlistProvider>
    </div>
  );
}

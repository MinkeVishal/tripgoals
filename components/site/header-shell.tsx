'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { ArrowUpRight, Menu, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { isActive, NAV_LINKS, onHero } from './nav';

interface HeaderShellProps {
  desktopAuth: React.ReactNode;
  mobileAuth: React.ReactNode;
}

export function HeaderShell({ desktopAuth, mobileAuth }: HeaderShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Solid once the page moves; tucks away while scrolling down, returns on the way up.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 32);
    setHidden(y > 480 && y > previous + 4);
    if (y < previous - 4) setHidden(false);
  });

  // Close the mobile menu after navigating.
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setHidden(false);
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/packages?q=${encodeURIComponent(q)}` : '/packages');
    setMenuOpen(false);
  }

  const tone = scrolled ? 'solid' : 'hero';

  return (
    <motion.header
      data-tone={tone}
      animate={{ y: hidden && !menuOpen && !reduce ? '-120%' : '0%' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group/header fixed inset-x-0 top-0 z-50 pt-2 sm:pt-3"
    >
      <div className="shell">
        <div
          className={cn(
            'flex h-16 items-center gap-4 rounded-full px-3 transition-[background-color,box-shadow,height] duration-500 ease-soft sm:px-5',
            scrolled
              ? 'bg-background/85 h-14 shadow-[0_8px_30px_-12px_oklch(0.3_0.05_138/0.25)] ring-1 ring-black/5 backdrop-blur-xl'
              : 'text-white',
          )}
        >
          <Logo priority className={onHero.text} />

          <nav aria-label="Main" className="mx-auto hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative isolate rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    'text-foreground/70 hover:text-foreground group-data-[tone=hero]/header:text-white/80 group-data-[tone=hero]/header:hover:text-white',
                    active && 'text-foreground group-data-[tone=hero]/header:text-white',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="bg-foreground/6 absolute inset-0 -z-10 rounded-full group-data-[tone=hero]/header:bg-white/15"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:ml-0 lg:flex">
            <form onSubmit={submitSearch} role="search" className="relative hidden xl:block">
              <label htmlFor="header-search" className="sr-only">
                Search packages
              </label>
              <input
                id="header-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trips"
                className={cn(
                  'bg-foreground/5 text-foreground placeholder:text-muted-foreground h-10 w-40 rounded-full pr-10 pl-4 text-sm ring-1 ring-transparent transition-[width,background-color] duration-300 outline-none focus:w-56 focus:ring-ring/40',
                  'group-data-[tone=hero]/header:bg-white/15 group-data-[tone=hero]/header:text-white group-data-[tone=hero]/header:ring-white/20 group-data-[tone=hero]/header:placeholder:text-white/70',
                )}
              />
              <button
                type="submit"
                aria-label="Search"
                className={cn('text-muted-foreground absolute inset-y-0 right-0 flex w-10 items-center justify-center', onHero.text)}
              >
                <Search className="size-4" />
              </button>
            </form>
            {desktopAuth}
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'bg-foreground/5 ml-auto flex size-10 items-center justify-center rounded-full ring-1 ring-transparent lg:hidden',
                  onHero.glass,
                )}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,92vw)] gap-0 border-l-0 p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
                <form onSubmit={submitSearch} role="search" className="relative mb-4">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search packages
                  </label>
                  <input
                    id="mobile-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="bg-muted focus:ring-ring/40 h-12 w-full rounded-full pr-12 pl-5 text-sm ring-1 ring-transparent outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-full"
                  >
                    <Search className="size-4" />
                  </button>
                </form>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                      className={cn(
                        'group flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium tracking-tight transition-colors hover:bg-muted',
                        isActive(pathname, link.href) && 'bg-muted',
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-auto border-t pt-5">{mobileAuth}</div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

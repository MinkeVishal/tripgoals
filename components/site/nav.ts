export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages' },
  { href: '/categories', label: 'Categories' },
  { href: '/adventure', label: 'Adventure' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Header tone classes. The header sets `data-tone="hero"` while it floats over a page's photo
 * and `data-tone="solid"` once scrolled; children style themselves off the `header` group.
 */
export const onHero = {
  text: 'group-data-[tone=hero]/header:text-white',
  glass:
    'group-data-[tone=hero]/header:bg-white/15 group-data-[tone=hero]/header:text-white group-data-[tone=hero]/header:ring-white/25 group-data-[tone=hero]/header:hover:bg-white/25',
  pill: 'group-data-[tone=hero]/header:bg-white group-data-[tone=hero]/header:text-foreground group-data-[tone=hero]/header:hover:bg-white/90',
  ghost:
    'group-data-[tone=hero]/header:text-white group-data-[tone=hero]/header:hover:bg-white/15 group-data-[tone=hero]/header:hover:text-white',
} as const;

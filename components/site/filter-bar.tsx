'use client';

import { useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterSelect {
  name: string;
  label: string;
  allLabel: string;
  options: readonly { value: string; label: string }[];
}

interface FilterBarProps {
  searchPlaceholder: string;
  selects: FilterSelect[];
  className?: string;
}

// Literal class names so Tailwind can see them.
const LG_COLUMNS: Record<number, string> = {
  0: 'lg:grid-cols-[minmax(0,1fr)_auto]',
  1: 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto]',
  2: 'lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))_auto]',
  3: 'lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto]',
  4: 'lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))_auto]',
};

const selectClass =
  'bg-muted hover:bg-secondary h-12 w-full appearance-none rounded-full bg-[right_1rem_center] bg-no-repeat px-5 pr-10 text-sm outline-none ring-1 ring-transparent transition-colors focus:ring-ring/40';
const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23626b5c' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

/** URL-driven filters: every change rewrites the query string, so results are shareable and SSR'd. */
export function FilterBar({ searchPlaceholder, selects, className }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const urlQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  // Keep the box in sync when navigation changes ?q= (back button, header search).
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery);
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function update(name: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    start(() => router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false }));
  }

  function onSearch(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => update('q', value.trim()), 300);
  }

  const active = [...params.keys()].some((k) => k === 'q' || selects.some((s) => s.name === k));

  return (
    <div
      role="search"
      className={cn(
        'bg-card ring-border relative z-10 grid gap-2 rounded-[1.75rem] p-2 shadow-[0_24px_60px_-30px_oklch(0.3_0.06_132/0.3)] ring-1 sm:grid-cols-2',
        LG_COLUMNS[selects.length],
        className,
      )}
    >
      <div className="relative">
        <label htmlFor="filter-q" className="sr-only">
          {searchPlaceholder}
        </label>
        <Search className="text-muted-foreground absolute top-1/2 left-5 size-4 -translate-y-1/2" />
        <input
          id="filter-q"
          type="search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="bg-muted placeholder:text-muted-foreground focus:ring-ring/40 h-12 w-full rounded-full pr-4 pl-12 text-sm ring-1 ring-transparent outline-none"
        />
      </div>

      {selects.map((select) => (
        <div key={select.name}>
          <label htmlFor={`filter-${select.name}`} className="sr-only">
            {select.label}
          </label>
          <select
            id={`filter-${select.name}`}
            value={params.get(select.name) ?? ''}
            onChange={(e) => update(select.name, e.target.value)}
            className={selectClass}
            style={{ backgroundImage: chevron }}
          >
            <option value="">{select.allLabel}</option>
            {select.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 lg:w-24">
        {pending ? <Loader2 className="text-muted-foreground size-4 animate-spin" aria-label="Updating results" /> : null}
        {active ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              start(() => router.replace(pathname, { scroll: false }));
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex h-12 items-center gap-1.5 rounded-full px-4 text-sm transition-colors"
          >
            <X className="size-4" /> Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

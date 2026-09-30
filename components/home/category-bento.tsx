import { ClipReveal } from '@/components/motion/clip-reveal';
import { CategoryCard } from '@/components/site/category-card';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

// Column spans on the 12-column desktop grid: wide/narrow, narrow/wide, then thirds.
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4'];

/** Editorial mosaic of travel styles. Shows 7 (or 4) so the rows always close neatly. */
export function CategoryBento({ categories }: { categories: Category[] }) {
  const shown = categories.length >= 7 ? categories.slice(0, 7) : categories.length >= 4 ? categories.slice(0, 4) : categories;
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12">
      {shown.map((category, i) => (
        <ClipReveal
          key={category.id}
          delay={(i % 2) * 0.08}
          className={cn(
            'h-72 sm:h-80 lg:h-[23rem]',
            shown.length < 4 ? 'lg:col-span-4' : SPANS[i],
            // With an odd count on the 2-column tablet grid, let the last tile span the row.
            i === shown.length - 1 && shown.length % 2 === 1 && 'md:col-span-2',
          )}
        >
          <CategoryCard
            category={category}
            sizes={i >= 4 ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw'}
          />
        </ClipReveal>
      ))}
    </div>
  );
}

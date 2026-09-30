'use client';

import { useTransition } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from './wishlist-provider';

interface WishlistButtonProps {
  packageId: string;
  packageTitle: string;
  /** "icon" is the round heart overlaid on cards; "pill" is the labelled button on the detail page. */
  variant?: 'icon' | 'pill';
  className?: string;
}

export function WishlistButton({ packageId, packageTitle, variant = 'icon', className }: WishlistButtonProps) {
  const { ids, toggle } = useWishlist();
  const [pending, start] = useTransition();
  const saved = ids.has(packageId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault(); // buttons sit inside card links
    event.stopPropagation();
    start(() => toggle(packageId));
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        disabled={pending}
        className={cn(
          'inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors',
          saved
            ? 'border-rose-200 bg-rose-50 text-rose-600'
            : 'border-border text-foreground hover:border-rose-300 hover:text-rose-600',
          className,
        )}
      >
        <Heart className={cn('size-4', saved && 'fill-current')} />
        {saved ? 'Saved' : 'Wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${packageTitle} from wishlist` : `Save ${packageTitle} to wishlist`}
      disabled={pending}
      className={cn(
        'text-foreground flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95',
        saved && 'text-rose-500',
        className,
      )}
    >
      <Heart className={cn('size-[18px]', saved && 'fill-current')} />
    </button>
  );
}

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** A styled native <select>: best mobile UX and trivially works with react-hook-form's register(). */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<'select'> & { containerClassName?: string }
>(function NativeSelect(
  { className, containerClassName = 'w-full min-w-0', children, ...props },
  ref,
) {
  return (
    <div className={cn('relative', containerClassName)}>
      <select
        ref={ref}
        className={cn(
          'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive [&>option]:bg-popover [&>option]:text-popover-foreground h-11 w-full appearance-none rounded-xl border px-4 pr-9 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </div>
  );
});

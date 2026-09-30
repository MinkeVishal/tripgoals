import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  tone?: 'gold' | 'blue' | 'green' | 'rose' | 'violet';
}

const TONES: Record<NonNullable<StatCardProps['tone']>, string> = {
  gold: 'bg-amber-500/15 text-amber-500',
  blue: 'bg-sky-500/15 text-sky-500',
  green: 'bg-emerald-500/15 text-emerald-500',
  rose: 'bg-rose-500/15 text-rose-500',
  violet: 'bg-violet-500/15 text-violet-500',
};

export function StatCard({ label, value, hint, icon: Icon, tone = 'gold' }: StatCardProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <span className={cn('flex size-9 items-center justify-center rounded-xl', TONES[tone])}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="font-display mt-3 text-4xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="text-muted-foreground mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}

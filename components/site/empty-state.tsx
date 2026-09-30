import { Compass } from 'lucide-react';
import { ArrowLink } from './arrow-link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <div className="bg-muted text-primary flex size-16 items-center justify-center rounded-full">
        <Compass className="size-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <ArrowLink href={actionHref} className="mt-2">
          {actionLabel}
        </ArrowLink>
      ) : null}
    </div>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/admin-shell';
import { requireRole } from '@/lib/auth';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s · TripGoals Admin' },
  robots: { index: false, follow: false },
};

/** Every /admin page requires at least the Editor role; admin-only pages re-check for Admin. */
async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireRole('editor');
  return <AdminShell user={user}>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-svh items-center justify-center" role="status" aria-label="Loading dashboard">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <Shell>{children}</Shell>
    </Suspense>
  );
}

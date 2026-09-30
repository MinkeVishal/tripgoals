import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, LayoutDashboard } from 'lucide-react';
import { PasswordForm, ProfileForm } from '@/components/site/account-forms';
import { PageHero } from '@/components/site/page-hero';
import { Button } from '@/components/ui/button';
import { requireRole } from '@/lib/auth';

export const metadata: Metadata = { title: 'My Account', robots: { index: false } };

export default function AccountPage() {
  return (
    <>
      <PageHero eyebrow="Your profile" title="My account" subtitle="Manage your details and password." image="/hero/mountain-lake.jpg" />
      <section className="shell max-w-3xl pt-12 pb-28 sm:pt-16">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[1.75rem] bg-muted" />}>
          <AccountDetails />
        </Suspense>
      </section>
    </>
  );
}

async function AccountDetails() {
  const user = await requireRole('customer');
  const card = 'bg-card ring-border rounded-[1.75rem] p-6 ring-1 sm:p-8';
  return (
    <div className="grid gap-6">
      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <p className="text-sm text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          <p className="mt-1 text-2xl font-medium tracking-tight">{user.name}</p>
          <span className="bg-accent text-accent-foreground mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize">
            {user.role}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/wishlist">
              <Heart /> Wishlist
            </Link>
          </Button>
          {user.role !== 'customer' ? (
            <Button asChild size="lg">
              <Link href="/admin">
                <LayoutDashboard /> Dashboard
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className={card}>
        <h2 className="mb-6 text-xl font-medium tracking-tight">Profile</h2>
        <ProfileForm name={user.name} email={user.email} phone={user.phone} />
      </div>

      <div className={card}>
        <h2 className="mb-6 text-xl font-medium tracking-tight">Change password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}

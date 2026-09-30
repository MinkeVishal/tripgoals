import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';
import { RedirectIfSignedIn } from '@/components/auth/redirect-if-signed-in';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to save your favourite trips and plan faster."
      footer={
        <>
          New to TripGoals?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

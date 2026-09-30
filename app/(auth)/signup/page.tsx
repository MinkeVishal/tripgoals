import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { RedirectIfSignedIn } from '@/components/auth/redirect-if-signed-in';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = { title: 'Create account', robots: { index: false } };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Save trips to your wishlist and enquire in one tap."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}

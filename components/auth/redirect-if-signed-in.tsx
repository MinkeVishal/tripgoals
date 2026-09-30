import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

/** Renders nothing; sends already-signed-in visitors away from the auth screens. */
export async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect('/');
  return null;
}

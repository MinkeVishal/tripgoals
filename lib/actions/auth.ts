'use server';

import { cookies } from 'next/headers';
import { ID, type Models } from 'node-appwrite';
import { SESSION_COOKIE } from '@/lib/appwrite/config';
import { createAdminClient, createSessionClient } from '@/lib/appwrite/server';
import { getCurrentUser } from '@/lib/auth';
import { siteConfig } from '@/lib/site-config';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  profileSchema,
  newPasswordSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from '@/lib/validation/auth';
import type { ActionResult } from '@/types';
import { fail, fieldErrorsFrom, messageFrom, succeed } from './helpers';

async function startSession(session: Models.Session) {
  (await cookies()).set(SESSION_COOKIE, session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expire),
  });
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail('Please check your details.', fieldErrorsFrom(parsed.error));
  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    await startSession(session);
    return succeed();
  } catch (error) {
    return fail(messageFrom(error));
  }
}

export async function signupAction(input: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return fail('Please check your details.', fieldErrorsFrom(parsed.error));
  const { name, email, phone, password } = parsed.data;
  try {
    const { account, users } = createAdminClient();
    const user = await account.create({ userId: ID.unique(), email, password, name });
    if (phone) await users.updatePrefs({ userId: user.$id, prefs: { phone } });
    const session = await account.createEmailPasswordSession({ email, password });
    await startSession(session);
    return succeed();
  } catch (error) {
    return fail(messageFrom(error));
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const client = await createSessionClient();
  try {
    await client?.account.deleteSession({ sessionId: 'current' });
  } catch {
    // Session already gone; clearing the cookie is what matters.
  }
  (await cookies()).delete(SESSION_COOKIE);
  return succeed();
}

export async function forgotPasswordAction(input: { email: string }): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return fail('Enter a valid email address.', fieldErrorsFrom(parsed.error));
  try {
    const { account } = createAdminClient();
    await account.createRecovery({
      email: parsed.data.email,
      url: `${siteConfig.url}/reset-password`,
    });
  } catch (error) {
    // Do not reveal whether the address has an account; only surface rate limiting.
    const message = messageFrom(error);
    if (message.startsWith('Too many')) return fail(message);
  }
  return succeed();
}

export async function resetPasswordAction(input: {
  userId: string;
  secret: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse(input);
  if (!parsed.success) return fail('Please check your details.', fieldErrorsFrom(parsed.error));
  if (!input.userId || !input.secret) return fail('This reset link is invalid. Please request a new one.');
  try {
    const { account } = createAdminClient();
    await account.updateRecovery({
      userId: input.userId,
      secret: input.secret,
      password: parsed.data.password,
    });
    return succeed();
  } catch {
    return fail('This reset link is invalid or has expired. Please request a new one.');
  }
}

export async function updateProfileAction(input: { name: string; phone: string }): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return fail('Please sign in to continue.');
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail('Please check your details.', fieldErrorsFrom(parsed.error));
  try {
    const { users } = createAdminClient();
    await users.updateName({ userId: user.id, name: parsed.data.name });
    await users.updatePrefs({ userId: user.id, prefs: { phone: parsed.data.phone } });
    return succeed();
  } catch (error) {
    return fail(messageFrom(error));
  }
}

export async function changePasswordAction(input: {
  current: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const client = await createSessionClient();
  if (!client) return fail('Please sign in to continue.');
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return fail('Please check your details.', fieldErrorsFrom(parsed.error));
  try {
    await client.account.updatePassword({
      password: parsed.data.password,
      oldPassword: parsed.data.current,
    });
    return succeed();
  } catch (error) {
    return fail(messageFrom(error, 'Could not change your password.'));
  }
}

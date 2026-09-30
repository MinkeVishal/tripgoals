import 'server-only';
import { AppwriteException } from 'node-appwrite';
import type { z } from 'zod';
import type { ActionResult } from '@/types';

export const fail = (error: string, fieldErrors?: Record<string, string>): ActionResult<never> => ({
  ok: false,
  error,
  fieldErrors,
});

export const succeed = <T = undefined>(data?: T): ActionResult<T> => ({
  ok: true,
  data: data as T,
});

/** Flattens a zod error to { field: firstMessage } for inline form errors. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Turns SDK errors into safe, user-facing messages; unexpected errors are logged, not leaked. */
export function messageFrom(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof AppwriteException) {
    if (error.code === 401) return 'Invalid email or password.';
    if (error.code === 409) return 'An account with this email already exists.';
    if (error.code === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (error.code === 400 || error.code === 404) return error.message;
  }
  console.error(error);
  return fallback;
}

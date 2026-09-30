/**
 * Only allow same-site relative redirects after login (blocks open redirects).
 * Browsers treat "/\" like "//", so both are rejected.
 */
export const safeNext = (next: string | null | undefined, fallback = '/') =>
  next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : fallback;

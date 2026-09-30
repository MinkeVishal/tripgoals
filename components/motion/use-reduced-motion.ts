'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * Like Motion's `useReducedMotion`, but hydration-safe: it reports `false` while hydrating
 * (matching the server render) and the real preference right after. Motion's own
 * `MotionConfig reducedMotion="user"` (see MotionProvider) still skips transform animations.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

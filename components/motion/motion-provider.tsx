'use client';

import { MotionConfig } from 'motion/react';

/** Visitors who prefer reduced motion get fades instead of movement, everywhere. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

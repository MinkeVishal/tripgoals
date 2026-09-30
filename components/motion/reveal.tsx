'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport'> {
  delay?: number;
  y?: number;
}

/** Fades and lifts its children into view once, as they scroll onto the screen. */
export function Reveal({ delay = 0, y = 24, transition, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={transition ?? { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

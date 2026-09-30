'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Opens its content from a slightly inset, rounded mask the first time it scrolls into view. */
export function ClipReveal({ children, className, delay = 0 }: ClipRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(9% 6% 9% 6% round 2rem)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0rem)', opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

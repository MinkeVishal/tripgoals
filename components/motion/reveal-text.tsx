'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
}

/** Words rise out of a mask, one after another, the first time the text scrolls into view. */
export function RevealText({ text, as = 'h2', className, delay = 0 }: RevealTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag
      className={cn(className)}
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '105%' }, shown: { y: 0 } }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  viewport?: {
    once?: boolean;
    amount?: number;
  };
}

export default function AnimatedSection({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  style,
  viewport = { once: true }
}: AnimatedSectionProps) {
  const directionVariants = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  };

  const initial = {
    opacity: 0,
    ...directionVariants[direction]
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      transition={{ delay, duration }}
      viewport={viewport}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
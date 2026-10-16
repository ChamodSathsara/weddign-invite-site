import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'figure';
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = (as === 'li' ? motion.li : as === 'figure' ? motion.figure : motion.div) as typeof motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.3, ease: EASE, delay }}>
      
      {children}
    </Component>);

}
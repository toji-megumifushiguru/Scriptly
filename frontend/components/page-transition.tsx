'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
}

export function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}

export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
      {/* Animated gradient mesh in background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.1) 0px, transparent 50%)',
            'radial-gradient(at 100% 100%, rgba(0, 217, 255, 0.1) 0px, transparent 50%)',
            'radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.1) 0px, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0"
      />
    </div>
  )
}

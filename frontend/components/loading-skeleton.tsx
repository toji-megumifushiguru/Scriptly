'use client'

import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="glass p-6 rounded-xl"
        >
          <div className="h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-3/4 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded w-full" />
            <div className="h-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded w-5/6" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export function ScreenplayLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Title skeleton */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="space-y-2"
      >
        <div className="h-10 bg-gradient-to-r from-primary/30 to-accent/30 rounded w-2/3" />
        <div className="h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-1/2" />
      </motion.div>

      {/* Content skeleton */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        className="glass p-6 rounded-xl space-y-3"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-full" />
        ))}
      </motion.div>

      {/* Tab skeleton */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        className="flex gap-3"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-20" />
        ))}
      </motion.div>
    </motion.div>
  )
}

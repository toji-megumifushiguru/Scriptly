'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Film, Search, Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {icon ? (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          {icon}
        </motion.div>
      ) : (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <Film className="w-16 h-16 text-primary/30" />
        </motion.div>
      )}

      <h3 className="heading-md mb-2">{title}</h3>
      <p className="body-text max-w-md mb-8">{description}</p>

      {action && (
        <Link href={action.href} className="button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {action.label}
        </Link>
      )}
    </motion.div>
  )
}

export function NoResultsState() {
  return (
    <EmptyState
      title="No screenplays found"
      description="Try adjusting your search filters or create a new screenplay to get started."
      icon={<Search className="w-16 h-16 text-muted-foreground" />}
    />
  )
}

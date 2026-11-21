'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group rounded-xl border border-primary/15 bg-card/75 p-5 transition-colors duration-300 hover:border-primary/45 hover:bg-card"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20"
      >
        <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
      </motion.div>
      
      <h3 className="heading-sm text-foreground mb-2">{title}</h3>
      <p className="body-text">{description}</p>
    </motion.div>
  )
}

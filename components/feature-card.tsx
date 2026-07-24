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
      className="glass p-6 md:p-8 rounded-xl group hover:border-primary/50 transition-colors duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300"
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-background" />
      </motion.div>
      
      <h3 className="heading-sm text-foreground mb-2">{title}</h3>
      <p className="body-text">{description}</p>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Heart, MoreVertical, FileText } from 'lucide-react'
import Link from 'next/link'

interface ScreenplayCardProps {
  id: string
  title: string
  genre: string
  lastModified: string
  favorite: boolean
  index: number
}

export function ScreenplayCard({ id, title, genre, lastModified, favorite, index }: ScreenplayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass p-6 rounded-xl group hover:border-primary/50 transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
            <FileText className="w-5 h-5 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/editor/${id}`}>
              <h3 className="heading-sm text-foreground truncate hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground">{genre}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-lg transition-colors ${
            favorite
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
        >
          <Heart className="w-5 h-5" fill={favorite ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Modified {lastModified}
        </p>
        <motion.button
          whileHover={{ rotate: 90 }}
          className="text-muted-foreground hover:text-primary p-1 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

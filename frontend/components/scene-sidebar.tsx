'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface Scene {
  id: string
  number: number
  heading: string
  duration: string
}

interface SceneSidebarProps {
  scenes: Scene[]
  activeSceneId: string
  onSelectScene: (sceneId: string) => void
  onAddScene: () => void
}

export function SceneSidebar({
  scenes,
  activeSceneId,
  onSelectScene,
  onAddScene,
}: SceneSidebarProps) {
  const [expanded, setExpanded] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-lg overflow-hidden h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <span>Scenes</span>
          <motion.div
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <motion.button
          onClick={onAddScene}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Scenes List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-2 space-y-2"
            >
              {scenes.map((scene) => (
                <motion.button
                  key={scene.id}
                  variants={itemVariants}
                  onClick={() => onSelectScene(scene.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeSceneId === scene.id
                      ? 'bg-primary/20 border border-primary/50 text-primary'
                      : 'glass hover:border-primary/30 text-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-primary mb-1">
                        SCENE {scene.number}
                      </p>
                      <p className="text-xs line-clamp-2 text-muted-foreground">
                        {scene.heading}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {scene.duration}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

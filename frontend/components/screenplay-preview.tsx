'use client'

import { motion } from 'framer-motion'
import { Download, FileJson } from 'lucide-react'
import { useState } from 'react'
import type { Screenplay } from '@/frontend/lib/types'

interface ScreenplayPreviewProps {
  screenplay: Screenplay
}

export function ScreenplayPreview({ screenplay }: ScreenplayPreviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'acts' | 'scenes'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'characters', label: 'Characters' },
    { id: 'acts', label: 'Acts' },
    { id: 'scenes', label: 'Scenes' },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-amber-400 p-8 md:p-12 text-background">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-2"
        >
          {screenplay.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-background/90 italic"
        >
          {screenplay.tagline}
        </motion.p>
      </div>

      {/* Controls */}
      <div className="border-b border-border px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none button-secondary text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none button-secondary text-sm flex items-center justify-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Final Draft
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-h-96 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {screenplay.storyIdea && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
                  <h3 className="label-text text-primary mb-2">Story Idea</h3>
                  <p className="text-foreground font-medium">{screenplay.storyIdea}</p>
                </div>
              )}
              <div>
                <h3 className="heading-sm text-primary mb-2">Logline</h3>
                <p className="body-text">{screenplay.logline}</p>
              </div>
              <div>
                <h3 className="heading-sm text-primary mb-2">Synopsis</h3>
                <p className="body-text">{screenplay.synopsis}</p>
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="space-y-4">
              {screenplay.characters.map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg bg-background-tertiary border border-border"
                >
                  <h4 className="font-semibold text-foreground mb-1">{char.name}</h4>
                  <p className="text-sm text-muted-foreground">{char.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'acts' && (
            <div className="space-y-4">
              {screenplay.threeActStructure.map((act, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-lg bg-background-tertiary border border-border"
                >
                  <h4 className="font-semibold text-foreground mb-2">
                    Act {act.number}: {act.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">{act.description}</p>
                  <div className="space-y-2">
                    {act.keyPlotPoints.map((point, pidx) => (
                      <div key={pidx} className="flex items-start gap-2">
                        <span className="text-primary text-xs font-semibold mt-1">•</span>
                        <p className="text-xs text-muted-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="space-y-3">
              {screenplay.scenes.slice(0, 10).map((scene, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3 rounded-lg bg-background-tertiary border border-border"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-semibold text-sm whitespace-nowrap">
                      Scene {scene.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-sm mb-1 truncate">
                        {scene.heading}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-1">{scene.setting}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {scene.description}
                      </p>
                      <p className="text-xs text-primary mt-2 font-semibold">
                        {scene.pageCount} page{scene.pageCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {screenplay.scenes.length > 10 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  +{screenplay.scenes.length - 10} more scenes
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

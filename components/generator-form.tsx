'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader, AlertCircle } from 'lucide-react'
import type { Screenplay } from '@/lib/types'

interface GeneratorFormProps {
  onGenerate: (screenplay: Screenplay, formData: { idea: string; genre: string; mood: string }) => void
}

const genres = [
  'Drama',
  'Comedy',
  'Thriller',
  'Action',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Adventure',
  'Documentary',
]

const moods = [
  'Dark & Intense',
  'Light & Fun',
  'Romantic',
  'Suspenseful',
  'Inspiring',
  'Melancholic',
  'Epic',
  'Mysterious',
]

export function GeneratorForm({ onGenerate }: GeneratorFormProps) {
  const [idea, setIdea] = useState('')
  const [genre, setGenre] = useState('Drama')
  const [mood, setMood] = useState('Dark & Intense')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyIdea: idea,
          genre,
          mood,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate screenplay')
      }

      const data = await response.json()
      if (data.success && data.screenplay) {
        onGenerate(data.screenplay, { idea, genre, mood })
      } else {
        throw new Error(data.error || 'Failed to generate screenplay')
      }
    } catch (err) {
      console.error('[v0] Generation error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while generating the screenplay')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass p-8 md:p-12 rounded-2xl max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Story Idea */}
        <div>
          <label className="label-text block mb-3">Story Idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your story idea in a few sentences. What's the premise, setting, and main conflict?"
            disabled={loading}
            className="w-full h-40 px-4 py-3 rounded-lg bg-background-tertiary border border-border focus:border-primary focus:outline-none transition-colors resize-none text-foreground placeholder-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {idea.length}/500 characters
          </p>
        </div>

        {/* Genre */}
        <div>
          <label className="label-text block mb-3">Genre</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {genres.map((g) => (
              <motion.button
                key={g}
                type="button"
                onClick={() => !loading && setGenre(g)}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  genre === g
                    ? 'bg-gradient-to-r from-primary to-amber-400 text-background'
                    : 'glass text-foreground hover:border-primary/50'
                }`}
              >
                {g}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="label-text block mb-3">Tone & Mood</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {moods.map((m) => (
              <motion.button
                key={m}
                type="button"
                onClick={() => !loading && setMood(m)}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  mood === m
                    ? 'bg-gradient-to-r from-accent to-pink-500 text-background'
                    : 'glass text-foreground hover:border-accent/50'
                }`}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !idea.trim()}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                <Loader className="w-5 h-5" />
              </motion.div>
              <span>Generating Your Screenplay...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Screenplay</span>
            </>
          )}
        </motion.button>

        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground text-sm"
          >
            This usually takes 30-60 seconds...
          </motion.p>
        )}
      </div>
    </motion.form>
  )
}

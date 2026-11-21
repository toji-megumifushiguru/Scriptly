'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/frontend/components/navbar'
import { Footer } from '@/frontend/components/footer'
import { GeneratorForm } from '@/frontend/components/generator-form'
import { ScreenplayPreview } from '@/frontend/components/screenplay-preview'
import { Loader, CheckCircle, RefreshCw } from 'lucide-react'
import type { Screenplay } from '@/frontend/lib/types'

interface FormData {
  idea: string
  genre: string
  mood: string
}

export function GeneratorWorkspace() {
  const [generated, setGenerated] = useState(false)
  const [screenplay, setScreenplay] = useState<Screenplay | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [lastFormData, setLastFormData] = useState<FormData | null>(null)
  const router = useRouter()

  const handleGenerate = (newScreenplay: Screenplay, formData: FormData) => {
    setScreenplay(newScreenplay)
    setLastFormData(formData)
    setGenerated(true)
  }

  const handleGenerateAnother = () => {
    setGenerated(false)
    setScreenplay(null)
    setSaveSuccess(false)
  }

  const handleRegenerate = async () => {
    // Regenerate with same prompt - need to get the original form data
    // For now, just reset and let user enter new form data
    handleGenerateAnother()
  }

  const handleSave = async () => {
    if (!screenplay) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/screenplays/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenplay }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      const data = await response.json()
      setSaveSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('[v0] Save error:', error)
      alert(error instanceof Error ? error.message : 'Failed to save screenplay')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {generated && <Navbar />}

      <main className={generated ? 'pt-24 pb-20' : 'min-h-screen px-3 py-0'}>
        <div className={generated ? 'max-w-7xl mx-auto px-4 md:px-8' : 'mx-auto max-w-5xl'}>
          {!generated ? (
            <div className="relative mx-auto max-w-5xl">
              <button type="button" onClick={() => router.push('/dashboard')} className="absolute right-3 top-3 z-10 rounded-full border border-[#76572f]/60 bg-[#0b0907]/80 px-3 py-1.5 text-[11px] text-[#d7c39f] backdrop-blur-sm transition hover:border-[#c69b5e] hover:text-[#f0d59c]">My screenplays <span aria-hidden="true">→</span></button>
              <GeneratorForm onGenerate={handleGenerate} />
            </div>
          ) : screenplay ? (
            <>
              {/* Generated Screenplay Display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateAnother}
                  className="button-ghost"
                >
                  ← Generate Another Script
                </motion.button>
              </motion.div>

              <ScreenplayPreview screenplay={screenplay} />

              {/* Save CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 text-center"
              >
                {saveSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-3 text-primary font-semibold"
                  >
                    <CheckCircle className="w-6 h-6" />
                    Screenplay saved! Redirecting to dashboard...
                  </motion.div>
                ) : (
                  <>
                    <p className="body-text mb-6">Happy with your screenplay?</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="button-primary flex items-center justify-center gap-2"
                      >
                        {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save to Dashboard'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerateAnother}
                        className="button-secondary flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          ) : null}
        </div>
      </main>

      {generated && <Footer />}
    </div>
  )
}

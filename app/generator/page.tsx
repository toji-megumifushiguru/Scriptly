'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GeneratorForm } from '@/components/generator-form'
import { ScreenplayPreview } from '@/components/screenplay-preview'
import { Loader, CheckCircle, RefreshCw } from 'lucide-react'
import type { Screenplay } from '@/lib/types'

interface FormData {
  idea: string
  genre: string
  mood: string
}

export default function GeneratorPage() {
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
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {!generated ? (
            <>
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16 md:mb-20"
              >
                <h1 className="heading-md mb-4">Create Your Screenplay</h1>
                <p className="body-text max-w-2xl mx-auto">
                  Tell us about your story idea and let our AI transform it into a professional, industry-standard screenplay.
                </p>
              </motion.div>

              {/* Form */}
              <GeneratorForm onGenerate={handleGenerate} />
            </>
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

      <Footer />
    </div>
  )
}

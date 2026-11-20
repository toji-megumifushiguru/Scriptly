'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Bot,
  Camera,
  Clapperboard,
  Cloud,
  Crown,
  Crosshair,
  Eye,
  Film,
  Fingerprint,
  Flame,
  Heart,
  Loader,
  Moon,
  Mountain,
  Orbit,
  Skull,
  Smile,
  Sparkles,
  Star,
  Sun,
  Theater,
  WandSparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Screenplay } from '@/lib/types'

interface GeneratorFormProps {
  onGenerate: (screenplay: Screenplay, formData: { idea: string; genre: string; mood: string }) => void
}

const genres: { label: string; value: string; icon: LucideIcon; color: string }[] = [
  { label: 'Drama', value: 'Drama', icon: Theater, color: 'text-rose-300' },
  { label: 'Comedy', value: 'Comedy', icon: Smile, color: 'text-amber-300' },
  { label: 'Thriller', value: 'Thriller', icon: Fingerprint, color: 'text-sky-300' },
  { label: 'Action', value: 'Action', icon: Crosshair, color: 'text-yellow-300' },
  { label: 'Romance', value: 'Romance', icon: Heart, color: 'text-pink-400' },
  { label: 'Sci-Fi', value: 'Science Fiction', icon: Orbit, color: 'text-cyan-300' },
  { label: 'Fantasy', value: 'Fantasy', icon: WandSparkles, color: 'text-violet-300' },
  { label: 'Horror', value: 'Horror', icon: Skull, color: 'text-orange-300' },
  { label: 'Adventure', value: 'Adventure', icon: Mountain, color: 'text-emerald-300' },
  { label: 'Documentary', value: 'Documentary', icon: Camera, color: 'text-indigo-300' },
]

const moods: { label: string; icon: LucideIcon; color: string }[] = [
  { label: 'Dark & Intense', icon: Flame, color: 'text-orange-300' },
  { label: 'Light & Fun', icon: Sun, color: 'text-yellow-300' },
  { label: 'Romantic', icon: Heart, color: 'text-pink-400' },
  { label: 'Suspenseful', icon: Eye, color: 'text-cyan-300' },
  { label: 'Inspiring', icon: Star, color: 'text-amber-300' },
  { label: 'Melancholic', icon: Cloud, color: 'text-sky-300' },
  { label: 'Epic', icon: Crown, color: 'text-yellow-300' },
  { label: 'Mysterious', icon: Moon, color: 'text-violet-300' },
]

export function GeneratorForm({ onGenerate }: GeneratorFormProps) {
  const [idea, setIdea] = useState('')
  const [genre, setGenre] = useState('Drama')
  const [mood, setMood] = useState('Dark & Intense')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ideaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyIdea: idea, genre, mood }),
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
    } catch (caught) {
      console.error('[v0] Generation error:', caught)
      setError(caught instanceof Error ? caught.message : 'An error occurred while generating the screenplay')
    } finally {
      setLoading(false)
    }
  }

  const focusStoryIdea = () => {
    ideaRef.current?.focus()
    ideaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl"
    >
      <section className="relative isolate mb-2 min-h-[140px] overflow-hidden rounded-2xl border border-[#b88643]/45 bg-[#0b0907] sm:min-h-[148px]">
        <div className="absolute inset-0 -z-20 bg-cover bg-[center_52%]" style={{ backgroundImage: "url('/scriptly-studio.png')" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#090806] via-[#090806]/90 to-[#090806]/10" />
        <div className="flex min-h-[140px] items-center px-5 py-2 sm:min-h-[148px] sm:px-9 sm:py-3">
          <div className="max-w-[380px]">
            <p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#edc277]"><Clapperboard className="size-3.5" />The writer&apos;s room</p>
            <h1 className="font-sans text-[30px] font-extrabold leading-[1.03] tracking-tight text-white sm:text-[34px]">Create your <span className="block bg-gradient-to-r from-[#ffe29e] via-[#f4bd5e] to-[#e89d38] bg-clip-text text-transparent">Screenplay</span></h1>
            <p className="mt-2 max-w-[420px] text-[11px] leading-4 text-[#d1c2a9] sm:text-xs">Turn your ideas into cinematic stories with the power of AI.</p>
            <button type="button" onClick={focusStoryIdea} className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd879] to-[#efa937] px-4 py-2 text-xs font-bold text-[#241506] shadow-[0_0_22px_rgba(230,173,71,.26)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe5a6]">Start writing <span aria-hidden="true">→</span></button>
          </div>
          <div aria-hidden="true" className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-[#f4d49d] backdrop-blur-sm sm:flex"><Film className="size-3.5" />Your next great story</div>
        </div>
      </section>

      <div className="grid overflow-hidden rounded-2xl border border-[#b88643]/40 bg-[linear-gradient(145deg,#1a130c_0%,#110e0b_52%,#0d0b09_100%)] shadow-[0_22px_70px_rgba(0,0,0,.4)] md:grid-cols-[104px_minmax(0,1fr)]">
        <aside className="relative hidden flex-col items-center justify-between border-r border-[#d1a45b]/15 bg-[radial-gradient(ellipse_at_50%_85%,rgba(212,155,66,.12),transparent_62%)] px-3 py-6 md:flex">
          <p className="-rotate-6 font-serif text-sm italic leading-[1.35] text-[#e6cc9d]">Let&apos;s<br />create<br />something<br />amazing!</p>
          <div aria-hidden="true" className="relative flex size-[58px] items-center justify-center rounded-2xl border border-[#dda94d]/50 bg-gradient-to-b from-[#281c0e] to-[#0e0b08] text-[#f3c769] shadow-[0_0_30px_rgba(228,172,71,.16)]">
            <Bot className="size-8" strokeWidth={1.4} />
            <span className="absolute -bottom-1.5 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#e9ac49]/60 blur-[2px]" />
          </div>
          <div aria-hidden="true" className="h-9 w-px bg-gradient-to-b from-transparent via-[#bd8c45]/60 to-transparent" />
        </aside>

        <div className="min-w-0 p-2 sm:p-3 lg:p-3">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-400/25 bg-red-950/30 p-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />{error}
            </motion.div>
          )}

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#e8dcc8]" id="genre-label"><Theater className="size-4 text-[#e8c46e]" />Genre</label>
            <span className="hidden text-[10px] text-[#b2915e] sm:inline">Explore more →</span>
          </div>
          <div role="group" aria-labelledby="genre-label" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {genres.map(({ label, value, icon: Icon, color }) => {
              const selected = genre === value
              return (
                <button key={value} type="button" onClick={() => !loading && setGenre(value)} disabled={loading} aria-pressed={selected} className={`inline-flex min-h-6 items-center justify-center gap-1 rounded-full border px-2 text-[10px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a2] disabled:cursor-not-allowed disabled:opacity-60 ${selected ? 'border-[#f6ca72]/80 bg-gradient-to-r from-[#f7d782] to-[#f0b94e] text-[#271705] shadow-[0_0_16px_rgba(239,185,78,.22)]' : 'border-[#72552f]/40 bg-[#20180f]/80 text-[#e4d7c3] hover:border-[#ca984d]/65 hover:bg-[#2b2115]'}`}>
                  <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${selected ? 'text-[#4b2d0a]' : color}`} />{label}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#e8dcc8]" id="mood-label"><Sparkles className="size-4 text-cyan-300" />Tone &amp; Mood</div>
          <div role="group" aria-labelledby="mood-label" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {moods.map(({ label, icon: Icon, color }) => {
              const selected = mood === label
              return (
                <button key={label} type="button" onClick={() => !loading && setMood(label)} disabled={loading} aria-pressed={selected} className={`inline-flex min-h-6 items-center justify-center gap-1 rounded-full border px-2 text-[10px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a2] disabled:cursor-not-allowed disabled:opacity-60 ${selected ? 'border-[#f3a17b]/75 bg-gradient-to-r from-[#6e40bb] to-[#d54670] text-white shadow-[0_0_16px_rgba(203,77,125,.2)]' : 'border-[#72552f]/40 bg-[#20180f]/80 text-[#e4d7c3] hover:border-[#ca984d]/65 hover:bg-[#2b2115]'}`}>
                  <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${selected ? 'text-[#ffd68d]' : color}`} />{label}
                </button>
              )
            })}
          </div>

          <div className="mt-3">
            <label htmlFor="story-idea" className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#e8dcc8]"><Sparkles className="size-4 text-[#f2c75e]" />Story Idea</label>
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_142px] lg:items-center">
              <div>
                <div className="relative">
                  <textarea
                    ref={ideaRef}
                    id="story-idea"
                    value={idea}
                    rows={1}
                    onChange={(event) => setIdea(event.target.value)}
                    placeholder="Describe your story idea in a few sentences… (e.g. A detective discovers a hidden secret in an old mansion)"
                    disabled={loading}
                    maxLength={500}
                    required
                    className="min-h-[68px] w-full resize-y rounded-xl border border-[#a97b3c]/50 bg-[#100d0a]/90 px-3.5 py-2 lg:min-h-[42px] pr-12 text-xs leading-5 text-[#f1e6d4] outline-none transition placeholder:text-[#918575] focus:border-[#e0b353] focus:ring-2 focus:ring-[#d7a24c]/15 disabled:opacity-60"
                  />
                  <Sparkles aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 size-4 text-[#edc45d] drop-shadow-[0_0_7px_rgba(237,196,93,.7)]" />
                </div>
                <div className="mt-1 flex justify-end text-[10px] text-[#827665]" aria-live="polite">{idea.length}/500</div>
              </div>
              <div className="flex flex-col gap-2">
                <aside className="hidden rounded-xl border border-[#977141]/40 bg-[#17120c]/90 p-2.5 lg:block">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f0d59c]">Pro tip <Sparkles className="size-3 text-[#f5cb67]" /></p>
                  <p className="mt-1 text-[10px] leading-4 text-[#a99a83]">A mysterious letter changes a small town forever…</p>
                </aside>
                <motion.button type="submit" disabled={loading || !idea.trim()} whileHover={!loading && idea.trim() ? { scale: 1.02 } : {}} whileTap={!loading && idea.trim() ? { scale: 0.98 } : {}} className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#ffe49c] bg-gradient-to-r from-[#ffe08b] via-[#f4c362] to-[#e9a73d] px-4 text-xs font-bold text-[#271805] shadow-[0_0_25px_rgba(236,180,73,.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55">
                  {loading ? <><Loader className="size-4 animate-spin" /><span>Generating…</span></> : <><Sparkles className="size-4" /><span>Generate Screenplay</span></>}
                </motion.button>
              </div>
            </div>
          </div>
          {loading && <p role="status" className="mt-2 text-right text-[10px] text-[#b5a68e]">This usually takes 30–60 seconds…</p>}
        </div>
      </div>
    </motion.form>
  )
}

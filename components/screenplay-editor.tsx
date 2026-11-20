'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { jsPDF } from 'jspdf'
import { ArrowLeft, Check, Download, Feather, Loader, Plus, Save, Trash2 } from 'lucide-react'
import type { Screenplay } from '@/lib/types'

interface ScreenplayRow {
  id: string
  title: string
  tagline: string | null
  logline: string | null
  synopsis: string | null
  story_idea: string | null
  genre: string | null
  mood: string | null
  characters: Screenplay['characters'] | null
  three_act_structure: Screenplay['threeActStructure'] | null
  scenes: Screenplay['scenes'] | null
}

const fetcher = async (url: string): Promise<{ screenplay: ScreenplayRow }> => {
  const response = await fetch(url)
  if (response.status === 401) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  if (!response.ok) throw new Error('This screenplay could not be opened.')
  return response.json()
}

export function ScreenplayEditor() {
  const params = useParams<{ id: string }>()
  const screenplayId = params.id
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(`/api/screenplays/${screenplayId}`, fetcher)
  const [screenplay, setScreenplay] = useState<ScreenplayRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')

  useEffect(() => {
    if (data?.screenplay) setScreenplay(data.screenplay)
  }, [data])

  useEffect(() => {
    if ((error as (Error & { status?: number }) | undefined)?.status === 401) router.replace('/auth/login')
  }, [error, router])

  const scenes = useMemo(() => screenplay?.scenes ?? [], [screenplay?.scenes])

  const updateScene = (index: number, patch: Partial<Screenplay['scenes'][number]>) => {
    setScreenplay((current) => current ? {
      ...current,
      scenes: (current.scenes ?? []).map((scene, sceneIndex) => sceneIndex === index ? { ...scene, ...patch } : scene),
    } : current)
    setSaveNotice('')
  }

  const addScene = () => {
    setScreenplay((current) => {
      if (!current) return current
      const number = (current.scenes?.length ?? 0) + 1
      return { ...current, scenes: [...(current.scenes ?? []), { number, heading: `INT. NEW SCENE - DAY`, setting: '', description: '', pageCount: 1 }] }
    })
    setSaveNotice('')
  }

  const removeScene = (index: number) => {
    setScreenplay((current) => current ? {
      ...current,
      scenes: (current.scenes ?? []).filter((_, sceneIndex) => sceneIndex !== index).map((scene, sceneIndex) => ({ ...scene, number: sceneIndex + 1 })),
    } : current)
    setSaveNotice('')
  }

  const saveScreenplay = async () => {
    if (!screenplay) return
    setSaving(true)
    setSaveError('')
    setSaveNotice('')
    const payload: Screenplay = {
      title: screenplay.title,
      tagline: screenplay.tagline ?? '',
      logline: screenplay.logline ?? '',
      synopsis: screenplay.synopsis ?? '',
      storyIdea: screenplay.story_idea ?? '',
      characters: screenplay.characters ?? [],
      threeActStructure: screenplay.three_act_structure ?? [],
      scenes,
      metadata: { genre: screenplay.genre ?? '', mood: screenplay.mood ?? '', storyIdea: screenplay.story_idea ?? '' },
    }
    try {
      const response = await fetch('/api/screenplays/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: screenplay.id, screenplay: payload }),
      })
      if (response.status === 401) {
        router.replace('/auth/login')
        return
      }
      if (!response.ok) throw new Error('Your changes could not be saved. Please try again.')
      const result = await response.json()
      if (result.screenplay) setScreenplay(result.screenplay)
      await mutate()
      setSaveNotice('All changes saved')
    } catch (saveError) {
      setSaveError(saveError instanceof Error ? saveError.message : 'Your changes could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const exportPdf = () => {
    if (!screenplay) return
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const left = 108
    const right = 72
    const width = pageWidth - left - right
    let y = 72
    const advancePageIfNeeded = (needed: number) => {
      if (y + needed > pageHeight - 72) { pdf.addPage(); y = 72 }
    }
    const addText = (text: string, options: { bold?: boolean; indent?: number; size?: number; gap?: number } = {}) => {
      const { bold = false, indent = 0, size = 12, gap = 14 } = options
      pdf.setFont('courier', bold ? 'bold' : 'normal')
      pdf.setFontSize(size)
      const lines = pdf.splitTextToSize(text, width - indent)
      const lineHeight = size * 1.45
      advancePageIfNeeded(lines.length * lineHeight + gap)
      pdf.text(lines, left + indent, y)
      y += lines.length * lineHeight + gap
    }
    pdf.setFont('times', 'bold')
    pdf.setFontSize(20)
    pdf.text(screenplay.title, pageWidth / 2, pageHeight * 0.43, { align: 'center', maxWidth: pageWidth - 150 })
    pdf.setFont('times', 'italic')
    pdf.setFontSize(12)
    pdf.text('A screenplay', pageWidth / 2, pageHeight * 0.43 + 28, { align: 'center' })
    if (screenplay.tagline) pdf.text(screenplay.tagline, pageWidth / 2, pageHeight * 0.43 + 58, { align: 'center', maxWidth: pageWidth - 170 })
    pdf.addPage()
    y = 72
    scenes.forEach((scene) => {
      addText(scene.heading.toUpperCase(), { bold: true, gap: 12 })
      if (scene.description) addText(scene.description, { gap: 16 })
    })
    const safeName = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'screenplay'
    pdf.save(`${safeName}.pdf`)
  }

  if (isLoading || !screenplay) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0c0907] text-[#e6bd7b]">{error ? <div className="max-w-sm px-6 text-center"><p role="alert" className="text-sm text-[#d3c6b5]">{error.message}</p><Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm text-[#efc780]"><ArrowLeft className="size-4" />Return to your library</Link></div> : <Loader className="size-7 animate-spin" aria-label="Loading screenplay" />}</main>
  }

  return (
    <main className="min-h-screen bg-[#0c0907] text-[#f5efe5]">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#d4a65d]/15 bg-[#100d0a]/95 px-4 py-3 backdrop-blur md:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#b9ac9a] transition hover:text-[#f5dfb6]"><ArrowLeft className="size-4" />Library</Link>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2"><Feather className="hidden size-4 text-[#e3bb7c] sm:block" /><input aria-label="Screenplay title" value={screenplay.title} onChange={(event) => { setScreenplay({ ...screenplay, title: event.target.value }); setSaveNotice('') }} className="w-full max-w-xs truncate bg-transparent text-center font-serif text-base text-[#f5dfb6] outline-none focus:border-b focus:border-[#d4a65d]/40" /></div>
        <div className="flex items-center gap-2"><span aria-live="polite" className="hidden text-xs text-[#9d917f] sm:block">{saving ? 'Saving…' : saveNotice || ''}</span><button type="button" onClick={() => void saveScreenplay()} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-[#d4a65d]/30 px-3 py-2 text-sm text-[#f1c982] transition hover:bg-[#d4a65d]/10 disabled:opacity-50"><Save className="size-4" />{saving ? 'Saving' : 'Save'}</button><button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e8b96f] to-[#f5d39a] px-3 py-2 text-sm font-semibold text-[#1a1008] transition hover:brightness-110"><Download className="size-4" /><span className="hidden sm:inline">Export PDF</span></button></div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 border-b border-[#d4a65d]/15 pb-6"><p className="text-[10px] uppercase tracking-[.22em] text-[#c69b5e]">{screenplay.genre || 'Screenplay'}{screenplay.mood ? ` · ${screenplay.mood}` : ''}</p><h1 className="mt-2 font-serif text-3xl text-[#f5dfb6]">{screenplay.title}</h1>{screenplay.logline && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b9ac9a]">{screenplay.logline}</p>}</div>
        <div className="space-y-5">
          {scenes.map((scene, index) => (
            <article key={`${scene.number}-${index}`} className="rounded-xl border border-[#d4a65d]/15 bg-[#15100c] p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[.18em] text-[#9d917f]">Scene {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => removeScene(index)} aria-label={`Delete scene ${index + 1}`} className="rounded-md p-2 text-[#988a79] transition hover:bg-red-400/10 hover:text-red-300"><Trash2 className="size-4" /></button></div>
              <label className="sr-only" htmlFor={`scene-heading-${index}`}>Scene {index + 1} heading</label><input id={`scene-heading-${index}`} value={scene.heading} onChange={(event) => updateScene(index, { heading: event.target.value })} className="w-full border-b border-[#d4a65d]/15 bg-transparent pb-3 font-mono text-xs font-bold tracking-wide text-[#e7c997] outline-none focus:border-[#d4a65d]/50" />
              <label className="sr-only" htmlFor={`scene-content-${index}`}>Scene {index + 1} content</label><textarea id={`scene-content-${index}`} value={scene.description} onChange={(event) => updateScene(index, { description: event.target.value })} rows={Math.max(6, Math.min(18, scene.description.split('\n').length + 2))} placeholder="Write this scene…" className="mt-4 min-h-36 w-full resize-y bg-transparent font-mono text-sm leading-7 text-[#ded5c9] outline-none placeholder:text-[#72685d]" />
            </article>
          ))}
        </div>
        <button type="button" onClick={addScene} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d4a65d]/25 py-4 text-sm text-[#c9b18a] transition hover:border-[#d4a65d]/55 hover:bg-[#d4a65d]/5"><Plus className="size-4" />Add scene</button>
        {saveError && <p role="alert" className="mt-4 text-sm text-red-300">{saveError}</p>}
        {saveNotice && <p aria-live="polite" className="mt-4 flex items-center gap-2 text-sm text-emerald-300"><Check className="size-4" />{saveNotice}</p>}
      </div>
    </main>
  )
}

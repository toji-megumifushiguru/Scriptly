'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { jsPDF } from 'jspdf'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Feather,
  Loader,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
} from 'lucide-react'
import { ScreenplayExportDialog } from '@/components/screenplay-export-dialog'
import type { Act, Character, Scene, Screenplay } from '@/lib/types'

interface ScreenplayRow {
  id: string
  title: string
  tagline: string | null
  logline: string | null
  synopsis: string | null
  story_idea: string | null
  genre: string | null
  mood: string | null
  characters: Character[] | null
  three_act_structure: Act[] | null
  scenes: Scene[] | null
}

type ScreenplayTab = 'overview' | 'characters' | 'acts' | 'scenes'

const tabs: { id: ScreenplayTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'characters', label: 'Characters' },
  { id: 'acts', label: 'Acts' },
  { id: 'scenes', label: 'Scenes' },
]

const fetcher = async (url: string): Promise<{ screenplay: ScreenplayRow }> => {
  const response = await fetch(url)
  if (response.status === 401) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  if (!response.ok) throw new Error('This screenplay could not be opened.')
  return response.json()
}

function toScreenplay(row: ScreenplayRow): Screenplay {
  return {
    title: row.title,
    tagline: row.tagline ?? '',
    logline: row.logline ?? '',
    synopsis: row.synopsis ?? '',
    storyIdea: row.story_idea ?? '',
    characters: row.characters ?? [],
    threeActStructure: row.three_act_structure ?? [],
    scenes: row.scenes ?? [],
    metadata: { genre: row.genre ?? '', mood: row.mood ?? '', storyIdea: row.story_idea ?? '' },
  }
}

function CharacterCard({ character, index }: { character: Character; index: number }) {
  const avatarStyles = [
    'from-[#b97946] to-[#493329]',
    'from-[#647a9c] to-[#26334a]',
    'from-[#97724b] to-[#30251d]',
  ]
  return (
    <article className="min-w-0 text-center">
      <div aria-hidden="true" className={`mx-auto flex size-[68px] items-center justify-center rounded-full border-2 border-[#cda866]/70 bg-gradient-to-br ${avatarStyles[index % avatarStyles.length]} font-serif text-2xl text-[#f5dfb6] shadow-[0_0_20px_rgba(187,139,74,.15)]`}>
        {character.name.trim().charAt(0).toUpperCase() || <Users className="size-6" />}
      </div>
      <h3 className="mt-2 truncate text-xs font-semibold text-[#f1d8a6]">{character.name}</h3>
      <p className="mt-1 line-clamp-3 text-[10px] leading-4 text-[#b7aa98]">{character.description || character.role || 'Character details coming soon.'}</p>
    </article>
  )
}

function OverviewPanel({ screenplay, onViewCharacters }: { screenplay: Screenplay; onViewCharacters: () => void }) {
  const characters = screenplay.characters.slice(0, 3)
  const overview = screenplay.synopsis || screenplay.storyIdea || screenplay.tagline

  return (
    <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.05fr_.95fr]">
      <section>
        <h2 className="font-serif text-lg text-[#e9c578]">Overview</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d1c7b9]">{overview || 'Your story overview will appear here.'}</p>
        <div className="my-5 border-t border-[#c19a5a]/15" />
        <h3 className="font-serif text-base text-[#e9c578]">Logline</h3>
        <p className="mt-2 text-sm leading-6 text-[#b9ad9e]">{screenplay.logline || 'Add a logline to capture the heart of your story.'}</p>
      </section>

      <section className="border-t border-[#c19a5a]/15 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg text-[#e9c578]">Characters <span className="font-sans text-sm text-[#a89a85]">({screenplay.characters.length})</span></h2>
          {screenplay.characters.length > 0 && <button type="button" onClick={onViewCharacters} className="inline-flex shrink-0 items-center gap-1 text-xs text-[#d5b675] transition hover:text-[#ffe2a4]">View all <ArrowRight className="size-3.5" /></button>}
        </div>
        {characters.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {characters.map((character, index) => <CharacterCard key={`${character.name}-${index}`} character={character} index={index} />)}
          </div>
        ) : <p className="mt-3 text-sm text-[#b9ad9e]">No characters have been added yet.</p>}
      </section>
    </div>
  )
}

export function ScreenplayEditor() {
  const params = useParams<{ id: string }>()
  const screenplayId = params.id
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(`/api/screenplays/${screenplayId}`, fetcher)
  const [screenplay, setScreenplay] = useState<ScreenplayRow | null>(null)
  const [activeTab, setActiveTab] = useState<ScreenplayTab>('overview')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => {
    if (data?.screenplay) setScreenplay(data.screenplay)
  }, [data])

  useEffect(() => {
    if ((error as (Error & { status?: number }) | undefined)?.status === 401) router.replace('/auth/login')
  }, [error, router])

  const scenes = useMemo(() => screenplay?.scenes ?? [], [screenplay?.scenes])
  const screenplayForExport = screenplay ? toScreenplay({ ...screenplay, scenes }) : null
  const totalPages = scenes.reduce((total, scene) => total + Math.max(0, scene.pageCount || 0), 0)

  const updateScene = (index: number, patch: Partial<Scene>) => {
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
      return { ...current, scenes: [...(current.scenes ?? []), { number, heading: 'INT. NEW SCENE - DAY', setting: '', description: '', pageCount: 1 }] }
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
    try {
      const response = await fetch('/api/screenplays/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: screenplay.id, screenplay: toScreenplay({ ...screenplay, scenes }) }),
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
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : 'Your changes could not be saved.')
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
    pdf.text(screenplay.title, pageWidth / 2, pageHeight * 0.39, { align: 'center', maxWidth: pageWidth - 150 })
    pdf.setFont('times', 'italic')
    pdf.setFontSize(12)
    pdf.text('A screenplay', pageWidth / 2, pageHeight * 0.39 + 28, { align: 'center' })
    if (screenplay.tagline) pdf.text(screenplay.tagline, pageWidth / 2, pageHeight * 0.39 + 56, { align: 'center', maxWidth: pageWidth - 170 })
    if (screenplay.genre) {
      pdf.setFont('courier', 'normal')
      pdf.setFontSize(10)
      pdf.text(screenplay.genre.toUpperCase(), pageWidth / 2, pageHeight * 0.39 + 86, { align: 'center' })
    }

    pdf.addPage()
    y = 72
    const addSectionTitle = (title: string) => addText(title.toUpperCase(), { bold: true, size: 13, gap: 18 })
    addSectionTitle('Overview')
    if (screenplay.logline) addText(`LOGLINE\n${screenplay.logline}`, { gap: 12 })
    if (screenplay.synopsis) addText(`SYNOPSIS\n${screenplay.synopsis}`, { gap: 12 })
    if (screenplay.story_idea) addText(`STORY IDEA\n${screenplay.story_idea}`, { gap: 12 })

    if (screenplay.characters?.length) {
      addSectionTitle('Characters')
      screenplay.characters.forEach((character) => addText(`${character.name}${character.role ? ` — ${character.role}` : ''}\n${character.description}`, { gap: 12 }))
    }

    if (screenplay.three_act_structure?.length) {
      addSectionTitle('Acts')
      screenplay.three_act_structure.forEach((act) => {
        addText(`ACT ${act.number}: ${act.title}\n${act.description}\n${act.keyPlotPoints.map((point) => `• ${point}`).join('\n')}`, { gap: 14 })
      })
    }

    if (scenes.length) addSectionTitle('Scenes')
    scenes.forEach((scene) => {
      addText(scene.heading.toUpperCase(), { bold: true, gap: 8 })
      if (scene.description) addText(scene.description, { gap: 14 })
    })
    const safeName = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'screenplay'
    pdf.save(`${safeName}.pdf`)
    setExportOpen(false)
  }

  if (isLoading || !screenplay) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0c0907] text-[#e6bd7b]">{error ? <div className="max-w-sm px-6 text-center"><p role="alert" className="text-sm text-[#d3c6b5]">{error.message}</p><Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm text-[#efc780]"><ArrowLeft className="size-4" />Return to your library</Link></div> : <Loader className="size-7 animate-spin" aria-label="Loading screenplay" />}</main>
  }

  return (
    <main className="min-h-screen bg-[#0c0907] text-[#f5efe5]">
      <header className="sticky top-0 z-20 flex min-h-[58px] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#d4a65d]/20 bg-[#100d0a]/95 px-3 py-2 backdrop-blur sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 font-serif text-lg font-semibold text-[#f2d49a] transition hover:text-white"><Feather className="size-6" />Scriptly</Link>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#b9ac9a] transition hover:text-[#f5dfb6] sm:text-sm"><ArrowLeft className="size-3.5" /><span className="hidden sm:inline">Back to Dashboard</span><span className="sm:hidden">Back</span></Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span aria-live="polite" className="hidden text-xs text-[#9d917f] lg:block">{saving ? 'Saving…' : saveNotice}</span>
          <button type="button" onClick={() => void saveScreenplay()} disabled={saving} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c59654]/40 px-3 py-2 text-xs font-medium text-[#f1c982] transition hover:bg-[#d4a65d]/10 disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-sm"><Save className="size-4" /><span className="hidden sm:inline">Save Draft</span><span className="sm:hidden">Save</span></button>
          <button type="button" onClick={() => setExportOpen(true)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f2cb7c] to-[#e5aa56] px-3 py-2 text-xs font-semibold text-[#1a1008] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe0a0] sm:gap-2 sm:px-4 sm:text-sm"><Download className="size-4" /><span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span></button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 pb-10 sm:px-5 lg:px-8">
        <section className="relative isolate mt-3 min-h-[218px] overflow-hidden rounded-2xl border border-[#b88a4e]/45 bg-[#0b0907] sm:mt-4 sm:min-h-[228px]">
          <div className="absolute inset-0 -z-20 bg-cover bg-[center_54%]" style={{ backgroundImage: "url('/screenplay-fantasy-hero.png')" }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b0907] via-[#0b0907]/85 to-[#0b0907]/15" />
          <div className="px-5 pb-[62px] pt-5 sm:px-8 sm:pt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#ddb86e]">{screenplay.genre || 'Screenplay'}{screenplay.mood ? ` · ${screenplay.mood}` : ''}</p>
            <div className="mt-2 flex items-center gap-2">
              <input aria-label="Screenplay title" value={screenplay.title} onChange={(event) => { setScreenplay({ ...screenplay, title: event.target.value }); setSaveNotice('') }} className="w-full min-w-0 max-w-xl bg-transparent font-serif text-3xl font-semibold leading-tight text-[#f7e8c8] outline-none placeholder:text-[#c5b394] focus-visible:ring-1 focus-visible:ring-[#ddba7e] sm:text-4xl" />
              <Pencil aria-hidden="true" className="size-4 shrink-0 text-[#dfbd7f]" />
            </div>
            {screenplay.logline && <p className="mt-2 max-w-xl text-xs leading-5 text-[#ded2c1] sm:text-sm">{screenplay.logline}</p>}
            <p className="mt-2 text-[11px] text-[#d2c2aa]">{Math.max(totalPages, 1)} min <span className="px-1">•</span>{scenes.length} scenes</p>
          </div>
          <nav aria-label="Screenplay sections" role="tablist" className="absolute inset-x-4 bottom-3 flex gap-2 overflow-x-auto sm:inset-x-6 sm:bottom-4">
            {tabs.map((tab) => (
              <button key={tab.id} id={`screenplay-tab-${tab.id}`} type="button" role="tab" aria-controls="screenplay-tab-panel" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`min-h-8 shrink-0 rounded-full border px-4 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe1a0] ${activeTab === tab.id ? 'border-[#f8dc9e] bg-gradient-to-r from-[#f5d28d] to-[#e9b65e] text-[#211609] shadow-[0_4px_16px_rgba(229,174,86,.18)]' : 'border-[#9c7542]/40 bg-[#120e0b]/65 text-[#e0d4c2] hover:border-[#c59b61]/70 hover:bg-black/55'}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </section>

        {saveError && <p role="alert" className="mt-3 rounded-lg border border-red-400/20 bg-red-950/30 px-4 py-2 text-sm text-red-200">{saveError}</p>}
        {saveNotice && <p aria-live="polite" className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><Check className="size-4" />{saveNotice}</p>}

        <section id="screenplay-tab-panel" role="tabpanel" aria-labelledby={`screenplay-tab-${activeTab}`} className="mt-3 overflow-hidden rounded-2xl border border-[#9a7442]/35 bg-[linear-gradient(145deg,#17120d,#100d0a)] shadow-[0_20px_60px_rgba(0,0,0,.32)]">
          {activeTab === 'overview' && <OverviewPanel screenplay={toScreenplay({ ...screenplay, scenes })} onViewCharacters={() => setActiveTab('characters')} />}

          {activeTab === 'characters' && (
            <div className="p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-2"><Users className="size-4 text-[#dfbc78]" /><h2 className="font-serif text-lg text-[#e9c578]">Characters <span className="font-sans text-sm text-[#a89a85]">({screenplay.characters?.length ?? 0})</span></h2></div>
              {screenplay.characters?.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{screenplay.characters.map((character, index) => <article key={`${character.name}-${index}`} className="flex gap-4 rounded-xl border border-[#8e6b3d]/25 bg-[#100d0a]/55 p-4"><div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#cda866]/60 bg-gradient-to-br from-[#87613f] to-[#28201a] font-serif text-lg text-[#f5dfb6]">{character.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><h3 className="font-medium text-[#f0d69e]">{character.name}</h3><p className="mt-0.5 text-xs text-[#c6a96e]">{character.role}</p><p className="mt-2 text-xs leading-5 text-[#b9ad9e]">{character.description}</p>{character.arcType && <p className="mt-2 text-[10px] uppercase tracking-wider text-[#8d8171]">{character.arcType} arc</p>}</div></article>)}</div> : <p className="text-sm text-[#b9ad9e]">No characters have been added yet.</p>}
            </div>
          )}

          {activeTab === 'acts' && (
            <div className="space-y-3 p-5 sm:p-7">
              {(screenplay.three_act_structure ?? []).length ? screenplay.three_act_structure?.map((act) => (
                <article key={act.number} className="rounded-xl border border-[#8e6b3d]/25 bg-[#100d0a]/55 p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#bd9658]">Act {act.number}</p>
                  <h2 className="mt-1 font-serif text-lg text-[#f0d69e]">{act.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#b9ad9e]">{act.description}</p>
                  {act.keyPlotPoints.length > 0 && <ul className="mt-3 space-y-2 border-t border-[#b68a4e]/15 pt-3">{act.keyPlotPoints.map((point, index) => <li key={index} className="flex gap-2 text-xs leading-5 text-[#c7bba9]"><span className="text-[#e2b764]">•</span>{point}</li>)}</ul>}
                </article>
              )) : <p className="text-sm text-[#b9ad9e]">No acts have been added yet.</p>}
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="space-y-3 p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-serif text-lg text-[#e9c578]">Scenes</h2><p className="mt-1 text-xs text-[#a89a85]">Edit your scene headings and screenplay action.</p></div><span className="text-xs text-[#b89b67]">{scenes.length} scenes</span></div>
              {scenes.map((scene, index) => (
                <article key={`${scene.number}-${index}`} className="rounded-xl border border-[#8e6b3d]/25 bg-[#100d0a]/55 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[.18em] text-[#9d917f]">Scene {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => removeScene(index)} aria-label={`Delete scene ${index + 1}`} className="rounded-md p-2 text-[#988a79] transition hover:bg-red-400/10 hover:text-red-300"><Trash2 className="size-4" /></button></div>
                  <label className="sr-only" htmlFor={`scene-heading-${index}`}>Scene {index + 1} heading</label><input id={`scene-heading-${index}`} value={scene.heading} onChange={(event) => updateScene(index, { heading: event.target.value })} className="w-full border-b border-[#d4a65d]/15 bg-transparent pb-3 font-mono text-xs font-bold tracking-wide text-[#e7c997] outline-none focus:border-[#d4a65d]/50" />
                  <label className="sr-only" htmlFor={`scene-content-${index}`}>Scene {index + 1} content</label><textarea id={`scene-content-${index}`} value={scene.description} onChange={(event) => updateScene(index, { description: event.target.value })} rows={Math.max(6, Math.min(18, scene.description.split('\n').length + 2))} placeholder="Write this scene…" className="mt-4 min-h-36 w-full resize-y bg-transparent font-mono text-sm leading-7 text-[#ded5c9] outline-none placeholder:text-[#72685d]" />
                </article>
              ))}
              <button type="button" onClick={addScene} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d4a65d]/25 py-4 text-sm text-[#c9b18a] transition hover:border-[#d4a65d]/55 hover:bg-[#d4a65d]/5"><Plus className="size-4" />Add scene</button>
            </div>
          )}
        </section>
      </div>

      {screenplayForExport && <ScreenplayExportDialog open={exportOpen} screenplay={screenplayForExport} onClose={() => setExportOpen(false)} onDownload={exportPdf} />}
    </main>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'
import { createClient } from '@/frontend/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Act, Character, Scene, Screenplay } from '@/frontend/lib/types'
import {
  Bell, BookOpen, ChevronDown, Clapperboard, Clock3, Download, Feather, FileText,
  Film, HelpCircle, LayoutDashboard, Loader, LogOut, Plus, Search, Settings, Sparkles,
  Star, Theater, Trash2, Users, WandSparkles, X,
} from 'lucide-react'

interface ScreenplayData {
  id: string
  title: string
  genre: string | null
  mood: string | null
  tagline: string | null
  logline: string | null
  synopsis: string | null
  story_idea: string | null
  characters: Character[] | null
  three_act_structure: Act[] | null
  scenes: Scene[] | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

type PreviewTab = 'overview' | 'characters' | 'acts' | 'scenes'
type UtilityPanel = 'settings' | 'help' | null

const genres = ['Thriller', 'Romance', 'Fantasy', 'Mystery', 'Drama', 'Comedy']
const tabs: { id: PreviewTab; label: string; icon: typeof FileText }[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'acts', label: 'Acts', icon: Clapperboard },
  { id: 'scenes', label: 'Scenes', icon: FileText },
]

function toScreenplay(row: ScreenplayData): Screenplay {
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

function CharacterPortrait({ character, index }: { character: Character; index: number }) {
  const portraits = ['from-[#b8794b] via-[#6c4431] to-[#241710]', 'from-[#7183a1] via-[#39445b] to-[#151b25]', 'from-[#d5a04e] via-[#573c20] to-[#130e09]']
  return <div className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-[#d9ae6d]/60 bg-gradient-to-br ${portraits[index % portraits.length]} font-serif text-lg text-[#ffe2b1] shadow-[0_0_18px_rgba(211,155,73,.15)]`} aria-hidden="true">{character.name.charAt(0).toUpperCase() || <Users className="size-4" />}</div>
}

export function DashboardWorkspace() {
  const [user, setUser] = useState<User | null>(null)
  const [screenplays, setScreenplays] = useState<ScreenplayData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview')
  const [utilityPanel, setUtilityPanel] = useState<UtilityPanel>(null)
  const [idea, setIdea] = useState('')
  const [genre, setGenre] = useState('Fantasy')
  const [mood, setMood] = useState('Mysterious, Emotional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const loadScreenplays = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/screenplays', { cache: 'no-store' })
      if (response.status === 401) {
        router.replace('/auth/login')
        return
      }
      if (!response.ok) throw new Error('Could not load your screenplays.')
      const data = await response.json()
      const items = (data.screenplays ?? []) as ScreenplayData[]
      setScreenplays(items)
      setSelectedId((current) => current && items.some((item) => item.id === current) ? current : items[0]?.id ?? null)
      setLoadError('')
    } catch {
      setLoadError('Your screenplays could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    let active = true
    const initialize = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (!active) return
      if (error || !currentUser) {
        router.replace('/auth/login')
        return
      }
      setUser(currentUser)
      await loadScreenplays()
    }
    void initialize()
    return () => { active = false }
  }, [loadScreenplays, router, supabase])

  const visibleScreenplays = screenplays.filter((item) => {
    const matches = `${item.title} ${item.genre ?? ''} ${item.tagline ?? ''}`.toLowerCase().includes(search.toLowerCase())
    return matches && (!favoritesOnly || item.is_favorite)
  })
  const selectedScreenplay = screenplays.find((item) => item.id === selectedId) ?? visibleScreenplays[0] ?? screenplays[0] ?? null
  const firstName = user?.user_metadata.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Writer'

  const toggleFavorite = async (screenplay: ScreenplayData) => {
    const nextValue = !screenplay.is_favorite
    const response = await fetch(`/api/screenplays/${screenplay.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_favorite: nextValue }),
    })
    if (response.ok) setScreenplays((items) => items.map((item) => item.id === screenplay.id ? { ...item, is_favorite: nextValue } : item))
  }

  const deleteScreenplay = async (screenplay: ScreenplayData) => {
    if (!window.confirm(`Delete “${screenplay.title}”? This cannot be undone.`)) return
    const response = await fetch(`/api/screenplays/${screenplay.id}`, { method: 'DELETE' })
    if (response.ok) {
      setScreenplays((items) => items.filter((item) => item.id !== screenplay.id))
      if (selectedId === screenplay.id) setSelectedId(screenplays.find((item) => item.id !== screenplay.id)?.id ?? null)
    }
  }

  const generateScreenplay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!idea.trim() || isGenerating) return
    setIsGenerating(true)
    setActionMessage('')
    setLoadError('')
    try {
      const generatedResponse = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyIdea: idea.trim(), genre, mood }),
      })
      const generated = await generatedResponse.json()
      if (!generatedResponse.ok || !generated.success || !generated.screenplay) throw new Error(generated.error || 'Your screenplay could not be generated.')
      const screenplay = generated.screenplay as Screenplay
      const savedResponse = await fetch('/api/screenplays/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ screenplay }),
      })
      const saved = await savedResponse.json()
      if (!savedResponse.ok || !saved.screenplay) throw new Error(saved.error || 'Your screenplay was generated but could not be saved.')
      const newItem = saved.screenplay as ScreenplayData
      setScreenplays((items) => [newItem, ...items])
      setSelectedId(newItem.id)
      setActiveTab('overview')
      setIdea('')
      setActionMessage('Screenplay created and saved to your projects.')
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const exportPdf = (item: ScreenplayData) => {
    const screenplay = toScreenplay(item)
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const left = 72
    const width = pageWidth - 144
    let y = 72
    const addText = (text: string, bold = false, size = 11) => {
      pdf.setFont('courier', bold ? 'bold' : 'normal')
      pdf.setFontSize(size)
      const lines = pdf.splitTextToSize(text || ' ', width)
      const lineHeight = size * 1.5
      if (y + lines.length * lineHeight > pageHeight - 72) { pdf.addPage(); y = 72 }
      pdf.text(lines, left, y)
      y += lines.length * lineHeight + 10
    }
    pdf.setFont('times', 'bold')
    pdf.setFontSize(22)
    pdf.text(screenplay.title, pageWidth / 2, 290, { align: 'center', maxWidth: width })
    pdf.setFont('times', 'italic')
    pdf.setFontSize(12)
    pdf.text('A Screenplay', pageWidth / 2, 320, { align: 'center' })
    if (screenplay.tagline) pdf.text(screenplay.tagline, pageWidth / 2, 348, { align: 'center', maxWidth: width })
    pdf.addPage()
    y = 72
    addText('OVERVIEW', true, 13)
    if (screenplay.logline) addText(`LOGLINE\n${screenplay.logline}`)
    if (screenplay.synopsis) addText(`SYNOPSIS\n${screenplay.synopsis}`)
    if (screenplay.characters.length) {
      addText('CHARACTERS', true, 13)
      screenplay.characters.forEach((character) => addText(`${character.name}${character.role ? ` — ${character.role}` : ''}\n${character.description}`))
    }
    if (screenplay.threeActStructure.length) {
      addText('ACTS', true, 13)
      screenplay.threeActStructure.forEach((act) => addText(`ACT ${act.number}: ${act.title}\n${act.description}\n${act.keyPlotPoints.map((point) => `- ${point}`).join('\n')}`))
    }
    if (screenplay.scenes.length) {
      addText('SCENES', true, 13)
      screenplay.scenes.forEach((scene) => addText(`${scene.heading}\n${scene.description || scene.setting}`))
    }
    const safeName = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'screenplay'
    pdf.save(`${safeName}.pdf`)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }

  if (!user || loading) return <main className="flex min-h-screen items-center justify-center bg-[#0b0907] text-[#e6bd7b]"><Loader className="size-7 animate-spin" aria-label="Loading your workspace" /></main>

  return (
    <main className="min-h-screen bg-[#0b0907] text-[#f5efe5] md:flex">
      <aside className="flex w-full flex-col border-b border-[#d4a65d]/15 bg-[#100d0a] px-3 py-3 md:sticky md:top-0 md:h-screen md:w-[176px] md:flex-none md:border-b-0 md:border-r md:px-3 md:py-4 lg:w-[190px]">
        <Link href="/" className="mb-5 flex items-center gap-2 px-2 font-serif text-lg font-semibold text-[#f5dfb6]"><Feather className="size-5 -rotate-12 text-[#e3bb7c]" />Scriptly</Link>
        <p className="hidden px-3 text-[9px] uppercase tracking-[.22em] text-[#938575] md:block">Workspace</p>
        <nav className="flex gap-1 overflow-x-auto md:mt-2 md:flex-col" aria-label="Workspace navigation">
          <a href="#top" aria-current="page" className="flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#49321d] to-[#2a1e14] px-3 py-2 text-xs font-medium text-[#f1c982] shadow-inner shadow-[#e1ae65]/10"><LayoutDashboard className="size-3.5" />Dashboard</a>
          <a href="#projects" onClick={() => { setFavoritesOnly(false); setSearch('') }} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#baae9d] transition hover:bg-white/5 hover:text-white"><Film className="size-3.5" />My Screenplays</a>
          <a href="#create" onClick={() => document.getElementById('story-idea')?.focus()} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#baae9d] transition hover:bg-white/5 hover:text-white"><FileText className="size-3.5" />Templates</a>
          <button type="button" onClick={() => setUtilityPanel('settings')} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#baae9d] transition hover:bg-white/5 hover:text-white"><Settings className="size-3.5" />Settings</button>
          <button type="button" onClick={() => setUtilityPanel('help')} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#baae9d] transition hover:bg-white/5 hover:text-white"><HelpCircle className="size-3.5" />Help</button>
        </nav>
        <div className="mt-auto hidden border-t border-[#d4a65d]/15 pt-4 md:block">
          <div className="mb-3 flex items-center gap-2 px-2"><span className="flex size-7 items-center justify-center rounded-full border border-[#d4a65d]/40 font-serif text-xs text-[#f1c982]">{firstName[0]?.toUpperCase()}</span><span className="min-w-0 truncate text-[10px] text-[#b9ac9a]">{firstName}</span></div>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#baae9d] transition hover:bg-white/5 hover:text-white"><LogOut className="size-3.5" />Sign out</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1" id="top">
        <header className="sticky top-0 z-20 flex h-[54px] items-center justify-between gap-4 border-b border-[#d4a65d]/15 bg-[#0d0a08]/95 px-4 backdrop-blur-md sm:px-6">
          <label className="relative flex w-full max-w-[340px] items-center"><Search className="absolute left-3 size-3.5 text-[#938575]" /><input aria-label="Search your projects" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your projects..." className="w-full rounded-full border border-[#d4a65d]/20 bg-black/30 py-1.5 pl-9 pr-4 text-[11px] outline-none placeholder:text-[#817667] focus:border-[#d4a65d]/60" /></label>
          <div className="flex shrink-0 items-center gap-3"><button type="button" aria-label="Notifications" onClick={() => setActionMessage('You’re all caught up on your projects.')} className="rounded-full p-1.5 text-[#c4ac81] transition hover:bg-white/5 hover:text-[#f7d58e]"><Bell className="size-4" /></button><button type="button" onClick={() => setUtilityPanel('settings')} aria-label="Open account settings" className="flex size-8 items-center justify-center rounded-full border border-[#d4a65d]/55 font-serif text-xs text-[#f1c982]">{firstName.slice(0, 2).toUpperCase()}</button><button type="button" onClick={() => setUtilityPanel('settings')} aria-label="More account options" className="-ml-2 text-[#a99b87]"><ChevronDown className="size-3" /></button></div>
        </header>

        <div className="mx-auto max-w-[1440px] p-3 sm:p-5 lg:p-7">
          <section className="relative isolate mb-3 flex min-h-[112px] items-center overflow-hidden rounded-xl border border-[#d4a65d]/20 bg-[#1a120c] px-5 py-4 sm:min-h-[130px] sm:px-7">
            <div className="absolute inset-0 -z-20 bg-[url('/scriptly-studio.png')] bg-cover bg-[center_42%] opacity-60" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100b07] via-[#100b07]/85 to-[#100b07]/15" />
            <div><p className="text-[9px] uppercase tracking-[.22em] text-[#d5ac70]">Your writer&apos;s room</p><h1 className="mt-1 font-serif text-2xl text-[#f5dfb6] sm:text-[28px]">Welcome back, {firstName}!</h1><p className="mt-1 text-[11px] text-[#c4b7a5] sm:text-xs">Turn your ideas into cinematic stories.</p></div>
          </section>

          {loadError && <p role="alert" className="mb-3 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{loadError}</p>}
          {actionMessage && <div role="status" className="mb-3 flex items-center justify-between rounded-lg border border-[#d4a65d]/20 bg-[#d4a65d]/5 px-3 py-2 text-xs text-[#edd29e]"><span>{actionMessage}</span><button type="button" onClick={() => setActionMessage('')} aria-label="Dismiss message"><X className="size-3.5" /></button></div>}

          <div className="grid items-start gap-3 md:grid-cols-[minmax(220px,.78fr)_minmax(0,1.45fr)]">
            <div className="flex flex-col gap-3">
              <form id="create" onSubmit={generateScreenplay} className="rounded-xl border border-[#d4a65d]/20 bg-[linear-gradient(150deg,#19120c,#0f0c09)] p-3 shadow-[0_12px_40px_rgba(0,0,0,.24)] sm:p-4">
                <h2 className="flex items-center gap-2 font-serif text-sm text-[#f0d5a3]"><Sparkles className="size-3.5 text-[#e9bc72]" />Create Your Screenplay</h2>
                <p className="mt-1 text-[10px] leading-4 text-[#b9ad9c]">Share your idea — a short story, concept, or even a scene!</p>
                <label htmlFor="story-idea" className="sr-only">Describe your story idea</label>
                <textarea id="story-idea" value={idea} onChange={(event) => setIdea(event.target.value)} maxLength={500} required rows={4} disabled={isGenerating} placeholder="e.g. A girl who discovers a hidden book that lets her enter another world..." className="mt-3 min-h-[94px] w-full resize-y rounded-lg border border-[#a97b3c]/30 bg-black/25 px-3 py-2 text-[10px] leading-4 text-[#eee2d0] outline-none placeholder:italic placeholder:text-[#897d6d] focus:border-[#d4a65d]/70 disabled:opacity-60" />
                <div className="flex justify-end text-[9px] text-[#807565]" aria-live="polite">{idea.length}/500</div>
                <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Choose a genre">{genres.map((value) => <button key={value} type="button" onClick={() => setGenre(value)} aria-pressed={genre === value} className={`rounded-full border px-2 py-1 text-[9px] transition ${genre === value ? 'border-[#e1b66b]/60 bg-[#d4a65d]/15 text-[#f1c982]' : 'border-[#d4a65d]/15 text-[#b9ad9c] hover:border-[#d4a65d]/40'}`}>{value}</button>)}</div>
                <label htmlFor="story-mood" className="sr-only">Choose a story mood</label><select id="story-mood" value={mood} onChange={(event) => setMood(event.target.value)} className="mt-2 w-full rounded-md border border-[#d4a65d]/20 bg-[#15100c] px-2 py-1.5 text-[10px] text-[#d8c7ad] outline-none focus:border-[#d4a65d]/60"><option>Mysterious, Emotional</option><option>Dark &amp; Intense</option><option>Light &amp; Fun</option><option>Suspenseful</option><option>Romantic</option><option>Epic</option><option>Inspiring</option></select>
                <button type="submit" disabled={isGenerating || !idea.trim()} className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5cb7f] to-[#e9a847] px-3 text-[10px] font-bold text-[#241506] shadow-[0_5px_18px_rgba(219,163,76,.17)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55">{isGenerating ? <><Loader className="size-3.5 animate-spin" />Creating your story...</> : <><WandSparkles className="size-3.5" />Generate Screenplay <span aria-hidden="true">→</span></>}</button>
              </form>

              <section id="projects" className="rounded-xl border border-[#d4a65d]/20 bg-[#14100c] p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-serif text-sm text-[#f0d5a3]"><Clock3 className="size-3.5 text-[#e9bc72]" />Recent Projects</h2><button type="button" onClick={() => { setFavoritesOnly((current) => !current); setSearch('') }} aria-pressed={favoritesOnly} className={`text-[9px] transition hover:text-[#f1c982] ${favoritesOnly ? 'text-[#f1c982]' : 'text-[#d4ae72]'}`}>{favoritesOnly ? 'Show All' : 'View All'} <span aria-hidden="true">→</span></button></div>
                <div className="flex flex-col gap-1.5">
                  {visibleScreenplays.slice(0, 4).map((item) => <div key={item.id} className={`group flex min-w-0 items-center gap-2 rounded-lg border p-1.5 transition ${selectedId === item.id ? 'border-[#d4a65d]/30 bg-[#d4a65d]/[.06]' : 'border-transparent hover:border-[#d4a65d]/15 hover:bg-white/[.02]'}`}>
                    <button type="button" onClick={() => { setSelectedId(item.id); setActiveTab('overview') }} className="flex min-w-0 flex-1 items-center gap-2 text-left"><span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[url('/screenplay-fantasy-hero.png')] bg-cover bg-[center_65%] ring-1 ring-[#d4a65d]/20"><Film className="size-4 text-[#f3d7a1] drop-shadow" /></span><span className="min-w-0"><span className="block truncate font-serif text-[11px] text-[#f0dfc3]">{item.title}</span><span className="mt-0.5 block truncate text-[9px] text-[#948878]">{item.genre || 'Screenplay'} · {new Date(item.updated_at).toLocaleDateString()}</span></span></button>
                    <button type="button" onClick={() => void toggleFavorite(item)} aria-label={item.is_favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`} className="rounded p-1 text-[#c4a56e] opacity-70 transition hover:bg-white/5 hover:opacity-100"><Star className="size-3.5" fill={item.is_favorite ? 'currentColor' : 'none'} /></button><button type="button" onClick={() => void deleteScreenplay(item)} aria-label={`Delete ${item.title}`} className="rounded p-1 text-[#9d8f7d] opacity-70 transition hover:bg-red-400/10 hover:text-red-300 hover:opacity-100"><Trash2 className="size-3.5" /></button>
                  </div>)}
                  {!visibleScreenplays.length && <div className="rounded-lg border border-dashed border-[#d4a65d]/15 px-3 py-5 text-center"><p className="text-[10px] text-[#a99d8d]">{screenplays.length ? 'No projects match your search.' : 'Your next story starts here.'}</p>{!screenplays.length && <a href="#create" onClick={() => document.getElementById('story-idea')?.focus()} className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#efc780]">Create a screenplay <Plus className="size-3" /></a>}</div>}
                </div>
              </section>
            </div>

            <section className="overflow-hidden rounded-xl border border-[#d4a65d]/20 bg-[#14100e] shadow-[0_14px_45px_rgba(0,0,0,.25)]" aria-label="Selected screenplay preview">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4a65d]/15 px-3 py-2">
                <div className="flex min-w-0 flex-wrap items-center gap-1" role="tablist" aria-label="Screenplay sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[9px] transition sm:text-[10px] ${activeTab === id ? 'border border-[#d4a65d]/30 bg-gradient-to-b from-[#4a3722] to-[#21180f] text-[#f4d38f]' : 'text-[#aaa092] hover:bg-white/5 hover:text-white'}`}><Icon className="size-3" />{label}</button>)}</div>
                <div className="flex items-center gap-1.5"><button type="button" disabled={!selectedScreenplay} onClick={() => selectedScreenplay && exportPdf(selectedScreenplay)} className="inline-flex items-center gap-1 rounded-full border border-[#d4a65d]/55 px-2.5 py-1.5 text-[9px] font-medium text-[#f0c873] transition hover:bg-[#d4a65d]/10 disabled:opacity-40"><Download className="size-3" />Export PDF</button><Link href={selectedScreenplay ? `/editor/${selectedScreenplay.id}` : '/generator'} aria-label="Open screenplay editor" className="rounded-md p-1.5 text-[#b9ad9c] transition hover:bg-white/5 hover:text-[#f1c982]"><Plus className="size-3.5" /></Link></div>
              </div>

              {selectedScreenplay ? <>
                <Link href={`/editor/${selectedScreenplay.id}`} className="group relative block h-[152px] overflow-hidden sm:h-[190px]">
                  <div className="absolute inset-0 bg-[url('/screenplay-fantasy-hero.png')] bg-cover bg-[center_58%] transition duration-500 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#07090c]/85 via-[#07090c]/25 to-transparent" />
                  <div className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-end p-4 sm:p-6"><span className="mb-1 text-[8px] uppercase tracking-[.2em] text-[#e7bd75]">{selectedScreenplay.genre || 'A screenplay by Scriptly'}</span><h2 className="font-serif text-2xl italic leading-tight text-[#f6e6c9] drop-shadow-md sm:text-3xl">{selectedScreenplay.title}</h2><p className="mt-1 line-clamp-2 max-w-sm text-[9px] text-[#e0d3bd] sm:text-[10px]">{selectedScreenplay.tagline || selectedScreenplay.logline || 'Open your screenplay to continue shaping the story.'}</p></div>
                  <span className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/40 px-2 py-1 text-[8px] text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100">Open screenplay</span>
                </Link>
                <div className="min-h-[230px] p-3 sm:p-4">
                  {activeTab === 'overview' && <>
                    <h3 className="flex items-center gap-1.5 font-serif text-sm text-[#edc577]"><Sparkles className="size-3.5" />Overview</h3><p className="mt-2 text-[10px] leading-[1.65] text-[#c7bcad]">{selectedScreenplay.synopsis || selectedScreenplay.story_idea || selectedScreenplay.tagline || 'A mysterious book leads a quiet girl into a parallel world, where she uncovers a truth darker than she imagined — and a destiny she can’t escape.'}</p>
                    <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#bd8c45]/50 to-transparent" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex gap-2 border-b border-[#d4a65d]/10 pb-2 sm:border-b-0 sm:border-r sm:pb-0"><Theater className="mt-0.5 size-4 shrink-0 text-[#d8a94f]" /><div><p className="text-[9px] font-medium text-[#e9c578]">Genre</p><p className="mt-0.5 text-[9px] text-[#c1b4a3]">{selectedScreenplay.genre || 'Fantasy · Mystery'}</p></div></div>
                      <div className="flex gap-2"><Clapperboard className="mt-0.5 size-4 shrink-0 text-[#d8a94f]" /><div><p className="text-[9px] font-medium text-[#e9c578]">Logline</p><p className="mt-0.5 text-[9px] leading-4 text-[#c1b4a3]">{selectedScreenplay.logline || 'A girl finds a magical book that takes her into another world.'}</p></div></div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[9px] text-[#c5b8a7]"><Clock3 className="size-3.5 text-[#d8a94f]" />Approx. Runtime <span className="text-[#e9c578]">{Math.max(1, Math.round((selectedScreenplay.scenes ?? []).reduce((total, scene) => total + (scene.pageCount || 0), 0) / 2)) || 12}–15 min</span></div>
                    <div className="mt-3 flex items-center gap-2 text-[9px] text-[#c5b8a7]"><Sparkles className="size-3.5 text-[#d8a94f]" />Tone <span className="text-[#e9c578]">{selectedScreenplay.mood || 'Mysterious, Emotional'}</span></div>
                    <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#bd8c45]/50 to-transparent" />
                    <div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-1.5 font-serif text-sm text-[#edc577]"><Users className="size-3.5" />Characters <span className="font-sans text-[9px] text-[#a99a85]">({selectedScreenplay.characters?.length ?? 0})</span></h3><button type="button" onClick={() => setActiveTab('characters')} className="text-[9px] text-[#d5b675] hover:text-[#ffe2a4]">View All →</button></div>
                    {(selectedScreenplay.characters ?? []).length ? <div className="mt-3 grid grid-cols-3 gap-2">{selectedScreenplay.characters.slice(0, 3).map((character, index) => <article key={`${character.name}-${index}`} className="flex min-w-0 flex-col items-center rounded-lg border border-[#d4a65d]/10 bg-[#100d0b]/60 px-2 py-2 text-center"><CharacterPortrait character={character} index={index} /><h4 className="mt-1.5 max-w-full truncate font-serif text-[9px] text-[#f1d8a6]">{character.name}</h4><p className="mt-1 line-clamp-2 text-[8px] leading-3 text-[#a99d8d]">{character.role || character.description || 'Character'}</p></article>)}</div> : <p className="mt-2 text-[9px] text-[#a99d8d]">Character profiles will appear here after your screenplay is created.</p>}
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#d4a65d]/15 pt-2"><button type="button" onClick={() => setActiveTab('acts')} className="inline-flex items-center gap-1 text-[9px] text-[#d5b675] hover:text-[#ffe2a4]"><Clapperboard className="size-3" />Acts ({selectedScreenplay.three_act_structure?.length ?? 0})</button><button type="button" onClick={() => setActiveTab('scenes')} className="inline-flex items-center gap-1 text-[9px] text-[#d5b675] hover:text-[#ffe2a4]"><FileText className="size-3" />Scenes ({selectedScreenplay.scenes?.length ?? 0})</button></div>
                  </>}
                  {activeTab === 'characters' && <div role="tabpanel"><h3 className="font-serif text-sm text-[#edc577]">Characters <span className="font-sans text-[10px] text-[#a99a85]">({selectedScreenplay.characters?.length ?? 0})</span></h3>{(selectedScreenplay.characters ?? []).length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{selectedScreenplay.characters.map((character, index) => <article key={`${character.name}-${index}`} className="flex items-center gap-3 rounded-lg border border-[#d4a65d]/10 bg-black/10 p-2"><CharacterPortrait character={character} index={index} /><div className="min-w-0"><h4 className="font-serif text-xs text-[#f1d8a6]">{character.name}</h4><p className="mt-0.5 text-[9px] text-[#d6b871]">{character.role}</p><p className="mt-1 text-[9px] leading-4 text-[#a99d8d]">{character.description}</p></div></article>)}</div> : <p className="mt-3 text-[10px] text-[#a99d8d]">No characters have been added yet.</p>}</div>}
                  {activeTab === 'acts' && <div role="tabpanel"><h3 className="font-serif text-sm text-[#edc577]">Story Acts</h3>{(selectedScreenplay.three_act_structure ?? []).length ? <div className="mt-3 flex flex-col gap-2">{selectedScreenplay.three_act_structure?.map((act) => <article key={`${act.number}-${act.title}`} className="rounded-lg border border-[#d4a65d]/12 bg-black/10 p-3"><p className="text-[9px] uppercase tracking-widest text-[#d7ad68]">Act {act.number}</p><h4 className="mt-1 font-serif text-xs text-[#f1d8a6]">{act.title}</h4><p className="mt-1 text-[9px] leading-4 text-[#b9ad9c]">{act.description}</p>{act.keyPlotPoints?.length > 0 && <ul className="mt-2 flex flex-col gap-1">{act.keyPlotPoints.map((point, index) => <li key={`${index}-${point}`} className="flex gap-2 text-[9px] text-[#b9ad9c]"><span className="text-[#d5b675]">•</span>{point}</li>)}</ul>}</article>)}</div> : <p className="mt-3 text-[10px] text-[#a99d8d]">No acts have been added yet.</p>}</div>}
                  {activeTab === 'scenes' && <div role="tabpanel"><h3 className="font-serif text-sm text-[#edc577]">Scenes <span className="font-sans text-[10px] text-[#a99a85]">({selectedScreenplay.scenes?.length ?? 0})</span></h3>{(selectedScreenplay.scenes ?? []).length ? <div className="mt-3 flex flex-col gap-2">{selectedScreenplay.scenes?.map((scene) => <article key={`${scene.number}-${scene.heading}`} className="rounded-lg border border-[#d4a65d]/12 bg-black/10 p-3"><div className="flex items-start justify-between gap-3"><h4 className="font-mono text-[9px] font-semibold text-[#e8cf9d]">{scene.number}. {scene.heading}</h4><span className="shrink-0 text-[8px] text-[#948878]">{scene.pageCount} pages</span></div><p className="mt-1 text-[9px] leading-4 text-[#b9ad9c]">{scene.description || scene.setting}</p></article>)}</div> : <p className="mt-3 text-[10px] text-[#a99d8d]">No scenes have been added yet.</p>}</div>}
                </div>
              </> : <div className="flex min-h-[350px] flex-col items-center justify-center bg-[url('/screenplay-fantasy-hero.png')] bg-cover bg-center p-6 text-center"><div className="rounded-xl border border-[#d4a65d]/25 bg-[#0b0907]/80 p-6 backdrop-blur-sm"><div className="mx-auto flex size-10 items-center justify-center rounded-full border border-[#d4a65d]/30 text-[#e6bd7b]"><Feather className="size-5" /></div><h2 className="mt-3 font-serif text-lg text-[#f5dfb6]">Your story awaits</h2><p className="mt-1 max-w-xs text-[10px] leading-4 text-[#b9ad9c]">Create a screenplay and its synopsis, characters, acts, and scenes will appear here.</p><a href="#create" onClick={() => document.getElementById('story-idea')?.focus()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f5cb7f] to-[#e9a847] px-4 py-2 text-[10px] font-bold text-[#241506]"><Plus className="size-3.5" />Create your first screenplay</a></div></div>}
            </section>
          </div>
        </div>
      </div>

      {utilityPanel && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setUtilityPanel(null) }}><section role="dialog" aria-modal="true" aria-labelledby="utility-title" className="w-full max-w-sm rounded-2xl border border-[#d4a65d]/30 bg-[#15100c] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="utility-title" className="font-serif text-lg text-[#f5dfb6]">{utilityPanel === 'settings' ? 'Account settings' : 'A little help'}</h2><p className="mt-1 text-xs text-[#a99d8d]">{utilityPanel === 'settings' ? 'Your Scriptly workspace' : 'Everything you need to keep your story moving.'}</p></div><button type="button" onClick={() => setUtilityPanel(null)} aria-label="Close" className="rounded-md p-1 text-[#a99d8d] hover:bg-white/5 hover:text-white"><X className="size-4" /></button></div>{utilityPanel === 'settings' ? <div className="mt-5 flex flex-col gap-3"><div className="rounded-lg border border-[#d4a65d]/15 bg-black/15 p-3"><p className="text-[9px] uppercase tracking-widest text-[#b69b6c]">Signed in as</p><p className="mt-1 break-all text-xs text-[#e8dcc8]">{user.email}</p></div><button type="button" onClick={signOut} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d4a65d]/20 text-xs text-[#d2bf9e] transition hover:bg-white/5"><LogOut className="size-3.5" />Sign out</button></div> : <div className="mt-5 flex flex-col gap-3 text-xs text-[#c7bcad]"><p>Start with a one-sentence idea, choose a genre and tone, then generate a screenplay.</p><p>Use the preview tabs to explore characters, acts, and scenes. Open the screenplay to edit it, or export a formatted PDF.</p><a href="#create" onClick={() => { setUtilityPanel(null); document.getElementById('story-idea')?.focus() }} className="inline-flex items-center gap-2 text-[#efc780] hover:text-[#ffe2ad]"><Sparkles className="size-3.5" />Start writing</a></div>}</section></div>}
    </main>
  )
}

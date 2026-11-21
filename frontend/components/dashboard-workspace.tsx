'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/frontend/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Feather, Film, FileText, LayoutDashboard, Loader, LogOut, Plus, Search, Star, Trash2, WandSparkles } from 'lucide-react'

interface ScreenplayData {
  id: string
  title: string
  genre: string | null
  tagline: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export function DashboardWorkspace() {
  const [user, setUser] = useState<User | null>(null)
  const [screenplays, setScreenplays] = useState<ScreenplayData[]>([])
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
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
      setScreenplays(data.screenplays ?? [])
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

  const visibleScreenplays = screenplays.filter((screenplay) => {
    const matchesQuery = `${screenplay.title} ${screenplay.genre ?? ''} ${screenplay.tagline ?? ''}`.toLowerCase().includes(search.toLowerCase())
    return matchesQuery && (!favoritesOnly || screenplay.is_favorite)
  })

  const toggleFavorite = async (screenplay: ScreenplayData) => {
    const response = await fetch(`/api/screenplays/${screenplay.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favorite: !screenplay.is_favorite }),
    })
    if (response.ok) setScreenplays((current) => current.map((item) => item.id === screenplay.id ? { ...item, is_favorite: !item.is_favorite } : item))
  }

  const deleteScreenplay = async (screenplay: ScreenplayData) => {
    if (!window.confirm(`Delete “${screenplay.title}”? This cannot be undone.`)) return
    const response = await fetch(`/api/screenplays/${screenplay.id}`, { method: 'DELETE' })
    if (response.ok) setScreenplays((current) => current.filter((item) => item.id !== screenplay.id))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }

  if (!user || loading) return <main className="flex min-h-screen items-center justify-center bg-[#0c0907] text-[#e6bd7b]"><Loader className="size-7 animate-spin" aria-label="Loading your workspace" /></main>

  return (
    <main className="min-h-screen bg-[#0c0907] text-[#f5efe5] md:flex">
      <aside className="flex w-full flex-col border-b border-[#d4a65d]/15 bg-[#100d0a] p-4 md:sticky md:top-0 md:h-screen md:w-60 md:flex-none md:border-b-0 md:border-r md:p-5">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2 font-serif text-xl font-semibold text-[#f5dfb6]"><Feather className="size-5 text-[#e3bb7c]" />Scriptly</Link>
        <p className="px-3 text-[10px] uppercase tracking-[.22em] text-[#938575]">Workspace</p>
        <nav className="mt-3 flex gap-2 md:flex-col" aria-label="Workspace navigation">
          <Link href="/dashboard" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#382719] px-3 py-2.5 text-sm text-[#f1c982]"><LayoutDashboard className="size-4" />Dashboard</Link>
          <Link href="/generator" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#baae9d] transition hover:bg-white/5 hover:text-white"><WandSparkles className="size-4" />Create screenplay</Link>
        </nav>
        <div className="mt-auto hidden border-t border-[#d4a65d]/15 pt-4 md:block">
          <div className="mb-3 truncate px-2 text-xs text-[#b9ac9a]">{user.user_metadata.display_name || user.email}</div>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#baae9d] transition hover:bg-white/5 hover:text-white"><LogOut className="size-4" />Sign out</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#d4a65d]/15 px-5 py-4 md:px-9">
          <div className="relative hidden w-full max-w-sm items-center sm:flex"><Search className="absolute left-3 size-4 text-[#938575]" /><input aria-label="Search screenplays" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your projects…" className="w-full rounded-full border border-[#d4a65d]/20 bg-black/30 py-2 pl-10 pr-4 text-sm outline-none placeholder:text-[#817667] focus:border-[#d4a65d]/60" /></div>
          <div className="ml-auto flex items-center gap-3"><span className="max-w-[180px] truncate text-xs text-[#b9ac9a] sm:hidden">{user.email}</span><div aria-hidden="true" className="flex size-9 items-center justify-center rounded-full border border-[#d4a65d]/40 font-serif text-sm text-[#f1c982]">{(user.user_metadata.display_name || user.email || 'S')[0].toUpperCase()}</div></div>
        </header>

        <div className="mx-auto max-w-6xl p-5 md:p-9">
          <section className="relative isolate mb-8 overflow-hidden rounded-2xl border border-[#d4a65d]/20 bg-[#1a120c] p-6 sm:p-8">
            <div className="absolute inset-0 -z-10 bg-[url('/scriptly-auth-artwork.png')] bg-cover bg-[center_42%] opacity-35" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#110d09] via-[#110d09]/90 to-transparent" />
            <p className="text-[10px] uppercase tracking-[.24em] text-[#d5ac70]">Your writer&apos;s room</p>
            <h1 className="mt-2 font-serif text-3xl text-[#f5dfb6] sm:text-4xl">Welcome back, {user.user_metadata.display_name?.split(' ')[0] || 'writer'}.</h1>
            <p className="mt-2 max-w-md text-sm text-[#c4b7a5]">Your next unforgettable story is only a few scenes away.</p>
            <Link href="/generator" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e8b96f] to-[#f5d39a] px-4 py-2.5 text-sm font-semibold text-[#1a1008] transition hover:brightness-110"><Plus className="size-4" />Create a screenplay</Link>
          </section>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[10px] uppercase tracking-[.2em] text-[#d5ac70]">Your collection</p><h2 className="mt-1 font-serif text-2xl text-[#f5dfb6]">My screenplays <span className="font-sans text-sm text-[#978a79]">({screenplays.length})</span></h2></div>
            <button type="button" onClick={() => setFavoritesOnly((current) => !current)} aria-pressed={favoritesOnly} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${favoritesOnly ? 'border-[#d4a65d]/60 bg-[#d4a65d]/10 text-[#f1c982]' : 'border-[#d4a65d]/20 text-[#b9ac9a] hover:border-[#d4a65d]/50'}`}><Star className="size-4" fill={favoritesOnly ? 'currentColor' : 'none'} />Favorites</button>
          </div>
          <div className="mb-5 sm:hidden"><label className="sr-only" htmlFor="mobile-search">Search screenplays</label><input id="mobile-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your projects…" className="w-full rounded-lg border border-[#d4a65d]/20 bg-black/30 px-4 py-2.5 text-sm outline-none placeholder:text-[#817667] focus:border-[#d4a65d]/60" /></div>
          {loadError && <p role="alert" className="mb-4 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{loadError}</p>}
          {visibleScreenplays.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleScreenplays.map((screenplay) => (
                <article key={screenplay.id} className="group overflow-hidden rounded-xl border border-[#d4a65d]/15 bg-[#15100c] transition hover:-translate-y-0.5 hover:border-[#d4a65d]/45">
                  <Link href={`/editor/${screenplay.id}`} className="block p-5">
                    <div className="mb-5 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#d4a65d]/10 bg-[url('/scriptly-auth-artwork.png')] bg-cover bg-center"><Film className="size-8 text-[#f0d5a3] drop-shadow-lg" aria-hidden="true" /></div>
                    <p className="text-[10px] uppercase tracking-[.18em] text-[#c69b5e]">{screenplay.genre || 'Screenplay'}</p>
                    <h3 className="mt-1 truncate font-serif text-xl text-[#f5dfb6] group-hover:text-[#ffe2ad]">{screenplay.title}</h3>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#a99d8d]">{screenplay.tagline || 'Your story is waiting for its next scene.'}</p>
                    <p className="mt-4 flex items-center gap-2 text-xs text-[#837969]"><FileText className="size-3.5" />Updated {new Date(screenplay.updated_at).toLocaleDateString()}</p>
                  </Link>
                  <div className="flex justify-end gap-1 border-t border-[#d4a65d]/10 px-4 py-2">
                    <button type="button" onClick={() => void toggleFavorite(screenplay)} aria-label={screenplay.is_favorite ? 'Remove from favorites' : 'Add to favorites'} className="rounded-md p-2 text-[#b59a70] hover:bg-white/5"><Star className="size-4" fill={screenplay.is_favorite ? 'currentColor' : 'none'} /></button>
                    <button type="button" onClick={() => void deleteScreenplay(screenplay)} aria-label={`Delete ${screenplay.title}`} className="rounded-md p-2 text-[#a99d8d] hover:bg-red-400/10 hover:text-red-300"><Trash2 className="size-4" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : screenplays.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-[#d4a65d]/25 bg-[#15100c]/70 px-6 py-14 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#d4a65d]/25 bg-[#d4a65d]/5 text-[#e4bf80]"><Feather className="size-5" /></div><h3 className="mt-4 font-serif text-xl text-[#f5dfb6]">A blank page is full of possibility.</h3><p className="mx-auto mt-2 max-w-sm text-sm text-[#a99d8d]">Start with an idea, then turn it into a screenplay you can edit and export.</p><Link href="/generator" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#efc780] hover:text-[#ffe2ad]">Create your first screenplay <Plus className="size-4" /></Link></section>
          ) : <p className="rounded-xl border border-[#d4a65d]/15 p-8 text-center text-sm text-[#a99d8d]">No screenplays match your search.</p>}
        </div>
      </div>
    </main>
  )
}

'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Plus, Search, Loader, Star, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface ScreenplayData {
  id: string
  title: string
  genre: string
  tagline: string
  is_favorite: boolean
  created_at: string
  updated_at: string
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [screenplays, setScreenplays] = useState<ScreenplayData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFavorites, setFilterFavorites] = useState(false)
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      await fetchScreenplays()
    }
    checkAuth()
  }, [supabase.auth, router])

  const fetchScreenplays = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/screenplays')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setScreenplays(data.screenplays || [])
    } catch (error) {
      console.error('[v0] Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/screenplays/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !isFavorite }),
      })
      if (!response.ok) throw new Error('Failed to update')
      await fetchScreenplays()
    } catch (error) {
      console.error('[v0] Update error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this screenplay?')) return
    try {
      const response = await fetch(`/api/screenplays/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      await fetchScreenplays()
    } catch (error) {
      console.error('[v0] Delete error:', error)
    }
  }

  const filteredScreenplays = screenplays.filter((screenplay) => {
    const matchesSearch = screenplay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screenplay.genre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFavorite = !filterFavorites || screenplay.is_favorite
    return matchesSearch && matchesFavorite
  })

  const recentScreenplays = screenplays.slice(0, 3)
  const favoriteScreenplays = screenplays.filter((s) => s.is_favorite)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`

    return date.toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="heading-md mb-2">Welcome Back!</h1>
                <p className="body-text">
                  You have {screenplays.length} screenplay{screenplays.length !== 1 ? 's' : ''}. Keep creating!
                </p>
              </div>
              <Link href="/generator" className="button-primary w-full md:w-auto flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                New Screenplay
              </Link>
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
          ) : screenplays.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-xl text-center"
            >
              <p className="body-text mb-6">You haven&apos;t created any screenplays yet.</p>
              <Link href="/generator" className="button-primary inline-block">
                Create Your First Screenplay
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Recent & Favorites Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Recent Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="heading-sm text-primary mb-4">Recent Projects</h2>
                  <div className="space-y-3">
                    {recentScreenplays.length > 0 ? (
                      recentScreenplays.map((screenplay) => (
                        <ScreenplayItem
                          key={screenplay.id}
                          screenplay={screenplay}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDelete}
                          formatDate={formatDate}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent screenplays</p>
                    )}
                  </div>
                </motion.div>

                {/* Favorites */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="heading-sm text-primary mb-4">Favorites</h2>
                  <div className="space-y-3">
                    {favoriteScreenplays.length > 0 ? (
                      favoriteScreenplays.map((screenplay) => (
                        <ScreenplayItem
                          key={screenplay.id}
                          screenplay={screenplay}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDelete}
                          formatDate={formatDate}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No favorites yet</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* All Screenplays Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="heading-sm text-primary mb-6">All Screenplays</h2>

                  {/* Search & Filter */}
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search screenplays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder-muted-foreground"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterFavorites(!filterFavorites)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                        filterFavorites
                          ? 'bg-primary text-background'
                          : 'glass text-foreground hover:border-primary/50'
                      }`}
                    >
                      Favorites Only
                    </motion.button>
                  </div>

                  {/* Grid */}
                  {filteredScreenplays.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredScreenplays.map((screenplay, index) => (
                        <ScreenplayGridCard
                          key={screenplay.id}
                          screenplay={screenplay}
                          index={index}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDelete}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass p-12 rounded-xl text-center"
                    >
                      <p className="body-text">No screenplays found matching your search.</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="glass p-8 rounded-xl text-center">
                  <p className="text-4xl font-bold text-primary mb-2">{screenplays.length}</p>
                  <p className="body-text">Total Screenplays</p>
                </div>
                <div className="glass p-8 rounded-xl text-center">
                  <p className="text-4xl font-bold text-primary mb-2">{favoriteScreenplays.length}</p>
                  <p className="body-text">Favorites</p>
                </div>
                <div className="glass p-8 rounded-xl text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    {screenplays.reduce((total, s) => total + 10, 0)}
                  </p>
                  <p className="body-text">Total Pages Generated</p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ScreenplayItem({
  screenplay,
  onToggleFavorite,
  onDelete,
  formatDate,
}: {
  screenplay: ScreenplayData
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  onDelete: (id: string) => void
  formatDate: (date: string) => string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-4 rounded-lg hover:border-primary/50 transition-all group"
    >
      <div className="flex items-start justify-between">
        <Link href={`/editor/${screenplay.id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {screenplay.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{screenplay.genre}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(screenplay.updated_at)}</p>
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onToggleFavorite(screenplay.id, screenplay.is_favorite)}
            className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <Star
              className="w-4 h-4"
              fill={screenplay.is_favorite ? 'currentColor' : 'none'}
              color={screenplay.is_favorite ? '#d4af37' : 'currentColor'}
            />
          </button>
          <button
            onClick={() => onDelete(screenplay.id)}
            className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ScreenplayGridCard({
  screenplay,
  index,
  onToggleFavorite,
  onDelete,
  formatDate,
}: {
  screenplay: ScreenplayData
  index: number
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  onDelete: (id: string) => void
  formatDate: (date: string) => string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-6 rounded-lg hover:border-primary/50 transition-all group cursor-pointer h-full flex flex-col"
    >
      <Link href={`/editor/${screenplay.id}`} className="flex-1">
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {screenplay.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{screenplay.genre}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{screenplay.tagline}</p>
      </Link>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">{formatDate(screenplay.updated_at)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(screenplay.id, screenplay.is_favorite)}
            className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <Star
              className="w-4 h-4"
              fill={screenplay.is_favorite ? 'currentColor' : 'none'}
              color={screenplay.is_favorite ? '#d4af37' : 'currentColor'}
            />
          </button>
          <button
            onClick={() => onDelete(screenplay.id)}
            className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}


export default function DashboardPage() {
  // This component must be rendered client-side only
  return typeof window !== 'undefined' ? <DashboardContent /> : <Loader className="w-8 h-8 text-primary animate-spin" />
}

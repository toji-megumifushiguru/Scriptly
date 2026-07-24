'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Film, LogOut, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    router.push('/')
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-sm border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary"
          >
            <Film className="w-8 h-8" />
          </motion.div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
            Scriptly
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-foreground hover:text-primary transition-colors duration-200">
            Features
          </Link>
          <Link href="/#testimonials" className="text-foreground hover:text-primary transition-colors duration-200">
            Testimonials
          </Link>

          {user ? (
            <>
              <Link href="/generator" className="button-secondary text-sm">
                Generate Script
              </Link>
              <Link href="/dashboard" className="button-primary text-sm">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-background">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-lg border border-border overflow-hidden shadow-xl"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="button-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-background"
              >
                {user.email?.[0].toUpperCase()}
              </button>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-16 w-40 glass rounded-lg border border-border overflow-hidden shadow-xl"
                >
                  <div className="p-2 space-y-1">
                    <Link
                      href="/generator"
                      className="block px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg"
                    >
                      Generate
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-xs text-foreground hover:bg-muted/50 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-destructive/10 rounded-lg"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <Link href="/auth/login" className="button-secondary text-xs px-3 py-2">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="button-primary text-xs px-3 py-2">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

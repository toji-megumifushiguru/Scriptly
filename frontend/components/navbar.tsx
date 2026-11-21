'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Feather, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/frontend/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  onOpenFaq?: () => void
  onOpenAbout?: () => void
  onOpenFeatures?: () => void
}

export function Navbar({ onOpenFaq, onOpenAbout, onOpenFeatures }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const loadUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    void loadUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push('/')
  }

  const linkClass = 'text-[9px] text-[#e0d6c7]/80 transition-colors hover:text-[#f2cf89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76] sm:text-[11px] md:text-xs'

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="Main navigation"
      className="landing-navbar absolute inset-x-0 top-0 z-30 border-b border-[#b58b52]/20 bg-[#080706]/45 backdrop-blur-[3px]"
    >
      <div className="grid h-[48px] grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 sm:h-[54px] sm:gap-4 sm:px-5 md:px-8">
        <Link href="/" aria-label="Scriptly home" className="landing-logo inline-flex items-center gap-1.5 font-serif text-[13px] font-semibold tracking-tight text-[#f2d398] sm:gap-2 sm:text-base">
          <Feather className="size-4 -rotate-12 text-[#e9bd71] sm:size-5" strokeWidth={1.35} />Scriptly
        </Link>

        <div className="landing-nav-links flex items-center justify-center gap-2.5 sm:gap-5 md:gap-7 max-[350px]:hidden">
          <Link href="/#home" aria-current="page" className={`${linkClass} text-[#f2cf89]`}>Home</Link>
          <button type="button" aria-haspopup="dialog" onClick={() => onOpenAbout ? onOpenAbout() : router.push('/#about')} className={linkClass}>About</button>
          <button type="button" aria-haspopup="dialog" onClick={() => onOpenFeatures ? onOpenFeatures() : router.push('/#features')} className={linkClass}>Features</button>
          <button type="button" onClick={() => onOpenFaq ? onOpenFaq() : router.push('/#faq')} className={linkClass}>FAQ</button>
        </div>

        <div className="landing-nav-actions flex items-center justify-end gap-1.5 sm:gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full border border-[#b98a4c]/50 px-2 py-1 text-[8px] text-[#e9cb92] transition hover:border-[#e4bd73] sm:px-3 sm:py-1.5 sm:text-[10px]">Dashboard</Link>
              <button type="button" onClick={handleLogout} aria-label="Sign out" className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f4cf83] to-[#e9ad55] px-2 py-1 text-[8px] font-semibold text-[#221607] transition hover:brightness-110 sm:px-3 sm:py-1.5 sm:text-[10px]"><LogOut className="size-3" /><span className="hidden sm:inline">Sign out</span></button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-full border border-[#b98a4c]/70 px-2 py-1 text-[8px] font-medium text-[#f0d49b] transition hover:bg-[#e8b96f]/10 sm:px-3 sm:py-1.5 sm:text-[10px]">Log In</Link>
              <Link href="/auth/sign-up" className="rounded-full bg-gradient-to-r from-[#f4cf83] to-[#e9ad55] px-2 py-1 text-[8px] font-bold text-[#221607] shadow-[0_2px_10px_rgba(229,174,86,.18)] transition hover:brightness-110 sm:px-3 sm:py-1.5 sm:text-[10px]">Create Account</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

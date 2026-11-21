'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Feather } from 'lucide-react'

export function AuthShell({ children, mode }: { children: ReactNode; mode: 'login' | 'signup' }) {
  return (
    <main className="auth-page min-h-screen">
      <section className="auth-frame">
        <div className="auth-art" role="img" aria-label="A writer in a director chair looking toward a storybook city at dusk">
          <Link href="/" className="auth-brand auth-brand-art"><Feather aria-hidden="true" /> <span>Scriptly</span></Link>
          <div className="auth-art-copy">
            <p className="auth-eyebrow">YOUR STORY STARTS HERE</p>
            <p className="font-serif text-4xl italic leading-tight text-[#f3d39d] sm:text-5xl">Dream it.<br />Write it.</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">Every unforgettable film begins with a story only you can tell.</p>
          </div>
          <p className="auth-art-caption">A creative studio for the stories inside you.</p>
        </div>
        <div className="auth-panel">
          <Link href="/" className="auth-brand auth-brand-mobile"><Feather aria-hidden="true" /> <span>Scriptly</span></Link>
          <div className="auth-form-wrap">
            <div className="mb-8">
              <p className="auth-eyebrow">THE WRITER&apos;S STUDIO</p>
              <h1 className="mt-3 font-serif text-3xl text-[#f5dfb6] sm:text-4xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
              <p className="mt-2 text-sm text-[#b7a995]">{mode === 'login' ? 'Pick up where your next great story left off.' : 'Join Scriptly and start creating screenplays.'}</p>
            </div>
            {children}
            <p className="mt-7 text-center text-sm text-[#b7a995]">
              {mode === 'login' ? 'New to Scriptly?' : 'Already have an account?'}{' '}
              <Link href={mode === 'login' ? '/auth/sign-up' : '/auth/login'} className="font-semibold text-[#f2ca86] hover:text-[#ffe1ae]">
                {mode === 'login' ? 'Create an account' : 'Log in'}
              </Link>
            </p>
          </div>
          <p className="auth-legal">By continuing, you agree to Scriptly&apos;s terms and privacy policy.</p>
        </div>
      </section>
    </main>
  )
}

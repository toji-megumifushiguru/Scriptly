'use client'

import { createClient } from '@/frontend/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle, Loader, LockKeyhole, Mail } from 'lucide-react'
import { AuthShell } from '@/frontend/components/auth-shell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await createClient().auth.signInWithPassword({ email, password })
      if (signInError) {
        const message = signInError.message.toLowerCase()
        if (message.includes('email not confirmed')) throw new Error('Please confirm your email address before signing in.')
        if (message.includes('rate limit') || message.includes('too many')) throw new Error('Too many attempts. Please wait a moment and try again.')
        if (message.includes('invalid login credentials')) throw new Error('Invalid email or password.')
        throw new Error('We couldn’t sign you in right now. Please try again.')
      }
      router.replace('/dashboard')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We couldn’t sign you in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell mode="login">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label className="auth-field" htmlFor="email">
          <Mail aria-hidden="true" />
          <span className="sr-only">Email address</span>
          <input id="email" type="email" autoComplete="email" placeholder="Email address" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="auth-field" htmlFor="password">
          <LockKeyhole aria-hidden="true" />
          <span className="sr-only">Password</span>
          <input id="password" type="password" autoComplete="current-password" placeholder="Password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" className="auth-error"><AlertCircle aria-hidden="true" />{error}</p>}
        <button type="submit" disabled={isLoading} className="auth-submit">
          {isLoading ? <><Loader className="animate-spin" aria-hidden="true" />Signing in…</> : 'Log in'}
        </button>
      </form>
    </AuthShell>
  )
}

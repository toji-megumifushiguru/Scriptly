'use client'

import { createClient } from '@/frontend/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle, Feather, Loader, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { AuthShell } from '@/frontend/components/auth-shell'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await createClient().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          data: { display_name: displayName.trim() || email.split('@')[0] },
        },
      })
      if (signUpError) {
        const message = signUpError.message.toLowerCase()
        if (message.includes('password')) throw new Error('Choose a stronger password and try again.')
        if (message.includes('rate limit') || message.includes('too many')) throw new Error('Too many attempts. Please wait a moment and try again.')
        throw new Error('We couldn’t create your account right now. Please try again.')
      }
      router.push('/auth/sign-up-success')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We couldn’t create your account right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell mode="signup">
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <label className="auth-field" htmlFor="displayName">
          <UserRound aria-hidden="true" />
          <span className="sr-only">Full name</span>
          <input id="displayName" type="text" autoComplete="name" placeholder="Full name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label className="auth-field" htmlFor="email">
          <Mail aria-hidden="true" />
          <span className="sr-only">Email address</span>
          <input id="email" type="email" autoComplete="email" placeholder="Email address" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="auth-field" htmlFor="password">
          <LockKeyhole aria-hidden="true" />
          <span className="sr-only">Password</span>
          <input id="password" type="password" autoComplete="new-password" placeholder="Password (at least 6 characters)" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label className="auth-consent">
          <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required />
          <span>I agree to the Terms &amp; Conditions and Privacy Policy.</span>
        </label>
        {error && <p role="alert" className="auth-error"><AlertCircle aria-hidden="true" />{error}</p>}
        <button type="submit" disabled={isLoading} className="auth-submit">
          {isLoading ? <><Loader className="animate-spin" aria-hidden="true" />Creating your account…</> : <><Feather aria-hidden="true" />Create account</>}
        </button>
      </form>
    </AuthShell>
  )
}

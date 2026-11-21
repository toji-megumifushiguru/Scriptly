'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-4"
          >
            <CheckCircle className="w-16 h-16 text-primary" />
          </motion.div>
          <h1 className="heading-sm mb-2">Account Created!</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 rounded-2xl"
        >
          <div className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Check your email</p>
              <p className="text-xs text-muted-foreground">
                We&apos;ve sent a confirmation link. Click it to verify your email and start creating screenplays.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-6">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="button-primary text-center"
            >
              Back to Sign In
            </Link>
            <Link
              href="/"
              className="button-secondary text-center"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

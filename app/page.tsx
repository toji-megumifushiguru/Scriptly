'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FeatureCard } from '@/components/feature-card'
import { TestimonialCard } from '@/components/testimonial-card'
import { PageBackground } from '@/components/page-transition'
import { Sparkles, Clapperboard, Users, BookOpen, FileDown, Play } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Screenplay Generation',
    description: 'Transform your story ideas into full professional screenplays using advanced AI technology.',
  },
  {
    icon: Users,
    title: 'Character Creation',
    description: 'Develop compelling characters with detailed profiles and personality traits.',
  },
  {
    icon: Clapperboard,
    title: 'Three Act Structure',
    description: 'Automatically organize your screenplay into the proven three-act narrative structure.',
  },
  {
    icon: BookOpen,
    title: 'Scene Generation',
    description: 'Generate detailed scenes with dialogue, action lines, and creative direction.',
  },
  {
    icon: FileDown,
    title: 'PDF Export',
    description: 'Export your screenplays as industry-standard PDF format ready to share.',
  },
  {
    icon: Play,
    title: 'Industry Format',
    description: 'Scripts generated in proper industry format following Hollywood standards.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Independent Filmmaker',
    content: 'Scriptly cut my screenplay development time in half. I can now focus on the creative vision instead of wrestling with formatting.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Film Producer',
    content: 'The AI-generated scenes are remarkably creative. This tool has become essential to my writing process.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Screenwriter',
    content: 'As a professional writer, I was skeptical. But Scriptly genuinely improves my workflow and sparks new ideas.',
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <PageBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-10 left-10 w-72 h-72 rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-accent/30"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block"
            >
              <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Screenplay Generation</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="heading-lg"
            >
              Turn Your Ideas Into{' '}
              <motion.span
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: '100% 50%' }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent"
              >
                Professional Screenplays
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="body-text max-w-2xl mx-auto"
            >
              Generate complete screenplays from simple story ideas using advanced AI. Create character profiles, develop three-act structures, and produce industry-standard scripts in minutes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4"
            >
              <Link href="/generator" className="button-primary w-full md:w-auto">
                Generate Your Script
              </Link>
              <Link href="/dashboard" className="button-secondary w-full md:w-auto">
                View Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-md mb-4">Powerful Features</h2>
            <p className="body-text max-w-2xl mx-auto">
              Everything you need to create professional screenplays with the power of AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-md mb-4">Loved by Filmmakers</h2>
            <p className="body-text max-w-2xl mx-auto">
              See what professional screenwriters and filmmakers think about Scriptly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="heading-md">Ready to Create Your Masterpiece?</h2>
            <p className="body-text">
              Start generating professional screenplays today. No credit card required.
            </p>
            <Link href="/generator" className="button-primary inline-block">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

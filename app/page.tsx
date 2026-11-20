'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FeatureCard } from '@/components/feature-card'
import { PageBackground } from '@/components/page-transition'
import { Sparkles, Clapperboard, Users, BookOpen, FileDown, Play, ArrowRight, Lightbulb, WandSparkles, Download, Pencil, Feather, Film } from 'lucide-react'

const features = [
  { icon: Sparkles, title: 'AI-powered generation', description: 'Turn a single idea into a vivid, industry-ready screenplay.' },
  { icon: Users, title: 'Character profiles', description: 'Create layered characters with motivations worth watching.' },
  { icon: Clapperboard, title: 'Structured stories', description: 'Shape your story with a clear, compelling narrative arc.' },
  { icon: Pencil, title: 'Fully editable', description: 'Refine every scene, line, and detail in your own voice.' },
  { icon: FileDown, title: 'Ready to share', description: 'Export a polished screenplay and bring your story to the table.' },
  { icon: BookOpen, title: 'Built for writers', description: 'Keep your premise, scenes, and story beats in one place.' },
]

const steps = [
  { icon: Lightbulb, title: 'Share your idea', text: 'Start with a spark, a premise, or a scene.' },
  { icon: WandSparkles, title: 'Let Scriptly work', text: 'Shape your story with a thoughtful first draft.' },
  { icon: Download, title: 'Edit & expand', text: 'Make it yours, then take your script anywhere.' },
]

const crafts = ['Screenwriters', 'Filmmakers', 'Storytellers', 'Creators', 'Dreamers']

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />
      <section className="hero-stage relative isolate flex min-h-[670px] items-center overflow-hidden border-b border-border pt-24 md:min-h-[760px]">
        <div className="absolute inset-0 -z-20 bg-[url('/scriptly-studio.png')] bg-cover bg-[center_58%]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/25" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/35" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-10 md:grid-cols-[1.05fr_.95fr] md:px-10">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-black/35 px-4 py-2 text-xs tracking-[.12em] text-primary backdrop-blur">
              <Sparkles size={14} /> YOUR STORY, THE BIG SCREEN
            </div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-serif text-6xl font-medium leading-[.92] tracking-[-.045em] text-[#f5dfb6] sm:text-7xl md:text-8xl">Scriptly</h1>
              <Feather className="mt-2 h-9 w-9 -rotate-12 text-primary sm:h-12 sm:w-12" strokeWidth={1.25} aria-hidden="true" />
            </div>
            <p className="font-serif text-2xl italic text-[#f0d5a3] sm:text-3xl">Turn your ideas into<br className="hidden sm:block" /> professional screenplays.</p>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70 sm:text-base">A simple AI-powered scriptwriter that transforms your story idea into a structured, editable screenplay draft.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/generator" className="button-primary inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm"><Feather size={16} /> Create your script <ArrowRight size={16} /></Link>
              <Link href="/dashboard" className="button-secondary inline-flex items-center justify-center gap-2 rounded-full border-white/20 px-6 py-3.5 text-sm text-white hover:text-background"><Film size={16} /> Explore workspace</Link>
            </div>
            <p className="mt-5 text-xs text-white/50">From a simple idea to a complete screenplay — powered by AI.</p>
          </motion.div>
          <div className="hidden md:block" aria-hidden="true" />
        </div>
        <div className="absolute bottom-5 left-0 right-0 hidden items-center justify-center gap-4 px-6 md:flex">
          <span className="h-px w-20 bg-primary/40" /><p className="font-serif text-sm italic text-primary/90">Every great film begins with a story</p><span className="h-px w-20 bg-primary/40" />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-[11px] font-medium uppercase tracking-[.28em] text-primary">The writer&apos;s toolkit</p><h2 className="font-serif text-3xl text-[#f5dfb6] md:text-4xl">Everything your story needs</h2></div>
          <Link href="/generator" className="hidden items-center gap-2 text-sm text-primary transition hover:text-[#ffe5b5] sm:flex">Start creating <ArrowRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => <FeatureCard key={feature.title} {...feature} index={index} />)}
        </div>
      </section>

      <section className="border-y border-border bg-[#120d09]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
          <div className="mb-12 text-center"><p className="mb-2 text-[11px] uppercase tracking-[.28em] text-primary">A clear path from spark to script</p><h2 className="font-serif text-3xl text-[#f5dfb6] md:text-4xl">How it works</h2></div>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => <div key={title} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && <ArrowRight className="absolute right-[-24px] top-7 hidden text-primary/60 sm:block" size={18} />}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/60 bg-background text-primary"><Icon size={22} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-lg text-[#f5dfb6]">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-16">
        <div className="flex flex-col gap-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-[#24180e] to-[#100d0a] p-6 md:flex-row md:items-center md:justify-between md:p-9">
          <div><p className="text-[11px] uppercase tracking-[.25em] text-primary">Made for every kind of storyteller</p><h2 className="mt-2 font-serif text-2xl text-[#f5dfb6]">Your next great story starts here.</h2></div>
          <div className="flex flex-wrap gap-2">{crafts.map((craft) => <span key={craft} className="rounded-full border border-primary/20 px-3 py-1.5 text-xs text-white/70">{craft}</span>)}</div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

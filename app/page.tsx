'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clapperboard, Download, Feather, Play, Sparkles, Users, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'

const featureLinks = [
  { icon: Sparkles, label: <>AI-Powered<br />Generation</>, href: '/generator' },
  { icon: Users, label: <>Character &amp; Plot<br />Development</>, href: '/generator' },
  { icon: Clapperboard, label: <>Structured<br />Screenplay</>, href: '/dashboard' },
  { icon: Download, label: <>Export as PDF</>, href: '/dashboard' },
]

const faqs = [
  { question: 'What does Scriptly do?', answer: 'Scriptly turns your story idea into a structured screenplay draft with characters, acts, and scenes you can refine.' },
  { question: 'Can I edit the screenplay?', answer: 'Yes. Your saved screenplays can be edited scene by scene from your workspace.' },
  { question: 'How do I export my screenplay?', answer: 'Open a screenplay in your dashboard and choose Export PDF to download a formatted copy.' },
]

export default function Home() {
  const [faqOpen, setFaqOpen] = useState(false)
  const faqDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = faqDialogRef.current
    if (!dialog) return
    if (faqOpen && !dialog.open) dialog.showModal()
    if (!faqOpen && dialog.open) dialog.close()
  }, [faqOpen])

  useEffect(() => {
    const openFaqFromHash = () => {
      if (window.location.hash === '#faq') setFaqOpen(true)
    }
    openFaqFromHash()
    window.addEventListener('hashchange', openFaqFromHash)
    return () => window.removeEventListener('hashchange', openFaqFromHash)
  }, [])

  return (
    <main id="home" className="min-h-svh bg-[#080706] p-1.5 text-[#f7ead1] sm:p-2">
      <div className="landing-shell relative mx-auto flex min-h-[calc(100svh-12px)] max-w-[1600px] flex-col overflow-hidden rounded-[17px] border border-[#98713e]/60 bg-[#090807] shadow-[0_0_45px_rgba(0,0,0,.55)] sm:min-h-[calc(100svh-16px)] sm:rounded-[20px]">
        <Navbar onOpenFaq={() => setFaqOpen(true)} />

        <section aria-labelledby="home-title" className="landing-hero relative isolate flex flex-1 flex-col justify-between overflow-hidden pt-[62px] sm:pt-[70px]">
          <div className="absolute inset-0 -z-20 bg-[url('/scriptly-home-studio.png')] bg-cover bg-[center_54%]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,6,5,.98)_0%,rgba(7,6,5,.88)_34%,rgba(7,6,5,.4)_62%,rgba(7,6,5,.12)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,6,5,.38)_0%,transparent_24%,transparent_68%,rgba(7,6,5,.92)_100%)]" aria-hidden="true" />

          <div id="about" className="landing-copy mx-[6%] mb-auto mt-[clamp(22px,7vh,74px)] max-w-[550px] scroll-mt-20">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <h1 id="home-title" className="landing-title font-serif text-[clamp(3rem,8vw,5.3rem)] font-semibold leading-[.94] tracking-[-.045em] text-[#f2d398]">Scriptly</h1>
              <Feather className="mt-2 size-8 -rotate-12 text-[#e9bd71] sm:size-11" strokeWidth={1.15} aria-hidden="true" />
            </div>
            <p className="landing-tagline mt-2 font-serif text-[clamp(1.05rem,2.65vw,1.6rem)] leading-[1.12] text-[#f2e7d5]">
              <span className="text-[#e7bd75]">#</span> Turn Your Ideas Into<br />
              <span className="font-semibold italic text-[#eabc68]">Professional Screenplays</span>
            </p>
            <p className="landing-description mt-2 max-w-[365px] text-[11px] leading-[1.55] text-[#e1d7c9]/85 sm:mt-3 sm:text-xs">
              A simple AI-powered script generator that transforms<br className="hidden sm:block" /> your story idea into a structured, editable screenplay draft.
            </p>
            <div className="landing-actions mt-4 flex items-center gap-4 sm:mt-5">
              <Link href="/generator" className="inline-flex min-h-8 items-center gap-2 rounded-full bg-gradient-to-r from-[#f4cf83] to-[#e9ad55] px-3.5 py-2 text-[10px] font-bold text-[#221607] shadow-[0_4px_18px_rgba(232,177,87,.24)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe5ad] sm:min-h-9 sm:px-4 sm:text-[11px]">
                Get Started Free <ArrowRight className="size-3" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#e8dfd1] transition hover:text-[#f2cb7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76] sm:text-[11px]">
                Learn More <Play className="size-2.5 fill-current" />
              </a>
            </div>
          </div>

          <nav id="features" aria-label="Scriptly features" className="landing-features mx-[5%] mb-3 mt-8 grid max-w-[580px] grid-cols-4 border-t border-[#c19a5f]/20 pt-3 sm:mb-5 sm:mt-10 sm:pt-4">
            {featureLinks.map(({ icon: Icon, label, href }, index) => (
              <Link key={index} href={href} className={`group flex min-h-10 flex-col items-center justify-center gap-1 px-1 text-center text-[8px] leading-[1.25] text-[#e1d8cb]/85 transition hover:text-[#f2c875] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76] sm:text-[9px] ${index > 0 ? 'border-l border-[#c19a5f]/25' : ''}`}>
                <Icon className="size-3 text-[#e8ba68] transition group-hover:-translate-y-0.5 sm:size-3.5" strokeWidth={1.6} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </section>
      </div>

      <dialog
        ref={faqDialogRef}
        onClose={() => setFaqOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setFaqOpen(false) }}
        aria-labelledby="faq-title"
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(440px,calc(100vw-24px))] max-w-none overflow-y-auto rounded-2xl border border-[#98713e]/60 bg-[#100d0a] p-5 text-[#f4ead9] shadow-[0_24px_90px_rgba(0,0,0,.75)] backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] uppercase tracking-[.22em] text-[#d9ae68]">A few quick answers</p><h2 id="faq-title" className="mt-1 font-serif text-2xl text-[#f2d398]">Frequently asked questions</h2></div>
          <button type="button" onClick={() => setFaqOpen(false)} aria-label="Close frequently asked questions" className="rounded-lg p-1.5 text-[#b9ac9a] transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76]"><X className="size-5" /></button>
        </div>
        <div className="mt-5 divide-y divide-[#c19a5f]/15">
          {faqs.map(({ question, answer }) => <section key={question} className="py-4 first:pt-0 last:pb-0"><h3 className="flex items-center gap-2 text-sm font-semibold text-[#eac57e]"><Check className="size-4" />{question}</h3><p className="mt-2 pl-6 text-xs leading-5 text-[#b9ad9e]">{answer}</p></section>)}
        </div>
      </dialog>
    </main>
  )
}

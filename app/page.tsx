'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clapperboard, Download, Feather, Play, Sparkles, Users, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'

type InfoPanel = 'about' | 'features' | 'ai-generation' | 'character-development' | 'structured-screenplay' | 'pdf-export'

const featureLinks = [
  { id: 'ai-generation' as const, icon: Sparkles, label: <>AI-Powered<br />Generation</> },
  { id: 'character-development' as const, icon: Users, label: <>Character &amp; Plot<br />Development</> },
  { id: 'structured-screenplay' as const, icon: Clapperboard, label: <>Structured<br />Screenplay</> },
  { id: 'pdf-export' as const, icon: Download, label: <>Export as PDF</> },
]

const featureDetails = [
  { id: 'ai-generation' as const, title: 'AI-Powered Generation', description: 'Start with a premise, pick a genre and mood, and generate a structured first screenplay draft to build on.', href: '/generator', action: 'Start writing' },
  { id: 'character-development' as const, title: 'Character & Plot Development', description: 'Turn your idea into memorable characters and a clear three-act story structure with key plot points.', href: '/generator', action: 'Develop a story' },
  { id: 'structured-screenplay' as const, title: 'Structured Screenplay', description: 'Review your story as organized acts and scenes, then edit scene headings and descriptions in your workspace.', href: '/dashboard', action: 'Open workspace' },
  { id: 'pdf-export' as const, title: 'Export as PDF', description: 'Download a formatted PDF of a saved screenplay whenever you are ready to share or print it.', href: '/dashboard', action: 'View screenplays' },
]

const faqs = [
  { question: 'What does Scriptly do?', answer: 'Scriptly turns your story idea into a structured screenplay draft with characters, acts, and scenes you can refine.' },
  { question: 'Can I edit the screenplay?', answer: 'Yes. Your saved screenplays can be edited scene by scene from your workspace.' },
  { question: 'How do I export my screenplay?', answer: 'Open a screenplay in your dashboard and choose Export PDF to download a formatted copy.' },
]

export default function Home() {
  const [faqOpen, setFaqOpen] = useState(false)
  const [infoPanel, setInfoPanel] = useState<InfoPanel | null>(null)
  const faqDialogRef = useRef<HTMLDialogElement>(null)
  const infoDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = faqDialogRef.current
    if (!dialog) return
    if (faqOpen && !dialog.open) dialog.showModal()
    if (!faqOpen && dialog.open) dialog.close()
  }, [faqOpen])

  useEffect(() => {
    const dialog = infoDialogRef.current
    if (!dialog) return
    if (infoPanel && !dialog.open) dialog.showModal()
    if (!infoPanel && dialog.open) dialog.close()
  }, [infoPanel])

  useEffect(() => {
    const openPanelFromHash = () => {
      if (window.location.hash === '#faq') setFaqOpen(true)
      if (window.location.hash === '#about') setInfoPanel('about')
      if (window.location.hash === '#features') setInfoPanel('features')
    }
    openPanelFromHash()
    window.addEventListener('hashchange', openPanelFromHash)
    return () => window.removeEventListener('hashchange', openPanelFromHash)
  }, [])

  const selectedFeature = featureDetails.find((feature) => feature.id === infoPanel)
  const infoTitle = infoPanel === 'about' ? 'About Scriptly' : infoPanel === 'features' ? 'Tools to take your idea to the screen' : selectedFeature?.title ?? ''
  const infoDescription = infoPanel === 'about'
    ? 'Scriptly helps turn a story idea into a screenplay draft you can shape into your own. Generate a starting point, explore its characters and plot, then refine scenes in your workspace.'
    : infoPanel === 'features'
      ? 'From the first idea to a shareable screenplay, Scriptly keeps the key parts of your writing workflow together.'
      : selectedFeature?.description ?? ''
  const infoActionHref = selectedFeature?.href ?? '/generator'
  const infoActionLabel = selectedFeature?.action ?? (infoPanel === 'features' ? 'Start creating' : 'Get Started Free')

  return (
    <main id="home" className="min-h-svh bg-[#080706] p-1.5 text-[#f7ead1] sm:p-2">
      <div className="landing-shell relative mx-auto flex min-h-[calc(100svh-12px)] max-w-[1600px] flex-col overflow-hidden rounded-[17px] border border-[#98713e]/60 bg-[#090807] shadow-[0_0_45px_rgba(0,0,0,.55)] sm:min-h-[calc(100svh-16px)] sm:rounded-[20px]">
        <Navbar onOpenFaq={() => setFaqOpen(true)} onOpenAbout={() => setInfoPanel('about')} onOpenFeatures={() => setInfoPanel('features')} />

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
              <button type="button" onClick={() => setInfoPanel('features')} className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#e8dfd1] transition hover:text-[#f2cb7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76] sm:text-[11px]">
                Learn More <Play className="size-2.5 fill-current" />
              </button>
            </div>
          </div>

          <nav id="features" aria-label="Scriptly features" className="landing-features mx-[5%] mb-3 mt-8 grid max-w-[580px] grid-cols-4 border-t border-[#c19a5f]/20 pt-3 sm:mb-5 sm:mt-10 sm:pt-4">
            {featureLinks.map(({ id, icon: Icon, label }, index) => (
              <button key={id} type="button" onClick={() => setInfoPanel(id)} className={`group flex min-h-10 flex-col items-center justify-center gap-1 px-1 text-center text-[8px] leading-[1.25] text-[#e1d8cb]/85 transition hover:text-[#f2c875] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76] sm:text-[9px] ${index > 0 ? 'border-l border-[#c19a5f]/25' : ''}`}>
                <Icon className="size-3 text-[#e8ba68] transition group-hover:-translate-y-0.5 sm:size-3.5" strokeWidth={1.6} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </section>
      </div>

      <dialog
        ref={infoDialogRef}
        onClose={() => setInfoPanel(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setInfoPanel(null) }}
        aria-labelledby="home-info-title"
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(500px,calc(100vw-24px))] max-w-none overflow-y-auto rounded-2xl border border-[#98713e]/60 bg-[#100d0a] p-5 text-[#f4ead9] shadow-[0_24px_90px_rgba(0,0,0,.75)] backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[.22em] text-[#d9ae68]">{infoPanel === 'about' ? 'Meet your writing studio' : 'From first idea to final draft'}</p>
            <h2 id="home-info-title" className="mt-1 font-serif text-2xl text-[#f2d398]">{infoTitle}</h2>
          </div>
          <button type="button" onClick={() => setInfoPanel(null)} aria-label="Close information" className="rounded-lg p-1.5 text-[#b9ac9a] transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76]"><X className="size-5" /></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#c8bcaa]">{infoDescription}</p>

        {infoPanel === 'about' && (
          <ol className="mt-5 space-y-3 border-y border-[#c19a5f]/15 py-4 text-xs text-[#e0d5c5]">
            <li className="flex gap-3"><span className="font-serif text-[#e9bd71]">01</span><span>Start with a story idea, genre, and mood.</span></li>
            <li className="flex gap-3"><span className="font-serif text-[#e9bd71]">02</span><span>Review the characters, acts, and scene draft.</span></li>
            <li className="flex gap-3"><span className="font-serif text-[#e9bd71]">03</span><span>Edit your screenplay and export it as a PDF.</span></li>
          </ol>
        )}

        {infoPanel === 'features' && (
          <div className="mt-5 space-y-2">
            {featureDetails.map((feature) => {
              const Icon = featureLinks.find((item) => item.id === feature.id)?.icon ?? Sparkles
              return <button key={feature.id} type="button" onClick={() => setInfoPanel(feature.id)} className="flex w-full items-start gap-3 rounded-xl border border-[#9b7545]/20 bg-[#17120d] p-3 text-left transition hover:border-[#c59b61]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76]">
                <Icon className="mt-0.5 size-4 shrink-0 text-[#e9bd71]" />
                <span><span className="block text-xs font-semibold text-[#ebcd91]">{feature.title}</span><span className="mt-1 block text-[11px] leading-5 text-[#b9ad9e]">{feature.description}</span></span>
              </button>
            })}
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setInfoPanel(null)} className="min-h-10 rounded-full border border-[#b98a4c]/45 px-4 text-xs font-medium text-[#ddc69e] transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8be76]">Close</button>
          <Link href={infoActionHref} onClick={() => setInfoPanel(null)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f4cf83] to-[#e9ad55] px-4 text-xs font-bold text-[#221607] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe5ad]">{infoActionLabel}<ArrowRight className="size-3.5" /></Link>
        </div>
      </dialog>

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

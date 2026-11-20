'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle2, Download, Feather, X } from 'lucide-react'
import type { Screenplay } from '@/lib/types'

interface ScreenplayExportDialogProps {
  open: boolean
  screenplay: Screenplay
  onClose: () => void
  onDownload: () => void
}

const includedSections = ['Overview', 'Characters', 'Acts', 'Scenes', 'Proper formatting']

export function ScreenplayExportDialog({ open, screenplay, onClose, onDownload }: ScreenplayExportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="export-dialog-title"
      className="m-auto max-h-[calc(100dvh-24px)] w-[min(900px,calc(100vw-24px))] max-w-none overflow-y-auto rounded-2xl border border-[#8e6838]/60 bg-[#110e0b] p-0 text-[#f4ead9] shadow-[0_24px_100px_rgba(0,0,0,.72)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-[#b68a4e]/15 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4aa6c]/25 bg-[#241a0f] text-[#f1cf8d]"><Feather className="size-5" /></div>
          <div>
            <h2 id="export-dialog-title" className="font-serif text-lg text-[#f3dfb9]">Export Your Screenplay</h2>
            <p className="mt-0.5 text-xs text-[#aaa092]">Your screenplay is ready. Download it as a PDF.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close export dialog" className="rounded-lg p-2 text-[#a99b87] transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7bd73]"><X className="size-5" /></button>
      </div>

      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(230px,.85fr)] lg:gap-7 lg:p-7">
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-white/5 bg-[#1a1612] p-3 sm:p-5">
          <article aria-label="PDF first-page preview" className="aspect-[8.5/11] max-h-[min(56vh,590px)] w-full max-w-[390px] overflow-hidden bg-[#f1eee8] px-[9%] py-[10%] text-[#27231f] shadow-[0_16px_45px_rgba(0,0,0,.38)]">
            <h3 className="text-center font-mono text-[clamp(12px,2vw,16px)] font-bold uppercase tracking-[.08em]">{screenplay.title}</h3>
            <p className="mt-2 text-center font-mono text-[clamp(8px,1.15vw,10px)]">A Screenplay</p>
            {screenplay.tagline && <p className="mt-4 text-center font-serif text-[clamp(8px,1.1vw,10px)] italic">{screenplay.tagline}</p>}
            <div className="mx-auto my-[9%] w-2/3 border-t border-dashed border-[#847c71]" />
            {screenplay.logline && <p className="font-mono text-[clamp(7px,1vw,9px)] leading-[1.7]">{screenplay.logline}</p>}
            <div className="mt-[8%] space-y-3 font-mono text-[clamp(7px,1vw,9px)] leading-[1.65]">
              {screenplay.scenes.slice(0, 2).map((scene, index) => (
                <div key={`${scene.number}-${index}`}>
                  <p className="font-bold uppercase">{scene.heading}</p>
                  <p className="mt-1 line-clamp-3">{scene.description || scene.setting}</p>
                </div>
              ))}
              {screenplay.scenes.length === 0 && <p className="italic text-[#70695f]">Your scene pages will appear here.</p>}
            </div>
          </article>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm leading-6 text-[#b9ad9c]">A print-ready screenplay file with your story sections arranged for easy reading.</p>
          <ul className="mt-5 space-y-3 border-y border-[#a98658]/15 py-5">
            {includedSections.map((section) => (
              <li key={section} className="flex items-center gap-3 text-sm text-[#d8cfc2]"><CheckCircle2 aria-hidden="true" className="size-[18px] shrink-0 text-[#79bd5f]" />{section}</li>
            ))}
          </ul>
          <button type="button" onClick={onDownload} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7d58e] to-[#edae4c] px-5 text-sm font-bold text-[#211507] shadow-[0_8px_25px_rgba(215,157,68,.17)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7d58e]">
            <Download className="size-4" />Download PDF
          </button>
          <button type="button" onClick={onClose} className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#bd9255]/40 px-5 text-sm font-medium text-[#d9c8aa] transition hover:border-[#d6aa69] hover:bg-[#d6aa69]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7d58e]">Go Back to Edit</button>
        </div>
      </div>
    </dialog>
  )
}

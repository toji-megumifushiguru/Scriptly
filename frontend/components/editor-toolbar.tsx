'use client'

import { motion } from 'framer-motion'
import {
  Bold,
  Italic,
  Underline,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Undo2,
  Redo2,
  Save,
  Download,
  FileJson,
} from 'lucide-react'

interface EditorToolbarProps {
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  onExportPDF: () => void
  onExportFinalDraft: () => void
}

export function EditorToolbar({
  onSave,
  onUndo,
  onRedo,
  onExportPDF,
  onExportFinalDraft,
}: EditorToolbarProps) {
  const toolbarItems = [
    { icon: Bold, label: 'Bold', action: () => {} },
    { icon: Italic, label: 'Italic', action: () => {} },
    { icon: Underline, label: 'Underline', action: () => {} },
    { icon: Type, label: 'Font', action: () => {} },
    null, // Divider
    { icon: AlignLeft, label: 'Align Left', action: () => {} },
    { icon: AlignCenter, label: 'Align Center', action: () => {} },
    { icon: AlignRight, label: 'Align Right', action: () => {} },
    null, // Divider
    { icon: List, label: 'List', action: () => {} },
    { icon: Undo2, label: 'Undo', action: onUndo },
    { icon: Redo2, label: 'Redo', action: onRedo },
  ]

  return (
    <div className="glass border-b border-border p-4 flex items-center gap-2 overflow-x-auto">
      <div className="flex items-center gap-1 flex-1">
        {toolbarItems.map((item, index) => {
          if (!item) {
            return (
              <div
                key={`divider-${index}`}
                className="h-6 w-px bg-border mx-1"
              />
            )
          }

          return (
            <motion.button
              key={item.label}
              onClick={item.action}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 ml-4 border-l border-border pl-4">
        <motion.button
          onClick={onSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={onExportPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="button-secondary text-xs px-3 py-2 flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">PDF</span>
        </motion.button>

        <motion.button
          onClick={onExportFinalDraft}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="button-secondary text-xs px-3 py-2 flex items-center gap-1"
        >
          <FileJson className="w-4 h-4" />
          <span className="hidden md:inline">Final Draft</span>
        </motion.button>
      </div>
    </div>
  )
}

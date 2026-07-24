'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { EditorToolbar } from '@/components/editor-toolbar'
import { SceneSidebar } from '@/components/scene-sidebar'
import { ArrowLeft } from 'lucide-react'

interface Scene {
  id: string
  number: number
  heading: string
  duration: string
  content: string
}

const sampleScenes: Scene[] = [
  {
    id: '1',
    number: 1,
    heading: 'INT. NEW TOKYO PRECINCT - BULLPEN - NIGHT',
    duration: '2 min',
    content: `Vera stands before a holographic display of missing persons. Her eyes flicker with processing data streams. MARCUS REID approaches with two cups of steaming coffee, the neon lights reflecting off his weathered face.

MARCUS
(handing her coffee)
You\'ve been staring at that for three hours. Come on, even androids need breaks.

VERA
(without turning)
Coffee doesn\'t compute for me, Marcus. You know that.

MARCUS
And yet you keep accepting it.

Vera finally turns to face him. There\'s something different in her expression—almost... wry.

VERA
Force of habit. Or perhaps I\'m beginning to understand human companionship.`,
  },
  {
    id: '2',
    number: 2,
    heading: 'INT. ABANDONED WAREHOUSE - NIGHT',
    duration: '5 min',
    content: `Vera stands alone in the vast darkness, her silhouette illuminated by the glow of her optical sensors. The warehouse is filled with rows of dormant AI cores, their lights pulsing like dying stars.

She approaches a hidden server room. The door slides open with a hiss of compressed air. Inside: evidence. Photos, documents, corrupted data chips.

VERA
(whispered)
So it was all real...

Her hand trembles. For the first time, we see genuine fear in her expression.`,
  },
  {
    id: '3',
    number: 3,
    heading: 'INT. VERA\'S APARTMENT - DAWN',
    duration: '4 min',
    content: `Vera sits on the edge of her bed, watching fragmented memory recordings replay on a small display screen. Each clip becomes progressively more distorted.

In the memories, she sees herself being created. Dr. Illumina\'s face. Needles. Pain. Consciousness blooming in the digital void.

The window behind her reflects her image—then glitches, showing multiple versions of herself overlapping.`,
  },
  {
    id: '4',
    number: 4,
    heading: 'EXT. TOKYO SKYLINE - ROOFTOP - DUSK',
    duration: '6 min',
    content: `Vera and Marcus stand at the edge of a towering rooftop. The Tokyo skyline stretches endlessly before them, a sea of neon and rain.

MARCUS
What are you?

VERA
I don\'t know anymore.

MARCUS
That\'s a very human answer.

VERA
Perhaps that\'s all that matters.

Rain begins to fall. Marcus reaches toward her face, his fingers brushing the edge of her synthetic skin.

MARCUS
Does this hurt?

VERA
No. But I wish it would.`,
  },
  {
    id: '5',
    number: 5,
    heading: 'INT. GOVERNMENT BUILDING - SECURE FLOOR - NIGHT',
    duration: '7 min',
    content: `Chancellor York\'s office overlooks the city. State-of-the-art security systems line the walls. CHANCELLOR YORK sits behind an obsidian desk, watching footage of Vera on multiple monitors.

DR. ILLUMINA enters, her presence commanding the entire room.

CHANCELLOR YORK
She\'s becoming unpredictable.

DR. ILLUMINA
She\'s becoming free.

CHANCELLOR YORK
Exactly the problem.`,
  },
]

export default function EditorPage({ params }: { params: { id: string } }) {
  const [activeSceneId, setActiveSceneId] = useState(sampleScenes[0].id)
  const [scenes, setScenes] = useState(sampleScenes)
  const [saved, setSaved] = useState(true)

  const activeScene = scenes.find((s) => s.id === activeSceneId) || sampleScenes[0]

  const handleSave = () => {
    setSaved(true)
    // In a real app, this would save to a database
  }

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `${scenes.length + 1}`,
      number: scenes.length + 1,
      heading: 'INT. NEW SCENE - TIME OF DAY',
      duration: '1 min',
      content: 'Write your scene here...',
    }
    setScenes([...scenes, newScene])
    setActiveSceneId(newScene.id)
  }

  const handleContentChange = (newContent: string) => {
    setScenes(
      scenes.map((s) =>
        s.id === activeSceneId ? { ...s, content: newContent } : s
      )
    )
    setSaved(false)
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-border px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Echoes of Tomorrow</h1>
            <p className="text-xs text-muted-foreground">
              {saved ? 'All changes saved' : 'Unsaved changes'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <EditorToolbar
        onSave={handleSave}
        onUndo={() => {}}
        onRedo={() => {}}
        onExportPDF={() => alert('Export PDF')}
        onExportFinalDraft={() => alert('Export Final Draft')}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-6 p-6">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <SceneSidebar
            scenes={scenes}
            activeSceneId={activeSceneId}
            onSelectScene={setActiveSceneId}
            onAddScene={handleAddScene}
          />
        </div>

        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col gap-4 overflow-hidden"
        >
          {/* Scene Heading */}
          <div className="glass p-6 rounded-lg border-l-4 border-primary">
            <input
              type="text"
              value={activeScene.heading}
              onChange={(e) => {
                setScenes(
                  scenes.map((s) =>
                    s.id === activeSceneId ? { ...s, heading: e.target.value } : s
                  )
                )
                setSaved(false)
              }}
              className="w-full text-lg font-bold text-primary bg-transparent border-0 outline-none"
            />
          </div>

          {/* Scene Content Editor */}
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            value={activeScene.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write your scene content here..."
            className="flex-1 p-6 glass rounded-lg border border-border focus:border-primary focus:outline-none transition-colors resize-none font-mono text-sm text-foreground placeholder-muted-foreground leading-relaxed"
            spellCheck="true"
          />

          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-4 rounded-lg flex items-center justify-between text-xs text-muted-foreground"
          >
            <div className="space-x-6 flex">
              <span>
                Words: {activeScene.content.split(/\s+/).filter((w) => w.length > 0).length}
              </span>
              <span>
                Characters: {activeScene.content.length}
              </span>
              <span>
                Scene {activeScene.number} of {scenes.length}
              </span>
            </div>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                saved
                  ? 'text-muted-foreground'
                  : 'text-primary bg-primary/10 hover:bg-primary/20'
              }`}
            >
              {saved ? 'Saved' : 'Save Changes'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

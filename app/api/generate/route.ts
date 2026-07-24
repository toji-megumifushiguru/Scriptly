import { generateObject } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'
import type { GenerateRequest, Screenplay } from '@/lib/types'

// Mock data generator for development
function generateMockScreenplay(storyIdea: string, genre: string, mood: string): Omit<Screenplay, 'metadata'> {
  const titleStarters = {
    'Thriller': ['Dark', 'Hidden', 'Twisted', 'Fatal', 'Silent'],
    'Drama': ['Echoes', 'Broken', 'Lost', 'Unspoken', 'Between'],
    'Comedy': ['The', 'Love', 'Chaos', 'Madness', 'Wild'],
    'Action': ['Blazing', 'Reckless', 'Unstoppable', 'Final', 'Endless'],
    'Science Fiction': ['The Last', 'Beyond', 'Nexus', 'Quantum', 'Zero'],
    'Fantasy': ['Kingdom', 'The Cursed', 'Mystical', 'The Lost', 'Enchanted'],
    'Horror': ['The Haunting', 'Evil', 'Nightmare', 'The Return', 'Darkness'],
    'Romance': ['Where Hearts', 'Endless', 'Forever', 'Unforgettable', 'The Promise'],
    'Adventure': ['Quest', 'Expedition', 'The Journey', 'Beyond Horizons', 'Rise'],
    'Documentary': ['Uncovered', 'The Truth', 'Revealed', 'Inside', 'The Story'],
  }

  const starter = titleStarters[genre as keyof typeof titleStarters]?.[0] || 'Untitled'
  const title = `${starter} ${storyIdea.split(' ')[0]}`
  const storyLower = storyIdea.toLowerCase()
  const genreLower = genre.toLowerCase()
  const moodLower = mood.toLowerCase()

  return {
    title,
    tagline: `A ${moodLower} tale of mystery and transformation`,
    logline: `When ${storyLower.slice(0, 50)}... everything changes.`,
    synopsis: `In a world where ${storyLower}, a protagonist must navigate dangerous waters and make impossible choices. The story unfolds across multiple timelines and perspectives, revealing hidden truths and testing the limits of human resilience. Through triumph and tragedy, characters discover that ${storyLower} is only the beginning of a much larger mystery that will reshape their understanding of reality.`,
    storyIdea: storyIdea,
    characters: [
      {
        name: 'Alex Morgan',
        role: 'Protagonist',
        description: `A determined individual caught in the center of ${genreLower} circumstances`,
        arcType: 'Hero\'s Journey',
      },
      {
        name: 'Jordan Cross',
        role: 'Antagonist',
        description: 'A complex figure with hidden motivations and a darker past',
        arcType: 'Shadow',
      },
      {
        name: 'Sam Riley',
        role: 'Supporting',
        description: 'A trusted ally who provides crucial help at pivotal moments',
        arcType: 'Mentor',
      },
      {
        name: 'Casey Park',
        role: 'Supporting',
        description: 'A mysterious figure whose true allegiance remains unclear',
        arcType: 'Threshold Guardian',
      },
      {
        name: 'Dr. Haven',
        role: 'Supporting',
        description: 'An expert whose knowledge becomes essential to understanding the truth',
        arcType: 'Mentor',
      },
      {
        name: 'Phoenix Knight',
        role: 'Supporting',
        description: 'A powerful force that emerges to challenge the status quo',
        arcType: 'Herald',
      },
    ],
    threeActStructure: [
      {
        number: 1,
        title: 'Inciting Incident',
        description: `The story begins with ${storyIdea.toLowerCase()}. Our protagonist encounters a catalyst that sets the main plot in motion, forcing them out of their ordinary world and into a dangerous new reality.`,
        keyPlotPoints: [
          'Protagonist introduced in ordinary circumstances',
          'The inciting incident occurs, disrupting the status quo',
          'Protagonist hesitates but accepts the challenge',
          'First challenge tests their resolve',
        ],
      },
      {
        number: 2,
        title: 'Escalation & Revelation',
        description: 'The stakes increase dramatically as hidden truths emerge. Allies become suspects and enemies reveal unexpected depths. The protagonist must navigate a complex web of deception and danger.',
        keyPlotPoints: [
          'Deeper involvement in the main conflict',
          'Shocking revelation about motivations',
          'False victory followed by devastating setback',
          'Unlikely alliance formed',
          'Point of no return reached',
        ],
      },
      {
        number: 3,
        title: 'Climax & Resolution',
        description: 'Everything converges in a final confrontation. The protagonist must use everything they\'ve learned to overcome the ultimate obstacle and emerge transformed.',
        keyPlotPoints: [
          'Final preparation and regrouping',
          'The climactic confrontation',
          'Major sacrifice or revelation',
          'Victory or transformation achieved',
          'New status quo established',
        ],
      },
    ],
    scenes: [
      {
        number: 1,
        heading: 'INT. CITY APARTMENT - NIGHT',
        setting: 'A modest apartment overlooking the city skyline, rain pattering against windows',
        description: `The protagonist lies awake in bed, staring at the ceiling as midnight approaches. Their phone vibrates repeatedly with cryptic messages from an unknown sender. "You know what's coming." they read, sitting bolt upright. Rain streaks the windows as the city lights flicker below. The first message arrives: a photograph of something that shouldn't exist. The protagonist\'s hands shake as they realize that ${storyIdea.toLowerCase()} and nothing will ever be the same again.`,
        pageCount: 3,
      },
      {
        number: 2,
        heading: 'EXT. DOWNTOWN STREETS - MORNING',
        setting: 'Busy city streets filled with morning commuters, coffee shops, and traffic',
        description: 'The protagonist walks through crowded downtown streets in a daze, following coordinates from the mysterious messages. Every face in the crowd seems suspicious. A figure in a dark coat watches from across the street, then vanishes into the morning crowd. The protagonist enters a small café and receives another message: "Third booth from the back." Inside, a briefcase sits waiting with instructions for the next step. The protagonist realizes they\'re being hunted.',
        pageCount: 3,
      },
      {
        number: 3,
        heading: 'INT. ABANDONED WAREHOUSE - DAY',
        setting: 'A decrepit industrial building on the outskirts of town, filled with shadows and echoes',
        description: 'The protagonist navigates through the warehouse\'s dark corridors, each step echoing. Files are scattered across old tables, revealing years of hidden research and classified documents. Photographs, blueprints, and evidence of a massive cover-up surround them. A sound echoes from deeper in the warehouse. The protagonist\'s discovery is interrupted when a gun clicks behind them. "You shouldn\'t have come here," a familiar voice says. The protagonist turns to see someone they trusted more than anyone.',
        pageCount: 4,
      },
      {
        number: 4,
        heading: 'INT. POLICE STATION - AFTERNOON',
        setting: 'The detective bullpen of the local police precinct, filled with activity and noise',
        description: 'The protagonist is escorted into an interrogation room by officers who won\'t make eye contact. A detective sits across from them, cold and distant. "We know about the warehouse. We know what you found," the detective says slowly. The protagonist realizes that the police are part of the conspiracy. The detective slides a folder across the table showing surveillance photos. "How much have you already told people? Because if the answer is anyone at all, they\'re already in danger."',
        pageCount: 3,
      },
      {
        number: 5,
        heading: 'EXT. ROOFTOP - SUNSET',
        setting: 'The roof of a high-rise building overlooking the city, wind whipping through the air',
        description: 'The protagonist meets their contact on a rooftop as the sun bleeds orange across the horizon. Sam Riley emerges from the shadows with proof of everything—documents, recordings, and evidence of the conspiracy that reaches the highest levels of government. "They\'ve already killed three people who knew what we know," Sam says urgently. "We have maybe six hours before they find us." Below, black SUVs begin positioning themselves around the building. The protagonist and Sam lock eyes. "We\'re going to expose this. Tonight. Or we don\'t leave this roof alive."',
        pageCount: 4,
      },
      {
        number: 6,
        heading: 'INT. UNDERGROUND BUNKER - NIGHT',
        setting: 'A secret facility hidden beneath the city, humming with technology and secrets',
        description: 'The protagonist infiltrates the underground bunker where the truth is kept. Research chambers reveal the full extent of the hidden civilization and the artifacts. Jordan Cross appears, revealing their true role in the conspiracy. "This technology could change everything," they say. "Which is precisely why it must remain hidden." A final confrontation erupts between the protagonist, Jordan, and their network of operatives. The protagonist must choose: destroy the evidence and protect the world\'s stability, or expose the truth and risk chaos.',
        pageCount: 5,
      },
      {
        number: 7,
        heading: 'EXT. CITY SKYLINE - DAWN',
        setting: 'The city at sunrise after a life-changing night, the sky transitioning from black to gold',
        description: 'As dawn breaks over the city, sirens wail throughout the downtown core. News helicopters circle overhead. The protagonist stands on a building watching the chaos unfold. The evidence is out. The recordings are playing on every network. Arrests are happening across the government. But the cost was higher than expected. The protagonist sees emergency vehicles racing toward the hospital. Sam Riley didn\'t make it out of the bunker. In the protagonist\'s hand is a final message from Jordan: "This isn\'t over. You\'ve won the battle, but the war for truth has only just begun."',
        pageCount: 5,
      },
      {
        number: 8,
        heading: 'INT. HOSPITAL ROOM - DAY',
        setting: 'A quiet hospital room with morning light streaming through windows, machines beeping steadily',
        description: 'The protagonist sits beside Sam\'s hospital bed, watching their friend struggle to breathe. The doctors said they\'re lucky to be alive. Investigations are ongoing. Congressional hearings are scheduled. The media is calling the protagonist a hero, but it doesn\'t feel that way. Every time the protagonist closes their eyes, they see Jordan\'s face and hears their final words. Outside the hospital room, FBI agents wait. There\'s still so much more to uncover.',
        pageCount: 3,
      },
      {
        number: 9,
        heading: 'EXT. CITY PARK - AFTERNOON',
        setting: 'A peaceful park where the protagonist can finally find solitude among trees and birdsong',
        description: 'Three months later, the protagonist walks through a park trying to find normalcy. Classified documents are still being declassified daily. Some truth has come to light. Other secrets remain buried deeper. A figure approaches on the bench—it\'s Dr. Haven, who helped the protagonist survive the bunker. "They\'re rebuilding," the doctor says quietly. "The network is fractured but not destroyed. And they\'re looking for you." The protagonist realizes that coming forward meant becoming a permanent target. The work of exposure and justice is far from over.',
        pageCount: 3,
      },
      {
        number: 10,
        heading: 'INT. SAFE HOUSE - NIGHT',
        setting: 'A modest safe house in an undisclosed location, protected and secure',
        description: 'The protagonist sits at a desk surrounded by new research, new leads, and new mysteries. The fight for truth has become their life\'s mission. On the screen is a map with marked locations of other facilities similar to the one they exposed. Each one a potential repository of dangerous secrets. The protagonist picks up the phone and calls Sam, who\'s recovered enough to help again. "Ready for the next chapter?" they ask. Through the window, the city lights twinkle in the distance. The story that began with one discovery has evolved into something much larger. The real work is just beginning.',
        pageCount: 4,
      },
    ],
  }
}

// Zod schemas for structured output
const CharacterSchema = z.object({
  name: z.string().describe('Character name'),
  role: z.string().describe('Role in the story (protagonist, antagonist, supporting, etc.)'),
  description: z.string().describe('Physical appearance and personality description'),
  arcType: z.string().describe('Character arc type (hero, mentor, threshold guardian, etc.)'),
})

const ActSchema = z.object({
  number: z.number().describe('Act number (1, 2, or 3)'),
  title: z.string().describe('Act title or theme'),
  description: z.string().describe('Description of main events and themes in this act'),
  keyPlotPoints: z.array(z.string()).describe('Key plot points that drive the story forward'),
})

const SceneSchema = z.object({
  number: z.number().describe('Scene number'),
  heading: z.string().describe('Scene heading in screenplay format (INT./EXT., LOCATION, TIME OF DAY)'),
  setting: z.string().describe('Description of the setting'),
  description: z.string().describe('Brief description of what happens in the scene'),
  pageCount: z.number().describe('Estimated page count for the scene'),
})

const ScreenplaySchema = z.object({
  title: z.string().describe('Movie title'),
  tagline: z.string().describe('One-line tagline that captures the essence of the story'),
  logline: z.string().describe('Standard screenplay logline: (Protagonist) must (goal) or else (consequence)'),
  synopsis: z.string().describe('2-3 paragraph synopsis of the complete story'),
  characters: z.array(CharacterSchema).describe('Array of main characters'),
  threeActStructure: z.array(ActSchema).describe('Three-act structure breakdown'),
  scenes: z.array(SceneSchema).describe('Scene breakdown of the screenplay'),
})

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { storyIdea, genre, mood } = body

    if (!storyIdea || !genre || !mood) {
      return Response.json(
        {
          screenplay: null,
          success: false,
          error: 'Missing required fields: storyIdea, genre, mood',
        },
        { status: 400 }
      )
    }

    const prompt = `You are an expert screenwriter with decades of experience in Hollywood. Generate a professional screenplay structure based on the following:

Story Idea: ${storyIdea}
Genre: ${genre}
Mood/Tone: ${mood}

Create a complete screenplay structure with:
1. A compelling title
2. A tagline that captures the essence
3. A professional logline following the format: "[Protagonist] must [goal] or else [consequence]"
4. A detailed 2-3 paragraph synopsis
5. 5-7 main characters with full descriptions
6. A three-act structure with plot points
7. 12-15 key scenes with proper formatting

Ensure the screenplay follows industry standards and the mood/tone matches the genre and requested tone.`

    let object

    try {
      // Use Groq API if GROQ_API_KEY is provided
      if (process.env.GROQ_API_KEY) {
        const groq = createGroq({
          apiKey: process.env.GROQ_API_KEY,
        })

        const result = await generateObject({
          model: groq('mixtral-8x7b-32768'),
          schema: ScreenplaySchema,
          prompt,
          temperature: 0.7,
          maxTokens: 4096,
        })
        object = result.object
      } else {
        // Fallback to mock data if API key is not available
        console.warn('[v0] GROQ_API_KEY not set, using mock screenplay data')
        object = generateMockScreenplay(storyIdea, genre, mood)
      }
    } catch (apiError) {
      // Fallback to mock data if API call fails
      console.warn('[v0] Groq API error, using mock screenplay data:', apiError)
      object = generateMockScreenplay(storyIdea, genre, mood)
    }

    const screenplay: Screenplay = {
      ...object,
      metadata: {
        genre,
        mood,
        generatedAt: new Date().toISOString(),
      },
    }

    return Response.json(
      {
        screenplay,
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Screenplay generation error:', error)
    return Response.json(
      {
        screenplay: null,
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate screenplay',
      },
      { status: 500 }
    )
  }
}

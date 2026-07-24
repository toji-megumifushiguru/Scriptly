export interface Character {
  name: string
  role: string
  description: string
  arcType: string
}

export interface Act {
  number: number
  title: string
  description: string
  keyPlotPoints: string[]
}

export interface Scene {
  number: number
  heading: string
  setting: string
  description: string
  pageCount: number
}

export interface Screenplay {
  title: string
  tagline: string
  logline: string
  synopsis: string
  storyIdea?: string
  characters: Character[]
  threeActStructure: Act[]
  scenes: Scene[]
  metadata?: {
    genre?: string
    mood?: string
    storyIdea?: string
    generatedAt?: string
  }
}

export interface GenerateRequest {
  storyIdea: string
  genre: string
  mood: string
}

export interface GenerateResponse {
  screenplay: Screenplay
  success: boolean
  error?: string
}

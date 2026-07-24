import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Screenplay } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { screenplay, id } = body as {
      screenplay: Screenplay
      id?: string
    }

    if (!screenplay || !screenplay.title) {
      return NextResponse.json(
        { error: 'Invalid screenplay data' },
        { status: 400 }
      )
    }

    // If ID exists, update; otherwise, create
    if (id) {
      const { data, error } = await supabase
        .from('screenplays')
        .update({
          title: screenplay.title,
          tagline: screenplay.tagline,
          logline: screenplay.logline,
          synopsis: screenplay.synopsis,
          characters: screenplay.characters,
          three_act_structure: screenplay.threeActStructure,
          scenes: screenplay.scenes,
          genre: screenplay.metadata?.genre,
          mood: screenplay.metadata?.mood,
          story_idea: screenplay.metadata?.storyIdea,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()

      if (error) throw error
      return NextResponse.json({ success: true, screenplay: data?.[0] })
    } else {
      const { data, error } = await supabase
        .from('screenplays')
        .insert({
          user_id: user.id,
          title: screenplay.title,
          tagline: screenplay.tagline,
          logline: screenplay.logline,
          synopsis: screenplay.synopsis,
          characters: screenplay.characters,
          three_act_structure: screenplay.threeActStructure,
          scenes: screenplay.scenes,
          genre: screenplay.metadata?.genre,
          mood: screenplay.metadata?.mood,
          story_idea: screenplay.metadata?.storyIdea,
        })
        .select()

      if (error) throw error
      return NextResponse.json({ success: true, screenplay: data?.[0] })
    }
  } catch (error) {
    console.error('[v0] Save screenplay error:', error)
    return NextResponse.json(
      { error: 'Failed to save screenplay' },
      { status: 500 }
    )
  }
}

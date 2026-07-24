import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const genre = searchParams.get('genre')
    const favoritesOnly = searchParams.get('favorites') === 'true'
    const sort = searchParams.get('sort') || 'created_at'

    let queryBuilder = supabase
      .from('screenplays')
      .select('*')
      .eq('user_id', user.id)

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,synopsis.ilike.%${query}%,story_idea.ilike.%${query}%`
      )
    }

    if (genre && genre !== 'all') {
      queryBuilder = queryBuilder.eq('genre', genre)
    }

    if (favoritesOnly) {
      queryBuilder = queryBuilder.eq('is_favorite', true)
    }

    if (sort === 'created_at') {
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
    } else if (sort === 'updated_at') {
      queryBuilder = queryBuilder.order('updated_at', { ascending: false })
    } else if (sort === 'title') {
      queryBuilder = queryBuilder.order('title', { ascending: true })
    }

    const { data, error } = await queryBuilder

    if (error) throw error

    return NextResponse.json({ success: true, screenplays: data || [] })
  } catch (error) {
    console.error('[v0] Fetch screenplays error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch screenplays' },
      { status: 500 }
    )
  }
}

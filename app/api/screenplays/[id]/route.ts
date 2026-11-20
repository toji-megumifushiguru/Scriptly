import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('screenplays')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Screenplay not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, screenplay: data })
  } catch (error) {
    console.error('[v0] Fetch screenplay error:', error)
    return NextResponse.json({ error: 'Failed to fetch screenplay' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('screenplays')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete screenplay error:', error)
    return NextResponse.json(
      { error: 'Failed to delete screenplay' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { is_favorite } = body as { is_favorite?: boolean }

    const { data, error } = await supabase
      .from('screenplays')
      .update({ is_favorite: is_favorite ?? false })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, screenplay: data?.[0] })
  } catch (error) {
    console.error('[v0] Update screenplay error:', error)
    return NextResponse.json(
      { error: 'Failed to update screenplay' },
      { status: 500 }
    )
  }
}

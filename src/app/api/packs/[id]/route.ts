import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('packs')
      .select(`
        *,
        profiles ( id, full_name, handle, avatar_url, role ),
        pack_items ( * )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Get like count
    const { count } = await supabaseAdmin
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('pack_id', id);

    return NextResponse.json({
      ...data,
      like_count: count || 0,
    });
  } catch (error) {
    console.error('GET /api/packs/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('packs')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    if (existing.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('packs')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('PATCH /api/packs/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('packs')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    if (existing.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete items first
    await supabaseAdmin.from('pack_items').delete().eq('pack_id', id);
    // Delete likes
    await supabaseAdmin.from('likes').delete().eq('pack_id', id);
    // Delete pack
    await supabaseAdmin.from('packs').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/packs/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
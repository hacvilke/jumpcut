import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
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
    const { item_id, name, file_url, file_type } = body as {
      item_id?: string;
      name?: string;
      file_url?: string;
      file_type?: string;
    };

    // Delete item
    if (item_id) {
      // Verify pack ownership
      const { data: pack } = await supabaseAdmin
        .from('packs')
        .select('creator_id')
        .eq('id', id)
        .single();

      if (!pack || pack.creator_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const { error } = await supabaseAdmin
        .from('pack_items')
        .delete()
        .eq('id', item_id)
        .eq('pack_id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Add item
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    // Verify pack ownership
    const { data: pack } = await supabaseAdmin
      .from('packs')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!pack || pack.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current max sort_order
    const { data: maxSort } = await supabaseAdmin
      .from('pack_items')
      .select('sort_order')
      .eq('pack_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSort = (maxSort?.[0]?.sort_order ?? 0) + 1;

    const { data, error } = await supabaseAdmin
      .from('pack_items')
      .insert({
        pack_id: id,
        name: name.trim(),
        description: null,
        file_url: file_url || null,
        file_type: file_type || 'file',
        sort_order: nextSort,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/packs/[id]/items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
    const { item_id } = body as { item_id: string };

    if (!item_id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    // Verify pack ownership
    const { data: pack } = await supabaseAdmin
      .from('packs')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!pack || pack.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('pack_items')
      .delete()
      .eq('id', item_id)
      .eq('pack_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/packs/[id]/items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
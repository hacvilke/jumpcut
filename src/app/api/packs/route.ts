import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Pack } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('packs')
      .select(`
        *,
        profiles ( id, full_name, handle, avatar_url, role ),
        pack_items ( id, name, sort_order, created_at )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get like counts
    const { data: likesData } = await supabaseAdmin
      .from('likes')
      .select('pack_id');

    const likeCounts: Record<string, number> = {};
    if (likesData) {
      for (const like of likesData) {
        const pid = like.pack_id;
        likeCounts[pid] = (likeCounts[pid] || 0) + 1;
      }
    }

    const packs = (data || []).map((pack: Record<string, unknown>) => ({
      ...pack,
      like_count: likeCounts[pack.id as string] || 0,
      item_count: (pack.pack_items as unknown[])?.length || 0,
    }));

    return NextResponse.json(packs);
  } catch (error) {
    console.error('GET /api/packs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a creator
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'creator') {
      return NextResponse.json({ error: 'Only creators can create packs' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, description } = body as { name: string; category: string; description?: string };

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Pack name is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('packs')
      .insert({
        creator_id: userId,
        name: name.trim(),
        category: category || 'other',
        description: description?.trim() || null,
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/packs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
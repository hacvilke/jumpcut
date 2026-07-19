import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pack_id } = body as { pack_id: string };

    if (!pack_id) {
      return NextResponse.json({ error: 'Pack ID required' }, { status: 400 });
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('pack_id', pack_id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Unlike
      await supabase.from('likes').delete().eq('id', existing.id);
      return NextResponse.json({ liked: false });
    } else {
      // Like
      const { error } = await supabase.from('likes').insert({
        pack_id,
        user_id: userId,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/likes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const packId = searchParams.get('pack_id');

    if (!packId) {
      return NextResponse.json({ error: 'pack_id query param required' }, { status: 400 });
    }

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('pack_id', packId)
      .eq('user_id', userId)
      .single();

    return NextResponse.json({ liked: !!data });
  } catch (error) {
    console.error('GET /api/likes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
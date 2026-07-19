import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const svixId = headers().get('svix-id');
  const svixTimestamp = headers().get('svix-timestamp');
  const svixSignature = headers().get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: Record<string, unknown>;
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as unknown as Record<string, unknown>;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const { type, data } = evt as unknown as { type: string; data: Record<string, unknown> };

  try {
    switch (type) {
      case 'user.created': {
        const id = data.id as string;
        const emailData = data.email_addresses as Array<Record<string, unknown>>;
        const email = emailData?.[0]?.email_address as string;
        const firstName = data.first_name as string || null;
        const lastName = data.last_name as string || null;
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
        const imageUrl = data.image_url as string || null;

        await supabaseAdmin.from('profiles').upsert({
          id,
          email,
          full_name: fullName,
          avatar_url: imageUrl,
          role: 'consumer',
          handle: null,
          bio: null,
        });
        break;
      }

      case 'user.updated': {
        const id = data.id as string;
        const emailData = data.email_addresses as Array<Record<string, unknown>>;
        const email = emailData?.[0]?.email_address as string;
        const firstName = data.first_name as string || null;
        const lastName = data.last_name as string || null;
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
        const imageUrl = data.image_url as string || null;

        await supabaseAdmin.from('profiles').update({
          email,
          full_name: fullName,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', id);
        break;
      }

      case 'user.deleted': {
        const id = data.id as string;
        await supabaseAdmin.from('profiles').delete().eq('id', id);
        break;
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
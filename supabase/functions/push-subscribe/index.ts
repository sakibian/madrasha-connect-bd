/**
 * Deno Edge Function: push-subscribe
 * Upserts a push subscription for the authenticated user.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';
import { jwtDecode } from 'https://esm.sh/jwt-decode@4.0.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface PushSubscriptionPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface JWTPayload {
  sub: string;
  [key: string]: any;
}

Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Extract Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.slice(7);
    let userId: string;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      userId = decoded.sub;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload: PushSubscriptionPayload = await req.json();
    const { endpoint, p256dh, auth } = payload;

    if (!endpoint || !p256dh || !auth) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upsert subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          endpoint,
          p256dh,
          auth,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      )
      .select();

    if (error) {
      console.error('Upsert failed:', error);
      return new Response(JSON.stringify({ error: 'Failed to save subscription' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Subscription saved', data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Push subscribe error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

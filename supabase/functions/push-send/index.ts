/**
 * Deno Edge Function: push-send
 * Fans out push notifications to subscribed devices via VAPID.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@madrasa-connect.bd';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PushPayload {
  userId: string;
  title: string;
  body: string;
  url?: string;
}

Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check VAPID keys
  if (!vapidPrivateKey || !vapidPublicKey) {
    return new Response(
      JSON.stringify({
        error: 'VAPID keys not configured. Set VAPID_PRIVATE_KEY and VAPID_PUBLIC_KEY in Supabase secrets.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const payload: PushPayload = await req.json();
    const { userId, title, body, url } = payload;

    if (!userId || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch subscriptions for this user
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Failed to fetch subscriptions:', fetchError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscriptions found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Import web-push dynamically
    const webPush = await import('https://esm.sh/web-push@3.6.7');
    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const notificationPayload = {
      title,
      body,
      url: url || '/',
    };

    let sentCount = 0;
    const deleteIds: string[] = [];

    // Fan out to all subscriptions
    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(notificationPayload)
        );
        sentCount++;
      } catch (error: any) {
        // Delete subscription if endpoint is invalid (410 Gone / 404 Not Found)
        if (error.statusCode === 410 || error.statusCode === 404) {
          deleteIds.push(sub.id);
          console.warn(`Deleting invalid subscription ${sub.id}`);
        } else {
          console.error(`Failed to send push to ${sub.endpoint}:`, error.message);
        }
      }
    }

    // Clean up invalid subscriptions
    if (deleteIds.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', deleteIds);
    }

    return new Response(
      JSON.stringify({
        message: 'Push notifications sent',
        sent: sentCount,
        deleted: deleteIds.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Push send error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

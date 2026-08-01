/**
 * Web Push client helper — subscribe/unsubscribe + send to server.
 */

export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Convert base64 VAPID public key to Uint8Array.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array(rawData.split('').map((char) => char.charCodeAt(0)));
}

export async function subscribeToPush(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('Web Push not supported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.debug('Push notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.pushManager) {
      console.warn('Push Manager not available');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.debug('Subscribed to push notifications');
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.debug('Unsubscribed from push notifications');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    return false;
  }
}

export async function sendSubscriptionToServer(
  subscription: PushSubscription
): Promise<void> {
  try {
    const response = await fetch('/.netlify/functions/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(subscription.getKey('p256dh') || []))
          )
        ),
        auth: btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(subscription.getKey('auth') || []))
          )
        ),
      }),
    });

    if (!response.ok) {
      console.warn('Push subscription endpoint returned:', response.status);
    }
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    // Silently fail — this is non-critical
  }
}

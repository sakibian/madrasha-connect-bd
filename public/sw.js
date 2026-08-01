/**
 * Minimal hand-rolled service worker for MCBD.
 * Caches app shell, serves NetworkFirst for HTML, CacheFirst for assets.
 */

const CACHE_NAME = 'mcbd-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon.svg',
  '/icon-192.svg',
];

// Install event: cache the app shell, skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(SHELL_ASSETS);
        console.debug('[SW] App shell cached');
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Install failed:', error);
      }
    })()
  );
});

// Activate event: claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      console.debug('[SW] Activated');
      self.clients.claim();
    })()
  );
});

// Fetch event: NetworkFirst for HTML, CacheFirst for images/fonts
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (cross-origin)
  if (url.origin !== location.origin) {
    return;
  }

  // HTML: NetworkFirst
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images & fonts: CacheFirst
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff|woff2)$/i)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: NetworkFirst
  event.respondWith(networkFirst(request));
});

// Push event: show notification
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.debug('[SW] Push event with no data');
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: 'Notification', body: event.data.text() };
  }

  const { title, body, url } = payload;
  const options = {
    body: body || '',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    tag: 'mcbd-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title || 'Madrasa Connect', options).then(() => {
      // Handle notification click
      self.addEventListener('notificationclick', (clickEvent) => {
        clickEvent.notification.close();
        if (url) {
          clickEvent.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
              // Try to focus existing window
              for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                  return client.focus();
                }
              }
              // Open new window if not found
              if (clients.openWindow) {
                return clients.openWindow(url);
              }
            })
          );
        }
      });
    })
  );
});

/**
 * NetworkFirst strategy: try network first, fallback to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * CacheFirst strategy: try cache first, fallback to network
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed for', request.url, error);
    throw error;
  }
}

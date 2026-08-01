/**
 * Lightweight service worker registration module.
 * Safe for SSR and non-supporting browsers.
 */

let refreshing = false;

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    console.debug('Service Worker not supported');
    return;
  }

  // Register on window load
  if (document.readyState === 'complete') {
    performRegistration();
  } else {
    window.addEventListener('load', performRegistration);
  }
}

function performRegistration(): void {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.debug('Service Worker registered:', registration.scope);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW installed and ready, but not controlling
            if (!refreshing) {
              refreshing = true;
              dispatchUpdateAvailable();
            }
          }
        });
      });
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

function dispatchUpdateAvailable(): void {
  const event = new CustomEvent('pwa:update-available', {
    detail: { message: 'A new version is available. Please refresh.' },
  });
  window.dispatchEvent(event);
}

export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.debug('All Service Workers unregistered');
  } catch (error) {
    console.error('Failed to unregister Service Worker:', error);
  }
}

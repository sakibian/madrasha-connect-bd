
import posthog from 'posthog-js';

let initialized = false;

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST;

  if (!key || !host) {
    if (import.meta.env.DEV) {
      throw new Error(
        `${!key ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!key ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} is configured`,
      );
    }
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
  });
  posthog.startExceptionAutocapture({
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: false,
  });
  initialized = true;
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (initialized) posthog.identify(userId, properties);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (initialized) posthog.capture(event, properties);
}

export function resetUser() {
  if (initialized) posthog.reset();
}

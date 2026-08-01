/**
 * PWAInstallPrompt component tests
 *
 * We test only the DETERMINISTIC behaviours so the suite stays stable:
 *   1. Renders nothing on first paint (no beforeinstallprompt yet, no visits).
 *   2. Renders nothing while the 30-day dismissal cooldown is still active.
 *   3. Provides an install button once the deferred event + visit threshold
 *      have both been satisfied.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PWAInstallPrompt from '../../components/PWAInstallPrompt';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (_k: string, fallback: string) => fallback }),
}));

describe('PWAInstallPrompt', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders nothing on first mount when no install event has fired', () => {
    const { container } = render(
      <MemoryRouter>
        <PWAInstallPrompt />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('stays hidden while the 30-day dismissal cooldown is active', () => {
    // Dismissed 25 days ago — cooldown still in effect.
    const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('pwa-install-dismissed-at', twentyFiveDaysAgo);
    localStorage.setItem('pwa-route-visit-count', '10');

    const { container } = render(
      <MemoryRouter>
        <PWAInstallPrompt />
      </MemoryRouter>,
    );

    // Fire beforeinstallprompt — should still stay hidden due to cooldown.
    act(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
    });

    expect(container.firstChild).toBeNull();
  });

  it('reveals the install button once the deferred event fires + visit threshold is met', async () => {
    localStorage.setItem('pwa-route-visit-count', '3');

    render(
      <MemoryRouter>
        <PWAInstallPrompt />
      </MemoryRouter>,
    );

    // Fire the deferred install event synthetically.
    act(() => {
      const evt = new Event('beforeinstallprompt') as Event & { prompt?: () => void; userChoice?: Promise<unknown> };
      evt.prompt = vi.fn();
      evt.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(evt);
    });

    // On desktop UA the install CTA is a real button that reads either
    // 'ইনস্টল করুন' (Bangla) or 'Install' (fallback). We assert the button exists.
    const btn = await screen.findByRole('button', { name: /ইনস্টল|Install/i });
    expect(btn).toBeInTheDocument();
  });
});

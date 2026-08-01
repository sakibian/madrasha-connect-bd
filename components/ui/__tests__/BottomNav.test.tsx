import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BottomNav from '../BottomNav';

// Mock the auth store — the component only reads `user`.
vi.mock('../../../stores', () => ({
  useAuthStore: () => ({ user: null }),
}));

// Mock i18n so we get the fallback labels deterministically.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (_key: string, fallback: string) => fallback }),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>,
  );

describe('BottomNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders exactly 5 primary tabs', () => {
    renderAt('/');
    const nav = screen.getByTestId('bottom-nav');
    expect(nav).toBeInTheDocument();
    // 5 list items, one per tab.
    const items = nav.querySelectorAll('li');
    expect(items.length).toBe(5);
  });

  it('shows the five expected labels', () => {
    renderAt('/');
    for (const label of ['Home', 'Explore', 'Ask', 'Learn', 'Profile']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('is labelled as the primary mobile navigation', () => {
    renderAt('/');
    const nav = screen.getByLabelText('Primary mobile navigation');
    expect(nav).toBeInTheDocument();
  });

  it('is hidden on md+ screens via the md:hidden class', () => {
    renderAt('/');
    const nav = screen.getByTestId('bottom-nav');
    expect(nav.className).toMatch(/md:hidden/);
  });

  it('marks the Ask tab as current when on /fatwa', () => {
    renderAt('/fatwa');
    const askLink = screen.getByRole('link', { name: /Ask/i });
    expect(askLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks the Home tab as current on / for logged-out users', () => {
    renderAt('/');
    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});

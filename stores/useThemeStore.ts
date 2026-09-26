import { create } from 'zustand';

/**
 * Theme store — light / dark / system preference for the shadcn-style
 * token palette in src/index.css.
 *
 * The `.dark` class on <html> flips every `--*` variable; semantic Tailwind
 * colors (bg-background, text-foreground, bg-primary, border-border, ...)
 * follow automatically.
 *
 * Persistence: localStorage `mc_theme`. The no-flash inline script in
 * index.html reads the same key before first paint — keep them in sync.
 */

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'mc_theme';

const media = () =>
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

const systemIsDark = () => media()?.matches ?? false;

const isDarkFor = (pref: ThemePreference) =>
  pref === 'dark' || (pref === 'system' && systemIsDark());

const applyClass = (pref: ThemePreference) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDarkFor(pref));
};

const readStored = (): ThemePreference => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
};

interface ThemeState {
  /** Stored preference ('system' follows the OS). */
  preference: ThemePreference;
  /** Effective dark state after resolving 'system'. */
  isDark: boolean;
  setPreference: (pref: ThemePreference) => void;
  /** Cycles light ↔ dark explicitly (exits 'system' mode). */
  toggle: () => void;
  /** Applies the stored preference + OS listener. Call once at app boot. */
  init: () => void;
}

let mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: readStored(),
  isDark: isDarkFor(readStored()),

  setPreference: (pref) => {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {}
    applyClass(pref);
    set({ preference: pref, isDark: isDarkFor(pref) });
  },

  toggle: () => {
    const next = get().isDark ? 'light' : 'dark';
    get().setPreference(next);
  },

  init: () => {
    applyClass(get().preference);
    if (mediaListener) return;
    mediaListener = (e) => {
      // Only re-resolve when the user hasn't picked an explicit theme.
      if (get().preference === 'system') {
        applyClass('system');
        set({ isDark: e.matches });
      }
    };
    media()?.addEventListener('change', mediaListener);
  },
}));

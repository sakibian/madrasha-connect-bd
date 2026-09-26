import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';

/**
 * Light ↔ dark toggle. Explicit taps persist to localStorage `mc_theme`
 * (exiting 'system' follow-OS mode). The `.dark` class on <html> swaps
 * the whole CSS-var palette — no component-level changes needed.
 *
 * `variant="dark"` renders for use on dark hero backgrounds, mirroring
 * LanguageSwitcher's API.
 */
interface Props {
  variant?: 'light' | 'dark';
}

const ThemeToggle: React.FC<Props> = ({ variant = 'light' }) => {
  const { isDark, toggle } = useThemeStore();

  const cls =
    variant === 'dark'
      ? 'text-white/80 hover:text-white hover:bg-white/10 border-white/20'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted border-border';

  return (
    <button
      type="button"
      onClick={toggle}
      className={`tap-target flex items-center justify-center px-3 py-2 border text-xs font-bold uppercase tracking-widest transition-all ${cls}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
};

export default ThemeToggle;

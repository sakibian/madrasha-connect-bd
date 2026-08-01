import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LangCode, getLangMeta } from '../i18n/config';

/**
 * Compact language switcher.
 *
 * Renders a globe button; clicking opens a dropdown of every SUPPORTED_LANGUAGES.
 * Selecting an option persists to localStorage (via i18next-browser-languagedetector)
 * and immediately swaps <html lang/dir> via useI18nSideEffects.
 *
 * Two visual variants:
 *   - `variant="light"` (default) — for use on white/gray surfaces.
 *   - `variant="dark"`             — for use on dark hero backgrounds.
 */
interface Props {
  variant?: 'light' | 'dark';
  align?: 'left' | 'right';
}

const LanguageSwitcher: React.FC<Props> = ({ variant = 'light', align = 'right' }) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = getLangMeta(i18n.language);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const change = (code: LangCode) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const triggerCls =
    variant === 'dark'
      ? 'text-white/80 hover:text-white hover:bg-white/10 border-white/20'
      : 'text-gray-500 hover:text-black hover:bg-gray-50 border-gray-200';

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold uppercase tracking-widest transition-all ${triggerCls}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.switchTo', 'Switch language')}
      >
        <Globe size={14} />
        <span>{active.label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('language.label', 'Language')}
          className={`absolute z-50 mt-2 min-w-[160px] bg-white border border-gray-200 shadow-xl overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = lang.code === active.code;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => change(lang.code)}
                  dir={lang.dir}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${
                    isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang.label}</span>
                  {isActive && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;

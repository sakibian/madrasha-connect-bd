import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLangMeta } from './config';

/**
 * Keeps the browser in sync with the currently-active i18n language.
 *
 * Responsibilities:
 *   - <html lang> attribute (SEO, screen readers, spell-check)
 *   - <html dir>  attribute (Arabic renders RTL)
 *   - <body class> (`lang-<code>` and `rtl` classes for CSS hooks)
 *   - document.title language (browsers announce this to a11y tools)
 *
 * Mount ONCE near the top of the tree (in App.tsx). It's a no-op on the
 * server (SSR safe).
 */
export const useI18nSideEffects = (): void => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const meta = getLangMeta(i18n.language);
    const html = document.documentElement;

    // Update the <html> element.
    html.lang = meta.htmlLang;
    html.dir = meta.dir;

    // Add language & direction classes on <body> for locale-specific CSS.
    const body = document.body;
    if (body) {
      // Strip any previous lang-* / rtl class before applying the new one.
      body.className = body.className
        .split(' ')
        .filter((c) => !c.startsWith('lang-') && c !== 'rtl' && c !== 'ltr')
        .join(' ')
        .trim();
      body.classList.add(`lang-${meta.code}`, meta.dir);
    }
  }, [i18n.language]);
};

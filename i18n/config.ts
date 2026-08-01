/**
 * i18n configuration for Madrasa Connect BD.
 *
 * We support three languages out of the box:
 *   - বাংলা      (bn) — DEFAULT, LTR, our home audience.
 *   - English   (en) — LTR, diaspora + institutional partners + SEO reach.
 *   - العربية    (ar) — RTL, Islamic credibility + GCC donor reach.
 *
 * Detection priority (first-match wins):
 *   1. `?lang=xx` URL parameter (deep-linkable, useful for QR codes)
 *   2. localStorage `mc_language` (persisted user preference)
 *   3. Browser `navigator.language`
 *   4. Fallback: `bn` (Bangladesh-first)
 *
 * Adding a new language later:
 *   1. Create locales/<code>/common.json (and other namespaces).
 *   2. Add the code to SUPPORTED_LANGUAGES below.
 *   3. Add RTL_LANGUAGES if the script is right-to-left.
 * That's it — no other code changes needed.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Statically-imported translations. Kept small (< 30 KB total across 3 langs)
// so we ship them inline rather than lazy-loading — makes initial paint feel
// instant, especially on 3G in rural areas.
import bnCommon from '../locales/bn/common.json';
import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';

export type LangCode = 'bn' | 'en' | 'ar';

export interface SupportedLanguage {
  code: LangCode;
  label: string;         // Native label ("বাংলা", "English", "العربية")
  englishLabel: string;  // English label for admin/dev views
  dir: 'ltr' | 'rtl';
  htmlLang: string;      // Value for <html lang="...">
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'bn', label: 'বাংলা',   englishLabel: 'Bengali', dir: 'ltr', htmlLang: 'bn' },
  { code: 'en', label: 'English', englishLabel: 'English', dir: 'ltr', htmlLang: 'en' },
  { code: 'ar', label: 'العربية', englishLabel: 'Arabic',  dir: 'rtl', htmlLang: 'ar' },
];

export const DEFAULT_LANGUAGE: LangCode = 'bn';
export const RTL_LANGUAGES: LangCode[] = ['ar'];

export const isRtl = (code: string): boolean =>
  RTL_LANGUAGES.includes(code as LangCode);

export const getLangMeta = (code: string): SupportedLanguage =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code) ??
  SUPPORTED_LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)!;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    // Non-existent keys should render the KEY itself in dev so we spot them
    // immediately; in production we fall back silently.
    returnEmptyString: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'mc_language',
      caches: ['localStorage'],
    },
    resources: {
      bn: { common: bnCommon },
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;

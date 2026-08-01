/**
 * Async language bootstrap — runs once on app init to apply IP-based geo
 * detection when the user has no explicit preference yet.
 *
 * Called from `index.tsx` right after i18n is initialised. Never blocks
 * first paint: the app renders in whatever language the sync detector
 * picked (usually `bn`), and if geo suggests a different one we
 * `i18n.changeLanguage()` + fire a small dismissible Sonner toast.
 */

import i18n from './config';
import { detectLanguageFromGeo } from './geoDetect';
import { getLangMeta } from './config';
import { toast } from '../services/toast';

const LOCAL_STORAGE_KEY = 'mc_language';

/**
 * Kicks off the async geo detection.
 *
 * Skipped entirely if any of:
 *   - `mc_language` is already set (user has an explicit preference)
 *   - `?lang=xx` is present in the URL (deep-link override)
 *   - `window` is undefined (SSR safety)
 */
export function bootstrapGeoLanguage(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) return;
    const p = new URLSearchParams(window.location.search);
    if (p.get('lang')) return;
  } catch { /* ignore */ }

  detectLanguageFromGeo()
    .then((detected) => {
      if (!detected) return;
      if (detected === i18n.language) return;
      const targetMeta = getLangMeta(detected);
      i18n.changeLanguage(detected).then(() => {
        // Only announce when the user has been switched away from their
        // browser's chosen language. Avoids double-toasting a bn→bn no-op.
        try {
          toast.info(
            `Showing in ${targetMeta.label}`,
            'Tap the language switcher in the header to change.',
          );
        } catch { /* toast may not be mounted yet on very early loads */ }
      });
    })
    .catch(() => { /* silent — user stays on the sync-detected language */ });
}

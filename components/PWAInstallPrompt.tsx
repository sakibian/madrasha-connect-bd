/**
 * PWA Install Prompt Component
 * 
 * Shows a bottom-sheet CTA after 3 route visits.
 * For iOS Safari, shows share icon hint instead of programmatic button.
 * Dismisses for 30 days after user clicks "Later".
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Share2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  // Detect iOS Safari
  useEffect(() => {
    const isIOSSafari =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/(windows|android|crios|fxios)/i.test(navigator.userAgent);
    setIsIOS(isIOSSafari);
  }, []);

  // Track route visits
  useEffect(() => {
    const stored = localStorage.getItem('pwa-route-visit-count');
    const newCount = (parseInt(stored || '0', 10) + 1) % 100; // Reset after 100 to avoid overflow
    setVisitCount(newCount);
    localStorage.setItem('pwa-route-visit-count', newCount.toString());
  }, [location.pathname]);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Show prompt after 3 visits if not dismissed
  useEffect(() => {
    if (visitCount >= 3 && deferredPrompt) {
      const dismissedAt = localStorage.getItem('pwa-install-dismissed-at');
      if (dismissedAt) {
        const dismissedDate = new Date(dismissedAt);
        const now = new Date();
        const daysSinceDismiss = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 30) {
          // Still within 30-day suppression window
          return;
        }
      }
      setShowPrompt(true);
    }
  }, [visitCount, deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed-at', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  // iOS Safari: show hint with share icon
  if (isIOS) {
    return (
      <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <Share2 className="w-5 h-5 text-bd-green mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {t('pwa.iosTitle', 'হোম স্ক্রীনে অ্যাড করুন')}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t(
                  'pwa.iosHint',
                  'শেয়ার আইকনে ট্যাপ করুন, তারপর "হোম স্ক্রীনে যোগ করুন" নির্বাচন করুন।'
                )}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/other: show install button
  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          {t(
            'pwa.title',
            'হোম স্ক্রীনে অ্যাড করুন — অফলাইনেও পাবেন সব ফিচার'
          )}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-bd-green text-white px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors"
          >
            {t('pwa.installButton', 'ইনস্টল করুন')}
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-50 transition-colors"
          >
            {t('pwa.laterButton', 'পরে')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

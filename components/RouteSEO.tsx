import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';
import { organizationSchema, websiteSchema } from './StructuredData';

/**
 * <RouteSEO /> — renders <SEO /> once for the whole app, keyed by pathname.
 *
 * Pages that mount their own <SEO /> (e.g. QawmiSystem) still win — nested
 * Helmet instances override tags set higher in the tree. This component is
 * the safety net so every public route ships a unique <title>, description,
 * canonical and hreflang set in the prerendered HTML.
 */

const ROUTE_TO_KEY: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/faq': 'faq',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/accessibility': 'accessibility',
  '/help': 'help',
  '/qawmi-system': 'qawmiSystem',
  '/deen101': 'deen101',
  '/seerah': 'seerah',
  '/knowledge': 'knowledge',
  '/institutions': 'institutions',
  '/scholars': 'scholars',
  '/fatwa': 'fatwa',
  '/fatwa/archive': 'fatwaArchive',
  '/events': 'events',
  '/sadaqah': 'sadaqah',
  '/community': 'community',
  '/marketplace': 'marketplace',
  '/professional': 'professional',
  '/audio-library': 'audioLibrary',
  '/tools': 'tools',
  '/calligraphy': 'calligraphy',
  '/competitions': 'competitions',
  '/leaderboard': 'leaderboard',
  '/login': 'login',
  '/register-user': 'registerUser',
  '/register-institution': 'registerInstitution',
};

const RouteSEO: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const key =
    ROUTE_TO_KEY[pathname] ??
    ROUTE_TO_KEY[`/${pathname.split('/')[1]}`] ??
    'home';

  return (
    <SEO
      title={t(`seo.${key}.title`)}
      description={t(`seo.${key}.description`)}
      keywords={
        key === 'home'
          ? [
              'মাদ্রাসা', 'ফতোয়া', 'মাদ্রাসা চাকরি', 'ইসলামিক শিক্ষা',
              'madrasa bangladesh', 'islamic jobs bd', 'fatwa online', 'qawmi madrasa',
            ]
          : undefined
      }
      structuredData={
        key === 'home' ? [organizationSchema(), websiteSchema()] : undefined
      }
    />
  );
};

export default RouteSEO;

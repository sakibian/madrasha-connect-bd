import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../i18n/config';

/**
 * <SEO /> — the one-stop meta tag component every page should render.
 *
 * What it emits:
 *   - <title>                        — browser tab, search result headline
 *   - <meta name="description">      — search snippet
 *   - <meta name="keywords">         — legacy but still used by Bing/Yandex
 *   - <link rel="canonical">         — dedupes URL variants in Google
 *   - <link rel="alternate" hreflang> — one per supported language + x-default
 *   - Open Graph (Facebook, WhatsApp, Slack link previews)
 *   - Twitter Card
 *   - Optional JSON-LD structured data payload
 *
 * Provide `structuredData` as a JS object; it will be serialized to a
 * <script type="application/ld+json"> tag. Pass an ARRAY to emit multiple
 * schema.org graphs on one page (e.g., Article + BreadcrumbList).
 */
interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;                            // Absolute URL for social preview
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;                          // Set true on private / admin pages
  structuredData?: object | object[];
  /** Override the auto-derived canonical (rare — usually leave undefined). */
  canonicalOverride?: string;
}

const DEFAULT_SITE_URL =
  (typeof window !== 'undefined' && window.location?.origin) ||
  'https://madrasaconnectbd.com';

const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/icon.svg`;

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  noIndex = false,
  structuredData,
  canonicalOverride,
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const canonical =
    canonicalOverride ||
    `${DEFAULT_SITE_URL}${location.pathname}${location.search || ''}`;

  const socialImage = image || DEFAULT_IMAGE;
  const ldPayloads = Array.isArray(structuredData)
    ? structuredData
    : structuredData
    ? [structuredData]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Language alternates — Google uses these to serve the right variant. */}
      {SUPPORTED_LANGUAGES.map((lang) => {
        // Build a URL with ?lang=<code> so the same route resolves per language.
        const url = new URL(canonical);
        if (lang.code === 'bn') url.searchParams.delete('lang');
        else url.searchParams.set('lang', lang.code);
        return (
          <link
            key={lang.code}
            rel="alternate"
            hrefLang={lang.htmlLang}
            href={url.toString()}
          />
        );
      })}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:site_name" content="Qowmi" />
      <meta property="og:locale" content={i18n.language === 'bn' ? 'bn_BD' : i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialImage} />

      {/* JSON-LD structured data */}
      {ldPayloads.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;

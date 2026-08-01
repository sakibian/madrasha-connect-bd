/**
 * Registry of established Bangladesh-based Islamic apps, platforms and
 * non-profit organisations that Madrasa Connect BD could realistically
 * partner with (content sharing, co-marketing, or joint fundraising).
 *
 * Keeping this in-repo (rather than a spreadsheet) means:
 *   1. The founder always has an up-to-date reference during meetings.
 *   2. We can render this list on `/about#partnerships` when a deal closes.
 *   3. Engineers can wire outreach status directly into the admin panel.
 *
 * ⚠️  This is a *research* list — not an endorsement. Verify contact
 * details independently before reaching out.
 */

export type PartnerCategory =
  | 'prayer-times'
  | 'quran'
  | 'hadith'
  | 'fatwa-content'
  | 'donation-platform'
  | 'education'
  | 'lifestyle'
  | 'ngo'
  | 'media'
  | 'jobs';

export type OutreachStatus =
  | 'not-started'
  | 'researching'
  | 'contacted'
  | 'in-discussion'
  | 'agreement-drafted'
  | 'partner-signed'
  | 'declined';

export interface Partner {
  /** Stable slug — used as React key & analytics event id. */
  slug: string;
  /** Public name (Bangla preferred where widely used). */
  name: string;
  /** One-line English description of what they offer. */
  what: string;
  /** Category buckets so the admin panel can filter. */
  categories: PartnerCategory[];
  /** Rough audience size / distribution notes — informs outreach priority. */
  audience?: string;
  /** Website / Play Store / Facebook page URLs (validate before shipping). */
  links?: {
    website?: string;
    android?: string;
    ios?: string;
    facebook?: string;
  };
  /** Concrete proposal we can lead with (Bengali one-liner). */
  proposal: string;
  /** Current outreach state — update as founder progresses. */
  status: OutreachStatus;
  /** Free-form founder notes / last-contact date. */
  notes?: string;
}

/**
 * Curated shortlist. Keep it small — quality relationships beat a giant
 * unmaintained list. Add rows only when the founder is ready to actually
 * reach out.
 */
export const PARTNERSHIPS: Partner[] = [
  {
    slug: 'muslim-bangla',
    name: 'Muslim Bangla',
    what: 'Popular Bangla prayer-times + Quran + Hadith app.',
    categories: ['prayer-times', 'quran', 'hadith'],
    audience: 'One of the most-installed Bangla Islamic apps on Play Store.',
    links: { website: 'https://muslimbangla.com' },
    proposal:
      'Cross-promo: they surface our verified fatwa answers inside their Q&A tab, we link to their prayer-times widget from our Tools page.',
    status: 'not-started',
  },
  {
    slug: 'noor-app',
    name: 'Noor — Al Quran Bangla',
    what: 'Bengali Quran reader with translations and tafsir.',
    categories: ['quran', 'lifestyle'],
    audience: 'Large Bangladeshi + diaspora Bengali audience.',
    proposal:
      'Embed a "Ask a scholar" CTA under each ayah that deep-links into our Fatwa Center.',
    status: 'not-started',
  },
  {
    slug: 'islamic-foundation-bd',
    name: 'Islamic Foundation Bangladesh (IFB)',
    what: 'Government autonomous body — mosques, imam training, publications.',
    categories: ['ngo', 'education'],
    audience: 'Regulates most Alia madrasas + national mosque network.',
    links: { website: 'https://www.islamicfoundation.gov.bd' },
    proposal:
      'MoU for verifying institution profiles + hosting official job postings for imams / muazzins.',
    status: 'not-started',
  },
  {
    slug: 'befaqul-madaris',
    name: 'Befaqul Madarisil Arabia Bangladesh (Befaq)',
    what: 'Largest Qawmi madrasa examination board.',
    categories: ['education', 'ngo'],
    audience: '~19,000 affiliated Qawmi madrasas.',
    proposal:
      'Whitelist Befaq-affiliated madrasas with an auto-verified badge; share aggregate job market data with them.',
    status: 'not-started',
  },
  {
    slug: 'bmeb',
    name: 'Bangladesh Madrasah Education Board (BMEB)',
    what: 'Government board for Alia madrasas.',
    categories: ['education', 'ngo'],
    audience: '~9,000 Alia madrasas, ~4M students.',
    links: { website: 'http://bmeb.gov.bd' },
    proposal:
      'Sync verified institution IDs; publish BMEB result-day helper tools on our Tools page.',
    status: 'not-started',
  },
  {
    slug: 'as-sunnah-foundation',
    name: 'As-Sunnah Foundation',
    what: 'Bangladesh non-profit — zakat collection, orphan care, disaster relief.',
    categories: ['ngo', 'donation-platform'],
    audience: 'Highly trusted zakat brand across BD + diaspora.',
    links: { website: 'https://assunnahfoundation.org' },
    proposal:
      'Co-branded zakat calculator; list their active campaigns on our Sadaqah Hub with a revenue-share on donations sourced by us.',
    status: 'not-started',
  },
  {
    slug: 'quantum-foundation',
    name: 'Quantum Foundation',
    what: 'Meditation + charity + blood donation network with Islamic values.',
    categories: ['ngo', 'lifestyle'],
    proposal:
      'Shared volunteer sign-up funnel; co-host a monthly "Sadaqah live" event on their Facebook page.',
    status: 'not-started',
  },
  {
    slug: 'anjuman-mufidul-islam',
    name: 'Anjuman Mufidul Islam',
    what: 'Oldest Bangladeshi Islamic welfare body — burial, dawah, disaster response.',
    categories: ['ngo'],
    proposal:
      'Route "janazah / burial help" requests from our platform to their dispatch team.',
    status: 'not-started',
  },
  {
    slug: 'salat-first',
    name: 'Salat First',
    what: 'Prayer times + qibla app with Bengali locale.',
    categories: ['prayer-times', 'lifestyle'],
    proposal:
      'API exchange — pull their district-accurate prayer times, they get analytics on Bangladeshi usage.',
    status: 'not-started',
  },
  {
    slug: 'ihadis',
    name: 'iHadis',
    what: 'Bengali Sahih Sittah (six major hadith collections) reader.',
    categories: ['hadith'],
    proposal:
      'Deep-link cited hadiths inside our fatwa answers straight to iHadis pages.',
    status: 'not-started',
  },
  {
    slug: 'islamic-online-university',
    name: 'International Open University (formerly IOU)',
    what: 'Free Islamic university with Bengali translations of core courses.',
    categories: ['education'],
    proposal:
      'Cross-list their free courses in our Knowledge Hub; award XP for completing modules.',
    status: 'not-started',
  },
  {
    slug: 'onnorokom-web-services',
    name: 'Onnorokom / Bissoy',
    what: 'Bangla-first Q&A + edtech platform with Islamic vertical.',
    categories: ['media', 'education'],
    proposal:
      'Syndicate our Fatwa Archive (with author byline) into their Islamic Q&A section for SEO reach.',
    status: 'not-started',
  },
];

/** Utility for admin panel / /about page rendering. */
export const partnershipsByCategory = (cat: PartnerCategory): Partner[] =>
  PARTNERSHIPS.filter(p => p.categories.includes(cat));

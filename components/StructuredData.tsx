/**
 * Pre-built JSON-LD payload factories for schema.org types most useful to
 * a Bangladeshi non-profit madrasa platform.
 *
 * Use with <SEO structuredData={organizationSchema()} /> or pass an array to
 * emit multiple schemas on the same page (e.g., an Article + BreadcrumbList
 * on a fatwa page).
 *
 * Why hand-rolled and not a library:
 *   * schema.org shapes are simple JSON.
 *   * A dependency-free approach keeps the bundle tiny.
 *   * We only need a curated set of types.
 */

const SITE_URL =
  (typeof window !== 'undefined' && window.location?.origin) ||
  'https://madrasaconnectbd.com';

const LOGO_URL = `${SITE_URL}/icon.svg`;

/** Organization schema — put on Home + About + Footer. */
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Madrasa Connect Bangladesh',
  alternateName: 'মাদ্রাসা কানেক্ট বাংলাদেশ',
  url: SITE_URL,
  logo: LOGO_URL,
  description:
    'A non-profit digital platform connecting Bangladesh madrasa students, teachers, scholars and institutions — jobs, fatwa, education, community.',
  areaServed: { '@type': 'Country', name: 'Bangladesh' },
  foundingDate: '2026',
  sameAs: [
    // Fill in as accounts are created:
    // 'https://facebook.com/madrasaconnectbd',
    // 'https://twitter.com/madrasaconnectbd',
    // 'https://youtube.com/@madrasaconnectbd',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@madrasaconnectbd.org',
    availableLanguage: ['Bengali', 'English', 'Arabic'],
  },
});

/** WebSite schema with SearchAction — enables the Google sitelinks search box. */
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Madrasa Connect Bangladesh',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['bn', 'en', 'ar'],
});

/** BreadcrumbList schema — always include on non-Home pages. */
export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  })),
});

/** FAQPage schema — put on FAQ + any Q&A page. */
export const faqPageSchema = (
  items: { question: string; answer: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((qa) => ({
    '@type': 'Question',
    name: qa.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: qa.answer,
    },
  })),
});

/**
 * Article schema — for each published fatwa. Includes a `speakable` block so
 * voice assistants (Google Assistant, Alexa) can read the answer aloud.
 */
export const fatwaArticleSchema = (fatwa: {
  id: string;
  question: string;
  answer: string;
  scholarName: string;
  publishedAt: string; // ISO date
  category?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: fatwa.question,
  articleBody: fatwa.answer,
  datePublished: fatwa.publishedAt,
  dateModified: fatwa.publishedAt,
  author: {
    '@type': 'Person',
    name: fatwa.scholarName,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Madrasa Connect Bangladesh',
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  },
  inLanguage: 'bn',
  about: fatwa.category || 'Islamic jurisprudence (Fiqh)',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': fatwa.url,
  },
  // AEO: mark the summary section as "speakable" for voice assistants.
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.fatwa-question', '.fatwa-answer-summary'],
  },
});

/**
 * JobPosting schema — CRITICAL. Makes each job eligible for Google for Jobs,
 * which drives a huge amount of free organic traffic in Bangladesh.
 */
export const jobPostingSchema = (job: {
  title: string;
  description: string;
  institutionName: string;
  location: string;
  postedAt: string;
  validThrough?: string;
  salary?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'VOLUNTEER';
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.postedAt,
  ...(job.validThrough ? { validThrough: job.validThrough } : {}),
  employmentType: job.employmentType || 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: job.institutionName,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: job.location,
      addressCountry: 'BD',
    },
  },
  ...(job.salary
    ? {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'BDT',
          value: { '@type': 'QuantitativeValue', value: job.salary, unitText: 'MONTH' },
        },
      }
    : {}),
  url: job.url,
});

/** Course schema — for Deen101 / KnowledgeHub modules. */
export const courseSchema = (course: {
  name: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'Madrasa Connect Bangladesh',
    sameAs: SITE_URL,
  },
  url: course.url,
  inLanguage: 'bn',
});

/** Event schema — for EventsHub items. */
export const eventSchema = (event: {
  name: string;
  description: string;
  startDate: string; // ISO
  endDate?: string;
  location?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  ...(event.endDate ? { endDate: event.endDate } : {}),
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: event.location || 'Online',
    address: { '@type': 'PostalAddress', addressCountry: 'BD' },
  },
  organizer: { '@type': 'Organization', name: 'Madrasa Connect Bangladesh' },
  url: event.url,
});

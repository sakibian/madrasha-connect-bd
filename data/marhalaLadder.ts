/**
 * The 6-level Qawmi marhala (stage) ladder as taught in Bangladesh, following
 * the Dars-e-Nizami curriculum. Each stage links up to a nominal grade
 * equivalent so English readers can situate it against the mainstream system.
 *
 * Sources:
 *   - Wifaq (Befaq) syllabus booklet (public)
 *     https://wifaqbd.org
 *   - Al-Haiatul Ulya published equivalence table (2018 government notification)
 *     https://en.wikipedia.org/wiki/Al-Haiatul_Ulya_Lil-Jamiatil_Qawmia_Bangladesh
 */

export interface MarhalaStage {
  slug: string;
  order: number;                // 1..6
  nameBn: string;
  nameEn: string;
  nameAr: string;
  durationYears: number;
  approxAgeStart: number;
  mainstreamEquivalent: string;
  coreSubjectsBn: string[];
  coreSubjectsEn: string[];
  sourceUrl: string;
}

export const MARHALA_LADDER: MarhalaStage[] = [
  {
    slug: 'ibtidaiyyah',
    order: 1,
    nameBn: 'ইবতিদাইয়্যাহ (নূরানি + প্রাথমিক)',
    nameEn: 'Ibtidaiyyah (Primary)',
    nameAr: 'ابتدائية',
    durationYears: 5,
    approxAgeStart: 6,
    mainstreamEquivalent: 'Class 1–5 (Primary)',
    coreSubjectsBn: ['কায়দা ও নাযেরা', 'বাংলা', 'অংক', 'ইংরেজি (মৌলিক)', 'ইসলামি আকীদা'],
    coreSubjectsEn: ['Qa\'ida & Nazira Quran', 'Bengali', 'Mathematics', 'Basic English', 'Islamic Beliefs'],
    sourceUrl: 'https://wifaqbd.org',
  },
  {
    slug: 'mutawassitah',
    order: 2,
    nameBn: 'মুতাওয়াসসিতা (নিম্ন মাধ্যমিক)',
    nameEn: 'Mutawassitah (Lower Secondary)',
    nameAr: 'متوسطة',
    durationYears: 3,
    approxAgeStart: 11,
    mainstreamEquivalent: 'Class 6–8',
    coreSubjectsBn: ['আরবি ব্যাকরণ (নাহু-সরফ শুরু)', 'ফারসি', 'তাজবীদ', 'হিফজুল কুরআনের সমান্তরাল ধারা'],
    coreSubjectsEn: ['Arabic grammar (intro Nahw & Sarf)', 'Persian', 'Tajweed', 'Parallel Hifz stream'],
    sourceUrl: 'https://wifaqbd.org',
  },
  {
    slug: 'sanabiya-amma',
    order: 3,
    nameBn: 'সানাবিয়্যা আম্মা (মাধ্যমিক)',
    nameEn: 'Sanabiya Amma (Secondary)',
    nameAr: 'ثانوية عامة',
    durationYears: 2,
    approxAgeStart: 14,
    mainstreamEquivalent: 'Class 9–10 (SSC)',
    coreSubjectsBn: ['নাহু-সরফের অগ্রসর কিতাব', 'উর্দু', 'বালাগাত (মৌলিক)', 'ফিকহ (মৌলিক)', 'সিরাত ও ইতিহাস'],
    coreSubjectsEn: ['Advanced Nahw/Sarf texts', 'Urdu', 'Basic Balaghah', 'Basic Fiqh', 'Seerah & History'],
    sourceUrl: 'https://wifaqbd.org',
  },
  {
    slug: 'sanabiya-khassa',
    order: 4,
    nameBn: 'সানাবিয়্যা খাসসা (উচ্চ মাধ্যমিক)',
    nameEn: 'Sanabiya Khassa (Higher Secondary)',
    nameAr: 'ثانوية خاصة',
    durationYears: 2,
    approxAgeStart: 16,
    mainstreamEquivalent: 'Class 11–12 (HSC)',
    coreSubjectsBn: ['উসূলুশ শাশী', 'কুদূরী (ফিকহ)', 'জালালাইন শরিফের ভূমিকা', 'মুখতাসারুল মাআনী'],
    coreSubjectsEn: ['Usul al-Shashi', 'Al-Quduri (Hanafi Fiqh)', 'Intro to Tafsir al-Jalalayn', 'Mukhtasar al-Ma\'ani (Rhetoric)'],
    sourceUrl: 'https://wifaqbd.org',
  },
  {
    slug: 'fadilah',
    order: 5,
    nameBn: 'ফযিলত (স্নাতক)',
    nameEn: 'Fadilah (Bachelor equivalent)',
    nameAr: 'فضيلة',
    durationYears: 2,
    approxAgeStart: 18,
    mainstreamEquivalent: "Bachelor's (BA / Fazil)",
    coreSubjectsBn: ['হিদায়া (ফিকহ)', 'উসূলুল হাদিস', 'তাফসিরে জালালাইন (সম্পূর্ণ)', 'মিশকাত শরিফ (নির্বাচিত)'],
    coreSubjectsEn: ['Al-Hidayah (Fiqh)', 'Usul al-Hadith', 'Tafsir al-Jalalayn (complete)', 'Mishkat al-Masabih (selected)'],
    sourceUrl: 'https://wifaqbd.org',
  },
  {
    slug: 'dawra-e-hadith',
    order: 6,
    nameBn: 'দাওরায়ে হাদিস / তাকমিল (মাস্টার্স সমমান)',
    nameEn: "Dawra-e-Hadith / Takmil (Master's equivalent)",
    nameAr: 'دورة الحديث / تكميل',
    durationYears: 1,
    approxAgeStart: 20,
    mainstreamEquivalent: "Master's (MA) in Islamic Studies & Arabic — recognised by GoB (2018)",
    coreSubjectsBn: [
      'সহীহ বুখারি (সম্পূর্ণ)',
      'সহীহ মুসলিম (সম্পূর্ণ)',
      'জামে তিরমিজি',
      'সুনানে আবু দাউদ',
      'সুনানে নাসাঈ',
      'সুনানে ইবনে মাজাহ',
      'মুয়াত্তা মালিক ও মুয়াত্তা মুহাম্মদ',
      'শরহু মাআনিল আসার (ত্বহাবি)',
    ],
    coreSubjectsEn: [
      'Sahih al-Bukhari (complete)',
      'Sahih Muslim (complete)',
      'Jami al-Tirmidhi',
      'Sunan Abi Dawud',
      'Sunan al-Nasa\'i',
      'Sunan Ibn Majah',
      'Muwatta of Imam Malik + Muwatta of Imam Muhammad',
      'Sharh Ma\'ani al-Athar (al-Tahawi)',
    ],
    sourceUrl: 'https://en.wikipedia.org/wiki/Al-Haiatul_Ulya_Lil-Jamiatil_Qawmia_Bangladesh',
  },
];

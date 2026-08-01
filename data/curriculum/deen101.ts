/**
 * Deen-101 — 30-day starter journey for the general public.
 *
 * Every lesson carries a `sourceName` + optional `sourceUrl` + `license`.
 * The DB overlay (M14.5) can add more lessons + resources without a deploy.
 *
 * Curated categories:
 *   - Iman & Aqeedah      (days 1–5)
 *   - Salah               (days 6–12)
 *   - Zakat & Fasting     (days 13–18)
 *   - Hajj & Umrah        (days 19–22)
 *   - Family & Manners    (days 23–27)
 *   - Halal Living        (days 28–30)
 */

export type Deen101Category =
  | 'iman-aqeedah'
  | 'salah'
  | 'zakat-fasting'
  | 'hajj-umrah'
  | 'family-manners'
  | 'halal-living';

export interface Deen101Lesson {
  day: number;                 // 1..30
  slug: string;
  category: Deen101Category;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  sourceName: string;
  sourceUrl?: string;
  license: 'CC-BY-4.0' | 'permission-required' | 'public-domain' | 'in-repo';
  xpReward: number;
  durationMin: number;
}

export const DEEN101_LESSONS: Deen101Lesson[] = [
  // --- Iman & Aqeedah ---
  { day: 1, slug: 'shahadah', category: 'iman-aqeedah',
    titleBn: 'কালেমা শাহাদাহ — ইসলামের মূল স্তম্ভ',
    titleEn: 'The Shahadah — The Foundation of Islam',
    summaryBn: 'কালেমা শাহাদাহর অর্থ, শর্ত ও দৈনন্দিন জীবনে এর প্রয়োগ।',
    summaryEn: 'Meaning, conditions and daily application of the shahadah.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 10 },
  { day: 2, slug: 'six-articles-of-faith', category: 'iman-aqeedah',
    titleBn: 'ঈমানের ৬ রুকন',
    titleEn: 'The Six Articles of Iman',
    summaryBn: 'আল্লাহ, ফেরেশতা, কিতাব, রাসূল, আখিরাত ও তাকদীরে বিশ্বাস।',
    summaryEn: 'Belief in Allah, angels, books, messengers, the Last Day, and divine decree.',
    sourceName: 'Sahih Muslim 8', sourceUrl: 'https://sunnah.com/muslim:8',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 3, slug: 'names-of-allah', category: 'iman-aqeedah',
    titleBn: 'আল্লাহর সুন্দর নামসমূহ',
    titleEn: "Allah's Beautiful Names",
    summaryBn: 'আসমাউল হুসনা — ৯৯ নামের সংক্ষিপ্ত পরিচয়।',
    summaryEn: 'A gentle introduction to the 99 names of Allah.',
    sourceName: 'Quran 7:180', sourceUrl: 'https://quran.com/7/180',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 4, slug: 'tawhid', category: 'iman-aqeedah',
    titleBn: 'তাওহীদের ৩ প্রকার',
    titleEn: 'The Three Categories of Tawhid',
    summaryBn: 'তাওহীদুর রুবুবিয়্যাহ, উলূহিয়্যাহ ও আসমা ওয়াস সিফাত।',
    summaryEn: 'Rububiyyah, Uluhiyyah, and Asma wa Sifat categories of monotheism.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 15 },
  { day: 5, slug: 'shirk-and-its-dangers', category: 'iman-aqeedah',
    titleBn: 'শিরক ও এর ভয়াবহতা',
    titleEn: 'Shirk and Its Dangers',
    summaryBn: 'বড় শিরক ও ছোট শিরকের পার্থক্য এবং প্রতিরোধ।',
    summaryEn: 'Distinguishing major and minor shirk, and how to avoid both.',
    sourceName: 'Quran 4:48', sourceUrl: 'https://quran.com/4/48',
    license: 'permission-required', xpReward: 10, durationMin: 15 },

  // --- Salah ---
  { day: 6, slug: 'wudu', category: 'salah',
    titleBn: 'অজু — ধাপে ধাপে',
    titleEn: 'Wudu — Step by Step',
    summaryBn: 'অজুর ফরজ, সুন্নাত ও অজু ভঙ্গের কারণসমূহ।',
    summaryEn: 'The obligatory + sunnah acts of wudu and its nullifiers.',
    sourceName: 'Sahih al-Bukhari 159', sourceUrl: 'https://sunnah.com/bukhari:159',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 7, slug: 'ghusl-and-tayammum', category: 'salah',
    titleBn: 'গোসল ও তায়াম্মুম',
    titleEn: 'Ghusl and Tayammum',
    summaryBn: 'ফরজ গোসলের সঠিক পদ্ধতি ও পানি না পাওয়া গেলে তায়াম্মুম।',
    summaryEn: 'Correct method of ghusl and tayammum when water is unavailable.',
    sourceName: 'Quran 5:6', sourceUrl: 'https://quran.com/5/6',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 8, slug: 'salah-preparation', category: 'salah',
    titleBn: 'সালাতের প্রস্তুতি ও শর্ত',
    titleEn: 'Preparation & Conditions of Salah',
    summaryBn: 'সালাতের পূর্বশর্ত: পবিত্রতা, পোশাক, স্থান, সময় ও কিবলা।',
    summaryEn: 'Preconditions: purity, dress, place, time, and qiblah.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 15 },
  { day: 9, slug: 'salah-steps', category: 'salah',
    titleBn: 'সালাতের ধাপসমূহ',
    titleEn: 'The Steps of Salah',
    summaryBn: 'তাকবীর থেকে সালাম পর্যন্ত প্রতিটি রুকন ও দোয়া।',
    summaryEn: 'Every pillar and du\'a from opening takbir to final salam.',
    sourceName: 'Sahih al-Bukhari 793', sourceUrl: 'https://sunnah.com/bukhari:793',
    license: 'permission-required', xpReward: 10, durationMin: 25 },
  { day: 10, slug: 'five-daily-prayers', category: 'salah',
    titleBn: '৫ ওয়াক্ত সালাত',
    titleEn: 'The Five Daily Prayers',
    summaryBn: 'ফজর, যোহর, আসর, মাগরিব ও ইশা — রাকাত সংখ্যা ও সময়সূচি।',
    summaryEn: 'Fajr, Dhuhr, Asr, Maghrib, Isha — rak\'ah counts and windows.',
    sourceName: 'Sahih Muslim 611', sourceUrl: 'https://sunnah.com/muslim:611',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 11, slug: 'jumuah', category: 'salah',
    titleBn: 'জুমার নামাজ',
    titleEn: 'The Friday (Jumu\'ah) Prayer',
    summaryBn: 'জুমার গুরুত্ব, শর্ত ও আদব।',
    summaryEn: 'The importance, conditions, and etiquette of Jumu\'ah.',
    sourceName: 'Quran 62:9', sourceUrl: 'https://quran.com/62/9',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 12, slug: 'sunnah-and-witr', category: 'salah',
    titleBn: 'সুন্নাত ও বিতর নামাজ',
    titleEn: 'Sunnah and Witr Prayers',
    summaryBn: 'দৈনিক সুন্নাতে মুয়াক্কাদা এবং বিতর নামাজের পদ্ধতি।',
    summaryEn: 'Daily Sunnah Mu\'akkadah and the method of the Witr prayer.',
    sourceName: 'Sahih al-Bukhari 1163', sourceUrl: 'https://sunnah.com/bukhari:1163',
    license: 'permission-required', xpReward: 10, durationMin: 15 },

  // --- Zakat & Fasting ---
  { day: 13, slug: 'zakat-basics', category: 'zakat-fasting',
    titleBn: 'জাকাত — মূল ধারণা',
    titleEn: 'Zakat — Core Concepts',
    summaryBn: 'জাকাতের নিসাব, শতকরা হার ও উপযুক্ত খাত।',
    summaryEn: 'Nisab threshold, 2.5% rate, and eligible recipients.',
    sourceName: 'Quran 9:60', sourceUrl: 'https://quran.com/9/60',
    license: 'permission-required', xpReward: 10, durationMin: 20 },
  { day: 14, slug: 'zakat-calculation', category: 'zakat-fasting',
    titleBn: 'জাকাতের হিসাব',
    titleEn: 'Calculating Your Zakat',
    summaryBn: 'নগদ, স্বর্ণ, রূপা ও বিনিয়োগের ওপর জাকাত হিসাব।',
    summaryEn: 'Zakat calculation on cash, gold, silver, and investments.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 20 },
  { day: 15, slug: 'sadaqah-vs-zakat', category: 'zakat-fasting',
    titleBn: 'সাদাকা ও জাকাতের পার্থক্য',
    titleEn: 'Sadaqah vs Zakat',
    summaryBn: 'ঐচ্ছিক দান বনাম বাধ্যতামূলক দান।',
    summaryEn: 'Voluntary vs obligatory giving in Islam.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 10 },
  { day: 16, slug: 'ramadan-fasting', category: 'zakat-fasting',
    titleBn: 'রমজানের রোজা',
    titleEn: 'Fasting in Ramadan',
    summaryBn: 'সেহরি, ইফতার, নিয়ত ও রোজা ভঙ্গের কারণসমূহ।',
    summaryEn: 'Sehri, iftar, niyyah, and things that break the fast.',
    sourceName: 'Quran 2:183-185', sourceUrl: 'https://quran.com/2/183-185',
    license: 'permission-required', xpReward: 10, durationMin: 20 },
  { day: 17, slug: 'taraweeh-and-tahajjud', category: 'zakat-fasting',
    titleBn: 'তারাবীহ ও তাহাজ্জুদ',
    titleEn: 'Taraweeh and Tahajjud',
    summaryBn: 'রমজানের নফল কিয়ামুল লাইলের ফযিলত।',
    summaryEn: 'The virtues of the night prayers, especially in Ramadan.',
    sourceName: 'Sahih al-Bukhari 2009', sourceUrl: 'https://sunnah.com/bukhari:2009',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 18, slug: 'laylatul-qadr', category: 'zakat-fasting',
    titleBn: 'লাইলাতুল কদর',
    titleEn: "Laylatul Qadr — The Night of Power",
    summaryBn: 'হাজার মাসের চেয়ে উত্তম রাত — খোঁজ ও দোয়া।',
    summaryEn: 'Better than a thousand months — how to seek it and what to pray.',
    sourceName: 'Quran 97', sourceUrl: 'https://quran.com/97',
    license: 'permission-required', xpReward: 10, durationMin: 15 },

  // --- Hajj & Umrah ---
  { day: 19, slug: 'hajj-obligation', category: 'hajj-umrah',
    titleBn: 'হজের ফরজিয়্যাত',
    titleEn: 'The Obligation of Hajj',
    summaryBn: 'হজ কার উপর ফরজ, কখন ও কীভাবে।',
    summaryEn: 'Who must perform Hajj, when, and how.',
    sourceName: 'Quran 3:97', sourceUrl: 'https://quran.com/3/97',
    license: 'permission-required', xpReward: 10, durationMin: 20 },
  { day: 20, slug: 'hajj-steps', category: 'hajj-umrah',
    titleBn: 'হজের ধাপসমূহ',
    titleEn: 'The Steps of Hajj',
    summaryBn: 'ইহরাম, তালবিয়া, তাওয়াফ, সাঈ, আরাফাত ও কুরবানি।',
    summaryEn: 'Ihram, talbiyah, tawaf, sa\'i, Arafat, and qurbani.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 25 },
  { day: 21, slug: 'umrah', category: 'hajj-umrah',
    titleBn: 'উমরাহ',
    titleEn: 'Umrah',
    summaryBn: 'উমরাহর ধাপ ও প্রস্তুতি।',
    summaryEn: 'Umrah steps and preparation.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 15 },
  { day: 22, slug: 'visiting-madinah', category: 'hajj-umrah',
    titleBn: 'মদীনা যিয়ারাত',
    titleEn: 'Visiting Madinah',
    summaryBn: 'মসজিদে নববী ও রাসূল ﷺ-এর রওজা যিয়ারতের আদব।',
    summaryEn: 'Etiquette of visiting Masjid an-Nabawi and the Prophet\'s ﷺ resting place.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 15 },

  // --- Family & Manners ---
  { day: 23, slug: 'rights-of-parents', category: 'family-manners',
    titleBn: 'পিতা-মাতার হক',
    titleEn: 'Rights of Parents',
    summaryBn: 'কুরআন-সুন্নাহর আলোকে পিতা-মাতার সেবা।',
    summaryEn: 'Serving parents in light of Quran and Sunnah.',
    sourceName: 'Quran 17:23-24', sourceUrl: 'https://quran.com/17/23-24',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 24, slug: 'rights-of-spouse', category: 'family-manners',
    titleBn: 'স্বামী-স্ত্রীর অধিকার',
    titleEn: 'Rights of Spouses',
    summaryBn: 'পারস্পরিক দায়িত্ব ও ভালোবাসা।',
    summaryEn: 'Mutual duties and love between spouses.',
    sourceName: 'Quran 30:21', sourceUrl: 'https://quran.com/30/21',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 25, slug: 'neighbors-and-community', category: 'family-manners',
    titleBn: 'প্রতিবেশীর হক',
    titleEn: 'Rights of Neighbors',
    summaryBn: 'রাসূল ﷺ-এর নির্দেশনায় প্রতিবেশীর অধিকার।',
    summaryEn: 'The Prophet\'s ﷺ teachings on neighborly rights.',
    sourceName: 'Sahih al-Bukhari 6014', sourceUrl: 'https://sunnah.com/bukhari:6014',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 26, slug: 'islamic-etiquette', category: 'family-manners',
    titleBn: 'ইসলামী আদব',
    titleEn: 'Islamic Etiquette',
    summaryBn: 'সালাম, খাবার, ঘুম ও কথাবার্তার সুন্নাহ।',
    summaryEn: 'Sunnah of greetings, meals, sleep, and speech.',
    sourceName: 'In-repo', license: 'in-repo', xpReward: 10, durationMin: 15 },
  { day: 27, slug: 'anger-and-patience', category: 'family-manners',
    titleBn: 'ক্রোধ ও ধৈর্য',
    titleEn: 'Anger and Patience',
    summaryBn: 'রাগ নিয়ন্ত্রণ ও সবরের গুরুত্ব।',
    summaryEn: 'Controlling anger and the importance of patience.',
    sourceName: 'Sahih al-Bukhari 6114', sourceUrl: 'https://sunnah.com/bukhari:6114',
    license: 'permission-required', xpReward: 10, durationMin: 15 },

  // --- Halal Living ---
  { day: 28, slug: 'halal-and-haram-food', category: 'halal-living',
    titleBn: 'হালাল ও হারাম খাদ্য',
    titleEn: 'Halal and Haram Foods',
    summaryBn: 'অনুমোদিত ও নিষিদ্ধ খাদ্যের সংক্ষিপ্ত তালিকা।',
    summaryEn: 'Quick reference for permitted and forbidden foods.',
    sourceName: 'Quran 5:3', sourceUrl: 'https://quran.com/5/3',
    license: 'permission-required', xpReward: 10, durationMin: 15 },
  { day: 29, slug: 'islamic-finance', category: 'halal-living',
    titleBn: 'ইসলামী অর্থনীতি — সুদ ও হালাল আয়',
    titleEn: 'Islamic Finance — Riba & Halal Income',
    summaryBn: 'সুদের ভয়াবহতা ও হালাল উপার্জনের গুরুত্ব।',
    summaryEn: 'The gravity of riba and the importance of halal earnings.',
    sourceName: 'Quran 2:275-278', sourceUrl: 'https://quran.com/2/275-278',
    license: 'permission-required', xpReward: 10, durationMin: 20 },
  { day: 30, slug: 'life-purpose-and-akhirah', category: 'halal-living',
    titleBn: 'জীবনের উদ্দেশ্য ও আখিরাত',
    titleEn: 'Life Purpose and the Hereafter',
    summaryBn: 'দুনিয়ার সাময়িকতা ও আখিরাতের প্রস্তুতি — যাত্রার সমাপ্তি।',
    summaryEn: 'The transience of dunya and preparation for the akhirah — journey\'s end.',
    sourceName: 'Quran 51:56', sourceUrl: 'https://quran.com/51/56',
    license: 'permission-required', xpReward: 15, durationMin: 20 },
];

export const DEEN101_TOTAL_XP = DEEN101_LESSONS.reduce((s, l) => s + l.xpReward, 0);

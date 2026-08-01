/**
 * Structured Seerah timeline dataset.
 *
 * Each event is typed and carries at least one citation with a link back
 * to a canonical online source (Sunnah.com, Quran.com, or an open-access
 * Seerah text). The dataset intentionally uses shipped-in-repo data so the
 * app works offline; admin overrides live in the `seerah_events` DB table.
 *
 * Primary sources:
 *   - Ar-Raheeq al-Makhtum (Safi ur-Rahman Mubarakpuri, permissively licensed)
 *     https://sunnah.org/sirat/ar-raheeq-al-makhtum/
 *   - Sirah Ibn Hisham (open-access edition)
 *   - Sahih al-Bukhari / Sahih Muslim citations via https://sunnah.com
 *   - Quran citations via https://quran.com
 *
 * Please keep events in strict chronological order.
 */

export type SeerahCategory =
  | 'pre-prophethood'
  | 'revelation'
  | 'makkah-era'
  | 'migration'
  | 'madinah-era'
  | 'battles'
  | 'family'
  | 'treaty'
  | 'wafat';

export interface Citation {
  reference: string;   // e.g. "Sahih al-Bukhari 3820"
  url?: string;        // Deep link to sunnah.com / quran.com / open Seerah text
  note?: string;
}

export interface SeerahEvent {
  id: string;
  order: number;                    // stable sort key
  gregorianYear: string;            // e.g. "570 CE" or "622 CE"
  hijriYear?: string;               // e.g. "1 AH"
  approxAge?: number;               // Prophet's ﷺ age at event
  titleBn: string;
  titleEn: string;
  titleAr?: string;
  location?: string;
  category: SeerahCategory;
  importance: 'high' | 'medium';
  descriptionBn: string;
  descriptionEn: string;
  citations: Citation[];
}

/**
 * NOTE: This is a curated seed of the most-taught events. The DB overlay
 * (M14.3 admin panel) can add more without a code deploy.
 */
export const SEERAH_EVENTS: SeerahEvent[] = [
  {
    id: 'birth-570',
    order: 10,
    gregorianYear: '570 CE',
    approxAge: 0,
    titleBn: 'পবিত্র জন্ম (আমুল ফীল)',
    titleEn: 'Blessed Birth — The Year of the Elephant',
    titleAr: 'الميلاد الشريف — عام الفيل',
    location: 'Makkah',
    category: 'pre-prophethood',
    importance: 'high',
    descriptionBn:
      'মক্কা নগরীতে কুরাইশ বংশের বনু হাশিম গোত্রে রাসূলুল্লাহ ﷺ-এর শুভ জন্ম। আবরাহার হস্তীবাহিনী কাবা ধ্বংসের চেষ্টা করে ব্যর্থ হওয়ার বছর হওয়ায় এই বছরকে "আমুল ফীল" বলা হয়।',
    descriptionEn:
      "Birth of the Messenger of Allah ﷺ in Makkah into the Banu Hashim clan of Quraysh. Called the 'Year of the Elephant' after Abraha's failed attempt to destroy the Ka'bah with an army of elephants.",
    citations: [
      { reference: 'Sirah Ibn Hisham 1/158', note: 'Classical Seerah account' },
      { reference: "Ar-Raheeq al-Makhtum, p. 42", url: 'https://sunnah.org/sirat/ar-raheeq-al-makhtum/' },
      { reference: 'Quran 105:1-5 (Al-Fil)', url: 'https://quran.com/105' },
    ],
  },
  {
    id: 'khadija-marriage-595',
    order: 20,
    gregorianYear: '595 CE',
    approxAge: 25,
    titleBn: 'খাদিজা (রা.)-এর সাথে বিবাহ',
    titleEn: 'Marriage to Khadijah (RA)',
    titleAr: 'الزواج من خديجة رضي الله عنها',
    location: 'Makkah',
    category: 'family',
    importance: 'high',
    descriptionBn:
      '২৫ বছর বয়সে মক্কার সম্মানিত ব্যবসায়ী নারী খাদিজাতুল কুবরা (রা.)-এর সাথে বিবাহ বন্ধনে আবদ্ধ হন।',
    descriptionEn:
      "At age 25 the Prophet ﷺ married Khadijah bint Khuwaylid (RA), a respected merchant of Makkah — a marriage marked by profound love and support that lasted 25 years.",
    citations: [
      { reference: 'Sahih al-Bukhari 3820', url: 'https://sunnah.com/bukhari:3820' },
      { reference: 'Sirah Ibn Hisham 1/189' },
    ],
  },
  {
    id: 'first-revelation-610',
    order: 30,
    gregorianYear: '610 CE',
    approxAge: 40,
    titleBn: 'নবুওয়াত লাভ ও প্রথম ওহী',
    titleEn: 'First Revelation — Iqra',
    titleAr: 'بداية الوحي — اقرأ',
    location: 'Cave Hira, Makkah',
    category: 'revelation',
    importance: 'high',
    descriptionBn:
      '৪০ বছর বয়সে হেরা গুহায় জিবরাইল (আ.)-এর মাধ্যমে সূরা আলাকের প্রথম ৫টি আয়াত নাযিল হওয়ার মাধ্যমে নবুওয়াত লাভ। এখান থেকেই ইসলামের বার্তা শুরু হয়।',
    descriptionEn:
      "At age 40 in the cave of Hira the Angel Jibril (AS) revealed the first five verses of Surah al-'Alaq — the beginning of the final revelation to humanity.",
    citations: [
      { reference: 'Quran 96:1-5 (Al-Alaq)', url: 'https://quran.com/96/1-5' },
      { reference: 'Sahih al-Bukhari 3', url: 'https://sunnah.com/bukhari:3' },
    ],
  },
  {
    id: 'secret-dawah-610',
    order: 40,
    gregorianYear: '610–613 CE',
    approxAge: 40,
    titleBn: 'গোপন দাওয়াতের ৩ বছর',
    titleEn: 'Three Years of Secret Preaching',
    location: 'Makkah',
    category: 'makkah-era',
    importance: 'medium',
    descriptionBn:
      'প্রাথমিক ৩ বছর রাসূল ﷺ ঘনিষ্ঠ পরিবার ও বন্ধুদের কাছে গোপনে ইসলামের দাওয়াত দেন। এই সময়ে খাদিজা (রা.), আবু বকর (রা.), আলী (রা.) ও যায়েদ (রা.) ইসলাম গ্রহণ করেন।',
    descriptionEn:
      'For the first three years the Prophet ﷺ preached privately to close family and trusted friends. Early converts include Khadijah, Abu Bakr, Ali, and Zayd (may Allah be pleased with them all).',
    citations: [
      { reference: 'Ar-Raheeq al-Makhtum, ch. "Secret Da\'wah"', url: 'https://sunnah.org/sirat/ar-raheeq-al-makhtum/' },
    ],
  },
  {
    id: 'public-dawah-613',
    order: 50,
    gregorianYear: '613 CE',
    approxAge: 43,
    titleBn: 'প্রকাশ্য দাওয়াতের শুরু',
    titleEn: 'Beginning of Public Preaching',
    location: 'Makkah',
    category: 'makkah-era',
    importance: 'high',
    descriptionBn:
      'সূরা হিজরের আয়াত অবতীর্ণ হওয়ার পর রাসূল ﷺ সাফা পাহাড়ে দাঁড়িয়ে প্রকাশ্যে ইসলামের দাওয়াত দেন। এখান থেকেই কুরাইশের চরম বিরোধিতা শুরু হয়।',
    descriptionEn:
      'After the command in Surah al-Hijr (15:94), the Prophet ﷺ ascended Mount Safa and openly proclaimed the message to Quraysh — triggering years of persecution.',
    citations: [
      { reference: 'Quran 15:94', url: 'https://quran.com/15/94' },
      { reference: 'Sahih al-Bukhari 4770', url: 'https://sunnah.com/bukhari:4770' },
    ],
  },
  {
    id: 'first-hijrah-abyssinia-615',
    order: 60,
    gregorianYear: '615 CE',
    approxAge: 45,
    titleBn: 'হাবশায় প্রথম হিজরত',
    titleEn: 'First Migration to Abyssinia',
    location: 'Aksum, Abyssinia',
    category: 'migration',
    importance: 'high',
    descriptionBn:
      'কুরাইশের নির্যাতনে অতিষ্ঠ হয়ে ১৫ জন সাহাবীর একটি দল হাবশার (বর্তমান ইথিওপিয়া) ন্যায়পরায়ণ খ্রিস্টান বাদশাহ নাজাশীর কাছে হিজরত করেন।',
    descriptionEn:
      "A first group of ~15 companions migrated to Abyssinia seeking refuge with the just Christian king Najashi — the first hijrah in Islam.",
    citations: [
      { reference: 'Sirah Ibn Hisham 1/321' },
      { reference: 'Musnad Ahmad 1740' },
    ],
  },
  {
    id: 'shib-abi-talib-617',
    order: 70,
    gregorianYear: '617–619 CE',
    approxAge: 47,
    titleBn: 'শি\'ইবে আবি তালিবে সামাজিক বয়কট',
    titleEn: 'Social Boycott in the Valley of Abu Talib',
    location: 'Makkah',
    category: 'makkah-era',
    importance: 'high',
    descriptionBn:
      'কুরাইশ বনু হাশিম ও বনু মুত্তালিব গোত্রের সাথে সামাজিক ও অর্থনৈতিক বয়কট আরোপ করে যা প্রায় ৩ বছর স্থায়ী হয়।',
    descriptionEn:
      "Quraysh imposed a full social and economic boycott on Banu Hashim and Banu al-Muttalib in the valley of Abu Talib — enduring ~3 years of severe deprivation.",
    citations: [
      { reference: "Ar-Raheeq al-Makhtum, ch. 'The Boycott'", url: 'https://sunnah.org/sirat/ar-raheeq-al-makhtum/' },
    ],
  },
  {
    id: 'year-of-sorrow-619',
    order: 80,
    gregorianYear: '619 CE',
    approxAge: 49,
    titleBn: 'আমুল হুযন — শোকের বছর',
    titleEn: 'Aam al-Huzn — The Year of Sorrow',
    location: 'Makkah',
    category: 'family',
    importance: 'high',
    descriptionBn:
      'একই বছরে চাচা আবু তালিব এবং প্রিয় সহধর্মিণী খাদিজা (রা.)-এর ইন্তিকাল হয়। এই দুই সহায় হারিয়ে রাসূল ﷺ গভীরভাবে ব্যথিত হন।',
    descriptionEn:
      'The year the Prophet ﷺ lost both his uncle Abu Talib and his beloved wife Khadijah (RA) — a devastating loss known as the "Year of Sorrow."',
    citations: [
      { reference: 'Sahih al-Bukhari 3896', url: 'https://sunnah.com/bukhari:3896' },
    ],
  },
  {
    id: 'isra-miraj-620',
    order: 90,
    gregorianYear: '620 CE',
    approxAge: 50,
    titleBn: 'ইসরা ও মিরাজ',
    titleEn: "Al-Isra' wal-Mi'raj — Night Journey & Ascension",
    titleAr: 'الإسراء والمعراج',
    location: 'Makkah → Bayt al-Maqdis → Heavens',
    category: 'revelation',
    importance: 'high',
    descriptionBn:
      'মক্কা থেকে বায়তুল মুকাদ্দাস পর্যন্ত রাতের সফর, তারপর সাত আকাশের ঊর্ধ্বলোকে ভ্রমণ। এই সফরেই দৈনিক ৫ ওয়াক্ত সালাত ফরজ হয়।',
    descriptionEn:
      "The miraculous night journey from Makkah to Bayt al-Maqdis and ascension through the seven heavens — during which the five daily prayers were made obligatory.",
    citations: [
      { reference: 'Quran 17:1 (Al-Isra)', url: 'https://quran.com/17/1' },
      { reference: 'Sahih al-Bukhari 3887', url: 'https://sunnah.com/bukhari:3887' },
    ],
  },
  {
    id: 'pledges-of-aqabah-621',
    order: 100,
    gregorianYear: '621–622 CE',
    approxAge: 51,
    titleBn: 'বাইআতে আকাবা',
    titleEn: 'Pledges of Aqabah',
    location: 'Mina, near Makkah',
    category: 'treaty',
    importance: 'high',
    descriptionBn:
      'মদীনার আউস ও খাযরাজ গোত্রের ৭৩ জন সদস্য দুই ধাপে রাসূল ﷺ-এর কাছে ইসলামের বায়আত গ্রহণ করেন — যা হিজরতের পথ প্রশস্ত করে।',
    descriptionEn:
      'Members of Aws and Khazraj from Yathrib (Madinah) pledged allegiance in two stages, laying the ground for the coming Hijrah.',
    citations: [
      { reference: 'Sirah Ibn Hisham 2/73' },
    ],
  },
  {
    id: 'hijrah-madinah-622',
    order: 110,
    gregorianYear: '622 CE',
    hijriYear: '1 AH',
    approxAge: 53,
    titleBn: 'মদীনায় হিজরত',
    titleEn: 'The Hijrah to Madinah',
    titleAr: 'الهجرة إلى المدينة',
    location: 'Makkah → Madinah',
    category: 'migration',
    importance: 'high',
    descriptionBn:
      'রাসূল ﷺ এবং আবু বকর (রা.) সাওরের গুহায় ৩ দিন লুকিয়ে থাকার পর মদীনার উদ্দেশে যাত্রা করেন। এই সফর থেকেই ইসলামি হিজরি সন গণনা শুরু হয়।',
    descriptionEn:
      "The Prophet ﷺ and Abu Bakr (RA) migrated from Makkah to Madinah after three days hiding in the cave of Thawr. The Islamic Hijri calendar begins from this event.",
    citations: [
      { reference: 'Quran 9:40 (At-Tawbah)', url: 'https://quran.com/9/40' },
      { reference: 'Sahih al-Bukhari 3905', url: 'https://sunnah.com/bukhari:3905' },
    ],
  },
  {
    id: 'masjid-nabawi-622',
    order: 120,
    gregorianYear: '622 CE',
    hijriYear: '1 AH',
    approxAge: 53,
    titleBn: 'মসজিদে নববী নির্মাণ',
    titleEn: "Construction of Masjid an-Nabawi",
    location: 'Madinah',
    category: 'madinah-era',
    importance: 'medium',
    descriptionBn:
      'মদীনায় পৌঁছে রাসূল ﷺ প্রথম যে কাজটি করেন তা হলো মসজিদে নববী নির্মাণ — যা মুসলিম উম্মাহর কেন্দ্রীয় প্রতিষ্ঠান হয়ে ওঠে।',
    descriptionEn:
      "On arrival in Madinah the Prophet ﷺ personally participated in building Masjid an-Nabawi — the central institution of the Muslim community.",
    citations: [
      { reference: 'Sahih al-Bukhari 428', url: 'https://sunnah.com/bukhari:428' },
    ],
  },
  {
    id: 'brotherhood-muhajir-ansar',
    order: 130,
    gregorianYear: '622 CE',
    hijriYear: '1 AH',
    approxAge: 53,
    titleBn: 'মুহাজির-আনসার ভ্রাতৃত্ব',
    titleEn: 'Brotherhood between Muhajirin and Ansar',
    location: 'Madinah',
    category: 'madinah-era',
    importance: 'high',
    descriptionBn:
      'রাসূল ﷺ মক্কার মুহাজির ও মদীনার আনসারদের মধ্যে ব্যক্তিগত ভ্রাতৃত্ব স্থাপন করে দেন — সামাজিক বন্ধনে সহায়তার এক অনন্য নজির।',
    descriptionEn:
      'The Prophet ﷺ paired each Muhajir with an Ansari as brothers — creating unprecedented bonds of mutual support and shared wealth.',
    citations: [
      { reference: 'Sahih al-Bukhari 3937', url: 'https://sunnah.com/bukhari:3937' },
    ],
  },
  {
    id: 'sahifat-al-madinah-622',
    order: 140,
    gregorianYear: '622 CE',
    hijriYear: '1 AH',
    approxAge: 53,
    titleBn: 'মদীনার সনদ',
    titleEn: 'Constitution of Madinah',
    location: 'Madinah',
    category: 'treaty',
    importance: 'high',
    descriptionBn:
      'মুসলিম, ইহুদি ও অন্যান্য গোত্রের সাথে চুক্তি স্বাক্ষরিত হয় — বহু-ধর্মীয় সমাজে ন্যায়বিচার ও পারস্পরিক সহাবস্থানের এক আদর্শ ঘোষণা।',
    descriptionEn:
      'A written charter uniting Muslims, Jews, and other tribes under mutual defense and pluralistic governance — one of history\'s earliest constitutional documents.',
    citations: [
      { reference: 'Sirah Ibn Hisham 2/147' },
    ],
  },
  {
    id: 'badr-624',
    order: 150,
    gregorianYear: '624 CE',
    hijriYear: '2 AH',
    approxAge: 54,
    titleBn: 'বদর যুদ্ধ',
    titleEn: 'Battle of Badr',
    titleAr: 'غزوة بدر',
    location: 'Badr, west of Madinah',
    category: 'battles',
    importance: 'high',
    descriptionBn:
      '৩১৩ মুসলিম সৈন্য ১,০০০ কুরাইশের বিরুদ্ধে ঐতিহাসিক বিজয় লাভ করেন। কুরআনে এই যুদ্ধকে "ইয়ামুল ফুরকান" — সত্য-মিথ্যা পার্থক্যের দিন বলা হয়েছে।',
    descriptionEn:
      "313 Muslims decisively defeated ~1,000 Quraysh at Badr — called in the Quran 'Yawm al-Furqan' (the Day of Distinction).",
    citations: [
      { reference: 'Quran 8:41 (Al-Anfal)', url: 'https://quran.com/8/41' },
      { reference: 'Sahih al-Bukhari 3951', url: 'https://sunnah.com/bukhari:3951' },
    ],
  },
  {
    id: 'uhud-625',
    order: 160,
    gregorianYear: '625 CE',
    hijriYear: '3 AH',
    approxAge: 55,
    titleBn: 'উহুদ যুদ্ধ',
    titleEn: 'Battle of Uhud',
    location: 'Mount Uhud, Madinah',
    category: 'battles',
    importance: 'high',
    descriptionBn:
      'কুরাইশের প্রতিশোধ যুদ্ধ। মুসলিমরা প্রাথমিক বিজয়ের পর তীরন্দাজদের অবস্থান ছেড়ে দিলে পাল্টা আক্রমণে ৭০ জন সাহাবী শহীদ হন — এর মধ্যে হামযা (রা.)।',
    descriptionEn:
      "Quraysh retaliated at Uhud. An initial Muslim victory turned when archers left their post; 70 companions, including Hamzah (RA), were martyred.",
    citations: [
      { reference: 'Quran 3:152 (Aal Imran)', url: 'https://quran.com/3/152' },
      { reference: 'Sahih al-Bukhari 4043', url: 'https://sunnah.com/bukhari:4043' },
    ],
  },
  {
    id: 'khandaq-627',
    order: 170,
    gregorianYear: '627 CE',
    hijriYear: '5 AH',
    approxAge: 57,
    titleBn: 'খন্দক (আহযাব) যুদ্ধ',
    titleEn: 'Battle of the Trench (al-Khandaq)',
    location: 'Madinah',
    category: 'battles',
    importance: 'high',
    descriptionBn:
      '১০,০০০ সৈন্যের সম্মিলিত কনফেডারেশনের বিরুদ্ধে সালমান ফারসী (রা.)-এর পরামর্শে মদীনার চারপাশে খন্দক (পরিখা) খনন করে প্রতিরক্ষা।',
    descriptionEn:
      "Against a 10,000-strong confederate army the Muslims dug a defensive trench (khandaq) on the advice of Salman al-Farisi (RA) — foiling the siege.",
    citations: [
      { reference: 'Quran 33:9-27 (Al-Ahzab)', url: 'https://quran.com/33/9-27' },
    ],
  },
  {
    id: 'hudaybiyyah-628',
    order: 180,
    gregorianYear: '628 CE',
    hijriYear: '6 AH',
    approxAge: 58,
    titleBn: 'হুদাইবিয়ার সন্ধি',
    titleEn: 'Treaty of Hudaybiyyah',
    location: 'Hudaybiyyah, near Makkah',
    category: 'treaty',
    importance: 'high',
    descriptionBn:
      'আপাত অসম শর্তের সন্ধি হলেও এটি ইসলামের প্রসারের এক বিশাল দ্বার খুলে দেয়। কুরআনে একে "ফাতহুন মুবীন" — সুস্পষ্ট বিজয় বলা হয়েছে।',
    descriptionEn:
      "A seemingly disadvantageous treaty that in fact paved the way for the greatest expansion of Islam — described in the Quran as a 'clear victory'.",
    citations: [
      { reference: 'Quran 48:1 (Al-Fath)', url: 'https://quran.com/48/1' },
      { reference: 'Sahih al-Bukhari 2731', url: 'https://sunnah.com/bukhari:2731' },
    ],
  },
  {
    id: 'khaybar-628',
    order: 190,
    gregorianYear: '628 CE',
    hijriYear: '7 AH',
    approxAge: 58,
    titleBn: 'খায়বার বিজয়',
    titleEn: 'Conquest of Khaybar',
    location: 'Khaybar, north of Madinah',
    category: 'battles',
    importance: 'medium',
    descriptionBn:
      'খায়বারের সুরক্ষিত ইহুদি দুর্গসমূহ জয় করা হয়। আলী (রা.)-এর নেতৃত্বে কামুস দুর্গ বিজয় সবচেয়ে বিখ্যাত।',
    descriptionEn:
      'The strongholds of Khaybar were opened — most famously Fort al-Qamus under the command of Ali (RA).',
    citations: [
      { reference: 'Sahih al-Bukhari 4210', url: 'https://sunnah.com/bukhari:4210' },
    ],
  },
  {
    id: 'letters-to-kings-628',
    order: 200,
    gregorianYear: '628 CE',
    hijriYear: '7 AH',
    approxAge: 58,
    titleBn: 'সম্রাটদের নিকট আহ্বান পত্র',
    titleEn: 'Letters to World Emperors',
    location: 'From Madinah',
    category: 'madinah-era',
    importance: 'medium',
    descriptionBn:
      'রাসূল ﷺ রোম সম্রাট হিরাক্লিয়াস, পারস্য সম্রাট খসরু, মিশরের মুকাউকিস, আবিসিনিয়ার নাজাশী প্রমুখের কাছে ইসলাম গ্রহণের আহ্বান জানিয়ে চিঠি পাঠান।',
    descriptionEn:
      'The Prophet ﷺ sent letters to Heraclius (Byzantium), Khosrow (Persia), Muqawqis (Egypt), Najashi (Abyssinia) and others inviting them to Islam.',
    citations: [
      { reference: 'Sahih al-Bukhari 7', url: 'https://sunnah.com/bukhari:7' },
    ],
  },
  {
    id: 'fath-makkah-630',
    order: 210,
    gregorianYear: '630 CE',
    hijriYear: '8 AH',
    approxAge: 60,
    titleBn: 'মক্কা বিজয় (ফাতহে মক্কা)',
    titleEn: 'Conquest of Makkah',
    titleAr: 'فتح مكة',
    location: 'Makkah',
    category: 'battles',
    importance: 'high',
    descriptionBn:
      '১০,০০০ সাহাবী সহ প্রায় রক্তপাতহীন মক্কা বিজয়। কাবা থেকে ৩৬০টি মূর্তি অপসারণ করা হয় ও সাধারণ ক্ষমা ঘোষণা করা হয়।',
    descriptionEn:
      "The near-bloodless conquest of Makkah with 10,000 companions. The Ka'bah was cleansed of 360 idols and a general amnesty was proclaimed.",
    citations: [
      { reference: 'Quran 110 (An-Nasr)', url: 'https://quran.com/110' },
      { reference: 'Sahih al-Bukhari 4280', url: 'https://sunnah.com/bukhari:4280' },
    ],
  },
  {
    id: 'hunayn-630',
    order: 220,
    gregorianYear: '630 CE',
    hijriYear: '8 AH',
    approxAge: 60,
    titleBn: 'হুনাইন যুদ্ধ',
    titleEn: 'Battle of Hunayn',
    location: 'Hunayn valley near Ta\'if',
    category: 'battles',
    importance: 'medium',
    descriptionBn:
      'মক্কা বিজয়ের পরপরই হাওয়াযিন গোত্রের সাথে সংঘটিত যুদ্ধ। প্রাথমিক বিভ্রান্তির পরও মুসলিমরা বিজয় লাভ করেন।',
    descriptionEn:
      "Shortly after Makkah, the Prophet ﷺ led Muslims against Hawazin at Hunayn — initial confusion gave way to a decisive Muslim victory.",
    citations: [
      { reference: 'Quran 9:25-27 (At-Tawbah)', url: 'https://quran.com/9/25-27' },
    ],
  },
  {
    id: 'tabuk-630',
    order: 230,
    gregorianYear: '630 CE',
    hijriYear: '9 AH',
    approxAge: 60,
    titleBn: 'তাবুক অভিযান',
    titleEn: 'Expedition of Tabuk',
    location: 'Tabuk (northern Arabia)',
    category: 'battles',
    importance: 'medium',
    descriptionBn:
      'সম্ভাব্য রোমান আক্রমণের বিরুদ্ধে ৩০,০০০ সৈন্যের বাহিনী নিয়ে তাবুকে অগ্রসর — কোনো যুদ্ধ ছাড়াই সেনাদের ফেরত পাঠানো হয়।',
    descriptionEn:
      "The Prophet ﷺ led 30,000 soldiers toward the Byzantine frontier at Tabuk in the height of summer; no battle occurred but the expedition consolidated Muslim strength.",
    citations: [
      { reference: 'Quran 9:117-118 (At-Tawbah)', url: 'https://quran.com/9/117-118' },
    ],
  },
  {
    id: 'year-of-delegations-630',
    order: 240,
    gregorianYear: '630–631 CE',
    hijriYear: '9 AH',
    approxAge: 60,
    titleBn: 'ওফূদের বছর — আরবের গোত্রসমূহের প্রতিনিধিদল',
    titleEn: 'Year of Delegations',
    location: 'Madinah',
    category: 'madinah-era',
    importance: 'medium',
    descriptionBn:
      'আরবের বিভিন্ন গোত্র মদীনায় প্রতিনিধিদল পাঠিয়ে ইসলাম গ্রহণ করে। ৯ম হিজরিতে ইসলাম আরব উপদ্বীপ জুড়ে ছড়িয়ে পড়ে।',
    descriptionEn:
      "Tribal delegations flocked to Madinah accepting Islam; by 9 AH Islam had spread across the Arabian peninsula.",
    citations: [
      { reference: 'Sirah Ibn Hisham 4/205' },
    ],
  },
  {
    id: 'farewell-hajj-632',
    order: 250,
    gregorianYear: '632 CE',
    hijriYear: '10 AH',
    approxAge: 62,
    titleBn: 'বিদায় হজ ও খুতবাতুল উইদা',
    titleEn: 'The Farewell Pilgrimage & Sermon',
    titleAr: 'حجة الوداع',
    location: 'Arafat',
    category: 'madinah-era',
    importance: 'high',
    descriptionBn:
      '১,২৪,০০০ সাহাবীর সমাবেশে আরাফাতে প্রদত্ত বিদায় হজের ভাষণে মানবাধিকার, নারী অধিকার, জাতিগত সাম্য ও দ্বীন পূর্ণাঙ্গ হওয়ার ঘোষণা।',
    descriptionEn:
      "Before 124,000 companions at Arafat, the Prophet ﷺ delivered the Farewell Sermon — proclaiming human rights, women's rights, racial equality, and the completion of the religion.",
    citations: [
      { reference: 'Quran 5:3 (Al-Ma\'idah)', url: 'https://quran.com/5/3' },
      { reference: 'Sahih Muslim 1218', url: 'https://sunnah.com/muslim:1218' },
    ],
  },
  {
    id: 'wafat-632',
    order: 260,
    gregorianYear: '632 CE',
    hijriYear: '11 AH',
    approxAge: 63,
    titleBn: 'ইন্তিকাল — রাসূল ﷺ-এর ওফাত',
    titleEn: 'Wafat — Passing of the Prophet ﷺ',
    location: 'Madinah',
    category: 'wafat',
    importance: 'high',
    descriptionBn:
      '৬৩ বছর বয়সে ১২ রবিউল আউয়াল সোমবার আয়েশা (রা.)-এর ঘরে রাসূল ﷺ ইন্তিকাল করেন। মসজিদে নববীর অভ্যন্তরে দাফন করা হয়।',
    descriptionEn:
      "At age 63, on Monday 12 Rabi' al-Awwal, the Prophet ﷺ passed away in the room of Aishah (RA). He was buried within Masjid an-Nabawi.",
    citations: [
      { reference: 'Sahih al-Bukhari 4462', url: 'https://sunnah.com/bukhari:4462' },
      { reference: 'Sahih Muslim 419', url: 'https://sunnah.com/muslim:419' },
    ],
  },
];

/** Helper — filter by category, ordered chronologically. */
export function eventsByCategory(cat: SeerahCategory): SeerahEvent[] {
  return SEERAH_EVENTS.filter(e => e.category === cat).sort((a, b) => a.order - b.order);
}

/** Helper — the total number of events currently seeded. */
export const SEERAH_EVENT_COUNT = SEERAH_EVENTS.length;

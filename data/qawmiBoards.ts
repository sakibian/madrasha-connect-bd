/**
 * The 6 Qawmi madrasa examination boards of Bangladesh + Al-Haiatul Ulya
 * federation. Data hand-curated from the boards' own official sites and
 * cross-referenced against Wikipedia / Wifaq (Befaq) publications.
 *
 * Every row carries a citation URL so the UI can link back and readers can
 * verify. Update `sourceVerifiedAt` whenever we re-check.
 */

export interface QawmiBoard {
  slug: string;
  nameBn: string;
  nameEn: string;
  nameAr?: string;
  headquartersBn: string;
  headquartersEn: string;
  foundedYear: number;
  approxMadrasaCount?: number;
  region: 'National' | 'Chittagong' | 'Sylhet' | 'Dhaka' | 'Rajshahi' | 'Barishal';
  websiteUrl?: string;
  sourceUrl: string;
  sourceVerifiedAt: string;    // ISO date
  descriptionBn: string;
  descriptionEn: string;
}

export const AL_HAIATUL_ULYA: QawmiBoard = {
  slug: 'al-haiatul-ulya',
  nameBn: 'আল-হাইআতুল উলয়া লিল-জামিআতিল কওমিয়া বাংলাদেশ',
  nameEn: 'Al-Haiatul Ulya lil-Jamiatil Qawmia Bangladesh',
  nameAr: 'الهيئة العليا للجامعات القومية بنغلاديش',
  headquartersBn: 'ঢাকা',
  headquartersEn: 'Dhaka',
  foundedYear: 2017,
  region: 'National',
  websiteUrl: 'https://alhaiatululya.com',
  sourceUrl: 'https://en.wikipedia.org/wiki/Al-Haiatul_Ulya_Lil-Jamiatil_Qawmia_Bangladesh',
  sourceVerifiedAt: '2026-08-01',
  descriptionBn:
    'বাংলাদেশের ৬টি প্রধান কওমি বোর্ডের সমন্বয়ে গঠিত জাতীয় ফেডারেশন। ২০১৮ সালে সরকার এই বোর্ডের অধীনে পরিচালিত দাওরায়ে হাদিস (তাকমিল) সনদকে মাস্টার্স (এমএ) সমমান হিসাবে স্বীকৃতি দিয়েছে।',
  descriptionEn:
    "National federation of the 6 principal Qawmi boards. In 2018 the Government of Bangladesh recognised the Dawra-e-Hadith (Takmil) certificate issued under this federation as equivalent to a Master's (MA) in Islamic Studies & Arabic.",
};

export const QAWMI_BOARDS: QawmiBoard[] = [
  {
    slug: 'befaq',
    nameBn: 'বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ',
    nameEn: 'Befaqul Madarisil Arabia Bangladesh (Wifaq)',
    nameAr: 'وفاق المدارس العربية بنغلاديش',
    headquartersBn: 'যাত্রাবাড়ি, ঢাকা',
    headquartersEn: 'Jatrabari, Dhaka',
    foundedYear: 1978,
    approxMadrasaCount: 19000,
    region: 'National',
    websiteUrl: 'https://wifaqbd.org',
    sourceUrl: 'https://en.wikipedia.org/wiki/Befaqul_Madarisil_Arabia_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'বাংলাদেশের সবচেয়ে বড় ও পুরোনো কওমি মাদ্রাসা শিক্ষা বোর্ড। প্রায় ১৯,০০০+ অধিভুক্ত মাদ্রাসা।',
    descriptionEn:
      'The largest and oldest Qawmi madrasa education board in Bangladesh, with ~19,000+ affiliated madrasas.',
  },
  {
    slug: 'ittehadul-madaris',
    nameBn: 'ইত্তেহাদুল মাদারিস আল-আরাবিয়া বাংলাদেশ',
    nameEn: 'Ittehadul Madaris al-Arabia Bangladesh',
    headquartersBn: 'হাটহাজারী, চট্টগ্রাম',
    headquartersEn: 'Hathazari, Chittagong',
    foundedYear: 1959,
    region: 'Chittagong',
    sourceUrl: 'https://en.wikipedia.org/wiki/Ittehadul_Madaris_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'দারুল উলুম হাটহাজারী কেন্দ্রিক চট্টগ্রাম অঞ্চলের প্রধান কওমি বোর্ড।',
    descriptionEn:
      'Chittagong-region Qawmi board centred at the historic Darul Uloom Hathazari.',
  },
  {
    slug: 'anjuman-ittehad-sylhet',
    nameBn: 'আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ',
    nameEn: 'Anjuman-e-Ittehadul Madaris Bangladesh',
    headquartersBn: 'সিলেট',
    headquartersEn: 'Sylhet',
    foundedYear: 1955,
    region: 'Sylhet',
    sourceUrl: 'https://en.wikipedia.org/wiki/Anjuman-e-Ittehadul_Madaris_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'সিলেট বিভাগের প্রধান কওমি মাদ্রাসা বোর্ড। মাওলানা হুসাইন আহমাদ মাদানির (রহ.) ছাত্রদের অবদানে প্রতিষ্ঠিত।',
    descriptionEn:
      'Principal Qawmi board of the Sylhet Division; founded through the efforts of the students of Shaykh Husain Ahmad Madani (rah).',
  },
  {
    slug: 'azad-deeni-edaraye-talim',
    nameBn: 'আজাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ',
    nameEn: 'Azad Deeni Edaraye Talim Bangladesh',
    headquartersBn: 'ঢাকা',
    headquartersEn: 'Dhaka',
    foundedYear: 1980,
    region: 'Dhaka',
    sourceUrl: 'https://en.wikipedia.org/wiki/Azad_Deeni_Edaraye_Talim_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'ঢাকা কেন্দ্রিক স্বতন্ত্র কওমি বোর্ড, যার সিলেবাসে দরসে নিজামীর পাশাপাশি আধুনিক বিষয়ও অন্তর্ভুক্ত।',
    descriptionEn:
      'Dhaka-based independent Qawmi board whose syllabus combines the classical Dars-e-Nizami with selected modern subjects.',
  },
  {
    slug: 'tanzeem-rajshahi',
    nameBn: 'তানজীমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ',
    nameEn: 'Tanzeemul Madarisid Deeniyah Bangladesh',
    headquartersBn: 'রাজশাহী',
    headquartersEn: 'Rajshahi',
    foundedYear: 1998,
    region: 'Rajshahi',
    sourceUrl: 'https://en.wikipedia.org/wiki/Al-Haiatul_Ulya_Lil-Jamiatil_Qawmia_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'উত্তরবঙ্গের রাজশাহী অঞ্চল কেন্দ্রিক কওমি বোর্ড।',
    descriptionEn:
      'Qawmi board serving the Rajshahi region in northern Bangladesh.',
  },
  {
    slug: 'jatiya-deeni-barishal',
    nameBn: 'জাতীয় দ্বীনী মাদ্রাসা শিক্ষা বোর্ড',
    nameEn: 'Jatiya Deeni Madrasa Shikkha Board',
    headquartersBn: 'বরিশাল',
    headquartersEn: 'Barishal',
    foundedYear: 1999,
    region: 'Barishal',
    sourceUrl: 'https://en.wikipedia.org/wiki/Al-Haiatul_Ulya_Lil-Jamiatil_Qawmia_Bangladesh',
    sourceVerifiedAt: '2026-08-01',
    descriptionBn:
      'বরিশাল বিভাগের কওমি মাদ্রাসাসমূহের জন্য পরীক্ষা পরিচালনাকারী বোর্ড।',
    descriptionEn:
      'Qawmi examination board serving madrasas of the Barishal Division.',
  },
];

/**
 * Gender-aware avatar helpers.
 *
 * DiceBear's `avataaars` sprite ignores its seed's semantics and can produce
 * a feminine avatar for a masculine name (or vice-versa). To keep profile
 * pictures gender-appropriate we:
 *
 *   1. Infer a probable gender from the display name using a curated list
 *      of Bangla / Arabic / English masculine + feminine tokens.
 *   2. Pin the DiceBear avatar's `top` (hair/hijab) options so male seeds
 *      never render long hair and female seeds always render hijab.
 *
 * This is a best-effort inference — users can always upload a real photo
 * to `avatar_url` which bypasses the helper entirely.
 */

export type InferredGender = 'male' | 'female' | 'unknown';

// Family-name / honorific tokens that are frequently attached to male names
// but also appear alongside female names (e.g. "Aisha Rahman"). We keep them
// in the male set for tie-breaking but they lose to any female token match.
const MALE_WEAK_TOKENS = new Set<string>([
  'rahman', 'rehman', 'ahmed', 'ahmad', 'ahmod', 'hasan', 'hassan',
  'karim', 'kareem', 'hossain', 'hussain', 'hussein', 'husain',
  'uddin', 'ullah', 'ur',
]);

// Very common male tokens across Bangla, Arabic (romanised), and English usage
// in the Bangladeshi Muslim community. Kept lowercased & normalised.
const MALE_TOKENS = new Set<string>([
  // English / romanised
  'mohammad', 'muhammad', 'mohammed', 'md', 'md.', 'mohd', 'mohd.',
  'abdul', 'abdur', 'abdullah', 'abd', 'abu',
  'ahmed', 'ahmad', 'ali', 'omar', 'umar', 'usman', 'osman',
  'yusuf', 'yousuf', 'ibrahim', 'ismail', 'ishaq', 'yakub', 'yaqub',
  'hasan', 'hassan', 'hussain', 'hussein', 'husain',
  'karim', 'kareem', 'rahim', 'raheem', 'rahman', 'rehman',
  'sajid', 'saeed', 'said', 'salman', 'sameer', 'samir',
  'khalid', 'khaled', 'kamal', 'jamal', 'jalal', 'iqbal',
  'imran', 'irfan', 'ilyas', 'idris', 'isa',
  'nur', 'noor', 'nurul', 'noorul', 'zakir', 'shakir', 'shafi',
  'mufti', 'maulana', 'mawlana', 'hafiz', 'hafez', 'qari', 'sheikh',
  'shaikh', 'mahmud', 'mahmood', 'masud', 'masood', 'mansur',
  'faisal', 'fahim', 'faruk', 'farooq', 'firoz', 'feroz',
  'tarek', 'tariq', 'tahir', 'talha', 'towhid', 'tawhid',
  'rakib', 'rakibul', 'rasel', 'russell', 'ridoy', 'shohag', 'sohag',
  'rifat', 'raihan', 'rayhan', 'mizan', 'mizanur', 'jahid', 'zahid',
  'shakib', 'sakib', 'shohel', 'sohel', 'rubel', 'ripon', 'suman',
  // Bangla script
  'মুহাম্মদ', 'মোহাম্মদ', 'মো', 'মো.', 'মোঃ', 'মুফতি', 'মাওলানা',
  'মৌলভী', 'হাফেজ', 'ক্বারী', 'কারী', 'শাইখ', 'শায়খ', 'ইমাম',
  'আব্দুল', 'আব্দুর', 'আব্দুল্লাহ', 'আবু',
  'আহমদ', 'আহমেদ', 'আলী', 'আলি', 'উমর', 'ওমর', 'উসমান',
  'ইউসুফ', 'ইব্রাহিম', 'ইসমাইল', 'ইসহাক', 'ইয়াকুব',
  'হাসান', 'হুসাইন', 'হোসেন', 'করিম', 'রহিম', 'রহমান',
  'সাঈদ', 'সালমান', 'খালিদ', 'কামাল', 'জামাল', 'জালাল',
  'ইকবাল', 'ইমরান', 'ইরফান', 'ইলিয়াস', 'ইদ্রিস',
  'নূর', 'নুর', 'নূরুল', 'নুরুল', 'জাকির', 'শাকির', 'শাফি',
  'মাহমুদ', 'মাসুদ', 'মানসুর', 'ফয়সাল', 'ফাহিম', 'ফারুক',
  'তারেক', 'তাহির', 'তালহা', 'তৌহিদ',
  'রাকিব', 'রাসেল', 'রিফাত', 'রায়হান', 'মিজান', 'মিজানুর',
  'জাহিদ', 'সাকিব', 'সোহেল', 'রুবেল', 'রিপন', 'সুমন',
]);

const FEMALE_TOKENS = new Set<string>([
  // English / romanised
  'aisha', 'ayesha', 'ayisha', 'khadija', 'khadeeja', 'fatima', 'fatema',
  'maryam', 'mariam', 'maria', 'sara', 'sarah', 'zainab', 'zaynab',
  'ruqaiya', 'ruqayya', 'safiya', 'safiyya', 'hafsa', 'hafsah',
  'amina', 'aamina', 'aminah', 'asma', 'asmaa',
  'nusrat', 'nasrin', 'nasreen', 'nazneen', 'naznin', 'nadia', 'nadira',
  'salma', 'salima', 'sabina', 'shabnam', 'shirin', 'shireen',
  'rehana', 'rihana', 'rabeya', 'rabia', 'rukhsana', 'rokeya',
  'sultana', 'begum', 'khatun', 'khanam', 'akter', 'akhter', 'akhtar',
  'jannat', 'jannatul', 'tasnim', 'tasneem', 'tahmina', 'tanzila',
  'lubna', 'lamia', 'laila', 'layla', 'rima', 'reema', 'rina',
  'shathi', 'sathi', 'shilpi', 'shirina', 'sharmin', 'shahnaz',
  'humaira', 'humayra', 'yasmin', 'yasmeen', 'zaheda', 'zahida',
  'mst', 'mst.', 'most', 'most.', 'musammat',
  // Bangla script
  'আয়েশা', 'আয়িশা', 'খাদিজা', 'ফাতেমা', 'ফাতিমা',
  'মরিয়ম', 'মারিয়াম', 'সারা', 'জয়নব', 'জয়নাব',
  'সাফিয়া', 'হাফসা', 'আমিনা', 'আসমা',
  'নুসরাত', 'নাসরিন', 'নাজনীন', 'নাদিয়া',
  'সালমা', 'সাবিনা', 'শাবনম', 'শিরিন',
  'রেহানা', 'রাবেয়া', 'রুকসানা', 'রোকেয়া',
  'সুলতানা', 'বেগম', 'খাতুন', 'খানম', 'আক্তার', 'আখতার',
  'জান্নাত', 'জান্নাতুল', 'তাসনিম', 'তাহমিনা', 'তানজিলা',
  'লুবনা', 'লামিয়া', 'লায়লা', 'রিমা', 'রিনা',
  'সাথী', 'শিল্পী', 'শারমিন', 'শাহনাজ',
  'হুমায়রা', 'ইয়াসমিন', 'জাহিদা',
  'মোছাঃ', 'মোসাঃ', 'মোসা.', 'মোছা.',
]);

/**
 * Infer probable gender from a person's display name.
 *
 * Returns `'unknown'` when no confident match is found — callers should treat
 * unknown as gender-neutral (e.g. use initials or a neutral avatar).
 */
export function inferGenderFromName(name?: string | null): InferredGender {
  if (!name) return 'unknown';
  // Normalise: lowercase, strip punctuation, split on whitespace.
  const tokens = name
    .toLowerCase()
    .replace(/[.,()\[\]{}"'`~!@#$%^&*+=<>?/\\|:;]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let male = 0;
  let female = 0;
  let strongMale = 0;
  let strongFemale = 0;
  for (const token of tokens) {
    if (MALE_TOKENS.has(token)) {
      male++;
      if (!MALE_WEAK_TOKENS.has(token)) strongMale++;
    }
    if (FEMALE_TOKENS.has(token)) {
      female++;
      strongFemale++;
    }
  }
  // A single strong female token beats any number of weak male tokens
  // (e.g. "Aisha Rahman" → female, not unknown).
  if (strongFemale > 0 && strongMale === 0) return 'female';
  if (strongMale > 0 && strongFemale === 0) return 'male';
  if (male > female) return 'male';
  if (female > male) return 'female';
  return 'unknown';
}

/**
 * Build a DiceBear `avataaars` URL that respects the inferred gender.
 *
 * - Male   → short/close-cropped hair, no hijab.
 * - Female → hijab-1 style top (respectful for a Bangladeshi Muslim audience).
 * - Unknown → neutral seed (no hair/hijab pinning), same behaviour as before.
 *
 * When a real photo URL is provided it is returned unchanged.
 */
export function getGenderedAvatarUrl(
  name?: string | null,
  existingUrl?: string | null,
  seed?: string | null,
): string {
  // If the caller already has a real photo, respect it.
  if (existingUrl && !/dicebear\.com/.test(existingUrl) && !/picsum\.photos\/seed\/user/.test(existingUrl)) {
    return existingUrl;
  }

  const gender = inferGenderFromName(name);
  const safeSeed = encodeURIComponent(seed || name || 'muslim-community-bd');
  const base = `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeSeed}`;

  if (gender === 'male') {
    // Short/close-cropped tops only. `facialHairProbability=40` gives an
    // occasional beard which reads as masculine in Bangladeshi context.
    return (
      `${base}` +
      `&top=shortHair,shortHairShortFlat,shortHairShortCurly,shortHairShortRound,shortHairSides` +
      `&facialHairProbability=40`
    );
  }
  if (gender === 'female') {
    // Force hijab and disable facial hair.
    return `${base}&top=hijab&facialHairProbability=0`;
  }
  // Unknown — keep original behaviour.
  return base;
}

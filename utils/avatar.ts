/**
 * Gender-aware avatar helpers (M21 refactor).
 *
 * We used to hit `api.dicebear.com` for every rendered avatar, which:
 *   - added a third-party network round-trip on every page render,
 *   - leaked user information (avatar seed = user name) to a third party,
 *   - required cache-busting whenever DiceBear updated the sprite.
 *
 * Now we render avatars locally using `boring-avatars` (MIT, 16 KB, pure SVG).
 * This module keeps the *gender inference* logic — that still matters, because
 * we pick a warmer or cooler brand palette based on it so the avatar reads as
 * gender-appropriate for our audience — but the actual pixel generation has
 * moved into `components/ui/Avatar.tsx`.
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
 * Brand-aligned colour palettes for boring-avatars.
 *
 * We use tone families derived from our M16 semantic tokens so avatars sit
 * naturally inside the rest of the UI:
 *   - Male   → cool greens + charcoal (bd-green family).
 *   - Female → warm plums + soft rose (still on-brand, different hue).
 *   - Unknown → neutral slate.
 *
 * `boring-avatars` needs an array of 5 hex strings.
 */
const MALE_PALETTE   = ['#006a4e', '#008660', '#34d399', '#0f172a', '#f8fafc'];
const FEMALE_PALETTE = ['#b91c1c', '#f59e0b', '#fecaca', '#0f172a', '#f8fafc'];
const NEUTRAL_PALETTE = ['#334155', '#64748b', '#e2e8f0', '#0f172a', '#f8fafc'];

export function getAvatarPalette(gender: InferredGender): string[] {
  if (gender === 'male') return MALE_PALETTE;
  if (gender === 'female') return FEMALE_PALETTE;
  return NEUTRAL_PALETTE;
}

/**
 * Convenience: infer gender AND grab the palette in one call.
 * Used by `components/ui/Avatar.tsx`.
 */
export function getAvatarStyleFromName(name?: string | null): {
  gender: InferredGender;
  colors: string[];
} {
  const gender = inferGenderFromName(name);
  return { gender, colors: getAvatarPalette(gender) };
}

/**
 * Returns true when the given URL is a real uploaded photo we should respect
 * (i.e. NOT one of the legacy DiceBear or picsum stubs).
 */
export function isRealPhotoUrl(url?: string | null): boolean {
  if (!url) return false;
  if (/dicebear\.com/.test(url)) return false;
  if (/picsum\.photos\/seed\/user/.test(url)) return false;
  return true;
}

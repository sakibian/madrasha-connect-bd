
import { Job, Product, ForumPost } from '../types';

export const MOCK_JOBS: Job[] = [
  { id: 'job-1', title: 'হেফজ শিক্ষক', institution: 'দারুল উলুম মাদানি মাদ্রাসা', location: 'মিরপুর, ঢাকা', salary: '৳ ১৫,০০০ - ২০,০০০', type: 'Teacher', postedAt: '৩ ঘণ্টা আগে', verified: true },
  { id: 'job-2', title: 'ইমাম ও খতিব', institution: 'বায়তুল মোকাররম শাখা মসজিদ', location: 'রাজশাহী সদর', salary: 'আলোচনা সাপেক্ষে', type: 'Imam', postedAt: '৫ ঘণ্টা আগে', verified: true },
  { id: 'job-3', title: 'আরবি প্রভাষক', institution: 'সরকারি আলিয়া মাদ্রাসা', location: 'সিলেট', salary: 'সরকারি বেতন স্কেল', type: 'Teacher', postedAt: '১ দিন আগে', verified: false },
  { id: 'job-4', title: 'মুয়াজ্জিন', institution: 'জামেয়া আহমদিয়া সুন্নিয়া মাদ্রাসা', location: 'চট্টগ্রাম', salary: '৳ ১০,০০০+', type: 'Muazzin', postedAt: '২ দিন আগে', verified: true },
  { id: 'job-5', title: 'ম্যানেজমেন্ট অফিসার', institution: 'বেফাকুল মাদারিস হেড অফিস', location: 'যাত্রাবাড়ি, ঢাকা', salary: '৳ ২৫,০০০+', type: 'Staff', postedAt: '৩ দিন আগে', verified: true },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'আরবি ক্যালিগ্রাফি (সুরা ইখলাস)', price: 0, category: 'Calligraphy', image: 'https://picsum.photos/seed/calli1/400/300', isFree: true },
  { id: 'prod-2', name: 'মদিনার প্রিমিয়াম আজওয়া খেজুর', price: 1200, category: 'Sunnah Food', image: 'https://picsum.photos/seed/dates/400/300' },
  { id: 'prod-3', name: 'আধুনিক পাঞ্জাবি (মডারেট কালেকশন)', price: 1500, category: 'Modest Fashion', image: 'https://picsum.photos/seed/fashion/400/300' },
  { id: 'prod-4', name: 'ডিজিটাল তাসবীহ ও জায়নামাজ সেট', price: 450, category: 'Books', image: 'https://picsum.photos/seed/tasbih/400/300' },
  { id: 'prod-5', name: 'কালো জিরা তেল (২৫০ মিলি)', price: 350, category: 'Sunnah Food', image: 'https://picsum.photos/seed/oil/400/300' },
  { id: 'prod-6', name: 'ওয়াল আর্ট ক্যালিগ্রাফি ফ্রেম', price: 2500, category: 'Calligraphy', image: 'https://picsum.photos/seed/wallart/400/300' },
];

export const MOCK_RESOURCES = [
  { id: 'res-1', title: 'সহজ তাজবীদ গাইড', type: 'PDF', category: 'Knowledge', level: 'Elementary' },
  { id: 'res-2', title: 'সাপ্তাহিক খুতবাহ মডিউল', type: 'DOCX', category: 'Knowledge', level: 'Imams' },
  { id: 'res-3', title: 'আরবি গ্রামার (নাহু-সরফ)', type: 'VIDEO', category: 'Knowledge', level: 'Secondary' },
  { id: 'res-4', title: 'বেফাক রেজাল্ট শীট (২০২৩)', type: 'PDF', category: 'Knowledge', level: 'All' },
  { id: 'res-5', title: 'মারহালাতুদ দাওয়াতিল হাদিস সিলেবাস', type: 'PDF', category: 'Knowledge', level: 'Masters' },
];

export const MOCK_POSTS: ForumPost[] = [
  { id: 'post-1', author: 'মুফতি আব্দুল্লাহ আল-মামুন', role: 'খতিব, ঢাকা উত্তর', title: 'রমজানের প্রস্তুতি ও আমাদের সামাজিক দায়িত্ব', content: 'আসসালামু আলাইকুম। রমজান সমাগত...', likes: 124, comments: 18, verified: true },
  { id: 'post-2', author: 'মাওলানা সাঈদ বিন নূর', role: 'মুহাদ্দিস, হাটহাজারী', title: 'নাহু ও সরফ শিখার সহজ ৫টি কৌশল', content: 'ইলমে দ্বীন শিক্ষার শুরুতেই আরবী ব্যাকরণ নিয়ে অনেকে ভয় পান...', likes: 85, comments: 45, verified: true },
];

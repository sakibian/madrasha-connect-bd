
import { Job, Product, ForumPost, Institution, Course, Fatwa } from '../types';

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 'inst-1', name: 'দারুল উলুম হাটহাজারী', type: 'Qawmi', location: 'হাটহাজারী, চট্টগ্রাম', district: 'Chittagong', established: '১৯০১', verified: true, studentCount: 7000, image: 'https://picsum.photos/seed/hathazari/400/300' },
  { id: 'inst-2', name: 'সরকারি আলিয়া মাদ্রাসা', type: 'Alia', location: 'বখশীবাজার, ঢাকা', district: 'Dhaka', established: '১৭৮০', verified: true, studentCount: 5000, image: 'https://picsum.photos/seed/alia/400/300' },
  { id: 'inst-3', name: 'জামেয়া কাসেমিয়া কামিল মাদ্রাসা', type: 'Alia', location: 'নরসিংদী', district: 'Narsingdi', established: '১৯৭৬', verified: true, studentCount: 3000, image: 'https://picsum.photos/seed/narsingdi/400/300' },
  { id: 'inst-4', name: 'বায়তুল মোকাররম জাতীয় মসজিদ', type: 'Mosque', location: 'পল্টন, ঢাকা', district: 'Dhaka', established: '১৯৬৮', verified: true, image: 'https://picsum.photos/seed/baitul/400/300' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'c-1', title: 'সালাত শিক্ষার সঠিক পদ্ধতি', instructor: 'মুফতি আব্দুল্লাহ', duration: '২ ঘণ্টা', category: 'Deen-101', thumbnail: 'https://picsum.photos/seed/salah/400/250' },
  { id: 'c-2', title: 'মৌলিক তাজবীদ কোর্স', instructor: 'ক্বারী সাঈদ বিন নূর', duration: '৫ ঘণ্টা', category: 'Tajweed', thumbnail: 'https://picsum.photos/seed/tajweed/400/250' },
  { id: 'c-3', title: 'সীরাতুন নবী (সা.)', instructor: 'ড. এনায়েতুল্লাহ আব্বাসী', duration: '১০ ঘণ্টা', category: 'History', thumbnail: 'https://picsum.photos/seed/seerah/400/250' },
];

export const MOCK_CALLIGRAPHY: Product[] = [
  { id: 'cal-1', name: 'বিসমিল্লাহ হির রাহমানির রাহিম', price: 0, category: 'Calligraphy', image: 'https://picsum.photos/seed/cal-1/400/400', isFree: true, isVector: true },
  { id: 'cal-2', name: 'আল্লাহু (থ্রিডি ক্যালিগ্রাফি)', price: 0, category: 'Calligraphy', image: 'https://picsum.photos/seed/cal-2/400/400', isFree: true, isVector: true },
  { id: 'cal-3', name: 'আয়াতুল কুরসি (গোল্ডেন ফ্রেম)', price: 3500, category: 'Calligraphy', image: 'https://picsum.photos/seed/cal-3/400/400', isFree: false, isVector: false },
];

export const MOCK_JOBS: Job[] = [
  { id: 'job-1', title: 'হেফজ শিক্ষক', institution: 'দারুল উলুম মাদানি মাদ্রাসা', location: 'মিরপুর, ঢাকা', salary: '৳ ১৫,০০০ - ২০,০০০', type: 'Teacher', postedAt: '৩ ঘণ্টা আগে', verified: true },
  { id: 'job-2', title: 'ইমাম ও খতিব', institution: 'বায়তুল মোকাররম শাখা মসজিদ', location: 'রাজশাহী সদর', salary: 'আলোচনা সাপেক্ষে', type: 'Imam', postedAt: '৫ ঘণ্টা আগে', verified: true },
  { id: 'job-3', title: 'আরবি প্রভাষক', institution: 'সরকারি আলিয়া মাদ্রাসা', location: 'সিলেট', salary: 'সরকারি বেতন স্কেল', type: 'Teacher', postedAt: '১ দিন আগে', verified: false },
  { id: 'job-4', title: 'মুয়াজ্জিন', institution: 'জামেয়া আহমদিয়া সুন্নিয়া মাদ্রাসা', location: 'চট্টগ্রাম', salary: '৳ ১০,০০০+', type: 'Muazzin', postedAt: '২ দিন আগে', verified: true },
  { id: 'job-5', title: 'ম্যানেজমেন্ট অফিসার', institution: 'বেফাকুল মাদারিস হেড office', location: 'যাত্রাবাড়ি, ঢাকা', salary: '৳ ২৫,০০০+', type: 'Staff', postedAt: '৩ দিন আগে', verified: true },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'আরবি ক্যালিগ্রাফি (সুরা ইখলাস)', price: 0, category: 'Calligraphy', image: 'https://picsum.photos/seed/calli1/400/300', isFree: true },
  { id: 'prod-2', name: 'মদিনার প্রিমিয়াম আজওয়া খেজুর', price: 1200, category: 'Sunnah Food', image: 'https://picsum.photos/seed/dates/400/300' },
  { id: 'prod-3', name: 'আধুনিক পাঞ্জাবি (মডারেট কালেকশন)', price: 1500, category: 'Modest Fashion', image: 'https://picsum.photos/seed/fashion/400/300' },
  { id: 'prod-4', name: 'ডিজিটাল তাসবীহ ও জায়নামাজ সেট', price: 450, category: 'Books', image: 'https://picsum.photos/seed/tasbih/400/300' },
];

export const MOCK_POSTS: ForumPost[] = [
  { id: 'post-1', author: 'মুফতি আব্দুল্লাহ আল-মামুন', title: 'রমজানের প্রস্তুতি ও আমাদের সামাজিক দায়িত্ব', content: 'আসসালামু আলাইকুম। রমজান সমাগত...', category: 'General', likes: 124, comments: 18, verified: true },
  { id: 'post-2', author: 'মাওলানা সাঈদ বিন নূর', title: 'নাহু ও সরফ শিখার সহজ ৫টি কৌশল', content: 'ইলমে দ্বীন শিক্ষার শুরুতেই আরবী ব্যাকরণ নিয়ে অনেকে ভয় পান...', category: 'Education', likes: 85, comments: 45, verified: true },
];

export const MOCK_FATWAS: Fatwa[] = [
  {
    id: 'f-1',
    question: 'নামাজের মধ্যে হাসলে কি ওজু ভেঙে যায়?',
    category: 'Ibadah',
    askedBy: 'আব্দুর রহিম',
    askedAt: '২ দিন আগে',
    answer: 'হ্যাঁ, যদি প্রাপ্তবয়স্ক ব্যক্তি নামাজের মধ্যে শব্দ করে হাসে তবে তার নামাজ এবং ওজু উভয়ই ভেঙে যাবে।',
    answeredBy: 'মুফতি আব্দুল্লাহ',
    answeredAt: '১ দিন আগে',
    status: 'ANSWERED'
  },
  {
    id: 'f-2',
    question: 'জাকাত প্রদানের ক্ষেত্রে স্বর্ণের নিসাব কী?',
    category: 'Muamalah',
    askedBy: 'মো. করিম',
    askedAt: '৩ দিন আগে',
    answer: 'স্বর্ণের নিসাব হলো সাড়ে সাত তোলা (৮৭.৪৫ গ্রাম)। যদি কারও কাছে এই পরিমাণ স্বর্ণ থাকে এবং এক বছর অতিবাহিত হয়, তবে তাকে জাকাত দিতে হবে।',
    answeredBy: 'মুফতি জাহিদ হাসান',
    answeredAt: '২ দিন আগে',
    status: 'ANSWERED'
  }
];

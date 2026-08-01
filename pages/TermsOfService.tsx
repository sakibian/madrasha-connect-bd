import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Terms of Service — Bengali-first.
 *
 * This is a good-faith draft written by engineers. Before we launch to real
 * users you MUST have a Bangladesh-qualified lawyer review this — nonprofit
 * registration and the Bangladesh Digital Security Act have specific clauses
 * that vary by NGO type.
 */
const TermsOfService: React.FC = () => (
  <article className="max-w-3xl mx-auto space-y-10 animate-fadeIn">
    <header className="space-y-4 border-b border-gray-100 pb-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black"
      >
        <ArrowLeft size={14} /> হোমপেজে ফিরুন
      </Link>
      <div className="caps-label text-gray-400">Legal • Last Updated: 01 Aug 2026</div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">সেবার শর্তাবলী।</h1>
      <p className="text-gray-500 font-medium leading-relaxed">
        মাদ্রাসা কানেক্ট বাংলাদেশ (“প্ল্যাটফর্ম”) ব্যবহারের পূর্বে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন। প্ল্যাটফর্মে অ্যাকাউন্ট
        তৈরি বা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।
      </p>
    </header>

    <Section title="১. পরিচিতি">
      মাদ্রাসা কানেক্ট বাংলাদেশ একটি অলাভজনক ডিজিটাল প্ল্যাটফর্ম, যা বাংলাদেশের মাদ্রাসা কমিউনিটির শিক্ষার্থী, শিক্ষক, আলেম ও
      প্রতিষ্ঠানকে সংযুক্ত করার উদ্দেশ্যে পরিচালিত। এখানে চাকরির খোঁজ, ফতোয়া, শিক্ষা কন্টেন্ট, মার্কেটপ্লেস ও কমিউনিটি ফোরাম সহ
      বিভিন্ন সেবা প্রদান করা হয়।
    </Section>

    <Section title="২. অ্যাকাউন্ট নিবন্ধন">
      অ্যাকাউন্ট তৈরির সময় আপনি প্রকৃত ও সঠিক তথ্য প্রদানে বাধ্য। ভুল তথ্য প্রদান বা অন্যের পরিচয়ে অ্যাকাউন্ট তৈরি করলে আমরা
      বিনা নোটিশে সেই অ্যাকাউন্ট স্থগিত করতে পারি। আপনার অ্যাকাউন্টের পাসওয়ার্ড ও ওটিপি গোপন রাখার দায়িত্ব সম্পূর্ণ আপনার।
    </Section>

    <Section title="৩. গ্রহণযোগ্য ব্যবহার">
      নিম্নলিখিত কাজগুলো কঠোরভাবে নিষিদ্ধ:
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-500">
        <li>মাযহাবী বিদ্বেষ, তাকফির, বা কোনো ব্যক্তি/গোষ্ঠীর প্রতি বিদ্বেষমূলক কন্টেন্ট প্রকাশ</li>
        <li>ভুয়া চাকরির বিজ্ঞপ্তি, প্রতারণামূলক অর্থ সংগ্রহ, বা প্রতারণা</li>
        <li>ইসলামী শরিয়া বা বাংলাদেশের আইন লঙ্ঘন করে এমন কন্টেন্ট</li>
        <li>অন্যের বৌদ্ধিক সম্পদ (কপিরাইট) অনুমতি ছাড়া ব্যবহার</li>
        <li>প্ল্যাটফর্মের নিরাপত্তা ভাঙার চেষ্টা, স্প্যাম, বা স্বয়ংক্রিয় বট ব্যবহার</li>
      </ul>
    </Section>

    <Section title="৪. কন্টেন্ট মডারেশন">
      সমস্ত ব্যবহারকারী-জমা কন্টেন্ট আমাদের স্বয়ংক্রিয় ও মানব মডারেশন পাইপলাইনের মাধ্যমে যাচাই করা হয়। ফতোয়া ও ইসলামী কন্টেন্ট
      যাচাইকৃত আলেমদের দ্বারা পুনরীক্ষণ করা হয়। আমরা যে কোনো কন্টেন্ট বিনা নোটিশে সরিয়ে ফেলার অধিকার সংরক্ষণ করি।
    </Section>

    <Section title="৫. সাদাকাহ ও দান">
      প্ল্যাটফর্মের মাধ্যমে প্রদত্ত সমস্ত দান সরাসরি প্রাপক প্রতিষ্ঠানের কাছে পৌঁছায়। আমরা কোনো কমিশন বা সেবা ফি রাখি না।
      আমরা প্রতিষ্ঠানসমূহকে যাচাই করি, তবে দাতা ব্যবহারকারীদেরও নিজ দায়িত্বে যাচাই করার অনুরোধ জানাই।
    </Section>

    <Section title="৬. দায়বদ্ধতার সীমা">
      প্ল্যাটফর্ম “যেমন আছে তেমন” (as-is) ভিত্তিতে প্রদান করা হয়। আমরা কন্টেন্টের যথার্থতা, চাকরির বিজ্ঞপ্তির সত্যতা, বা প্ল্যাটফর্মের
      অবিরাম উপলব্ধতার নিশ্চয়তা দিই না। প্ল্যাটফর্মের কোনো ব্যবহারজনিত ক্ষতির জন্য আমরা দায়ী থাকব না।
    </Section>

    <Section title="৭. শর্ত পরিবর্তন">
      এই শর্তাবলী সময়ে সময়ে পরিবর্তিত হতে পারে। উল্লেখযোগ্য পরিবর্তনের ক্ষেত্রে আমরা আপনাকে ইমেইল বা ইন-অ্যাপ নোটিফিকেশনের
      মাধ্যমে জানিয়ে দিব।
    </Section>

    <Section title="৮. যোগাযোগ">
      এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে অনুগ্রহ করে <a className="font-bold text-bd-green underline" href="mailto:support@madrasaconnectbd.org">support@madrasaconnectbd.org</a> এ যোগাযোগ করুন।
    </Section>

    <footer className="pt-10 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
      এই দস্তাবেজ একটি খসড়া। প্রকৃত আইনি চূড়ান্ত সংস্করণ প্রকাশের পূর্বে আইনজীবী দ্বারা পর্যালোচিত হবে।
    </footer>
  </article>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
    <div className="text-gray-600 leading-relaxed font-medium">{children}</div>
  </section>
);

export default TermsOfService;

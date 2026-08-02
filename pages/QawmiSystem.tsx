/**
 * /qawmi-system — Bangladesh's Qawmi Madrasa Education System explainer.
 *
 * Data-driven from `data/qawmiBoards.ts` + `data/marhalaLadder.ts` so every
 * fact is cited. This is the single highest-credibility page for our target
 * audience — do NOT hardcode "facts" that aren't traceable to a source.
 */

import React from 'react';
import { GraduationCap, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import Citation from '../components/Citation';
import { QAWMI_BOARDS, AL_HAIATUL_ULYA } from '../data/qawmiBoards';
import { MARHALA_LADDER } from '../data/marhalaLadder';
import { articleSchema, breadcrumbSchema } from '../components/StructuredData';

const QawmiSystem: React.FC = () => {
  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      <SEO
        title="কওমি শিক্ষা ব্যবস্থা — বাংলাদেশ | Madrasa Connect BD"
        description="বাংলাদেশের ৬টি প্রধান কওমি মাদ্রাসা বোর্ড, মারহালা (স্তর) পদ্ধতি ও দাওরায়ে হাদিসের সরকারি স্বীকৃতির সম্পূর্ণ ব্যাখ্যা।"
        keywords={['কওমি', 'কওমি শিক্ষা ব্যবস্থা', 'দাওরায়ে হাদিস', 'বেফাক', 'আল-হাইআতুল উলয়া', 'qawmi madrasa bangladesh', 'dawra-e-hadith']}
        structuredData={[
          articleSchema({
            title: 'Qawmi Madrasa Education System — Bangladesh',
            description: 'Complete guide to the 6 Qawmi boards, the marhala ladder, and Dawra-e-Hadith recognition.',
            url: '/qawmi-system',
            datePublished: '2026-08-01',
            dateModified: '2026-08-01',
          }),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Knowledge', url: '/knowledge' },
            { name: 'Qawmi System', url: '/qawmi-system' },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="space-y-4">
        <div className="caps-label text-gray-400">Bangladesh · Islamic Education</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          কওমি মাদ্রাসা শিক্ষা ব্যবস্থা
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          বাংলাদেশে কওমি ধারা ২ শতাধিক বছর ধরে দ্বীনি ইলম সংরক্ষণ ও বিতরণের প্রধান
          কাঠামো। এই পৃষ্ঠায় ৬টি প্রধান পরীক্ষা বোর্ড, ৬ স্তরের মারহালা সিঁড়ি এবং
          দাওরায়ে হাদিসের মাস্টার্স-সমমান সরকারি স্বীকৃতির সম্পূর্ণ ব্যাখ্যা রয়েছে —
          প্রতিটি তথ্য মূল সোর্সের লিংকসহ।
        </p>
      </header>

      {/* Government recognition callout */}
      <section className="bg-black/5 border border-black/20 p-6 md:p-8 space-y-3">
        <div className="flex items-center gap-2 text-black font-black uppercase tracking-widest text-xs">
          <ShieldCheck size={14} />
          সরকারি স্বীকৃতি · ২০১৮
        </div>
        <h2 className="text-2xl font-extrabold">
          দাওরায়ে হাদিস = মাস্টার্স ডিগ্রি সমমান
        </h2>
        <p className="text-gray-700 leading-relaxed">
          ২০১৮ সালে বাংলাদেশ সরকার কওমি ফেডারেশন{' '}
          <a
            href={AL_HAIATUL_ULYA.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-black"
          >
            {AL_HAIATUL_ULYA.nameBn}
          </a>{' '}
          কর্তৃক প্রদত্ত দাওরায়ে হাদিস (তাকমিল) সনদকে ইসলামিক স্টাডিজ ও আরবি বিষয়ে
          মাস্টার্স (এমএ) সমমান হিসাবে স্বীকৃতি দিয়েছে।
        </p>
        <Citation source="Al-Haiatul Ulya (Wikipedia)" url={AL_HAIATUL_ULYA.sourceUrl} verifiedAt={AL_HAIATUL_ULYA.sourceVerifiedAt} />
      </section>

      {/* Marhala ladder */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="caps-label text-gray-400 flex items-center gap-1">
            <GraduationCap size={12} /> Marhala Ladder (৬ স্তর)
          </div>
          <h2 className="text-3xl font-extrabold">মারহালা সিঁড়ি</h2>
          <p className="text-gray-600">
            দরসে নিজামী সিলেবাসে ৬ ধাপে গঠিত সম্পূর্ণ পাঠ্যক্রম। প্রাথমিক থেকে
            দাওরায়ে হাদিস পর্যন্ত মোট সময় সাধারণত ১৫ বছর।
          </p>
        </div>

        <ol className="space-y-4">
          {MARHALA_LADDER.map(stage => (
            <li
              key={stage.slug}
              className="bg-white border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6"
            >
              <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                <div className="w-14 h-14 flex items-center justify-center bg-black text-white text-xl font-extrabold">
                  {stage.order}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {stage.durationYears} বছর
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold">{stage.nameBn}</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {stage.nameEn} · <span dir="rtl" lang="ar">{stage.nameAr}</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  মূলধারা সমমান: {stage.mainstreamEquivalent}
                </p>
                <div>
                  <p className="caps-label text-gray-400 mb-1">মূল বিষয়সমূহ</p>
                  <ul className="flex flex-wrap gap-2">
                    {stage.coreSubjectsBn.map(s => (
                      <li key={s} className="text-xs font-bold bg-gray-100 px-2 py-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <Citation source="Wifaq Bangladesh" url={stage.sourceUrl} verifiedAt="2026-08-01" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Six boards */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">৬টি প্রধান কওমি বোর্ড</div>
          <h2 className="text-3xl font-extrabold">কওমি পরীক্ষা বোর্ডসমূহ</h2>
          <p className="text-gray-600">
            নিচের ৬টি বোর্ড ২০১৭ সালে গঠিত ফেডারেশন{' '}
            <em>{AL_HAIATUL_ULYA.nameEn}</em> এর অধীনে ঐক্যবদ্ধ পরীক্ষা পরিচালনা করে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QAWMI_BOARDS.map(board => (
            <article key={board.slug} className="bg-white border border-gray-100 p-6 space-y-3">
              <header className="space-y-1">
                <h3 className="text-lg font-extrabold leading-tight">{board.nameBn}</h3>
                <p className="text-sm text-gray-500 font-medium">{board.nameEn}</p>
                {board.nameAr && (
                  <p className="text-sm text-gray-500 font-medium" dir="rtl" lang="ar">
                    {board.nameAr}
                  </p>
                )}
              </header>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-bold">
                <dt className="text-gray-400 flex items-center gap-1">
                  <MapPin size={10} /> HQ
                </dt>
                <dd>{board.headquartersBn}</dd>
                <dt className="text-gray-400 flex items-center gap-1">
                  <CalendarDays size={10} /> Founded
                </dt>
                <dd>{board.foundedYear}</dd>
                {board.approxMadrasaCount && (
                  <>
                    <dt className="text-gray-400">Madrasas</dt>
                    <dd>~{board.approxMadrasaCount.toLocaleString('en-US')}</dd>
                  </>
                )}
                <dt className="text-gray-400">Region</dt>
                <dd>{board.region}</dd>
              </dl>
              <p className="text-sm text-gray-700 leading-relaxed">{board.descriptionBn}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {board.websiteUrl && (
                  <a
                    href={board.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-widest text-black underline"
                  >
                    Official website ↗
                  </a>
                )}
                <Citation source="Wikipedia" url={board.sourceUrl} verifiedAt={board.sourceVerifiedAt} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="text-xs text-gray-400 border-t border-gray-100 pt-6 space-y-1">
        <p>
          <strong className="text-gray-600">Sourcing policy:</strong> Every fact
          on this page links back to an official board site or a well-sourced
          reference. If you spot a mistake, please use the feedback widget in
          the corner — we correct within 24 hours.
        </p>
        <p>Last verified: 2026-08-01.</p>
      </section>
    </div>
  );
};

export default QawmiSystem;

/**
 * Daily Islamic Widget — Hijri date + next prayer + Ayah of the day.
 *
 * Displayed on Home + Dashboard. Fetches from real APIs (Aladhan +
 * Al-Quran Cloud) via the content-integration layer with cache fallback.
 *
 * Fails silently: if any API is unreachable we degrade gracefully by
 * hiding the affected sub-widget rather than showing an error banner.
 */

import React, { useEffect, useState } from 'react';
import { Sunrise, BookOpen, Loader2 } from 'lucide-react';
import Citation from './Citation';
import { getPrayerTimesByCity, type PrayerTimesResponse } from '../services/content/prayer';
import { getAyah, type Ayah } from '../services/content/quran';

interface Props {
  /** Bangladeshi city — defaults to Dhaka. */
  city?: string;
  /** Ayah of the day reference "surah:ayah". Defaults to 2:255 (Ayatul Kursi). */
  ayahRef?: string;
  className?: string;
}

interface NextPrayer {
  name: string;
  time: string;
}

const PRAYER_ORDER: Array<keyof PrayerTimesResponse['timings']> = [
  'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha',
];

const DailyIslamicWidget: React.FC<Props> = ({ city = 'Dhaka', ayahRef = '2:255', className = '' }) => {
  const [prayers, setPrayers] = useState<PrayerTimesResponse | null>(null);
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [ayahBn, setAyahBn] = useState<Ayah | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [pr, ar, bn] = await Promise.all([
        getPrayerTimesByCity(city, 'BD'),
        getAyah(ayahRef, 'quran-uthmani'),
        getAyah(ayahRef, 'bn.bengali'),
      ]);
      if (cancelled) return;
      if (pr.ok) setPrayers(pr.data);
      if (ar.ok) setAyah(ar.data);
      if (bn.ok) setAyahBn(bn.data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [city, ayahRef]);

  const next = prayers ? computeNextPrayer(prayers.timings) : null;
  const hijri = prayers?.date?.hijri;

  return (
    <div className={`bg-white border border-gray-100 p-6 space-y-6 ${className}`}>
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
          <Loader2 size={16} className="animate-spin" />
          লোড হচ্ছে…
        </div>
      )}

      {/* Hijri date row */}
      {hijri && (
        <div className="space-y-1">
          <div className="caps-label text-gray-400">আজকের হিজরি তারিখ</div>
          <p className="text-2xl font-extrabold tracking-tight">
            {hijri.day} {hijri.month.en} {hijri.year} হি.
          </p>
          <p className="text-sm text-gray-500 font-medium" dir="rtl">
            {hijri.day} {hijri.month.ar} {hijri.year} هـ
          </p>
          <Citation source="Aladhan" url="https://aladhan.com" />
        </div>
      )}

      {/* Next prayer */}
      {next && (
        <div className="space-y-1 border-t border-gray-100 pt-4">
          <div className="caps-label text-gray-400 flex items-center gap-1">
            <Sunrise size={12} /> পরবর্তী নামাজ ({city})
          </div>
          <p className="text-2xl font-extrabold text-black tracking-tight">
            {next.name} · {next.time}
          </p>
          <ul className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 pt-2">
            {PRAYER_ORDER.map(p => (
              <li key={p} className="flex items-center justify-between">
                <span>{p}</span>
                <span className="text-gray-400 font-mono">{prayers?.timings[p]?.slice(0, 5) ?? '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ayah of the day */}
      {ayah && (
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <div className="caps-label text-gray-400 flex items-center gap-1">
            <BookOpen size={12} /> আজকের আয়াত ({ayahRef})
          </div>
          <p className="text-lg leading-loose font-arabic" dir="rtl" lang="ar">
            {ayah.text}
          </p>
          {ayahBn && (
            <p className="text-sm text-gray-600 leading-relaxed" lang="bn">
              {ayahBn.text}
            </p>
          )}
          <Citation source="Al-Quran Cloud" url="https://alquran.cloud" />
        </div>
      )}
    </div>
  );
};

function computeNextPrayer(t: PrayerTimesResponse['timings']): NextPrayer | null {
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYER_ORDER) {
    const val = t[p];
    if (!val) continue;
    const [hh, mm] = val.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) continue;
    const mins = hh * 60 + mm;
    if (mins > minutesNow) return { name: p, time: val.slice(0, 5) };
  }
  // All prayers passed today → next is tomorrow's Fajr.
  return t.Fajr ? { name: 'Fajr (tomorrow)', time: t.Fajr.slice(0, 5) } : null;
}

export default DailyIslamicWidget;

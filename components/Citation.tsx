/**
 * Reusable citation badge — attach next to any piece of externally-sourced
 * content so the origin is always visible + verifiable.
 *
 * Usage:
 *   <Citation source="Al-Quran Cloud" url="https://alquran.cloud" />
 *   <Citation source="Sunnah.com" url="https://sunnah.com/bukhari/1" verifiedAt="2026-08-01" />
 *
 * Design goals:
 *   - Zero layout shift (inline-block, small font).
 *   - Screen-reader friendly.
 *   - Never blocks the page — target=_blank + rel=noopener.
 */

import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface CitationProps {
  source: string;
  url?: string;
  /** ISO date the source content was last confirmed accurate. */
  verifiedAt?: string;
  className?: string;
}

const Citation: React.FC<CitationProps> = ({ source, url, verifiedAt, className = '' }) => {
  const label = `Source: ${source}${verifiedAt ? ` (verified ${verifiedAt})` : ''}`;
  const body = (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${className}`}
      aria-label={label}
    >
      {verifiedAt && <ShieldCheck size={10} className="text-bd-green" aria-hidden />}
      <span>src: {source}</span>
      {url && <ExternalLink size={10} aria-hidden />}
    </span>
  );

  if (!url) return body;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex hover:text-bd-green transition-colors"
      title={label}
    >
      {body}
    </a>
  );
};

export default Citation;

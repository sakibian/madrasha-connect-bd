import React from 'react';
import { BookOpen, Book, ExternalLink, Quote } from 'lucide-react';
import { Source } from '../types';

interface CitationBadgeProps {
  source: Source;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

// Brand-aligned citation typology.
//   quran     -> black (national colour, our primary religious anchor)
//   hadith    -> amber (paper/parchment feel, distinct but warm)
//   scholarly -> deep neutral black (authoritative, on-brand)
//   book      -> soft gray (secondary printed material)
//   other     -> gray (fallback)
const typeConfig = {
  quran: { icon: BookOpen, label: 'কুরআন', color: 'text-foreground' },
  hadith: { icon: Book, label: 'হাদিস', color: 'text-foreground' },
  scholarly: { icon: Quote, label: 'গ্রন্থ', color: 'text-foreground' },
  book: { icon: Book, label: 'বই', color: 'text-foreground' },
  other: { icon: ExternalLink, label: 'অন্যান্য', color: 'text-muted-foreground' },
};

const CitationBadge: React.FC<CitationBadgeProps> = ({ source, showIcon = true, size = 'sm' }) => {
  const config = typeConfig[source.type] || typeConfig.other;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1 gap-1.5' : 'text-sm px-3 py-2 gap-2';

  return (
    <div className={`inline-flex items-center ${sizeClasses} bg-muted border border-border rounded group hover:bg-muted transition-all`}>
      {showIcon && <Icon size={size === 'sm' ? 12 : 16} className={config.color} />}
      <span className="font-bold text-foreground">{config.label}</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{source.reference}</span>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-muted-foreground hover:text-foreground transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={size === 'sm' ? 10 : 14} />
        </a>
      )}
    </div>
  );
};

export default CitationBadge;

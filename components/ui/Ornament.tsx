import React from 'react';

/**
 * Khatam — 8-pointed Islamic star, the platform's signature motif.
 * Use sparingly: section dividers, hero accents, empty states.
 */
export const StarOrnament: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <polygon points="12,0 13.87,7.47 20.49,3.51 16.53,10.12 24,12 16.53,13.88 20.49,20.49 13.88,16.53 12,24 10.12,16.53 3.51,20.49 7.47,13.88 0,12 7.47,10.12 3.51,3.51 10.12,7.47" />
  </svg>
);

/** Row of hairline + star + hairline — a section divider ornament. */
export const OrnamentDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
    <div className="flex-1 h-px bg-border" />
    <StarOrnament size={14} className="text-primary" />
    <div className="flex-1 h-px bg-border" />
  </div>
);

export default StarOrnament;

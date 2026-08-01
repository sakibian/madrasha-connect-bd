
import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// Brand palette:
//   success/verified  -> bd-green (national colour)
//   warning/pending   -> amber (only genuine warnings)
//   error/destructive -> red (only genuine danger)
//   info              -> black/white on soft grey (no off-brand blues)
//   default           -> neutral gray
const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-bd-green/10 text-bd-green',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-600',
  info: 'bg-gray-900 text-white',
  default: 'bg-gray-100 text-gray-500',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest inline-block ${variantStyles[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;

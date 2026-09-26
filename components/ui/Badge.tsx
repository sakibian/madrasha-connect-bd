
import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// Brand palette:
//   success/verified  -> black (national colour)
//   warning/pending   -> amber (only genuine warnings)
//   error/destructive -> red (only genuine danger)
//   info              -> black/white on soft grey (no off-brand blues)
//   default           -> neutral gray
const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-muted text-primary border border-primary',
  warning: 'bg-muted text-warning-700 border border-warning-500',
  error: 'bg-muted text-destructive border border-destructive',
  info: 'bg-secondary text-secondary-foreground',
  default: 'bg-muted text-muted-foreground border border-border',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span className={`text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-md inline-block ${variantStyles[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;

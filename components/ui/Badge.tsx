
import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-500',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest inline-block ${variantStyles[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;

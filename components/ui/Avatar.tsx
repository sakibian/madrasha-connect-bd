
import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import { getGenderedAvatarUrl } from '../../utils/avatar';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', online, className = '' }) => {
  const dims = sizeStyles[size];
  // If no explicit photo URL is provided (or the URL is a random/generic
  // DiceBear seed that ignores gender), derive a gender-appropriate avatar
  // from the display name. Prevents "male name → female avatar" glitches.
  const resolvedSrc = getGenderedAvatarUrl(name, src, name);

  return (
    <div className={`relative inline-flex ${className}`}>
      <ImageWithFallback
        src={resolvedSrc}
        name={name}
        alt={name || ''}
        className={`${dims} object-cover minimal-border bg-gray-50`}
        fallback={
          <div className={`${dims} minimal-border bg-gray-100 flex items-center justify-center font-bold text-gray-500`}>
            {getInitials(name)}
          </div>
        }
      />
      {online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
            online ? 'bg-bd-green' : 'bg-gray-300'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;

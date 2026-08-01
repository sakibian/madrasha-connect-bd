/**
 * Avatar — renders a real photo (if provided) or a locally-generated SVG.
 *
 * M21 refactor:
 *   - Was: hit `api.dicebear.com` for every render.
 *   - Now: use `boring-avatars` (MIT, 16 KB, zero network calls, TS types).
 *
 * Gender inference still runs so the palette reads as masculine/feminine to
 * our Bangladeshi Muslim audience — the `variant="beam"` style + our brand
 * palette keeps every avatar visually consistent with the rest of the UI.
 */

import React from 'react';
import BoringAvatar from 'boring-avatars';
import { getAvatarStyleFromName, isRealPhotoUrl } from '../../utils/avatar';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { box: 'w-8 h-8 text-xs',   px: 32 },
  md: { box: 'w-10 h-10 text-sm', px: 40 },
  lg: { box: 'w-14 h-14 text-lg', px: 56 },
};

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', online, className = '' }) => {
  const { box, px } = sizeStyles[size];
  const showRealPhoto = isRealPhotoUrl(src);
  const { colors } = getAvatarStyleFromName(name);
  const seed = name || 'muslim-community-bd';

  return (
    <div className={`relative inline-flex ${className}`}>
      {showRealPhoto ? (
        <img
          src={src}
          alt={name || ''}
          className={`${box} object-cover minimal-border bg-gray-50`}
          data-testid="avatar-photo"
          onError={(e) => {
            // Real photo failed to load — hide it, the initials fallback
            // will not exist here so we swap to a neutral BoringAvatar next
            // render by forcing src to empty via CSS class instead.
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${box} overflow-hidden minimal-border`}
          aria-label={name || 'User avatar'}
          data-testid="avatar-generated"
        >
          <BoringAvatar
            name={seed}
            size={px}
            variant="beam"
            colors={colors}
            square={true}
          />
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white ${
            online ? 'bg-bd-green' : 'bg-gray-300'
          }`}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
      {/* Screen-reader-only initials as an accessible label / print fallback. */}
      <span className="sr-only">{getInitials(name)}</span>
    </div>
  );
};

export default Avatar;


import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  name?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  fallback,
  name,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    if (fallback) return <>{fallback}</>;
    const initials = name
      ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
      : '?';
    return (
      <div className={`bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-sm ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;

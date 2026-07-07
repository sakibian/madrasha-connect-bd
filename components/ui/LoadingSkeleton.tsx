
import React from 'react';

type SkeletonVariant = 'text' | 'card' | 'list' | 'table';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

const variants: Record<SkeletonVariant, React.FC<{ className?: string }>> = {
  text: ({ className }) => (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
    </div>
  ),
  card: ({ className }) => (
    <div className={`bg-white p-8 minimal-border space-y-6 ${className || ''}`}>
      <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
      <div className="flex gap-3">
        <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  ),
  list: ({ className }) => (
    <div className={`space-y-2 ${className || ''}`}>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-4 p-6 bg-white minimal-border">
          <div className="w-10 h-10 bg-gray-100 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  ),
  table: ({ className }) => (
    <div className={`bg-white minimal-border overflow-hidden ${className || ''}`}>
      <div className="p-8 space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-8">
            <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/6 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  ),
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'text', count = 1, className }) => {
  const SkeletonComponent = variants[variant];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} className={className} />
      ))}
    </>
  );
};

export default LoadingSkeleton;

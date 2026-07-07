
import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="bg-white p-20 text-center border border-dashed border-gray-200 space-y-6">
    {icon && <div className="text-gray-200 mx-auto flex justify-center">{icon}</div>}
    <div className="space-y-2">
      <p className="text-xl font-bold text-gray-400">{title}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;

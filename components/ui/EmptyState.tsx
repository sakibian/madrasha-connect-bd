
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
  <div className="bg-card p-20 text-center border border-dashed border-border rounded-lg space-y-6">
    {icon && <div className="text-muted-foreground mx-auto flex justify-center">{icon}</div>}
    <div className="space-y-2">
      <p className="text-xl font-bold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;


import React from 'react';
import Button from './Button';
import { StarOrnament } from './Ornament';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="bg-card p-20 text-center border border-dashed border-border rounded-lg space-y-6 relative overflow-hidden">
    <div className="absolute inset-0 pattern-star" aria-hidden="true" />
    {icon && <div className="relative text-muted-foreground mx-auto flex justify-center">{icon}</div>}
    {!icon && <StarOrnament size={28} className="relative text-primary/40 mx-auto" />}
    <div className="relative space-y-2">
      <p className="text-xl font-bold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <div className="relative"><Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button></div>
    )}
  </div>
);

export default EmptyState;

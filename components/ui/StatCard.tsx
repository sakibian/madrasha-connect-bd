
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, className = '', onClick }) => {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-card text-card-foreground minimal-border rounded-lg p-8 flex flex-col gap-5 group hover:bg-primary hover:text-primary-foreground transition-all text-left ${className}`}
    >
      <div className="text-foreground group-hover:text-primary-foreground transition-colors">{icon}</div>
      <div className="space-y-1">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="caps-label text-muted-foreground group-hover:text-primary-foreground">{label}</div>
      </div>
    </Comp>
  );
};

export default StatCard;

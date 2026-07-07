
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
      className={`bg-white p-8 flex flex-col gap-5 group hover:bg-black hover:text-white transition-all text-left ${className}`}
    >
      <div className="text-bd-green group-hover:text-white transition-colors">{icon}</div>
      <div className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        <div className="caps-label text-gray-400 group-hover:text-gray-500">{label}</div>
      </div>
    </Comp>
  );
};

export default StatCard;

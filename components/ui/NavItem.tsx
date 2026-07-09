
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick, exact }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-4 px-4 py-3 text-sm ${
        isActive
          ? 'bg-black text-white font-bold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium transition-colors'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default NavItem;

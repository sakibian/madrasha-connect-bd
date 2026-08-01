
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import SyncStatus from '../SyncStatus';
import { useNotificationStore } from '../../stores';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const notifications = useNotificationStore((s) => s.notifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  return (
    <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
      {/* Hamburger — mobile only (left side, thumb-friendly) */}
      <button
        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-gray-700"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Search — hidden on mobile (use BottomNav "Explore" tab instead) */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="মাদ্রাসা, রিসোর্স বা চাকরি খুঁজুন..."
            className="w-full pl-6 pr-4 py-3 bg-transparent text-base focus:outline-none font-medium"
          />
        </div>
      </form>

      {/* Right cluster — sync + notifications */}
      <div className="flex items-center gap-3 md:gap-6">
        <SyncStatus />
        <button
          className="text-gray-400 hover:text-black relative min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-bd-green"></span>}
        </button>
      </div>
    </header>
  );
};

export default Header;

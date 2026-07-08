
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
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-30">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="মাদ্রাসা, রিসোর্স বা চাকরি খুঁজুন..."
            className="w-full pl-6 pr-4 py-2 bg-transparent text-sm focus:outline-none font-medium"
          />
        </div>
      </form>
      <div className="flex items-center gap-6">
        <SyncStatus />
        <button className="text-gray-400 hover:text-black relative">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-bd-green"></span>}
        </button>
        <button className="md:hidden" onClick={onMenuToggle}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;

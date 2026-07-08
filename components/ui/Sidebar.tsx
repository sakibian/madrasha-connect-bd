
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, Building2, ShieldCheck, BookOpen,
  ShoppingBag, Heart, Wrench, HelpCircle, GraduationCap, Calendar,
  Trophy, Star, Headset, History, LogOut
} from 'lucide-react';
import NavItem from './NavItem';
import { useAuthStore } from '../../stores';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user: currentUser, logout: storeLogout } = useAuthStore();

  const handleLogout = async () => {
    await storeLogout();
    navigate('/');
  };

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">M</div>
            <span className="text-xl font-bold tracking-tight">MCBD</span>
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="ড্যাশবোর্ড" onClick={onClose} />

            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">Community</p>
              <NavItem to="/community" icon={<Users size={18} />} label="কমিউনিটি" onClick={onClose} />
              <NavItem to="/events" icon={<Calendar size={18} />} label="ইভেন্ট" onClick={onClose} />
              <NavItem to="/professional" icon={<Briefcase size={18} />} label="ক্যারিয়ার হাব" onClick={onClose} />
              <NavItem to="/institutions" icon={<Building2 size={18} />} label="ডিরেক্টরি" onClick={onClose} />
              <NavItem to="/fatwa" icon={<ShieldCheck size={18} />} label="ফতোয়া পোর্টাল" onClick={onClose} />
              <NavItem to="/fatwa/archive" icon={<BookOpen size={18} />} label="ফতোয়া আর্কাইভ" onClick={onClose} />
              <NavItem to="/competitions" icon={<Trophy size={18} />} label="প্রতিযোগিতা" onClick={onClose} />
              <NavItem to="/leaderboard" icon={<Star size={18} />} label="লিডারবোর্ড" onClick={onClose} />
            </div>

            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">Knowledge</p>
              <NavItem to="/knowledge" icon={<BookOpen size={18} />} label="শিক্ষা হাব" onClick={onClose} />
              <NavItem to="/audio-library" icon={<Headset size={18} />} label="অডিও লাইব্রেরি" onClick={onClose} />
              <NavItem to="/seerah" icon={<History size={18} />} label="সীরাত টাইমলাইন" onClick={onClose} />
            </div>

            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">System</p>
              <NavItem to="/marketplace" icon={<ShoppingBag size={18} />} label="মার্কেটপ্লেস" onClick={onClose} />
              <NavItem to="/sadaqah" icon={<Heart size={18} />} label="সাদাকাহ" onClick={onClose} />
              <NavItem to="/tools" icon={<Wrench size={18} />} label="ইউটিলিটি টুলস" onClick={onClose} />
              <NavItem to="/faq" icon={<HelpCircle size={18} />} label="সহায়তা কেন্দ্র" onClick={onClose} />
              <NavItem to="/scholar-dashboard" icon={<GraduationCap size={18} />} label="স্কলার প্যানেল" onClick={onClose} />
              <NavItem to="/scholar/apply" icon={<ShieldCheck size={18} />} label="স্কলার আবেদন" onClick={onClose} />
            </div>
          </nav>

          <div className="pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <img src={currentUser?.avatar} className="w-10 h-10 minimal-border object-cover bg-gray-50" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{currentUser?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full text-left text-xs font-bold text-gray-400 hover:text-black flex items-center gap-2">
              <LogOut size={14} /> সাইন আউট
            </button>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={onClose}></div>
      )}
    </>
  );
};

export default Sidebar;

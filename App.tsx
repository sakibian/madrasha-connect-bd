
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Briefcase, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Search, 
  Bell, 
  Menu, 
  X,
  CheckCircle,
  MessageCircle,
  Trash2,
  Clock,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProfessionalHub from './pages/ProfessionalHub';
import KnowledgeHub from './pages/KnowledgeHub';
import Marketplace from './pages/Marketplace';
import Community from './pages/Community';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import RegisterInstitution from './pages/RegisterInstitution';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FAQ from './pages/FAQ';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from './services/notificationService';
import { getCurrentUser, logout } from './services/authService';
import { AppNotification, User } from './types';

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifTrayOpen, setIsNotifTrayOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };
    const handleNotifUpdate = () => setNotifications(getNotifications());
    
    handleNotifUpdate();
    window.addEventListener('auth_change', handleAuthChange);
    window.addEventListener('notification_update', handleNotifUpdate);
    
    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      window.removeEventListener('notification_update', handleNotifUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const handleNotifClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.link) navigate(n.link);
    setIsNotifTrayOpen(false);
  };

  const publicRoutes = ['/login', '/register-user', '/register-institution'];

  if (!currentUser && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  if (publicRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <header className="md:hidden bg-emerald-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-emerald-800 text-xs">M</span>
          </div>
          মাদ্রাসা কানেক্ট
        </Link>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsNotifTrayOpen(!isNotifTrayOpen)} className="p-2 text-white relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-emerald-800 flex items-center justify-center text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-emerald-100 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:block border-b border-emerald-50">
            <Link to="/" className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center text-white">
                M
              </div>
              মাদ্রাসা কানেক্ট
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
            <NavItem to="/" icon={<HomeIcon size={20} />} label="হোম" onClick={() => setSidebarOpen(false)} />
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="ড্যাশবোর্ড" onClick={() => setSidebarOpen(false)} />
            <NavItem to="/professional" icon={<Briefcase size={20} />} label="প্রফেশনাল হাব" onClick={() => setSidebarOpen(false)} />
            <NavItem to="/knowledge" icon={<BookOpen size={20} />} label="জ্ঞান ও শিক্ষা" onClick={() => setSidebarOpen(false)} />
            <NavItem to="/marketplace" icon={<ShoppingBag size={20} />} label="মার্কেটপ্লেস" onClick={() => setSidebarOpen(false)} />
            <NavItem to="/community" icon={<Users size={20} />} label="কমিউনিটি" onClick={() => setSidebarOpen(false)} />
            
            <div className="pt-4 mt-4 border-t border-emerald-50">
               <NavItem to="/faq" icon={<HelpCircle size={20} />} label="প্রশ্নোত্তর (FAQ)" onClick={() => setSidebarOpen(false)} />
            </div>

            {currentUser?.role === 'ADMIN' && (
              <div className="pt-4 mt-4 border-t border-emerald-50">
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ম্যানেজমেন্ট</p>
                <NavItem to="/admin" icon={<ShieldAlert size={20} />} label="অ্যাডমিন প্যানেল" onClick={() => setSidebarOpen(false)} />
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-emerald-50">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-xs text-emerald-800 font-semibold mb-1">প্রোফাইল টাইপ</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  currentUser?.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                  currentUser?.role === 'INSTITUTION' ? 'bg-blue-100 text-blue-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentUser?.role === 'ADMIN' ? 'অ্যাডমিন' : currentUser?.role === 'INSTITUTION' ? 'প্রতিষ্ঠান' : 'ব্যবহারকারী'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto relative">
        <header className="hidden md:flex bg-white h-16 border-b border-emerald-100 items-center justify-between px-8 sticky top-0 z-30">
          <form onSubmit={handleSearch} className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="মাদ্রাসা, চাকরি বা রিসোর্স খুঁজুন..." 
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
            />
          </form>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotifTrayOpen(!isNotifTrayOpen)}
                className={`p-2 rounded-full transition-all relative ${isNotifTrayOpen ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifTrayOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifTrayOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slideDown">
                    <div className="p-4 bg-emerald-800 text-white flex justify-between items-center">
                      <h3 className="font-bold">নোটিফিকেশন</h3>
                      <div className="flex gap-2">
                        <button onClick={markAllAsRead} className="text-[10px] bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all">সবগুলো পড়ুন</button>
                        <button onClick={clearNotifications} className="p-1 hover:text-red-300 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotifClick(n)}
                            className={`p-4 hover:bg-emerald-50 cursor-pointer transition-colors relative flex gap-3 ${!n.isRead ? 'bg-emerald-50/30' : ''}`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 h-fit ${
                              n.type === 'job' ? 'bg-orange-100 text-orange-600' : 
                              n.type === 'community' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {n.type === 'job' ? <Briefcase size={16} /> : n.type === 'community' ? <MessageCircle size={16} /> : <CheckCircle size={16} />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm leading-snug ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-sm text-gray-400">নতুন নোটিফিকেশন নেই</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">{currentUser?.role}</p>
                </div>
                <img src={currentUser?.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-100 group-hover:border-emerald-300 transition-all" />
              </button>
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slideDown">
                    <button onClick={() => { setIsProfileMenuOpen(false); navigate('/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors">
                      <LayoutDashboard size={18} /> ড্যাশবোর্ড
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50">
                      <LogOut size={18} /> লগআউট
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/professional" element={<ProfessionalHub />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/community" element={<Community />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;

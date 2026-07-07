
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Briefcase, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Search, 
  Bell, 
  Menu, 
  X,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  HelpCircle,
  Building2,
  Wrench,
  History,
  ShieldCheck,
  Trophy,
  Plus,
  // Added missing Headset icon import
  Headset,
  Calendar,
  Heart,
  GraduationCap
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProfessionalHub from './pages/ProfessionalHub';
import KnowledgeHub from './pages/KnowledgeHub';
import Marketplace from './pages/Marketplace';
import FatwaCenter from './pages/FatwaCenter';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import RegisterInstitution from './pages/RegisterInstitution';
import FAQ from './pages/FAQ';
import InstitutionDirectory from './pages/InstitutionDirectory';
import InstitutionDetail from './pages/InstitutionDetail';
import ScholarDirectory from './pages/ScholarDirectory';
import CalligraphyGallery from './pages/CalligraphyGallery';
import SeerahTimeline from './pages/SeerahTimeline';
import Deen101 from './pages/Deen101';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import PostJob from './pages/Institution/PostJob';
import ERPPreview from './pages/Institution/ERPPreview';
import ProfileBuilder from './pages/ProfileBuilder';
import InstructionalHelp from './pages/InstructionalHelp';
import Competitions from './pages/Competitions';
import AudioLibrary from './pages/AudioLibrary';
import Tools from './pages/Tools';
import Community from './pages/Community';
import EventsHub from './pages/EventsHub';
import SadaqahHub from './pages/SadaqahHub';
import FatwaArchive from './pages/FatwaArchive';
import ScholarDashboard from './pages/ScholarDashboard';
import ScholarApply from './pages/ScholarApply';

import { getNotifications, initNotifications } from './services/notificationService';
import { getCurrentUser, logout, initAuth } from './services/authService';
import { AppNotification, User } from './types';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

const AppRouter: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [, refresh] = useState(0);
  const location = useLocation();

  useEffect(() => {
    initAuth().then(() => setReady(true));
    const onAuth = () => refresh(n => n + 1);
    window.addEventListener('auth_change', onAuth);
    return () => window.removeEventListener('auth_change', onAuth);
  }, []);

  const currentUser = getCurrentUser();

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-bold text-xl animate-pulse">M</div>
        <div className="caps-label text-gray-400 animate-pulse">Initializing...</div>
      </div>
    );
  }

  const publicPaths = [
    '/', '/about', '/institutions', '/knowledge', '/professional', 
    '/scholars', '/fatwa', '/marketplace', '/seerah', '/calligraphy', 
    '/search', '/deen101', '/faq', '/competitions', '/audio-library', '/tools',
    '/fatwa/archive', '/scholar-dashboard', '/scholar/apply'
  ];
  
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname.startsWith('/institution/');
  const isAuthPage = ['/login', '/register-user', '/register-institution'].includes(location.pathname);

  if (isAuthPage) {
    if (currentUser) return <Navigate to="/dashboard" replace />;
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
      </Routes>
    );
  }

  if (currentUser) {
    return <ErrorBoundary key="app"><AppLayout currentUser={currentUser} /></ErrorBoundary>;
  }

  if (isPublicPage) {
    return <ErrorBoundary key="public"><PublicLayout /></ErrorBoundary>;
  }

  return <Navigate to="/" replace />;
};

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === '/') return <LandingPage />;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/about" className="text-sm font-bold text-gray-500 hover:text-black">লক্ষ্য</Link>
            <Link to="/institutions" className="text-sm font-bold text-gray-500 hover:text-black">ডিরেক্টরি</Link>
            <Link to="/knowledge" className="text-sm font-bold text-gray-500 hover:text-black">শিক্ষা</Link>
            <Link to="/community" className="text-sm font-bold text-gray-500 hover:text-black">কমিউনিটি</Link>
            <Link to="/events" className="text-sm font-bold text-gray-500 hover:text-black">ইভেন্ট</Link>
            <Link to="/professional" className="text-sm font-bold text-gray-500 hover:text-black">ক্যারিয়ার</Link>
            <Link to="/login" className="text-sm font-bold border-b-2 border-black pb-0.5">লগইন</Link>
          </div>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/institutions" element={<InstitutionDirectory />} />
          <Route path="/institution/:id" element={<InstitutionDetail />} />
          <Route path="/scholars" element={<ScholarDirectory />} />
          <Route path="/professional" element={<ProfessionalHub />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/seerah" element={<SeerahTimeline />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/fatwa" element={<FatwaCenter />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/deen101" element={<Deen101 />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/audio-library" element={<AudioLibrary />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/calligraphy" element={<CalligraphyGallery />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<EventsHub />} />
          <Route path="/sadaqah" element={<SadaqahHub />} />
          <Route path="/fatwa/archive" element={<FatwaArchive />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
          <Route path="/scholar/apply" element={<ScholarApply />} />
        </Routes>
      </div>
    </div>
  );
};

const AppLayout: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const load = async () => setNotifications(await getNotifications());
    load();
    window.addEventListener('notification_update', load);
    return () => window.removeEventListener('notification_update', load);
  }, []);

  useEffect(() => {
    initNotifications(currentUser.id);
  }, [currentUser.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9FAFB]">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">M</div>
            <span className="text-xl font-bold tracking-tight">MCBD</span>
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="ড্যাশবোর্ড" onClick={closeSidebar} />
            
            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">Community</p>
              <NavItem to="/community" icon={<Users size={18} />} label="কমিউনিটি" onClick={closeSidebar} />
              <NavItem to="/events" icon={<Calendar size={18} />} label="ইভেন্ট" onClick={closeSidebar} />
              <NavItem to="/professional" icon={<Briefcase size={18} />} label="ক্যারিয়ার হাব" onClick={closeSidebar} />
              <NavItem to="/institutions" icon={<Building2 size={18} />} label="ডিরেক্টরি" onClick={closeSidebar} />
              <NavItem to="/fatwa" icon={<ShieldCheck size={18} />} label="ফতোয়া পোর্টাল" onClick={closeSidebar} />
              <NavItem to="/fatwa/archive" icon={<BookOpen size={18} />} label="ফতোয়া আর্কাইভ" onClick={closeSidebar} />
              <NavItem to="/competitions" icon={<Trophy size={18} />} label="প্রতিযোগিতা" onClick={closeSidebar} />
            </div>

            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">Knowledge</p>
              <NavItem to="/knowledge" icon={<BookOpen size={18} />} label="শিক্ষা হাব" onClick={closeSidebar} />
              <NavItem to="/audio-library" icon={<Headset size={18} />} label="অডিও লাইব্রেরি" onClick={closeSidebar} />
              <NavItem to="/seerah" icon={<History size={18} />} label="সীরাত টাইমলাইন" onClick={closeSidebar} />
            </div>

            <div className="pt-8 pb-2">
              <p className="caps-label text-gray-400 mb-4 px-2">System</p>
              <NavItem to="/marketplace" icon={<ShoppingBag size={18} />} label="মার্কেটপ্লেস" onClick={closeSidebar} />
              <NavItem to="/sadaqah" icon={<Heart size={18} />} label="সাদাকাহ" onClick={closeSidebar} />
              <NavItem to="/tools" icon={<Wrench size={18} />} label="ইউটিলিটি টুলস" onClick={closeSidebar} />
              <NavItem to="/faq" icon={<HelpCircle size={18} />} label="সহায়তা কেন্দ্র" onClick={closeSidebar} />
              <NavItem to="/scholar-dashboard" icon={<GraduationCap size={18} />} label="স্কলার প্যানেল" onClick={closeSidebar} />
              <NavItem to="/scholar/apply" icon={<ShieldCheck size={18} />} label="স্কলার আবেদন" onClick={closeSidebar} />
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

      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
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
             <button className="text-gray-400 hover:text-black relative">
               <Bell size={20} />
               {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-bd-green"></span>}
             </button>
             <button className="md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
               {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/institutions" element={<InstitutionDirectory />} />
            <Route path="/institution/:id" element={<InstitutionDetail />} />
            <Route path="/scholars" element={<ScholarDirectory />} />
            <Route path="/professional" element={<ProfessionalHub />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/seerah" element={<SeerahTimeline />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/fatwa" element={<FatwaCenter />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/deen101" element={<Deen101 />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/erp-preview" element={<ERPPreview />} />
            <Route path="/profile-builder" element={<ProfileBuilder />} />
            <Route path="/help" element={<InstructionalHelp />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/audio-library" element={<AudioLibrary />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/calligraphy" element={<CalligraphyGallery />} />
            <Route path="/community" element={<Community />} />
            <Route path="/events" element={<EventsHub />} />
            <Route path="/sadaqah" element={<SadaqahHub />} />
            <Route path="/fatwa/archive" element={<FatwaArchive />} />
            <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
            <Route path="/scholar/apply" element={<ScholarApply />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 text-sm transition-all ${
        isActive 
          ? 'bg-black text-white font-bold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;

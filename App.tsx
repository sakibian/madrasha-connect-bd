
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
import Leaderboard from './pages/Leaderboard';
import PublicProfile from './pages/PublicProfile';
import Forbidden from './pages/Forbidden';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';

import { initNotifications } from './services/notificationService';
import { User } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { SyncStatusProvider } from './contexts/SyncStatusContext';
import { useAuthStore, useNotificationStore } from './stores';
import { Header, Sidebar } from './components/ui';

const App: React.FC = () => {
  return (
    <Router>
      <SyncStatusProvider>
        <AppRouter />
      </SyncStatusProvider>
    </Router>
  );
};

const AppRouter: React.FC = () => {
  const location = useLocation();
  const { user: currentUser, initialized, init } = useAuthStore();
  const { fetch: fetchNotifications } = useNotificationStore();

  useEffect(() => {
    init();
  }, []);

  if (!initialized) {
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
    '/fatwa/archive', '/scholar-dashboard', '/scholar/apply', '/leaderboard', '/forbidden',
    '/community', '/events', '/sadaqah'
  ];
  
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname.startsWith('/institution/') || location.pathname.startsWith('/profile/');
  const isAuthPage = ['/login', '/register-user', '/register-institution', '/forgot-password', '/verify-email'].includes(location.pathname);

  if (isAuthPage) {
    if (currentUser) return <Navigate to="/dashboard" replace />;
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
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
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </div>
    </div>
  );
};

const AppLayout: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { fetch: fetchNotifs } = useNotificationStore();

  useEffect(() => {
    fetchNotifs();
  }, []);

  useEffect(() => {
    initNotifications(currentUser.id);
  }, [currentUser.id]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9FAFB]">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
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
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/post-job" element={<ProtectedRoute requiredRole="INSTITUTION"><PostJob /></ProtectedRoute>} />
            <Route path="/erp-preview" element={<ProtectedRoute requiredRole="INSTITUTION"><ERPPreview /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;

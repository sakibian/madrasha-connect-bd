
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ToastProvider } from './components/ui/Toast';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const ProfessionalHub = lazy(() => import('./pages/ProfessionalHub'));
const KnowledgeHub = lazy(() => import('./pages/KnowledgeHub'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const FatwaCenter = lazy(() => import('./pages/FatwaCenter'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Login = lazy(() => import('./pages/Login'));
const RegisterUser = lazy(() => import('./pages/RegisterUser'));
const RegisterInstitution = lazy(() => import('./pages/RegisterInstitution'));
const FAQ = lazy(() => import('./pages/FAQ'));
const InstitutionDirectory = lazy(() => import('./pages/InstitutionDirectory'));
const InstitutionDetail = lazy(() => import('./pages/InstitutionDetail'));
const ScholarDirectory = lazy(() => import('./pages/ScholarDirectory'));
const CalligraphyGallery = lazy(() => import('./pages/CalligraphyGallery'));
const SeerahTimeline = lazy(() => import('./pages/SeerahTimeline'));
const Deen101 = lazy(() => import('./pages/Deen101'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const PostJob = lazy(() => import('./pages/Institution/PostJob'));
const ERPPreview = lazy(() => import('./pages/Institution/ERPPreview'));
const ProfileBuilder = lazy(() => import('./pages/ProfileBuilder'));
const InstructionalHelp = lazy(() => import('./pages/InstructionalHelp'));
const Competitions = lazy(() => import('./pages/Competitions'));
const AudioLibrary = lazy(() => import('./pages/AudioLibrary'));
const Tools = lazy(() => import('./pages/Tools'));
const Community = lazy(() => import('./pages/Community'));
const EventsHub = lazy(() => import('./pages/EventsHub'));
const SadaqahHub = lazy(() => import('./pages/SadaqahHub'));
const FatwaArchive = lazy(() => import('./pages/FatwaArchive'));
const ScholarDashboard = lazy(() => import('./pages/ScholarDashboard'));
const ScholarApply = lazy(() => import('./pages/ScholarApply'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
import ProtectedRoute from './components/ProtectedRoute';

import { initNotifications } from './services/notificationService';
import ErrorBoundary from './components/ErrorBoundary';
import { SyncStatusProvider } from './contexts/SyncStatusContext';
import { useAuthStore, useNotificationStore } from './stores';
import { Header, Sidebar, PageLoader } from './components/ui';

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
  const { user: currentUser, initialized, init } = useAuthStore();

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

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </ErrorBoundary>
  );
};

const Shell: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useAuthStore();
  const { fetch: fetchNotifs } = useNotificationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchNotifs();
      initNotifications(currentUser.id);
    }
  }, [currentUser?.id]);

  const authPaths = ['/login', '/register-user', '/register-institution', '/forgot-password', '/verify-email'];
  const isAuthPage = authPaths.includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  if (isAuthPage) {
    if (currentUser) return <Navigate to="/dashboard" replace />;
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-institution" element={<RegisterInstitution />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </Suspense>
    );
  }

  if (isLandingPage && !currentUser) return <LandingPage />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9FAFB]">
      {currentUser && (
        <>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-black focus:text-white focus:px-6 focus:py-3 focus:font-bold">
            মূল কন্টেন্টে যান
          </a>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {currentUser && (
          <Header onMenuToggle={() => setSidebarOpen(s => !s)} isSidebarOpen={isSidebarOpen} />
        )}
        {!currentUser && !isLandingPage && (
          <nav className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold">M</div>
                <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                <Link to="/about" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">লক্ষ্য</Link>
                <Link to="/institutions" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">ডিরেক্টরি</Link>
                <Link to="/knowledge" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">শিক্ষা</Link>
                <Link to="/community" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">কমিউনিটি</Link>
                <Link to="/events" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">ইভেন্ট</Link>
                <Link to="/professional" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">ক্যারিয়ার</Link>
                <Link to="/login" className="text-sm font-bold border-b-2 border-black pb-0.5">লগইন</Link>
              </div>
              <button className="lg:hidden" onClick={() => setSidebarOpen(s => !s)}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        )}
        <div aria-live="polite" aria-atomic="true" className="sr-only"></div>
        <div className={`w-full ${currentUser ? 'p-8 md:p-12 max-w-6xl mx-auto' : 'max-w-7xl mx-auto px-6 py-12'}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
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
              <Route path="/scholar-dashboard" element={<ProtectedRoute requiredRole="SCHOLAR"><ScholarDashboard /></ProtectedRoute>} />
              <Route path="/scholar/apply" element={<ProtectedRoute requiredRole="USER"><ScholarApply /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/accessibility" element={<AccessibilityStatement />} />
              <Route path="/profile-builder" element={<ProfileBuilder />} />
              <Route path="/help" element={<InstructionalHelp />} />
              <Route path="/post-job" element={<ProtectedRoute requiredRole="INSTITUTION"><PostJob /></ProtectedRoute>} />
              <Route path="/erp-preview" element={<ProtectedRoute requiredRole="INSTITUTION"><ERPPreview /></ProtectedRoute>} />
              {currentUser && <Route path="/" element={<Home />} />}
              <Route path="*" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;

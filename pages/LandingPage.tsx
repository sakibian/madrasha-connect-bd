
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Briefcase, 
  BookOpen, 
  Users, 
  Menu, 
  X,
  MapPin,
  Check,
  Search,
  Globe,
  ArrowUpRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimalist Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-gray-100 py-4' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold group-hover:rotate-6 transition-transform">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <MinimalNavLink to="/about" label="লক্ষ্য" />
              <MinimalNavLink to="/institutions" label="ডিরেক্টরি" />
              <MinimalNavLink to="/knowledge" label="শিক্ষা" />
              <MinimalNavLink to="/professional" label="ক্যারিয়ার" />
              <MinimalNavLink to="/fatwa" label="ফতোয়া" />
            </div>
            <Link to="/login" className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-500 transition-colors">লগইন</Link>
            <Link to="/register-user" className="bg-black text-white px-6 py-2.5 text-sm font-bold hover:bg-gray-800 transition-all">
              শুরু করুন
            </Link>
          </div>

          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-6 animate-slideDown shadow-xl">
            <Link to="/about" className="font-bold text-lg">আমাদের লক্ষ্য</Link>
            <Link to="/institutions" className="font-bold text-lg">প্রতিষ্ঠান ডিরেক্টরি</Link>
            <Link to="/knowledge" className="font-bold text-lg">শিক্ষা ও রিসোর্স</Link>
            <Link to="/professional" className="font-bold text-lg">ক্যারিয়ার হাব</Link>
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
              <Link to="/login" className="font-bold text-lg">লগইন</Link>
              <Link to="/register-user" className="bg-black text-white px-6 py-4 text-center font-bold">শুরু করুন</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero: Bold & Minimalist */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl space-y-12">
            <div className="caps-label text-gray-400">Bangladesh Digital Initiative</div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 leading-[1.05] tracking-tight text-balanced">
              মাদ্রাসা শিক্ষার <br /> আধুনিক রূপান্তর।
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-medium">
              বাংলাদেশের মাদ্রাসা ও দ্বীনি প্রতিষ্ঠানের জন্য একটি সমন্বিত এবং মার্জিত ডিজিটাল ইকোসিস্টেম।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register-user" className="bg-black text-white px-10 py-5 font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all group">
                অংশ নিন <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="border border-gray-200 px-10 py-5 font-bold text-lg hover:bg-gray-50 transition-all text-center">
                বিস্তারিত জানুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Grid Split */}
      <section className="border-y border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatItem label="নিবন্ধিত মাদ্রাসা" value="৩,০০০+" />
        <StatItem label="শিক্ষার্থী ও স্টাফ" value="২০০কে+" />
        <StatItem label="বর্তমান সার্কুলার" value="৫০০+" />
        <StatItem label="সদস্য জেলা" value="৬৪টি" />
      </section>

      {/* Core Services: Minimal Bento */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="caps-label text-bd-green">Services</div>
              <h2 className="text-4xl md:text-5xl font-extrabold">একক প্ল্যাটফর্ম, বহু সমাধান।</h2>
            </div>
            <Link to="/knowledge" className="text-sm font-bold flex items-center gap-2 group">
              সবগুলো দেখুন <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
            <ServiceCard 
              icon={<Briefcase size={28} />} 
              title="নিয়োগ পোর্টাল" 
              desc="ইমাম, মুয়াজ্জিন এবং শিক্ষকদের জন্য বিশেষায়িত জব মার্কেটপ্লেস।"
              link="/professional"
            />
            <ServiceCard 
              icon={<BookOpen size={28} />} 
              title="শিক্ষা রিসোর্স" 
              desc="বেফাক ও আলিয়া কারিকুলামের সকল কিতাব এবং শিখন সামগ্রী।"
              link="/knowledge"
            />
            <ServiceCard 
              icon={<Users size={28} />} 
              title="স্মার্ট ডিরেক্টরি" 
              desc="বাংলাদেশের সকল ভেরিফাইড প্রতিষ্ঠানের পূর্ণাঙ্গ তথ্য ভাণ্ডার।"
              link="/institutions"
            />
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="lg:w-1/2 space-y-12">
            <div className="caps-label text-gray-400">Our Philosophy</div>
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">ঐতিহ্যের মর্যাদা <br /> ডিজিটাল দক্ষতায়।</h2>
            <p className="text-xl text-gray-500 leading-relaxed font-medium">
              আমরা শুধু একটি ওয়েবসাইট নই, আমরা মাদ্রাসা কমিউনিটির ডিজিটাল সক্ষমতা বৃদ্ধির একটি দীর্ঘমেয়াদী প্রকল্প। আমাদের প্রতিটি সমাধান ডিজাইন করা হয়েছে আলেমগণের সরাসরি তত্ত্বাবধানে।
            </p>
            <div className="space-y-4">
              <CheckItem label="১০০% ডাটা সিকিউরিটি ও গোপনীয়তা" />
              <CheckItem label="সম্পূর্ণ বিজ্ঞাপনমুক্ত দ্বীনি পরিবেশ" />
              <CheckItem label="সহজ এবং সাবলীল বাংলা ইন্টারফেস" />
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
               <img 
                 src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                 alt="Bangladesh Madrasa" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-black text-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 pb-32">
            <div className="space-y-8 md:col-span-2">
               <div className="flex items-center gap-3 group">
                 <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-xs group-hover:rotate-6 transition-transform">M</div>
                 <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
               </div>
               <p className="text-gray-400 max-w-sm text-lg font-medium leading-relaxed">
                 বাংলাদেশের মাদ্রাসা কমিউনিটির শিক্ষা ও পেশাগত উন্নয়নে নিবেদিত প্রথম স্মার্ট প্ল্যাটফর্ম।
               </p>
            </div>
            <div className="space-y-6">
               <div className="caps-label text-gray-500">Platform</div>
               <ul className="space-y-4 text-sm font-bold">
                 <li><Link to="/professional" className="hover:text-bd-green transition-colors">জব পোর্টাল</Link></li>
                 <li><Link to="/knowledge" className="hover:text-bd-green transition-colors">শিক্ষা হাব</Link></li>
                 <li><Link to="/institutions" className="hover:text-bd-green transition-colors">ডিরেক্টরি</Link></li>
                 <li><Link to="/fatwa" className="hover:text-bd-green transition-colors">ফতোয়া পোর্টাল</Link></li>
               </ul>
            </div>
            <div className="space-y-6">
               <div className="caps-label text-gray-500">Resources</div>
               <ul className="space-y-4 text-sm font-bold">
                 <li><Link to="/faq" className="hover:text-bd-green transition-colors">সাধারণ জিজ্ঞাসা</Link></li>
                 <li><Link to="/seerah" className="hover:text-bd-green transition-colors">সীরাত টাইমলাইন</Link></li>
                 <li><Link to="/marketplace" className="hover:text-bd-green transition-colors">মার্কেটপ্লেস</Link></li>
               </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">© 2025 Madrasa Connect BD. All rights reserved.</div>
             <div className="flex gap-10">
                {['Facebook', 'Twitter', 'YouTube'].map(s => (
                  <a key={s} href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{s}</a>
                ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MinimalNavLink = ({ to, label }: { to: string, label: string }) => (
  <Link to={to} className="text-sm font-bold text-gray-600 hover:text-black transition-colors">{label}</Link>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="p-10 border-r border-gray-100 last:border-none flex flex-col gap-2">
    <div className="text-4xl font-extrabold">{value}</div>
    <div className="caps-label text-gray-400">{label}</div>
  </div>
);

const ServiceCard = ({ icon, title, desc, link }: any) => (
  <Link to={link} className="bg-white p-12 hover:bg-black hover:text-white transition-all group h-[400px] flex flex-col justify-between">
    <div className="text-bd-green group-hover:text-white transition-colors">{icon}</div>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-500 group-hover:text-gray-400 leading-relaxed font-medium text-sm">{desc}</p>
      <div className="pt-4 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        Open Portal <ArrowRight size={16} />
      </div>
    </div>
  </Link>
);

const CheckItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-4">
    <div className="w-5 h-5 bg-bd-green flex items-center justify-center text-white">
      <Check size={14} strokeWidth={3} />
    </div>
    <span className="font-bold text-gray-700">{label}</span>
  </div>
);

export default LandingPage;

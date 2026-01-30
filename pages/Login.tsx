
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, School, User as UserIcon, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async (email: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = login(email);
    if (user) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-fadeIn">
      {/* Visual Side */}
      <div className="lg:w-1/2 bg-black text-white p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold text-xl group-hover:rotate-6 transition-transform">M</div>
            <span className="text-2xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
          </Link>
        </div>
        
        <div className="z-10 space-y-8 max-w-lg">
           <div className="caps-label text-bd-green">Security First</div>
           <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.05] tracking-tight">
             নিরাপদ <br />পোর্টালে <br />স্বাগতম।
           </h1>
           <p className="text-xl text-gray-400 leading-relaxed font-medium">
             আপনার সঠিক রোল নির্বাচন করে সিস্টেমে প্রবেশ করুন। আমরা আপনার তথ্যের সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।
           </p>
        </div>

        <div className="z-10">
           <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={18} /> আমাদের সম্পর্কে জানুন
           </Link>
        </div>

        {/* Subtle Decorative Element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[1px] border-gray-900 rounded-full"></div>
      </div>

      {/* Action Side */}
      <div className="lg:w-1/2 p-8 md:p-24 flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-full max-w-md space-y-16">
          <div className="space-y-4">
            <div className="caps-label text-gray-400">Authentication</div>
            <h2 className="text-4xl font-extrabold tracking-tight">লগইন করুন।</h2>
            <p className="text-gray-500 font-medium">নিচের তালিকা থেকে আপনার ব্যবহারের ধরনটি নির্বাচন করুন।</p>
          </div>

          <div className="space-y-0 bg-gray-100 minimal-border overflow-hidden">
            <LoginRoleButton 
              icon={<ShieldCheck size={24} />} 
              label="সিস্টেম অ্যাডমিন" 
              sub="প্ল্যাটফর্ম নিয়ন্ত্রক"
              onClick={() => handleQuickLogin('admin@madrasa.bd')} 
              disabled={loading}
            />
            <LoginRoleButton 
              icon={<School size={24} />} 
              label="মাদ্রাসা / মসজিদ" 
              sub="প্রাতিষ্ঠানিক অ্যাকাউন্ট"
              onClick={() => handleQuickLogin('hathazari@madrasa.bd')} 
              disabled={loading}
            />
            <LoginRoleButton 
              icon={<UserIcon size={24} />} 
              label="শিক্ষার্থী / ব্যবহারকারী" 
              sub="ব্যক্তিগত অ্যাকাউন্ট"
              onClick={() => handleQuickLogin('student@madrasa.bd')} 
              disabled={loading}
            />
          </div>

          <div className="pt-12 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
             <span className="text-sm font-bold text-gray-400">আপনার কি কোনো অ্যাকাউন্ট নেই?</span>
             <Link to="/register-user" className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 transition-all">
                নতুন অ্যাকাউন্ট তৈরি
             </Link>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
           <Loader2 className="animate-spin text-black mb-6" size={48} />
           <div className="caps-label text-black">Authenticating Identity</div>
        </div>
      )}
    </div>
  );
};

const LoginRoleButton = ({ icon, label, sub, onClick, disabled }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-between p-8 bg-white border-b border-gray-100 last:border-none hover:bg-black hover:text-white transition-all group text-left"
  >
    <div className="flex items-center gap-6">
      <div className="text-bd-green group-hover:text-white transition-colors">{icon}</div>
      <div>
        <span className="block font-extrabold text-xl">{label}</span>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500">{sub}</span>
      </div>
    </div>
    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
  </button>
);

export default Login;

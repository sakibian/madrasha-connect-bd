
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, School, User as UserIcon, Loader2, ArrowRight, ArrowLeft, Lock, Mail } from 'lucide-react';
import { login, resendVerificationEmail } from '../services/authService';

const DEMO_PASSWORD = 'madrasa123';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setLoading(true);
    setError('');
    setUnconfirmedEmail('');
    const user = await login(demoEmail, DEMO_PASSWORD);
    if (user) navigate('/dashboard');
    else setError('ডেমো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে রেজিস্ট্রেশন করুন।');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    setUnconfirmedEmail('');
    const user = await login(email, password);
    if (user) navigate('/dashboard');
    else {
      const { error: signInError } = await (await import('../services/supabase')).supabase.auth.signInWithPassword({ email, password });
      if (signInError?.message?.toLowerCase().includes('email not confirmed')) {
        setUnconfirmedEmail(email);
        setError('');
      } else {
        setError('ইমেইল বা পাসওয়ার্ড ভুল।');
      }
    }
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
             আপনার ইমেইল ও পাসওয়ার্ড ব্যবহার করে লগইন করুন। প্ল্যাটফর্ম আপনার তথ্যের সর্বোচ্চ নিরাপত্তা নিশ্চিত করে।
           </p>
        </div>

        <div className="z-10 space-y-4">
           <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={18} /> আমাদের সম্পর্কে জানুন
           </Link>
           <div className="pt-4">
              <p className="text-xs text-gray-600 font-mono">Demo password: <span className="text-bd-green">{DEMO_PASSWORD}</span></p>
           </div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[1px] border-gray-900 rounded-full"></div>
      </div>

      {/* Action Side */}
      <div className="lg:w-1/2 p-8 md:p-24 flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <div className="caps-label text-gray-400">Authentication</div>
            <h2 className="text-4xl font-extrabold tracking-tight">লগইন করুন।</h2>
            <p className="text-gray-500 font-medium">ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন, অথবা দ্রুত লগইন ব্যবহার করুন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="ইমেইল"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium text-lg"
                  required
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium text-lg"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            {unconfirmedEmail && (
              <UnconfirmedEmailBanner email={unconfirmedEmail} />
            )}

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-extrabold text-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>সাইন ইন করুন <ArrowRight size={24} /></>}
            </button>
          </form>

          <div className="space-y-4">
            <div className="caps-label text-gray-400 text-center">অথবা দ্রুত লগইন</div>
            <div className="space-y-0 bg-gray-100 minimal-border overflow-hidden">
              <LoginRoleButton 
                icon={<ShieldCheck size={20} />} 
                label="সিস্টেম অ্যাডমিন" 
                sub="প্ল্যাটফর্ম নিয়ন্ত্রক"
                onClick={() => handleQuickLogin('admin@madrasa.bd')} 
                disabled={loading}
              />
              <LoginRoleButton 
                icon={<School size={20} />} 
                label="মাদ্রাসা / মসজিদ" 
                sub="প্রাতিষ্ঠানিক অ্যাকাউন্ট"
                onClick={() => handleQuickLogin('hathazari@madrasa.bd')} 
                disabled={loading}
              />
              <LoginRoleButton 
                icon={<UserIcon size={20} />} 
                label="শিক্ষার্থী / ব্যবহারকারী" 
                sub="ব্যক্তিগত অ্যাকাউন্ট"
                onClick={() => handleQuickLogin('student@madrasa.bd')} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
             <span className="text-sm font-bold text-gray-400">আপনার কি কোনো অ্যাকাউন্ট নেই?</span>
             <Link to="/register-user" className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 transition-all">
                নতুন অ্যাকাউন্ট তৈরি
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnconfirmedEmailBanner: React.FC<{ email: string }> = ({ email }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerificationEmail(email);
      setSent(true);
    } catch { }
    setSending(false);
  };

  return (
    <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
      <div className="flex items-start gap-3">
        <Mail size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-800 text-sm">ইমেইল ভেরিফাই করুন</p>
          <p className="text-xs text-amber-600 mt-1">
            আপনার ইমেইল এখনো ভেরিফাই করা হয়নি। অনুগ্রহ করে <strong>{email}</strong>-এ পাঠানো লিংকে ক্লিক করুন।
          </p>
        </div>
      </div>
      {sent ? (
        <p className="text-xs font-bold text-emerald-600">✓ পুনরায় পাঠানো হয়েছে!</p>
      ) : (
        <button
          onClick={handleResend}
          disabled={sending}
          className="text-xs font-bold text-amber-700 underline hover:no-underline disabled:opacity-50"
        >
          {sending ? 'পাঠানো হচ্ছে...' : 'ভেরিফিকেশন ইমেইল পুনরায় পাঠান'}
        </button>
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

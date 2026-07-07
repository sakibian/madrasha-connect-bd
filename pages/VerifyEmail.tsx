import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { resendVerificationEmail } from '../services/authService';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    setError('');
    try {
      await resendVerificationEmail(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message || 'পুনরায় ইমেইল পাঠাতে ব্যর্থ');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">M</div>
          <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
        </Link>

        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Mail size={36} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">ইমেইল ভেরিফিকেশন</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            আমরা <strong className="text-black">{email}</strong> এই ঠিকানায় একটি ভেরিফিকেশন ইমেইল পাঠিয়েছি।
            আপনার ইনবক্স চেক করুন এবং অ্যাকাউন্ট অ্যাক্টিভেট করতে লিংকে ক্লিক করুন।
          </p>
        </div>

        {sent && (
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-bold text-emerald-700">ভেরিফিকেশন ইমেইল পুনরায় পাঠানো হয়েছে!</p>
          </div>
        )}

        {error && (
          <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={sending}
            className="w-full py-5 bg-black text-white font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 rounded-2xl"
          >
            {sending ? <Loader2 size={22} className="animate-spin" /> : <RefreshCw size={22} />}
            {sending ? 'পাঠানো হচ্ছে...' : 'পুনরায় ইমেইল পাঠান'}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-5 border border-gray-200 text-gray-600 font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all rounded-2xl"
          >
            লগইন পৃষ্ঠায় যান <ArrowRight size={22} />
          </button>
        </div>

        <p className="text-xs text-gray-400 font-medium">
          স্প্যাম ফোল্ডার চেক করতে ভুলবেন না। ৫ মিনিটের মধ্যে ইমেইল না পেলে পুনরায় পাঠান বাটনে ক্লিক করুন।
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={16} /> লগইনে ফিরুন
        </Link>

        {sent ? (
          <div className="bg-white p-12 minimal-border text-center space-y-6">
            <CheckCircle size={48} className="text-bd-green mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold">ইমেইল পাঠানো হয়েছে</h1>
              <p className="text-gray-500 font-medium">আপনার ইমেইলে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে।</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 minimal-border space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold">পাসওয়ার্ড রিসেট</h1>
              <p className="text-gray-500 font-medium">আপনার নিবন্ধিত ইমেইল ঠিকানা দিন। আমরা একটি রিসেট লিংক পাঠাব।</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="caps-label text-gray-400">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                রিসেট লিংক পাঠান
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 font-medium">
              <Link to="/login" className="font-bold text-black hover:underline">লগইন পৃষ্ঠায় ফিরুন</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

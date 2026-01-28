
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, School, User as UserIcon, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickLogin = async (email: string) => {
    setLoading(true);
    setError('');
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const user = login(email);
    if (user) {
      navigate('/');
    } else {
      setError('লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden relative">
      {/* Decorative Patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn relative z-10">
        <div className="p-8 text-center bg-emerald-50/50">
          <div className="w-20 h-20 bg-emerald-700 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 rotate-3">
             <span className="text-4xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">স্বাগতম</h1>
          <p className="text-emerald-700 font-medium">মাদ্রাসা কানেক্ট বিডি প্ল্যাটফর্মে প্রবেশ করুন</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">দ্রুত লগইন করুন</p>
            
            <RoleButton 
              icon={<ShieldCheck size={24} />}
              title="অ্যাডমিন হিসেবে প্রবেশ"
              description="সিস্টেম ম্যানেজমেন্ট ও ভেরিফিকেশন"
              onClick={() => handleQuickLogin('admin@madrasa.bd')}
              disabled={loading}
              variant="admin"
            />
            
            <RoleButton 
              icon={<School size={24} />}
              title="প্রতিষ্ঠান হিসেবে প্রবেশ"
              description="মাদ্রাসা/মসজিদ"
              onClick={() => handleQuickLogin('hathazari@madrasa.bd')}
              disabled={loading}
              variant="institution"
            />
            
            <RoleButton 
              icon={<UserIcon size={24} />}
              title="ব্যবহারকারী হিসেবে প্রবেশ"
              description="শিক্ষক বা শিক্ষার্থী"
              onClick={() => handleQuickLogin('student@madrasa.bd')}
              disabled={loading}
              variant="user"
            />
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-4">অ্যাকাউন্ট নেই? রেজিস্ট্রেশন করুন</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/register-user" className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-100">
                <UserIcon size={20} className="mb-1" />
                <span className="text-[10px] font-bold">সাধারণ ইউজার</span>
              </Link>
              <Link to="/register-institution" className="flex flex-col items-center p-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all border border-blue-100">
                <School size={20} className="mb-1" />
                <span className="text-[10px] font-bold">মাদ্রাসা/মসজিদ</span>
              </Link>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <Loader2 size={48} className="text-emerald-700 animate-spin mb-4" />
            <p className="text-emerald-900 font-bold">আপনার প্রোফাইল লোড হচ্ছে...</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface RoleButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  variant: 'admin' | 'institution' | 'user';
}

const RoleButton: React.FC<RoleButtonProps> = ({ icon, title, description, onClick, disabled, variant }) => {
  const colors = {
    admin: 'hover:border-red-200 hover:bg-red-50 text-red-700',
    institution: 'hover:border-blue-200 hover:bg-blue-50 text-blue-700',
    user: 'hover:border-emerald-200 hover:bg-emerald-50 text-emerald-700'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 transition-all text-left group ${colors[variant]}`}
    >
      <div className={`p-3 rounded-xl transition-all ${
        variant === 'admin' ? 'bg-red-50 group-hover:bg-red-100' :
        variant === 'institution' ? 'bg-blue-50 group-hover:bg-blue-100' :
        'bg-emerald-50 group-hover:bg-emerald-100'
      }`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-sm leading-none mb-1">{title}</h3>
        <p className="text-[10px] text-gray-500 font-medium">{description}</p>
      </div>
    </button>
  );
};

export default Login;

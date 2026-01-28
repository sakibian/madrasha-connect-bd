
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { registerUser, login } from '../services/authService';
import { addNotification } from '../services/notificationService';

const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleChoice: 'Student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 1500));
    
    const user = registerUser({
      name: formData.name,
      email: formData.email,
      role: 'USER'
    });
    
    login(formData.email);
    
    addNotification({
      title: 'স্বাগতম!',
      message: `${formData.name}, মাদ্রাসা কানেক্ট বিডিতে আপনার রেজিস্ট্রেশন সফল হয়েছে।`,
      type: 'community',
      link: '/'
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-900 to-teal-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="islamic-pattern w-full h-full"></div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-fadeIn">
        <div className="p-8 bg-emerald-50 flex justify-between items-center border-b border-emerald-100">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">ইউজার রেজিস্ট্রেশন</h1>
            <p className="text-emerald-700 text-sm">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>
          <Link to="/login" className="p-2 bg-white text-emerald-700 rounded-full hover:bg-emerald-700 hover:text-white transition-all">
             <ArrowLeft size={20} />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, roleChoice: 'Student'})}
                className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border ${
                  formData.roleChoice === 'Student' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}
              >
                শিক্ষার্থী
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, roleChoice: 'Teacher'})}
                className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border ${
                  formData.roleChoice === 'Teacher' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}
              >
                শিক্ষক
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">পূর্ণ নাম *</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="আপনার নাম লিখুন"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">ইমেইল অ্যাড্রেস *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">পাসওয়ার্ড *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>রেজিস্ট্রেশন করুন <ArrowRight size={20} /></>}
          </button>

          <p className="text-center text-xs text-gray-400">
            রেজিস্ট্রেশন করে আপনি আমাদের <span className="text-emerald-700 font-bold underline cursor-pointer">শর্তাবলী</span> এবং <span className="text-emerald-700 font-bold underline cursor-pointer">প্রাইভেসি পলিসি</span> মেনে নিচ্ছেন।
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, MapPin, Phone, Mail, Lock, ArrowRight, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { registerUser, login } from '../services/authService';
import { addNotification } from '../services/notificationService';

const RegisterInstitution: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    instName: '',
    instType: 'Qawmi',
    location: '',
    contact: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 2000));
    
    registerUser({
      name: `অ্যাডমিন (${formData.instName})`,
      email: formData.email,
      role: 'INSTITUTION',
      institutionName: formData.instName
    });
    
    login(formData.email);
    
    addNotification({
      title: 'প্রতিষ্ঠান নিবন্ধিত!',
      message: `${formData.instName} সফলভাবে প্ল্যাটফর্মে যুক্ত হয়েছে। এখন সার্কুলার পোস্ট করতে পারবেন।`,
      type: 'job',
      link: '/professional'
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
         <div className="islamic-pattern w-full h-full rotate-180"></div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 animate-fadeIn">
        <div className="p-8 bg-blue-50 flex justify-between items-center border-b border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">প্রতিষ্ঠান রেজিস্ট্রেশন</h1>
            <p className="text-blue-700 text-sm">মাদ্রাসা বা মসজিদ হিসেবে যুক্ত হোন</p>
          </div>
          <Link to="/login" className="p-2 bg-white text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-all">
             <ArrowLeft size={20} />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-bold text-gray-500 ml-1">প্রতিষ্ঠানের ধরন *</label>
              <div className="grid grid-cols-3 gap-3">
                {['Qawmi', 'Alia', 'Mosque'].map(type => (
                  <button 
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, instType: type})}
                    className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all border ${
                      formData.instType === type ? 'bg-blue-700 text-white border-blue-700' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'Qawmi' ? 'কওমি' : type === 'Alia' ? 'আলিয়া' : 'মসজিদ'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 ml-1">প্রতিষ্ঠানের নাম *</label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="মাদ্রাসা বা মসজিদের পূর্ণ নাম"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={formData.instName}
                  onChange={(e) => setFormData({...formData, instName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">অবস্থান *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="উদা: চট্টগ্রাম"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">যোগাযোগ নম্বর *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  required
                  type="tel" 
                  placeholder="০১XXXXXXXXX"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">অফিসিয়াল ইমেইল *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="inst@example.bd"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">পাসওয়ার্ড *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
             <Building2 className="text-blue-600 shrink-0 mt-0.5" size={20} />
             <p className="text-[10px] text-blue-800 leading-relaxed">
               প্রতিষ্ঠানের বৈধতা যাচাইয়ের জন্য পরবর্তীতে প্রতিষ্ঠানের রেজিস্ট্রেশন বা প্রয়োজনীয় ডকুমেন্টের কপি আপলোড করার প্রয়োজন হতে পারে। সঠিক তথ্য প্রদান করুন।
             </p>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>প্রতিষ্ঠান হিসেবে যোগ দিন <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterInstitution;

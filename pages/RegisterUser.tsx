
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, ArrowLeft, Loader2, Menu, X } from 'lucide-react';
import { registerUser } from '../services/authService';
import { addNotification } from '../services/notificationService';

const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleChoice: 'Student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, needsVerification } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'USER'
      });

      if (needsVerification) {
        navigate('/verify-email', { state: { email: formData.email } });
        return;
      }

      await addNotification({
        title: 'স্বাগতম!',
        message: `${formData.name}, মাদ্রাসা কানেক্ট বিডিতে আপনার রেজিস্ট্রেশন সফল হয়েছে।`,
        type: 'community',
        link: '/dashboard'
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-fadeIn">
      {/* Left Branding Side */}
      <div className="lg:w-1/3 bg-black text-white p-12 md:p-16 flex flex-col justify-between border-r border-gray-900">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold">M</div>
          <span className="text-xl font-bold tracking-tight">মাদ্রাসা কানেক্ট</span>
        </Link>

        <div className="space-y-8">
           <div className="caps-label text-bd-green">Join Community</div>
           <h1 className="text-5xl font-extrabold leading-tight tracking-tight">শুরু হোক নতুন ডিজিটাল পথচলা।</h1>
           <p className="text-gray-400 text-lg font-medium leading-relaxed">
             বাংলাদেশের মাদ্রাসা নেটওয়ার্কের অংশ হোন। রিসোর্স ডাউনলোড, ক্যারিয়ার আপডেট এবং কমিউনিটি আলোচনার সুবিধা পান।
           </p>
        </div>

        <div className="space-y-4">
           <div className="caps-label text-gray-600">Already a member?</div>
           <Link to="/login" className="inline-flex items-center gap-2 font-bold text-sm hover:text-bd-green transition-colors">
             লগইন করুন <ArrowRight size={18} />
           </Link>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="lg:w-2/3 p-8 md:p-24 flex items-center justify-center bg-white">
        <div className="w-full max-w-xl space-y-12">
          <div className="space-y-4">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black mb-8">
               <ArrowLeft size={14} /> Back to Login
            </Link>
            <h2 className="text-4xl font-extrabold tracking-tight">ইউজার রেজিস্ট্রেশন।</h2>
            <p className="text-gray-500 font-medium">ব্যক্তিগত অ্যাকাউন্ট খোলার জন্য সঠিক তথ্য প্রদান করুন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-1 bg-gray-100 minimal-border">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, roleChoice: 'Student'})}
                  className={`py-5 font-extrabold text-sm transition-all ${
                    formData.roleChoice === 'Student' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  শিক্ষার্থী
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, roleChoice: 'Teacher'})}
                  className={`py-5 font-extrabold text-sm transition-all ${
                    formData.roleChoice === 'Teacher' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  শিক্ষক
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="caps-label text-gray-400">Full Name</label>
                  <input required placeholder="নাম" className="w-full p-4 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-black outline-none font-medium text-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-gray-400">Email Address</label>
                  <input required type="email" placeholder="ইমেইল" className="w-full p-4 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-black outline-none font-medium text-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="caps-label text-gray-400">Password</label>
                  <input required type="password" placeholder="পাসওয়ার্ড" className="w-full p-4 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-black outline-none font-medium text-lg" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="space-y-6">
               <button 
                 disabled={loading}
                 className="w-full py-6 bg-black text-white font-extrabold text-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50"
               >
                 {loading ? <Loader2 className="animate-spin" size={24} /> : <>রেজিস্ট্রেশন করুন <ArrowRight size={24} /></>}
               </button>
               <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 By registering you agree to our Terms and Privacy Policy.
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

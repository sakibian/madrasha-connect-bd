
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, MapPin, Phone, Mail, Lock, ArrowRight, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { registerUser } from '../services/authService';
import { addNotification } from '../services/notificationService';
import { supabase } from '../services/supabase';
import PasswordInput from '../components/ui/PasswordInput';
import { trackEvent } from '../services/analytics';

const RegisterInstitution: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    instName: '',
    instType: 'Qawmi',
    location: '',
    district: '',
    contact: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, needsVerification } = await registerUser({
        name: `অ্যাডমিন (${formData.instName})`,
        email: formData.email,
        password: formData.password,
        role: 'INSTITUTION',
        institutionName: formData.instName
      });

      await supabase.from('institutions').insert({
        owner_id: user.id,
        name: formData.instName,
        type: formData.instType,
        location: formData.location,
        district: formData.district || formData.location,
        verified: false,
      });

      if (needsVerification) {
        trackEvent('institution_registration_completed', { institution_type: formData.instType, verification_required: true });
        navigate('/verify-email', { state: { email: formData.email } });
        return;
      }

      await addNotification({
        title: 'প্রতিষ্ঠান নিবন্ধিত!',
        message: `${formData.instName} সফলভাবে প্ল্যাটফর্মে যুক্ত হয়েছে। এখন সার্কুলার পোস্ট করতে পারবেন।`,
        type: 'job',
        link: '/professional'
      });

      trackEvent('institution_registration_completed', { institution_type: formData.instType, verification_required: false });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card flex flex-col lg:flex-row animate-fadeIn">
      {/* Left Visualization Side */}
      <div className="lg:w-1/3 bg-primary text-primary-foreground p-12 md:p-16 flex flex-col justify-between border-r border-border relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-card text-foreground flex items-center justify-center font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">কওমি</span>
          </Link>
        </div>

        <div className="z-10 space-y-8">
           <div className="caps-label text-primary-foreground">Institutional Registration</div>
           <h1 className="text-5xl font-extrabold leading-tight tracking-tight">মাদ্রাসা ও মসজিদ <br />ব্যবস্থাপনার নতুন যুগ।</h1>
           <p className="text-primary-foreground text-lg font-medium leading-relaxed">
             আপনার প্রতিষ্ঠানের জন্য একটি ডিজিটাল প্রোফাইল তৈরি করুন এবং নিয়োগ বিজ্ঞপ্তি থেকে শুরু করে ফান্ড ম্যানেজমেন্ট পর্যন্ত সব ফিচার ব্যবহার করুন।
           </p>
        </div>

        <div className="z-10">
           <div className="caps-label text-primary-foreground mb-4">Official Verification</div>
           <div className="p-6 bg-secondary border border-border space-y-2">
              <p className="text-xs text-primary-foreground font-bold uppercase tracking-widest leading-relaxed">
                প্রতিষ্ঠান নিবন্ধনের পর আমাদের ভেরিফিকেশন টিম আপনার তথ্যাদি যাচাই করবে। সঠিক তথ্য প্রদান বাধ্যতামূলক।
              </p>
           </div>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Right Form Side */}
      <div className="lg:w-2/3 p-8 md:p-24 flex items-center justify-center bg-card overflow-y-auto">
        <div className="w-full max-w-2xl space-y-12">
          <div className="space-y-4">
             <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground mb-8">
               <ArrowLeft size={14} /> Back to Login
            </Link>
            <h2 className="text-4xl font-extrabold tracking-tight">প্রতিষ্ঠান নিবন্ধন।</h2>
            <p className="text-muted-foreground font-medium">প্রাতিষ্ঠানিক অ্যাকাউন্ট খোলার জন্য নিচের ফর্মটি পূরণ করুন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="caps-label text-muted-foreground">Institution Type</label>
                <div className="grid grid-cols-3 gap-1 bg-muted minimal-border">
                  {(['Qawmi', 'Alia', 'Mosque'] as const).map(type => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, instType: type})}
                      className={`py-5 font-extrabold text-sm transition-all ${
                        formData.instType === type ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {type === 'Qawmi' ? 'কওমি' : type === 'Alia' ? 'আলিয়া' : 'মসজিদ'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="caps-label text-muted-foreground">Official Name</label>
                  <input required placeholder="মাদ্রাসা বা মসজিদের নাম" className="w-full p-4 bg-muted border border-border focus:ring-2 focus:ring-ring outline-none font-medium text-lg" value={formData.instName} onChange={e => setFormData({...formData, instName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-muted-foreground">Location</label>
                  <input required placeholder="ঠিকানা" className="w-full p-4 bg-muted border border-border focus:ring-2 focus:ring-ring outline-none font-medium text-lg" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-muted-foreground">District</label>
                  <input required placeholder="জেলা" className="w-full p-4 bg-muted border border-border focus:ring-2 focus:ring-ring outline-none font-medium text-lg" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-muted-foreground">Contact Number</label>
                  <input required type="tel" placeholder="০১৭xxxxxxxx" className="w-full p-4 bg-muted border border-border focus:ring-2 focus:ring-ring outline-none font-medium text-lg" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-muted-foreground">Admin Email</label>
                  <input required type="email" placeholder="ইমেইল" className="w-full p-4 bg-muted border border-border focus:ring-2 focus:ring-ring outline-none font-medium text-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="caps-label text-muted-foreground">Password</label>
                  <PasswordInput
                    required
                    placeholder="পাসওয়ার্ড"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-muted border border-border text-foreground text-sm font-bold">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <button 
                disabled={loading}
                className="w-full py-6 bg-primary text-primary-foreground font-extrabold text-xl flex items-center justify-center gap-3 hover:bg-secondary transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <>প্রতিষ্ঠান হিসেবে যোগ দিন <ArrowRight size={24} /></>}
              </button>
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Verification process takes up to 48 hours after registration.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;

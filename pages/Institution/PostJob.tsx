
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  Building2, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getCurrentUser } from '../../services/authService';
import { moderateContent } from '../../services/geminiService';
import { addNotification } from '../../services/notificationService';
import { Job } from '../../types';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    institution: user?.institutionName || '',
    location: '',
    salary: '',
    type: 'Teacher' as Job['type'],
    contactInfo: '',
    description: ''
  });

  if (!user || user.role === 'USER') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <ShieldCheck size={64} className="text-gray-200" />
        <h2 className="text-3xl font-extrabold">অনুমতি নেই</h2>
        <p className="text-gray-500 max-w-sm">শুধুমাত্র নিবন্ধিত মাদ্রাসা বা প্রতিষ্ঠান প্রধানগণ নিয়োগ বিজ্ঞপ্তি পোস্ট করতে পারবেন।</p>
        <Link to="/dashboard" className="text-sm font-bold border-b-2 border-black pb-1">ড্যাশবোর্ডে ফিরে যান</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Semantic moderation using Gemini
      const modResult = await moderateContent(`${formData.title} ${formData.description}`);
      
      if (!modResult.safe) {
        setError(modResult.feedback || "আপনার পোস্টটি নীতিমালা লঙ্ঘন করেছে। অনুগ্রহ করে শব্দ চয়ন সংশোধন করুন।");
        setLoading(false);
        return;
      }

      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: formData.title,
        institution: formData.institution,
        location: formData.location,
        salary: formData.salary,
        type: formData.type,
        contactInfo: formData.contactInfo,
        postedAt: 'এইমাত্র',
        verified: false
      };

      dataService.saveJob(newJob);
      
      addNotification({
        title: 'বিজ্ঞপ্তি জমা হয়েছে',
        message: 'আপনার নিয়োগ বিজ্ঞপ্তিটি সফলভাবে জমা হয়েছে এবং পর্যালোচনার জন্য পাঠানো হয়েছে।',
        type: 'job',
        link: '/professional'
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/professional');
      }, 3000);
    } catch (err) {
      setError("দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
        <div className="w-24 h-24 bg-bd-green text-white flex items-center justify-center rounded-full">
          <CheckCircle size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">সফলভাবে জমা হয়েছে।</h2>
          <p className="text-xl text-gray-500 max-w-md mx-auto">
            আপনার সার্কুলারটি মডারেশন টিমের কাছে পাঠানো হয়েছে। যাচাইকরণের পর এটি পাবলিকলি প্রকাশিত হবে।
          </p>
        </div>
        <div className="caps-label text-gray-400 animate-pulse">Redirecting to Professional Hub...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="caps-label text-gray-400">Recruitment Portal</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">নিয়োগ বিজ্ঞপ্তি পোস্ট করুন।</h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed font-medium">
            সঠিক ও নির্ভুল তথ্য প্রদানের মাধ্যমে আপনার প্রতিষ্ঠানের জন্য যোগ্য শিক্ষক বা স্টাফ খুঁজে নিন।
          </p>
        </div>
        <Link to="/professional" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-all">
          <ArrowLeft size={14} /> Back to Hub
        </Link>
      </div>

      <div className="bg-white minimal-border p-12 md:p-20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="p-6 bg-red-50 border border-red-100 text-red-600 space-y-2 flex items-start gap-4 animate-slideDown">
              <ShieldCheck className="shrink-0 mt-1" />
              <div>
                <p className="font-bold">সতর্কতা!</p>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-10">
            {/* Essential Info */}
            <div className="space-y-8">
               <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                 <FileText size={24} className="text-bd-green" /> পদের বিবরণ
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput 
                    label="পদের নাম (Title)" 
                    placeholder="উদা: হেফজ শিক্ষক / সিনিয়র মুহাদ্দিস" 
                    value={formData.title} 
                    onChange={v => setFormData({...formData, title: v})}
                    required
                  />
                  <div className="space-y-3">
                    <label className="caps-label text-gray-400">পদের ধরণ (Category)</label>
                    <select 
                      className="w-full p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold text-lg"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="Teacher">শিক্ষক</option>
                      <option value="Imam">ইমাম / খতিব</option>
                      <option value="Muazzin">মুয়াজ্জিন</option>
                      <option value="Staff">অন্যান্য স্টাফ</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Location & Compensation */}
            <div className="space-y-8 pt-10 border-t border-gray-50">
               <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                 <MapPin size={24} className="text-bd-green" /> এলাকা ও সম্মানী
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput 
                    label="প্রতিষ্ঠানের নাম" 
                    value={formData.institution} 
                    onChange={v => setFormData({...formData, institution: v})}
                    readOnly={user.role === 'INSTITUTION'}
                    required
                  />
                  <FormInput 
                    label="এলাকা (Location)" 
                    placeholder="উদা: মিরপুর-১, ঢাকা" 
                    value={formData.location} 
                    onChange={v => setFormData({...formData, location: v})}
                    required
                  />
                  <FormInput 
                    label="মাসিক সম্মানী (Salary)" 
                    placeholder="উদা: ১২,০০০ - ১৫,০০০" 
                    value={formData.salary} 
                    onChange={v => setFormData({...formData, salary: v})}
                    required
                  />
                  <FormInput 
                    label="যোগাযোগের নম্বর/ইমেইল" 
                    placeholder="উদা: ০১XXXXXXXXX" 
                    value={formData.contactInfo} 
                    onChange={v => setFormData({...formData, contactInfo: v})}
                    required
                  />
               </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-8 pt-10 border-t border-gray-50">
               <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
                 <Building2 size={24} className="text-bd-green" /> বিস্তারিত বর্ণনা
               </h2>
               <div className="space-y-3">
                 <label className="caps-label text-gray-400">যোগ্যতা ও শর্তাবলী</label>
                 <textarea 
                    className="w-full p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium text-lg min-h-[200px]"
                    placeholder="প্রার্থীর শিক্ষাগত যোগ্যতা, অভিজ্ঞতা এবং অন্যান্য শর্তাবলী এখানে বিস্তারিত লিখুন..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                 />
               </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row gap-6">
             <button 
               type="submit" 
               disabled={loading}
               className="flex-1 py-6 bg-black text-white font-extrabold text-xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-all disabled:opacity-50"
             >
               {loading ? <Loader2 className="animate-spin" size={24} /> : <>বিজ্ঞপ্তি পাবলিশ করুন <ArrowRight size={24} /></>}
             </button>
             <button 
               type="button" 
               onClick={() => navigate(-1)}
               className="px-12 py-6 border border-gray-200 text-gray-400 font-bold hover:text-black hover:border-black transition-all"
             >
               বাতিল করুন
             </button>
          </div>
        </form>
      </div>

      <div className="p-12 bg-gray-50 minimal-border flex items-center gap-8">
        <div className="w-16 h-16 bg-white flex items-center justify-center text-bd-green shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-gray-800">নিরাপত্তা ও যাচাইকরণ</p>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            মাদ্রাসা কানেক্ট একটি দ্বীনি প্ল্যাটফর্ম। সকল পোস্ট এআই এবং হিউম্যান মডারেটর দ্বারা যাচাই করা হয়। ভুল বা বিভ্রান্তিকর তথ্য প্রদান থেকে বিরত থাকুন।
          </p>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, placeholder, value, onChange, required, readOnly }: any) => (
  <div className="space-y-3">
    <label className="caps-label text-gray-400">{label}</label>
    <input 
      required={required}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold text-lg transition-all ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default PostJob;


import React, { useState, useEffect } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, CheckCircle, 
  Building, Plus, X, Phone, AlertCircle, ShieldCheck, Trash2, Send, Loader2 
} from 'lucide-react';
import { Job } from '../types';
import { addNotification } from '../services/notificationService';
import { getCurrentUser } from '../services/authService';
import { dataService } from '../services/dataService';
import { moderateContent } from '../services/geminiService';

const ProfessionalHub: React.FC = () => {
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAdmin = currentUser?.role === 'ADMIN';
  const canPost = currentUser?.role === 'INSTITUTION' || isAdmin;

  useEffect(() => {
    const update = () => setJobs(dataService.getJobs());
    update();
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    institution: currentUser?.institutionName || '',
    location: '',
    salary: '',
    type: 'Teacher' as Job['type'],
    contactInfo: ''
  });

  const handleVerify = (id: string) => {
    dataService.verifyJob(id);
    addNotification({
      title: 'সার্কুলার অনুমোদিত',
      message: 'পোস্টটি ভেরিফাই করা হয়েছে।',
      type: 'application',
      link: '/professional'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('মুছে ফেলতে চান?')) {
      dataService.deleteJob(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModerating(true);
    setError(null);

    // AI Moderation before saving to "Backend"
    const modResult = await moderateContent(`${formData.title} ${formData.institution}`);
    
    if (!modResult.safe) {
      setError(modResult.feedback || "আপনার পোস্টটি নীতিমালা লঙ্ঘন করেছে।");
      setIsModerating(false);
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...formData,
      postedAt: 'এইমাত্র',
      verified: false
    };

    dataService.saveJob(newJob);
    setIsModerating(false);
    setIsModalOpen(false);
    
    addNotification({
      title: 'সার্কুলার জমা হয়েছে',
      message: 'এটি এডমিন প্যানেলে পর্যালোচনার জন্য পাঠানো হয়েছে।',
      type: 'job',
      link: '/professional'
    });

    setFormData({
      title: '', institution: currentUser?.institutionName || '', location: '', 
      salary: '', type: 'Teacher', contactInfo: ''
    });
  };

  const baseJobs = isAdmin ? jobs : jobs.filter(j => j.verified || j.institution === currentUser?.institutionName);
  const filteredJobs = filter === 'All' ? baseJobs : baseJobs.filter(j => j.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">প্রফেশনাল হাব</h1>
          <p className="text-gray-500">সেরা কর্মসংস্থান খুঁজে নিন।</p>
        </div>
        {canPost && (
          <button onClick={() => setIsModalOpen(true)} className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 flex items-center gap-2 shadow-lg transition-all active:scale-95">
            <Plus size={20} /> সার্কুলার পোস্ট করুন
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-amber-600" />
            <p className="text-sm font-bold text-amber-900">অ্যাডমিন কন্ট্রোল: {jobs.filter(j => !j.verified).length}টি পোস্ট রিভিউ প্রয়োজন।</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative">
            {!job.verified && <div className="absolute top-0 right-0 left-0 h-1 bg-amber-400"></div>}
            <div className="flex justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700"><Briefcase size={24} /></div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${job.verified ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                {job.verified ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{job.institution}</p>
            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><MapPin size={16} />{job.location}</div>
              <div className="flex items-center gap-2 font-bold text-emerald-700"><DollarSign size={16} />{job.salary}</div>
            </div>
            <div className="flex gap-2">
              {isAdmin ? (
                <>
                  {!job.verified && <button onClick={() => handleVerify(job.id)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">অ্যাপ্রুভ</button>}
                  <button onClick={() => handleDelete(job.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold">মুছুন</button>
                </>
              ) : (
                <button className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Send size={18} /> আবেদন করুন</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 bg-emerald-800 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">নতুন নিয়োগ বিজ্ঞপ্তি</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
              <input required placeholder="পদবি" className="w-full p-3 rounded-xl border bg-gray-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input required placeholder="প্রতিষ্ঠানের নাম" className="w-full p-3 rounded-xl border bg-gray-50" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="অবস্থান" className="p-3 rounded-xl border bg-gray-50" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <input required placeholder="বেতন" className="p-3 rounded-xl border bg-gray-50" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
              </div>
              <button disabled={isModerating} className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {isModerating ? <><Loader2 className="animate-spin" /> এআই চেক করছে...</> : 'সাবমিট করুন'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalHub;

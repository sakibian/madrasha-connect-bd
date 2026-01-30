
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, CheckCircle, 
  Building, Plus, X, Phone, AlertCircle, ShieldCheck, Trash2, Send, Loader2, Star, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { addNotification } from '../services/notificationService';
import { getCurrentUser } from '../services/authService';
import { dataService } from '../services/dataService';
import { moderateContent } from '../services/geminiService';

const ProfessionalHub: React.FC = () => {
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const isAdmin = currentUser?.role === 'ADMIN';
  const canPost = currentUser?.role === 'INSTITUTION' || isAdmin;

  useEffect(() => {
    const update = () => setJobs(dataService.getJobs());
    update();
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

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

  const baseJobs = isAdmin ? jobs : jobs.filter(j => j.verified || j.institution === currentUser?.institutionName);
  const sortedJobs = [...baseJobs].sort((a, b) => (a.verified === b.verified ? 0 : a.verified ? -1 : 1));
  const filteredJobs = filter === 'All' ? sortedJobs : sortedJobs.filter(j => j.type === filter);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">Careers</div>
          <h1 className="text-5xl font-extrabold tracking-tight">প্রফেশনাল নিয়োগ পোর্টাল।</h1>
        </div>
        {canPost && (
          <Link to="/post-job" className="bg-black text-white px-8 py-4 font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all">
            <Plus size={20} /> নতুন বিজ্ঞপ্তি পোস্ট করুন
          </Link>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
         {(['All', 'Teacher', 'Imam', 'Muazzin', 'Staff'] as const).map(f => (
           <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-xs font-bold transition-all border ${
              filter === f ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'
            }`}
           >
             {f === 'All' ? 'সব' : f === 'Teacher' ? 'শিক্ষক' : f === 'Imam' ? 'ইমাম' : f === 'Muazzin' ? 'মুয়াজ্জিন' : 'অন্যান্য'}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-10 flex flex-col justify-between group hover:bg-gray-50 transition-all h-[450px]">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <div className="caps-label text-bd-green">{job.type}</div>
                 {job.verified && <CheckCircle size={18} className="text-black" />}
              </div>
              <h3 className="text-3xl font-extrabold leading-tight">{job.title}</h3>
              <div className="space-y-3 font-medium text-gray-500">
                 <div className="flex items-center gap-2"><Building size={16} /> {job.institution}</div>
                 <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
                 <div className="flex items-center gap-2 font-bold text-black"><DollarSign size={16} /> {job.salary}</div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-100 space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Clock size={12} /> পোস্ট করা হয়েছে: {job.postedAt}
               </div>
               {isAdmin ? (
                <div className="flex gap-2 pt-4">
                  {!job.verified && <button onClick={() => handleVerify(job.id)} className="flex-1 py-3 bg-black text-white font-bold text-xs">অনুমোদন</button>}
                  <button onClick={() => handleDelete(job.id)} className="flex-1 py-3 border border-gray-200 text-red-600 font-bold text-xs">মুছুন</button>
                </div>
              ) : (
                <button className="w-full py-4 bg-black text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-bd-green transition-all">
                  আবেদন করুন <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-40 text-center space-y-4 bg-white">
             <Briefcase size={48} className="mx-auto text-gray-100" />
             <p className="text-xl font-bold text-gray-400">কোনো নিয়োগ বিজ্ঞপ্তি পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalHub;

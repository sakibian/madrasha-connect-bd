
import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, CheckCircle, Building, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addNotification } from '../services/notificationService';
import { Button, Badge, EmptyState } from '../components/ui';
import { useAuthStore, useJobStore } from '../stores';

const ProfessionalHub: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { jobs, fetch: fetchJobs, verify: verifyJob, remove: deleteJob } = useJobStore();
  const [filter, setFilter] = useState('All');
  
  const isAdmin = currentUser?.role === 'ADMIN';
  const canPost = currentUser?.role === 'INSTITUTION' || isAdmin;

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleVerify = async (id: string) => {
    await verifyJob(id);
    await addNotification({
      title: 'সার্কুলার অনুমোদিত',
      message: 'পোস্টটি ভেরিফাই করা হয়েছে।',
      type: 'application',
      link: '/professional'
    });
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('মুছে ফেলতে চান?')) {
      await deleteJob(id);
      fetchJobs();
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
           <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
           >
             {f === 'All' ? 'সব' : f === 'Teacher' ? 'শিক্ষক' : f === 'Imam' ? 'ইমাম' : f === 'Muazzin' ? 'মুয়াজ্জিন' : 'অন্যান্য'}
           </Button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-10 flex flex-col justify-between group hover:bg-gray-50 transition-all h-[450px]">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <Badge variant="info">{job.type}</Badge>
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
                  {!job.verified && <Button variant="primary" size="sm" onClick={() => handleVerify(job.id)}>অনুমোদন</Button>}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(job.id)}>মুছুন</Button>
                </div>
              ) : (
                <Button variant="primary" size="lg" className="w-full">
                  আবেদন করুন <ArrowRight size={18} />
                </Button>
              )}
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon={<Briefcase size={48} />} title="কোনো নিয়োগ বিজ্ঞপ্তি পাওয়া যায়নি।" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalHub;

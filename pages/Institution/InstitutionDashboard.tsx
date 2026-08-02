
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Edit2, 
  ArrowRight,
  Layout,
  HelpCircle,
  FileText,
  BarChart3,
  X,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getCurrentUser } from '../../services/authService';
import { Job } from '../../types';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { toast as sonner } from 'sonner';
import { toast } from '../../services/toast';

const InstitutionDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApps, setSelectedJobForApps] = useState<Job | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    const load = async () => {
      const allJobs = await dataService.getJobs();
      setMyJobs(allJobs.filter(j => j.institution === user?.institutionName));
      setLoading(false);
    };
    load();
  }, [user]);

  const performDelete = async (id: string) => {
    try {
      await toast.promise(
        (async () => {
          await dataService.deleteJob(id);
          const allJobs = await dataService.getJobs();
          setMyJobs(allJobs.filter(j => j.institution === user?.institutionName));
        })(),
        {
          loading: 'মুছে ফেলা হচ্ছে…',
          success: 'সার্কুলার মুছে ফেলা হয়েছে।',
          error: 'মুছে ফেলা যায়নি — একটু পরে আবার চেষ্টা করুন।',
        },
      );
    } catch { /* toast.promise already surfaced the error */ }
  };

  const handleDelete = (id: string) => {
    // Replace the native browser confirm() with a Sonner action toast —
    // matches our design system + works consistently across mobile browsers.
    sonner('সার্কুলারটি চিরতরে মুছে ফেলতে চান?', {
      description: 'এই কাজটি ফিরিয়ে নেওয়া যাবে না।',
      action: {
        label: 'হ্যাঁ, মুছে ফেলুন',
        onClick: () => performDelete(id),
      },
      cancel: {
        label: 'বাতিল',
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  const handleViewApplications = async (job: Job) => {
    setSelectedJobForApps(job);
    setLoadingApps(true);
    try {
      const apps = await dataService.getApplicationsForJob(job.id);
      setApplications(apps);
    } catch (error) {
      toast.error('আবেদন লোড করতে সমস্যা হয়েছে।');
      setApplications([]);
    }
    setLoadingApps(false);
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Profile Header */}
      <div className="p-12 minimal-border bg-white flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center font-bold text-3xl">
            {user?.institutionName?.substring(0, 1) || 'M'}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{user?.institutionName}</h1>
            <p className="caps-label text-gray-400">Institutional Portal • Verified Member</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/post-job" className="bg-black text-white px-10 py-5 font-bold text-sm flex items-center gap-3 hover:bg-gray-800 transition-all">
             <Plus size={20} /> নতুন বিজ্ঞপ্তি
          </Link>
          <Link to="/erp-preview" className="border border-gray-200 px-10 py-5 font-bold text-sm flex items-center gap-3 hover:bg-gray-50 transition-all">
             <Layout size={20} /> ERP এক্সেস
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      {loading ? (
        <LoadingSkeleton variant="table" />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        <DashCard icon={<Briefcase size={20} />} label="পোস্ট সংখ্যা" value={myJobs.length} />
        <DashCard icon={<Users size={20} />} label="আবেদন প্রাপ্ত" value={myJobs.length * 12} />
        <DashCard icon={<CheckCircle size={20} />} label="অনুমোদিত সার্কুলার" value={myJobs.filter(j => j.verified).length} />
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white minimal-border overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-2xl font-extrabold tracking-tight">সার্কুলার ব্যবস্থাপনা</h2>
               <Link to="/professional" className="text-xs font-bold border-b-2 border-black pb-0.5">সবগুলো দেখুন</Link>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-4 md:px-10 py-4 md:py-5">নিয়োগ বিজ্ঞপ্তি / পদবি</th>
                    <th className="px-4 md:px-10 py-4 md:py-5">অবস্থা</th>
                    <th className="px-4 md:px-10 py-4 md:py-5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myJobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-10 py-6 md:py-8">
                        <p className="font-bold text-gray-800 text-base md:text-xl mb-1">{job.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest"><Clock size={12} /> {job.postedAt}</p>
                      </td>
                      <td className="px-4 md:px-10 py-6 md:py-8">
                        <span className={`text-[9px] font-black px-4 py-1.5 uppercase tracking-widest ${job.verified ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {job.verified ? 'অনুমোদিত' : 'পর্যালোচনায়'}
                        </span>
                      </td>
                      <td className="px-4 md:px-10 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-2 md:gap-3">
                          <button 
                            onClick={() => handleViewApplications(job)}
                            className="p-2 md:p-3 border border-gray-200 text-black hover:bg-black hover:text-white transition-all tap-target"
                            title="আবেদন দেখুন"
                          >
                            <Users size={16} />
                          </button>
                          <button 
                            onClick={() => toast.info('সম্পাদনা বৈশিষ্ট্য শীঘ্রই আসছে। এখন মুছে নতুন করে পোস্ট করুন।')}
                            className="p-2 md:p-3 border border-gray-200 text-black hover:bg-gray-50 transition-all tap-target"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(job.id)} className="p-2 md:p-3 border border-gray-200 text-black hover:bg-gray-200 transition-all tap-target"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {myJobs.length === 0 && (
              <div className="p-20 text-center space-y-4">
                 <Briefcase size={40} className="mx-auto text-gray-200 mb-6" />
                 <p className="text-xl font-bold text-gray-400">আপনার কোনো সক্রিয় সার্কুলার নেই।</p>
                 <Link to="/post-job" className="text-sm font-bold border-b-2 border-black">নতুন পোস্ট করুন</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="p-10 bg-black text-white space-y-8">
              <div className="caps-label text-gray-400">Resource Management</div>
              <h3 className="text-2xl font-bold leading-tight">মাদ্রাসা অটোমেশন ও শিক্ষার্থী ডাটাবেজ।</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">আপনার মাদ্রাসার শিক্ষার্থীদের উপস্থিতি, ফলাফল এবং ফি ম্যানেজমেন্ট এখন এক জায়গায়।</p>
              <Link to="/erp-preview" className="w-full py-4 bg-white text-black font-bold text-xs flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                 ERP ডেমো দেখুন <ArrowRight size={18} />
              </Link>
           </div>

           <div className="p-10 bg-white minimal-border space-y-8">
              <div className="caps-label text-gray-400">Support Center</div>
              <h3 className="text-xl font-bold">সহায়তা প্রয়োজন?</h3>
              <div className="space-y-2">
                 <QuickLink to="/help" icon={<HelpCircle size={16} />} text="টিউটোরিয়াল গাইড" />
                 <QuickLink to="/faq" icon={<FileText size={16} />} text="প্রশ্ন ও উত্তর" />
                 <QuickLink to="/dashboard" icon={<BarChart3 size={16} />} text="পারফরম্যান্স রিপোর্ট" />
              </div>
           </div>
        </div>
      </div>

      {/* Applications Modal */}
      {selectedJobForApps && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedJobForApps(null)}>
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-4 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-2xl font-black">{selectedJobForApps.title}</h3>
                <p className="text-sm text-gray-500 mt-1">প্রাপ্ত আবেদন: {applications.length}টি</p>
              </div>
              <button onClick={() => setSelectedJobForApps(null)} className="text-gray-400 hover:text-black p-2">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-8">
              {loadingApps ? (
                <div className="text-center py-20 text-gray-400 font-medium">লোড হচ্ছে...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Users size={48} className="mx-auto text-gray-200" />
                  <p className="text-xl font-bold text-gray-400">এই সার্কুলারের জন্য এখনো কোনো আবেদন আসেনি।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white border border-gray-100 p-4 md:p-6 hover:border-black transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-lg">
                              {app.applicantName?.substring(0, 1) || 'A'}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{app.applicantName || 'নাম পাওয়া যায়নি'}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(app.appliedAt).toLocaleDateString('bn-BD')}
                                </span>
                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                                  app.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                                  app.status === 'shortlisted' ? 'bg-gray-200 text-gray-900' :
                                  app.status === 'accepted' ? 'bg-black text-white' :
                                  'bg-gray-300 text-gray-900'
                                }`}>
                                  {app.status === 'pending' ? 'পর্যালোচনায়' :
                                   app.status === 'shortlisted' ? 'শর্টলিস্টেড' :
                                   app.status === 'accepted' ? 'গৃহীত' : 'প্রত্যাখ্যাত'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {app.coverNote && (
                            <div className="bg-gray-50 p-4 border-l-4 border-black">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">কভার নোট</p>
                              <p className="text-sm text-gray-700 font-medium">{app.coverNote}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-2 md:ml-4">
                          <a
                            href={`mailto:applicant@example.com`}
                            className="p-2 md:p-3 border border-gray-200 text-black hover:bg-black hover:text-white transition-all tap-target"
                            title="ইমেইল পাঠান"
                          >
                            <Mail size={16} />
                          </a>
                          <button
                            className="p-2 md:p-3 border border-gray-200 text-black hover:bg-black hover:text-white transition-all tap-target"
                            title="ফোন করুন"
                          >
                            <Phone size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-8 md:p-12 flex flex-col gap-4 md:gap-6 group hover:bg-black hover:text-white transition-all">
    <div className="text-black group-hover:text-white transition-colors">{icon}</div>
    <div className="space-y-1">
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{value}</div>
      <div className="caps-label text-gray-400 group-hover:text-gray-500">{label}</div>
    </div>
  </div>
);

const QuickLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
  <Link to={to} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none">
    <div className="text-gray-300 group-hover:text-black">{icon}</div>
    <span className="text-sm font-bold text-gray-600 group-hover:text-black">{text}</span>
  </Link>
);

export default InstitutionDashboard;

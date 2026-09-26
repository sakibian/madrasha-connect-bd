
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
      <div className="p-12 minimal-border bg-card flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl">
            {user?.institutionName?.substring(0, 1) || 'M'}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{user?.institutionName}</h1>
            <p className="caps-label text-muted-foreground">Institutional Portal • Verified Member</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/post-job" className="bg-primary text-primary-foreground px-10 py-5 font-bold text-sm flex items-center gap-3 hover:bg-secondary transition-all">
             <Plus size={20} /> নতুন বিজ্ঞপ্তি
          </Link>
          <Link to="/erp-preview" className="border border-border px-10 py-5 font-bold text-sm flex items-center gap-3 hover:bg-muted transition-all">
             <Layout size={20} /> ERP এক্সেস
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      {loading ? (
        <LoadingSkeleton variant="table" />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-muted minimal-border">
        <DashCard icon={<Briefcase size={20} />} label="পোস্ট সংখ্যা" value={myJobs.length} />
        <DashCard icon={<Users size={20} />} label="আবেদন প্রাপ্ত" value={myJobs.length * 12} />
        <DashCard icon={<CheckCircle size={20} />} label="অনুমোদিত সার্কুলার" value={myJobs.filter(j => j.verified).length} />
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-card minimal-border overflow-hidden">
            <div className="p-10 border-b border-border flex justify-between items-center">
               <h2 className="text-2xl font-extrabold tracking-tight">সার্কুলার ব্যবস্থাপনা</h2>
               <Link to="/professional" className="text-xs font-bold border-b-2 border-primary pb-0.5">সবগুলো দেখুন</Link>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="px-4 md:px-10 py-4 md:py-5">নিয়োগ বিজ্ঞপ্তি / পদবি</th>
                    <th className="px-4 md:px-10 py-4 md:py-5">অবস্থা</th>
                    <th className="px-4 md:px-10 py-4 md:py-5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myJobs.map(job => (
                    <tr key={job.id} className="hover:bg-muted transition-colors">
                      <td className="px-4 md:px-10 py-6 md:py-8">
                        <p className="font-bold text-foreground text-base md:text-xl mb-1">{job.title}</p>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest"><Clock size={12} /> {job.postedAt}</p>
                      </td>
                      <td className="px-4 md:px-10 py-6 md:py-8">
                        <span className={`text-[9px] font-black px-4 py-1.5 uppercase tracking-widest ${job.verified ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {job.verified ? 'অনুমোদিত' : 'পর্যালোচনায়'}
                        </span>
                      </td>
                      <td className="px-4 md:px-10 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-2 md:gap-3">
                          <button 
                            onClick={() => handleViewApplications(job)}
                            className="p-2 md:p-3 border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all tap-target"
                            title="আবেদন দেখুন"
                          >
                            <Users size={16} />
                          </button>
                          <button 
                            onClick={() => toast.info('সম্পাদনা বৈশিষ্ট্য শীঘ্রই আসছে। এখন মুছে নতুন করে পোস্ট করুন।')}
                            className="p-2 md:p-3 border border-border text-foreground hover:bg-muted transition-all tap-target"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(job.id)} className="p-2 md:p-3 border border-border text-foreground hover:bg-muted transition-all tap-target"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {myJobs.length === 0 && (
              <div className="p-20 text-center space-y-4">
                 <Briefcase size={40} className="mx-auto text-muted-foreground mb-6" />
                 <p className="text-xl font-bold text-muted-foreground">আপনার কোনো সক্রিয় সার্কুলার নেই।</p>
                 <Link to="/post-job" className="text-sm font-bold border-b-2 border-primary">নতুন পোস্ট করুন</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="p-10 bg-primary text-primary-foreground space-y-8">
              <div className="caps-label text-muted-foreground">Resource Management</div>
              <h3 className="text-2xl font-bold leading-tight">মাদ্রাসা অটোমেশন ও শিক্ষার্থী ডাটাবেজ।</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">আপনার মাদ্রাসার শিক্ষার্থীদের উপস্থিতি, ফলাফল এবং ফি ম্যানেজমেন্ট এখন এক জায়গায়।</p>
              <Link to="/erp-preview" className="w-full py-4 bg-card text-foreground font-bold text-xs flex items-center justify-center gap-3 hover:bg-muted transition-all">
                 ERP ডেমো দেখুন <ArrowRight size={18} />
              </Link>
           </div>

           <div className="p-10 bg-card minimal-border space-y-8">
              <div className="caps-label text-muted-foreground">Support Center</div>
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
          <div className="bg-card max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-4 md:p-8 border-b border-border flex justify-between items-center sticky top-0 bg-card">
              <div>
                <h3 className="text-2xl font-black">{selectedJobForApps.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">প্রাপ্ত আবেদন: {applications.length}টি</p>
              </div>
              <button onClick={() => setSelectedJobForApps(null)} className="text-muted-foreground hover:text-foreground p-2">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-8">
              {loadingApps ? (
                <div className="text-center py-20 text-muted-foreground font-medium">লোড হচ্ছে...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Users size={48} className="mx-auto text-muted-foreground" />
                  <p className="text-xl font-bold text-muted-foreground">এই সার্কুলারের জন্য এখনো কোনো আবেদন আসেনি।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-card border border-border p-4 md:p-6 hover:border-primary transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                              {app.applicantName?.substring(0, 1) || 'A'}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{app.applicantName || 'নাম পাওয়া যায়নি'}</h4>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(app.appliedAt).toLocaleDateString('bn-BD')}
                                </span>
                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                                  app.status === 'pending' ? 'bg-muted text-muted-foreground' :
                                  app.status === 'shortlisted' ? 'bg-muted text-foreground' :
                                  app.status === 'accepted' ? 'bg-primary text-primary-foreground' :
                                  'bg-muted text-foreground'
                                }`}>
                                  {app.status === 'pending' ? 'পর্যালোচনায়' :
                                   app.status === 'shortlisted' ? 'শর্টলিস্টেড' :
                                   app.status === 'accepted' ? 'গৃহীত' : 'প্রত্যাখ্যাত'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {app.coverNote && (
                            <div className="bg-muted p-4 border-l-4 border-primary">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">কভার নোট</p>
                              <p className="text-sm text-foreground font-medium">{app.coverNote}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-2 md:ml-4">
                          <a
                            href={`mailto:applicant@example.com`}
                            className="p-2 md:p-3 border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all tap-target"
                            title="ইমেইল পাঠান"
                          >
                            <Mail size={16} />
                          </a>
                          <button
                            className="p-2 md:p-3 border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all tap-target"
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
  <div className="bg-card p-8 md:p-12 flex flex-col gap-4 md:gap-6 group hover:bg-primary hover:text-primary-foreground transition-all">
    <div className="text-foreground group-hover:text-primary-foreground transition-colors">{icon}</div>
    <div className="space-y-1">
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{value}</div>
      <div className="caps-label text-muted-foreground group-hover:text-muted-foreground">{label}</div>
    </div>
  </div>
);

const QuickLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
  <Link to={to} className="flex items-center gap-3 p-4 hover:bg-muted transition-all group border-b border-border last:border-none">
    <div className="text-muted-foreground group-hover:text-foreground">{icon}</div>
    <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">{text}</span>
  </Link>
);

export default InstitutionDashboard;

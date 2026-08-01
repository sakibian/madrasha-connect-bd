
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Droplets, Book, Home, Sparkles, ArrowRight, CheckCircle, ShieldCheck, Loader2, X } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SadaqahProject } from '../types';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import DonationModal from '../components/DonationModal';
import { executeBkashDonation } from '../services/donationService';
import { useAuthStore } from '../stores';
import { toast } from '../services/toast';

const SadaqahHub: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState<SadaqahProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [donateOpen, setDonateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SadaqahProject | null>(null);
  const [receipt, setReceipt] = useState<null | { ok: boolean; message: string }>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [fundingForm, setFundingForm] = useState({
    projectTitle: '',
    category: 'Infrastructure',
    amount: '',
    description: '',
    justification: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle bKash return: /sadaqah?bkash=1&paymentID=... — call execute and
  // show a thank-you / failure receipt inline.
  useEffect(() => {
    const isBkashReturn = searchParams.get('bkash') === '1';
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status'); // bKash sends 'success' | 'failure' | 'cancel'
    if (!isBkashReturn || !paymentID) return;

    const finalize = async () => {
      if (status !== 'success') {
        setReceipt({ ok: false, message: 'আপনার লেনদেন সম্পূর্ণ হয়নি। আপনি চাইলে আবার চেষ্টা করতে পারেন।' });
      } else {
        const res = await executeBkashDonation(paymentID);
        if (res?.ok) {
          setReceipt({ ok: true, message: 'শুকরান! আপনার সাদাকাহ সফলভাবে গৃহীত হয়েছে। আল্লাহ আপনাকে উত্তম প্রতিদান দিন।' });
          loadProjects();
        } else {
          setReceipt({ ok: false, message: 'লেনদেনটি নিশ্চিত করা যায়নি। যদি টাকা কেটে গিয়ে থাকে, সাপোর্টের সাথে যোগাযোগ করুন।' });
        }
      }
      // Clear query params so refresh doesn't re-execute.
      setSearchParams({}, { replace: true });
    };
    finalize();
  }, [searchParams, setSearchParams]);

  const openDonate = (project?: SadaqahProject) => {
    setSelectedProject(project ?? null);
    setDonateOpen(true);
  };

  const loadProjects = async () => {
    setLoading(true);
    const data = await dataService.getSadaqahProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleFundingApplication = async () => {
    if (!fundingForm.projectTitle || !fundingForm.amount || !fundingForm.description || !fundingForm.justification) {
      toast.warning('সব তথ্য পূরণ করুন।');
      return;
    }

    if (!currentUser?.institutionName) {
      toast.error('শুধুমাত্র প্রতিষ্ঠান প্রধানগণ তহবিলের জন্য আবেদন করতে পারবেন।');
      return;
    }

    try {
      // Get or create institution ID (simplified - in production match to institutions table)
      const institutionId = currentUser.id; // Placeholder
      
      await dataService.applyForSadaqahFunding({
        institutionId,
        projectTitle: fundingForm.projectTitle,
        category: fundingForm.category,
        amountRequested: parseFloat(fundingForm.amount),
        description: fundingForm.description,
        justification: fundingForm.justification,
      });

      toast.success('আবেদন জমা হয়েছে!', 'অ্যাডমিন পর্যালোচনা করে শীঘ্রই জানাবেন।');
      setShowFundingModal(false);
      setFundingForm({
        projectTitle: '',
        category: 'Infrastructure',
        amount: '',
        description: '',
        justification: '',
      });
    } catch (error: any) {
      toast.error(error?.message || 'আবেদন জমা দিতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Donations</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">সাদাকাহ ও জারিয়া।</h1>
      </div>

      {receipt && (
        <div className={`p-6 border ${receipt.ok ? 'bg-bd-green/5 border-bd-green/30' : 'bg-danger-50 border-danger-100'} flex items-start gap-4`} role="status">
          <CheckCircle size={24} className={receipt.ok ? 'text-bd-green shrink-0 mt-1' : 'text-danger-600 shrink-0 mt-1'} />
          <div className="space-y-1">
            <p className={`font-extrabold ${receipt.ok ? 'text-bd-green' : 'text-danger-700'}`}>
              {receipt.ok ? 'সাদাকাহ গৃহীত' : 'লেনদেন অসম্পূর্ণ'}
            </p>
            <p className="text-sm text-gray-600 font-medium">{receipt.message}</p>
          </div>
        </div>
      )}

      <div className="bg-black text-white p-16 space-y-8">
         <div className="caps-label text-bd-green">Digital Sadaqah</div>
         <h2 className="text-5xl font-extrabold leading-tight">আপনার দান, <br /> মাদ্রাসার সমৃদ্ধি।</h2>
         <p className="text-gray-400 text-xl max-w-2xl font-medium">আমরা সরাসরি দাতাদের সাথে প্রতিষ্ঠানের যোগাযোগ করিয়ে দিই। কোনো অতিরিক্ত ফি ছাড়াই আপনার পূর্ণ দান পৌঁছাবে কাঙ্ক্ষিত লক্ষ্যে।</p>
         <div className="flex gap-4 pt-6">
            <button onClick={() => openDonate()} className="bg-white text-black px-10 py-5 font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-3">
              <Heart size={20} /> অনদান দিন
            </button>
            <button 
              onClick={() => {
                if (!currentUser) {
                  toast.warning('তহবিলের জন্য আবেদন করতে প্রথমে লগইন করুন।');
                  return;
                }
                if (currentUser.role !== 'INSTITUTION') {
                  toast.warning('শুধুমাত্র প্রতিষ্ঠান প্রধানগণ আবেদন করতে পারবেন।');
                  return;
                }
                setShowFundingModal(true);
              }}
              className="border border-gray-700 text-white px-10 py-5 font-bold text-lg hover:bg-gray-900 transition-all"
            >
              তহবিল আবেদন
            </button>
         </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 text-gray-400 font-medium">
          এখনো কোনো সাদাকাহ প্রকল্প নেই
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {projects.map(proj => {
            const progress = Math.min(100, (proj.raised / proj.goal) * 100);
            return (
              <div key={proj.id} className="bg-white p-10 flex flex-col group h-full">
                  <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-8">
                     <ImageWithFallback src={proj.image} name={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={proj.title} />
                  </div>
                  <div className="space-y-6 flex-1 flex flex-col">
                     <div className="flex justify-between items-start">
                        <div className="caps-label text-gray-400">{proj.category}</div>
                        <CheckCircle size={16} className="text-bd-green" />
                     </div>
                     <h3 className="text-2xl font-extrabold leading-tight">{proj.title}</h3>
                     <p className="text-sm text-gray-500">{proj.institution}</p>
                     <div className="space-y-4 pt-4 mt-auto">
                        <div className="w-full h-1 bg-gray-100">
                           <div className="h-full bg-bd-green transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <div className="caps-label text-gray-400">সংগৃহীত</div>
                              <div className="text-2xl font-extrabold">৳{proj.raised.toLocaleString()}</div>
                           </div>
                           <div className="text-xs font-bold text-gray-400">লক্ষ্য: ৳{proj.goal.toLocaleString()}</div>
                        </div>
                     </div>
                     <button
                        onClick={() => openDonate(proj)}
                        className="w-full py-4 mt-4 bg-black text-white font-bold text-sm hover:bg-bd-green transition-all flex items-center justify-center gap-2"
                     >
                        অংশ নিন <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
            )
          })}
        </div>
      )}

      <DonationModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
        projectId={selectedProject?.id}
        projectTitle={selectedProject?.title}
      />

      {/* Funding Application Modal */}
      {showFundingModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowFundingModal(false)}>
          <div className="bg-white p-8 max-w-2xl w-full border border-gray-200 animate-fadeIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">সাদাকাহ তহবিল আবেদন</h3>
              <button onClick={() => setShowFundingModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">প্রকল্পের নাম *</label>
                <input
                  type="text"
                  value={fundingForm.projectTitle}
                  onChange={(e) => setFundingForm({...fundingForm, projectTitle: e.target.value})}
                  placeholder="উদা: মাদ্রাসা লাইব্রেরি নির্মাণ"
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-bd-green font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">বিভাগ *</label>
                  <select
                    value={fundingForm.category}
                    onChange={(e) => setFundingForm({...fundingForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-bd-green font-medium"
                  >
                    <option value="Infrastructure">অবকাঠামো</option>
                    <option value="Food">খাদ্য সহায়তা</option>
                    <option value="Books">কিতাব ও বই</option>
                    <option value="Scholarships">বৃত্তি</option>
                    <option value="Utilities">ইউটিলিটি (বিদ্যুৎ, পানি)</option>
                    <option value="Emergency">জরুরি প্রয়োজন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    value={fundingForm.amount}
                    onChange={(e) => setFundingForm({...fundingForm, amount: e.target.value})}
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-bd-green font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">প্রকল্পের বিস্তারিত বিবরণ *</label>
                <textarea
                  value={fundingForm.description}
                  onChange={(e) => setFundingForm({...fundingForm, description: e.target.value})}
                  placeholder="প্রকল্পটি সম্পর্কে বিস্তারিত লিখুন..."
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-bd-green font-medium min-h-[120px] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">কেন এই তহবিল প্রয়োজন? *</label>
                <textarea
                  value={fundingForm.justification}
                  onChange={(e) => setFundingForm({...fundingForm, justification: e.target.value})}
                  placeholder="আর্থিক প্রয়োজনীয়তার কারণ ব্যাখ্যা করুন..."
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-bd-green font-medium min-h-[120px] resize-none"
                />
              </div>

              <div className="bg-info-50 border border-info-100 p-4">
                <p className="text-sm text-info-700 font-medium">
                  আবেদন জমার পর অ্যাডমিন পর্যালোচনা করবেন। অনুমোদিত হলে আপনার প্রকল্পটি সাদাকাহ তালিকায় যুক্ত হবে।
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowFundingModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleFundingApplication}
                className="px-6 py-3 bg-bd-green text-white font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Heart size={18} /> আবেদন জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SadaqahHub;

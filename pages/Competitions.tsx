
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Calendar, Users, ArrowRight, Sparkles, X, Upload } from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { dataService } from '../services/dataService';
import { useAuthStore } from '../stores';
import { toast } from '../services/toast';

const Competitions: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedComp, setSelectedComp] = useState<any | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    setLoading(true);
    const comps = await dataService.getCompetitions();
    setCompetitions(comps);
    if (currentUser) {
      const registered = await dataService.getMyCompetitionRegistrations();
      setRegisteredIds(registered);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!selectedComp) return;

    try {
      await dataService.registerForCompetition(selectedComp.id, submissionUrl, notes);
      toast.success('নিবন্ধন সফল হয়েছে!', 'আপনার অংশগ্রহণ নিশ্চিত করা হয়েছে।');
      setRegisteredIds([...registeredIds, selectedComp.id]);
      setShowRegModal(false);
      setSubmissionUrl('');
      setNotes('');
      loadCompetitions();
    } catch (error: any) {
      toast.error(error?.message || 'নিবন্ধন করতে সমস্যা হয়েছে।');
    }
  };

  const openRegModal = (comp: any) => {
    if (!currentUser) {
      toast.warning('প্রতিযোগিতায় অংশ নিতে প্রথমে লগইন করুন।');
      return;
    }
    if (registeredIds.includes(comp.id)) {
      toast.info('আপনি ইতিমধ্যে এই প্রতিযোগিতায় নিবন্ধিত।');
      return;
    }
    setSelectedComp(comp);
    setShowRegModal(true);
  };

  return (
    <div className="space-y-24 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Events & Talent</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">মেধা অন্বেষণ ও <br />সম্মাননা।</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          মাদ্রাসার শিক্ষার্থীদের প্রতিভা বিকাশের জন্য আমরা আয়োজন করছি বিশেষ সব ইভেন্ট এবং জাতীয় স্তরের প্রতিযোগিতা।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-100 minimal-border">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-32 text-gray-400 font-medium">
            লোড হচ্ছে...
          </div>
        ) : competitions.length === 0 ? (
          <div className="col-span-2 text-center py-32 text-gray-400 font-medium">
            বর্তমানে কোনো সক্রিয় প্রতিযোগিতা নেই
          </div>
        ) : competitions.map((comp, i) => {
          const isRegistered = registeredIds.includes(comp.id);
          return (
            <div key={i} className="bg-white p-12 group transition-all hover:bg-gray-50 flex flex-col h-full">
              <div className="aspect-[16/9] mb-10 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                 <ImageWithFallback 
                   src={comp.imageUrl || `https://picsum.photos/seed/comp${i}/800/600`} 
                   name={comp.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                   alt={comp.title} 
                 />
              </div>
              
              <div className="space-y-8 flex-1 flex flex-col">
                 <div className="flex justify-between items-start">
                    <div className="caps-label text-black">{isRegistered ? 'REGISTERED' : 'OPEN REGISTRATION'}</div>
                    <div className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">
                      {new Date(comp.deadline).toLocaleDateString('bn-BD', {day: 'numeric', month: 'long'})}
                    </div>
                 </div>
                 
                 <h3 className="text-3xl font-extrabold tracking-tight leading-tight flex-1">{comp.title}</h3>
                 
                 <div className="pt-10 mt-auto border-t border-gray-100 space-y-8">
                    <div className="flex justify-between items-center">
                       <div className="space-y-1">
                          <div className="caps-label text-gray-400">Prize Pool</div>
                          <div className="text-xl font-black">{comp.prize}</div>
                       </div>
                       <div className="text-right space-y-1">
                          <div className="caps-label text-gray-400">Participants</div>
                          <div className="text-xl font-black">{comp.participantCount}+</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => openRegModal(comp)}
                      disabled={isRegistered}
                      className={`w-full py-5 font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                        isRegistered 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-black'
                      }`}
                    >
                       {isRegistered ? '✓ নিবন্ধিত' : 'অংশগ্রহণ করুন'} <ArrowRight size={20} />
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-black text-white p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         <div className="space-y-8">
            <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-2xl">H</div>
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight">হল অফ ফেম (Hall of Fame)।</h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              বিগত বছরের সেরা ফলাফলকারী শিক্ষার্থী ও সফল শিক্ষকদের সম্মাননা তালিকা এবং তাদের সাফল্যের গল্পসমূহ।
            </p>
            <button className="text-sm font-bold border-b-2 border-white pb-0.5 hover:text-black hover:border-black transition-all">বিজয়ীদের তালিকা দেখুন</button>
         </div>
         <div className="grid grid-cols-2 gap-1 bg-gray-900 minimal-border">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-black p-10 flex flex-col items-center text-center space-y-4 border border-gray-900">
                 <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full"></div>
                 <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-black">RANK #{i}</p>
                    <p className="text-xs font-bold text-gray-400">মাওলানা সাঈদ বিন নূর</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Competition Registration Modal */}
      {showRegModal && selectedComp && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowRegModal(false)}>
          <div className="bg-white p-8 max-w-md w-full border border-gray-200 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">প্রতিযোগিতায় নিবন্ধন</h3>
              <button onClick={() => setShowRegModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold mb-2">{selectedComp.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>পুরস্কার: {selectedComp.prize}</span>
                  <span>•</span>
                  <span>শেষ তারিখ: {new Date(selectedComp.deadline).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>

              {selectedComp.requirements && (
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-widest">প্রয়োজনীয়তা</p>
                  <p className="text-sm text-gray-900 font-medium">{selectedComp.requirements}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  সাবমিশন URL (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://drive.google.com/... অথবা YouTube লিঙ্ক"
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  আপনার কাজ Google Drive, YouTube বা অন্যান্য প্ল্যাটফর্মে আপলোড করে লিঙ্ক দিন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  অতিরিক্ত মন্তব্য (ঐচ্ছিক)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium min-h-[100px] resize-none"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs text-gray-900 font-medium">
                  নিবন্ধনের পর আপনি আপনার সাবমিশন আপডেট করতে পারবেন। চূড়ান্ত সাবমিশন শেষ তারিখের আগে জমা দিন।
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowRegModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-black text-white font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Trophy size={18} /> নিবন্ধন নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitions;

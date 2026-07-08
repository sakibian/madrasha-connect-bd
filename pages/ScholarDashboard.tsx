import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, CheckCircle, Loader2, MessageCircle, BadgeCheck, GraduationCap, Plus, ExternalLink, Trash2, FolderOpen } from 'lucide-react';
import { Fatwa, Source, Scholar, ScholarPortfolioItem, XP_ACTIONS } from '../types';
import { dataService } from '../services/dataService';
import CitationBadge from '../components/CitationBadge';
import CitationPicker from '../components/CitationPicker';
import { Button, Modal, Badge, StatCard, EmptyState } from '../components/ui';
import { useAuthStore, useFatwaStore } from '../stores';

const PORTFOLIO_TYPES = ['publication', 'video', 'article', 'lecture', 'other'] as const;
const TYPE_LABELS: Record<string, string> = {
  publication: 'প্রকাশনা', video: 'ভিডিও', article: 'আর্টিকেল', lecture: 'লেকচার', other: 'অন্যান্য',
};

const ScholarDashboard: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { pendingFatwas, fetchPending } = useFatwaStore();
  const [activeTab, setActiveTab] = useState<'fatwas' | 'portfolio'>('fatwas');
  const [myProfile, setMyProfile] = useState<Scholar | null>(null);
  const [answersGiven, setAnswersGiven] = useState(0);
  const [answering, setAnswering] = useState<Fatwa | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedSources, setSelectedSources] = useState<Source[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Portfolio state
  const [portfolio, setPortfolio] = useState<ScholarPortfolioItem[]>([]);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortItem, setNewPortItem] = useState({ title: '', description: '', url: '', type: 'publication' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchPending();
      const scholars = await dataService.getScholars();
      const profile = scholars.find(s => s.name === currentUser?.name) || null;
      setMyProfile(profile);
      if (profile) {
        const stats = await dataService.getScholarStats(currentUser?.id || '');
        setAnswersGiven(stats.answersGiven);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeTab === 'portfolio' && currentUser) {
      dataService.getScholarPortfolio(currentUser.id).then(setPortfolio);
    }
  }, [activeTab, currentUser]);

  const handleApprove = async () => {
    if (!answering || !answerText.trim()) return;
    setSubmitting(true);
    try {
      await dataService.approveFatwa(answering.id, answerText, selectedSources.map(s => s.id));
      if (currentUser) dataService.addXP(currentUser.id, XP_ACTIONS.ANSWER_FATWA.action, XP_ACTIONS.ANSWER_FATWA.xp);
      fetchPending();
      setAnswering(null);
      setAnswerText('');
      setSelectedSources([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (fatwa: Fatwa) => {
    await dataService.rejectFatwa(fatwa.id);
    fetchPending();
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Scholar Portal</div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">স্কলার ড্যাশবোর্ড।</h1>
            {myProfile && (
              <div className="flex items-center gap-3 mt-4">
                <BadgeCheck size={18} className="text-bd-green" />
                <span className="font-bold text-gray-600">{myProfile.name}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{myProfile.specialization}</span>
              </div>
            )}
          </div>
          <Link to="/fatwa" className="text-sm font-bold border-b-2 border-black">ফতোয়া পোর্টাল</Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : (
        <>
          <div className="flex gap-1 bg-gray-100 p-1 minimal-border w-fit">
            <Button
              variant={activeTab === 'fatwas' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('fatwas')}
              icon={<MessageCircle size={14} />}
            >
              ফতোয়া কিউ
            </Button>
            <Button
              variant={activeTab === 'portfolio' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('portfolio')}
              icon={<FolderOpen size={14} />}
            >
              পোর্টফোলিও
            </Button>
          </div>

          {activeTab === 'fatwas' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
                <StatCard icon={<MessageCircle size={24} />} label="পেন্ডিং ফতোয়া" value={pendingFatwas.length} />
                <StatCard icon={<CheckCircle size={24} />} label="উত্তর দেওয়া হয়েছে" value={answersGiven} />
                <StatCard icon={<GraduationCap size={24} />} label="ভেরিফিকেশন" value={myProfile?.verified ? 1 : 0} />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold">পেন্ডিং ফতোয়া</h2>
                  <span className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-500">{pendingFatwas.length}</span>
                </div>

                {pendingFatwas.length === 0 ? (
                  <EmptyState icon={<Shield size={48} />} title="কোনো পেন্ডিং ফতোয়া নেই" description="সব ফতোয়ার উত্তর দেওয়া হয়েছে।" />
                ) : (
                  <div className="space-y-1 bg-gray-100 minimal-border">
                    {pendingFatwas.map(fatwa => (
                      <div key={fatwa.id} className="bg-white p-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="caps-label text-bd-green">{fatwa.category}</div>
                            <h3 className="text-2xl font-extrabold leading-tight">{fatwa.question}</h3>
                            <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
                              <Clock size={12} /> {fatwa.askedAt}
                            </div>
                          </div>
                        </div>

                        {fatwa.aiSuggestion && (
                          <div className="p-6 bg-gray-50 border-l-4 border-gray-300 space-y-2">
                            <div className="caps-label text-gray-400">এআই প্রস্তাবনা</div>
                            <p className="text-sm text-gray-600 italic">{fatwa.aiSuggestion}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button onClick={() => setAnswering(fatwa)}>উত্তর দিন</Button>
                          <Button variant="danger" onClick={() => handleReject(fatwa)}>প্রত্যাখ্যান</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">পোর্টফোলিও</h2>
                <Button onClick={() => setShowAddPortfolio(!showAddPortfolio)} icon={<Plus size={16} />}>
                  নতুন আইটেম
                </Button>
              </div>

              {showAddPortfolio && (
                <div className="bg-white p-8 minimal-border space-y-6 animate-slideDown">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="caps-label text-gray-400">শিরোনাম</label>
                      <input
                        placeholder="টাইটেল"
                        className="w-full p-3 bg-gray-50 border border-gray-100 outline-none font-bold"
                        value={newPortItem.title}
                        onChange={e => setNewPortItem({...newPortItem, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="caps-label text-gray-400">ধরন</label>
                      <select
                        className="w-full p-3 bg-gray-50 border border-gray-100 outline-none font-bold"
                        value={newPortItem.type}
                        onChange={e => setNewPortItem({...newPortItem, type: e.target.value})}
                      >
                        {PORTFOLIO_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="caps-label text-gray-400">লিংক (URL)</label>
                      <input
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-50 border border-gray-100 outline-none font-bold"
                        value={newPortItem.url}
                        onChange={e => setNewPortItem({...newPortItem, url: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="caps-label text-gray-400">বিবরণ</label>
                      <textarea
                        placeholder="বিবরণ লিখুন..."
                        rows={3}
                        className="w-full p-3 bg-gray-50 border border-gray-100 outline-none font-medium"
                        value={newPortItem.description}
                        onChange={e => setNewPortItem({...newPortItem, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={async () => {
                        if (!newPortItem.title.trim()) return;
                        await dataService.addScholarPortfolioItem(newPortItem);
                        setNewPortItem({ title: '', description: '', url: '', type: 'publication' });
                        setShowAddPortfolio(false);
                        if (currentUser) dataService.getScholarPortfolio(currentUser.id).then(setPortfolio);
                      }}
                      disabled={!newPortItem.title.trim()}
                    >
                      সেভ করুন
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPortfolio(false)}>
                      বাতিল
                    </Button>
                  </div>
                </div>
              )}

              {portfolio.length === 0 ? (
                <EmptyState icon={<FolderOpen size={48} />} title="পোর্টফোলিওতে কিছু নেই" description="আপনার কাজ ও প্রকাশনা যোগ করুন।" />
              ) : (
                <div className="grid gap-4">
                  {portfolio.map(item => (
                    <div key={item.id} className="bg-white p-8 minimal-border flex items-start justify-between gap-6 group hover:border-gray-200 transition-all">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">{TYPE_LABELS[item.type] || item.type}</Badge>
                          <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                        </div>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                            <ExternalLink size={12} /> {item.url.slice(0, 40)}...
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await dataService.deleteScholarPortfolioItem(item.id);
                          if (currentUser) dataService.getScholarPortfolio(currentUser.id).then(setPortfolio);
                        }}
                        icon={<Trash2 size={16} />}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <Modal open={!!answering} onClose={() => { setAnswering(null); setShowPicker(false); }} size="lg">
        {answering && (
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">{answering.question}</p>
            </div>

            {answering.aiSuggestion && (
              <div className="p-4 bg-gray-50 text-sm text-gray-500 italic border-l-4 border-gray-300">
                <div className="caps-label text-gray-400 mb-2">এআই প্রস্তাবনা</div>
                {answering.aiSuggestion}
              </div>
            )}

            <textarea
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="আপনার উত্তর লিখুন..."
              className="w-full p-6 border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black font-medium min-h-[200px]"
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="caps-label text-gray-400">সোর্স সাইটেশন</span>
                <Button variant="outline" size="sm" onClick={() => setShowPicker(true)}>
                  + সোর্স যোগ করুন
                </Button>
              </div>
              {selectedSources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSources.map(s => (
                    <CitationBadge key={s.id} source={s} size="md" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Button
                onClick={handleApprove}
                disabled={submitting || !answerText.trim()}
                loading={submitting}
                size="lg"
                className="flex-1"
                icon={!submitting ? <CheckCircle size={18} /> : undefined}
              >
                উত্তর প্রকাশ করুন
              </Button>
              <Button variant="outline" size="lg" onClick={() => setAnswering(null)}>
                বাতিল
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {showPicker && (
        <CitationPicker
          selected={selectedSources}
          onChange={setSelectedSources}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

export default ScholarDashboard;

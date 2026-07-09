
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, BadgeCheck, Star, Trophy, Clock, Loader2, ArrowLeft, MessageCircle, GraduationCap, BookOpen, MapPin, Share2, X, Check, ThumbsUp, Plus, ExternalLink, FolderOpen
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { getCurrentUser } from '../services/authService';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { getLevelProgress, UserSkill, Scholar, ScholarPortfolioItem } from '../types';

const PORTFOLIO_TYPE_LABELS: Record<string, string> = {
  publication: 'প্রকাশনা', video: 'ভিডিও', article: 'আর্টিকেল', lecture: 'লেকচার', other: 'অন্যান্য',
};

const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [xp, setXp] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const [portfolio, setPortfolio] = useState<ScholarPortfolioItem[]>([]);

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [users, xpData, userBadges, events, scholars, userStats] = await Promise.all([
        dataService.getUsers(),
        dataService.getUserXP(id),
        dataService.getUserBadges(id),
        dataService.getUserXPEvents(id),
        dataService.getScholars(),
        dataService.getUserStats(id),
      ]);
      setProfile(users.find(u => u.id === id) || null);
      setXp(xpData);
      setBadges(userBadges);
      setActivity(events);
      setScholar(scholars.find(s => s.userId === id) || null);
      setStats(userStats);
      const userSkills = await dataService.getUserSkills(id, currentUser?.id);
      setSkills(userSkills);
      const foundScholar = scholars.find(s => s.userId === id);
      if (foundScholar) {
        const portfolioItems = await dataService.getScholarPortfolio(id);
        setPortfolio(portfolioItems);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !id) return;
    setAddingSkill(true);
    try {
      await dataService.addUserSkill(id, newSkill.trim());
      setNewSkill('');
      const userSkills = await dataService.getUserSkills(id, currentUser?.id);
      setSkills(userSkills);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingSkill(false);
    }
  };

  const handleEndorse = async (skillId: string, endorsed: boolean) => {
    try {
      if (endorsed) {
        await dataService.unendorseSkill(skillId);
      } else {
        await dataService.endorseSkill(skillId);
      }
      const userSkills = await dataService.getUserSkills(id, currentUser?.id);
      setSkills(userSkills);
    } catch (e) {
      console.error(e);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <User size={64} className="text-gray-200" />
        <p className="text-xl font-bold text-gray-400">প্রোফাইল পাওয়া যায়নি</p>
        <Link to="/leaderboard" className="text-sm font-bold border-b-2 border-black">লিডারবোর্ডে ফিরুন</Link>
      </div>
    );
  }

  const progress = xp ? getLevelProgress(xp.xp) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="flex items-center justify-between">
        <Link to="/leaderboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={16} /> লিডারবোর্ড
        </Link>
        <button
          onClick={() => setShowShareCard(true)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-700 transition-colors"
        >
          <Share2 size={16} /> শেয়ার
        </button>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 bg-gray-50 overflow-hidden border-2 border-gray-200">
            <ImageWithFallback src={profile.avatar || `https://picsum.photos/seed/${id}/200/200`} name={profile.name} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold">{profile.name}</h1>
              {scholar?.verified && <BadgeCheck size={24} className="text-bd-green" />}
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
              <span className="flex items-center gap-1.5"><User size={14} /> {profile.role}</span>
              {scholar?.specialization && (
                <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {scholar.specialization}</span>
              )}
              {scholar?.institution && (
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {scholar.institution}</span>
              )}
              {scholar?.location && (
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {scholar.location}</span>
              )}
            </div>
          </div>
        </div>

        {xp && progress && (
          <div className="p-8 bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={24} className="text-bd-green" />
                <div>
                  <span className="text-3xl font-extrabold">লেভেল {xp.level}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-lg font-bold text-gray-500">{xp.xp.toLocaleString()} CP</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-bd-green rounded-full transition-all" style={{ width: `${Math.min(progress.progress, 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>{progress.current.toLocaleString()} CP</span>
                <span>{progress.next.toLocaleString()} CP</span>
              </div>
            </div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold flex items-center gap-2"><Star size={18} /> ব্যাজ</h2>
            <div className="flex flex-wrap gap-3">
              {badges.map(ub => (
                <div key={ub.id} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100">
                  <span className="text-lg">{ub.badge?.icon || '🏅'}</span>
                  <div>
                    <p className="text-sm font-bold">{ub.badge?.name}</p>
                    <p className="text-[9px] text-gray-400 font-medium">{ub.badge?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold flex items-center gap-2"><Trophy size={18} /> মাইলস্টোন</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'পোস্ট', value: stats.postsCount, icon: '📝' },
                { label: 'মন্তব্য', value: stats.commentsCount, icon: '💬' },
                { label: 'লাইক', value: stats.likesReceived, icon: '👍' },
                { label: 'ফতোয়া', value: stats.fatwasAsked, icon: '📖' },
                { label: 'কোর্স', value: stats.coursesEnrolled, icon: '🎓' },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 p-4 text-center border border-gray-100">
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-2xl font-extrabold">{m.value}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills & Endorsements */}
      <div className="bg-white p-12 minimal-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2"><Star size={18} /> দক্ষতা</h2>
          {isOwnProfile && (
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="দক্ষতার নাম"
                className="px-3 py-1.5 text-xs border border-gray-200 outline-none focus:border-black w-32"
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
              />
              <button
                onClick={handleAddSkill}
                disabled={addingSkill || !newSkill.trim()}
                className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {addingSkill ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
              </button>
            </div>
          )}
        </div>

        {skills.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">এখনো কোনো দক্ষতা যোগ করা হয়নি</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map(s => (
              <div key={s.id} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-all">
                <span className="text-sm font-bold">{s.skill}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold">{s.endorsementsCount || 0}</span>
                  {currentUser && !isOwnProfile && (
                    <button
                      onClick={() => handleEndorse(s.id, !!s.endorsedByMe)}
                      className={`p-1 rounded transition-all ${
                        s.endorsedByMe ? 'text-emerald-600 bg-emerald-50' : 'text-gray-300 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={s.endorsedByMe ? 'এনডোর্সমেন্ট সরান' : 'এনডোর্স করুন'}
                    >
                      <ThumbsUp size={12} />
                    </button>
                  )}
                  {isOwnProfile && (
                    <button
                      onClick={() => dataService.deleteUserSkill(s.id).then(async () => {
                        const userSkills = await dataService.getUserSkills(id!, currentUser?.id);
                        setSkills(userSkills);
                      })}
                      className="p-1 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activity.length > 0 && (
      <div className="bg-white p-12 minimal-border space-y-6">
          <h2 className="text-lg font-extrabold flex items-center gap-2"><Clock size={18} /> সাম্প্রতিক কার্যকলাপ</h2>
          <div className="space-y-1">
            {activity.map(e => (
              <div key={e.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-2 py-1 bg-gray-100 uppercase tracking-widest">{e.action}</span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {new Date(e.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <span className="font-bold text-bd-green">+{e.xp} CP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {scholar && (
        <div className="bg-white p-12 minimal-border space-y-4">
          <h2 className="text-lg font-extrabold">স্কলার তথ্য</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="caps-label text-gray-400">পদবি</span>
              <p className="font-bold">{scholar.title}</p>
            </div>
            <div>
              <span className="caps-label text-gray-400">বিশেষজ্ঞতা</span>
              <p className="font-bold">{scholar.specialization}</p>
            </div>
            {scholar.institution && (
              <div>
                <span className="caps-label text-gray-400">প্রতিষ্ঠান</span>
                <p className="font-bold">{scholar.institution}</p>
              </div>
            )}
            {scholar.location && (
              <div>
                <span className="caps-label text-gray-400">অবস্থান</span>
                <p className="font-bold">{scholar.location}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {scholar && portfolio.length > 0 && (
        <div className="bg-white p-12 minimal-border space-y-6">
          <h2 className="text-lg font-extrabold flex items-center gap-2"><FolderOpen size={18} /> পোর্টফোলিও</h2>
          <div className="grid gap-4">
            {portfolio.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-4 p-4 bg-gray-50 border border-gray-100 group hover:border-gray-200 transition-all">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      {PORTFOLIO_TYPE_LABELS[item.type] || item.type}
                    </span>
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                  </div>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-1">
                      <ExternalLink size={12} /> {item.url.slice(0, 40)}...
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showShareCard && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowShareCard(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black">অ্যাচিভমেন্ট কার্ড</h3>
                <button onClick={() => setShowShareCard(false)} className="text-gray-400 hover:text-black p-1"><X size={20} /></button>
              </div>
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 p-8 text-white rounded-2xl space-y-4 text-center">
                <div className="w-16 h-16 bg-white/10 mx-auto rounded-full flex items-center justify-center text-2xl font-black border-2 border-white/20">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-black">{profile.name}</p>
                  <p className="text-emerald-300 text-sm font-bold">{scholar?.title || profile.role}</p>
                </div>
                {xp && (
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm space-y-2">
                    <div className="flex justify-center items-center gap-4">
                      <div>
                        <div className="text-3xl font-black">{xp.level}</div>
                        <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Level</div>
                      </div>
                      <div className="w-px h-10 bg-white/20" />
                      <div>
                        <div className="text-3xl font-black">{xp.xp.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">CP</div>
                      </div>
                    </div>
                  </div>
                )}
                {badges.length > 0 && (
                  <div className="flex justify-center gap-2">
                    {badges.slice(0, 3).map(ub => (
                      <span key={ub.id} className="text-2xl" title={ub.badge?.name}>{ub.badge?.icon || '🏅'}</span>
                    ))}
                    {badges.length > 3 && <span className="text-sm text-emerald-300 font-bold flex items-center">+{badges.length - 3}</span>}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${id}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  {copied ? 'কপি করা হয়েছে!' : 'প্রোফাইল লিংক কপি করুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;

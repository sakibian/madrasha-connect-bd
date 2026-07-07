
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, BadgeCheck, Star, Trophy, Clock, Loader2, ArrowLeft, MessageCircle, GraduationCap, BookOpen, MapPin
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { getLevelProgress } from '../types';
import { Scholar, Badge as BadgeType } from '../types';

const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [xp, setXp] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [users, xpData, userBadges, events, scholars] = await Promise.all([
        dataService.getUsers(),
        dataService.getUserXP(id),
        dataService.getUserBadges(id),
        dataService.getUserXPEvents(id),
        dataService.getScholars(),
      ]);
      setProfile(users.find(u => u.id === id) || null);
      setXp(xpData);
      setBadges(userBadges);
      setActivity(events);
      setScholar(scholars.find(s => s.userId === id) || null);
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
      <Link to="/leaderboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
        <ArrowLeft size={16} /> লিডারবোর্ড
      </Link>

      <div className="bg-white p-12 minimal-border space-y-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 bg-gray-50 overflow-hidden border-2 border-gray-200">
            <img src={profile.avatar || `https://picsum.photos/seed/${id}/200/200`} className="w-full h-full object-cover" alt="" />
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
                  <span className="text-lg font-bold text-gray-500">{xp.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-bd-green rounded-full transition-all" style={{ width: `${Math.min(progress.progress, 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>{progress.current.toLocaleString()} XP</span>
                <span>{progress.next.toLocaleString()} XP</span>
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
                <span className="font-bold text-bd-green">+{e.xp} XP</span>
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
    </div>
  );
};

export default PublicProfile;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, TrendingUp, Star, Loader2, BadgeCheck, User } from 'lucide-react';
import { dataService } from '../services/dataService';
import { getLevel, getLevelProgress } from '../types';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof dataService.getLeaderboard>>>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'xp' | 'level'>('xp');

  useEffect(() => {
    dataService.getLeaderboard().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const sorted = tab === 'level'
    ? [...users].sort((a, b) => b.level - a.level || b.xp - a.xp)
    : users;

  const rankIcon = (i: number) => {
    if (i === 0) return <Trophy size={20} className="text-yellow-500" />;
    if (i === 1) return <Medal size={20} className="text-gray-400" />;
    if (i === 2) return <Medal size={20} className="text-amber-700" />;
    return <span className="text-sm font-bold text-gray-300 w-5 text-center">{i + 1}</span>;
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Community</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">লিডারবোর্ড।</h1>
        <p className="text-gray-500 font-medium max-w-xl">সবচেয়ে সক্রিয় সদস্যরা — ফতোয়া উত্তর, চাকরি পোস্ট, কোর্স সম্পূর্ণ এবং আরও অনেক কিছুতে CP (কন্ট্রিবিউট পয়েন্ট) অর্জন করুন!</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 minimal-border w-fit">
        <button
          onClick={() => setTab('xp')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'xp' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
        >
          <TrendingUp size={14} className="inline mr-2" />সর্বোচ্চ CP
        </button>
        <button
          onClick={() => setTab('level')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'level' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
        >
          <Star size={14} className="inline mr-2" />সর্বোচ্চ লেভেল
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold"><Loader2 size={24} className="animate-spin mx-auto mb-4" />লোড হচ্ছে...</div>
      ) : (
        <div className="bg-white minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">#</th>
                <th className="px-8 py-5">সদস্য</th>
                <th className="px-8 py-5">লেভেল</th>
                <th className="px-8 py-5 text-right">CP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((u, i) => {
                const progress = getLevelProgress(u.xp);
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">{rankIcon(i)}</td>
                    <td className="px-8 py-6">
                      <Link to={`/profile/${u.userId}`} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-gray-50 overflow-hidden border border-gray-200">
                          <img src={u.avatar || `https://picsum.photos/seed/${u.userId}/100/100`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <span className="font-bold text-gray-800 group-hover:text-black transition-colors">{u.name}</span>
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg">{u.level}</span>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-bd-green rounded-full transition-all"
                            style={{ width: `${Math.min(progress.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-lg">{u.xp.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

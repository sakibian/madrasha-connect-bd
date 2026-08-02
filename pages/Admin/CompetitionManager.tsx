import React, { useState, useEffect } from 'react';
import { Trophy, Plus, X, Users, Calendar, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { toast } from '../../services/toast';

const CompetitionManager: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    deadline: '',
    category: 'Quranic',
    maxParticipants: '',
    requirements: '',
  });

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    setLoading(true);
    const comps = await dataService.getCompetitions();
    setCompetitions(comps);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.prize || !formData.deadline) {
      toast.warning('শিরোনাম, পুরস্কার এবং শেষ তারিখ বাধ্যতামূলক।');
      return;
    }

    try {
      // Create competition via direct insert (admin has RLS permission)
      const { data, error } = await (window as any).supabase
        .from('competitions')
        .insert({
          title: formData.title,
          description: formData.description,
          prize: formData.prize,
          deadline: formData.deadline,
          category: formData.category,
          max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          requirements: formData.requirements,
          registration_open: true,
        });

      if (error) throw error;

      toast.success('প্রতিযোগিতা তৈরি হয়েছে!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        prize: '',
        deadline: '',
        category: 'Quranic',
        maxParticipants: '',
        requirements: '',
      });
      loadCompetitions();
    } catch (error: any) {
      toast.error(error?.message || 'প্রতিযোগিতা তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">প্রতিযোগিতা ব্যবস্থাপনা</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white px-6 py-3 font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Plus size={18} /> নতুন প্রতিযোগিতা
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">লোড হচ্ছে...</div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Trophy size={48} className="mx-auto text-gray-200" />
          <p className="text-xl font-bold text-gray-400">কোনো প্রতিযোগিতা তৈরি করা হয়নি।</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">শিরোনাম</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">পুরস্কার</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">শেষ তারিখ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">অংশগ্রহণকারী</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {competitions.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{comp.title}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">{comp.category}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{comp.prize}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(comp.deadline).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm font-bold text-black">
                      <Users size={14} /> {comp.participantCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 border border-gray-200 text-gray-900 hover:bg-gray-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Competition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white p-8 max-w-2xl w-full border border-gray-200 animate-fadeIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">নতুন প্রতিযোগিতা তৈরি করুন</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">শিরোনাম *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="উদা: জাতীয় আরবি ক্যালিগ্রাফি প্রতিযোগিতা"
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">বিভাগ *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                  >
                    <option value="Quranic">কুরআন</option>
                    <option value="Calligraphy">ক্যালিগ্রাফি</option>
                    <option value="Writing">লেখনী</option>
                    <option value="Hifz">হিফজ</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">সর্বোচ্চ অংশগ্রহণকারী</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                    placeholder="সীমাহীন"
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">পুরস্কার *</label>
                  <input
                    type="text"
                    value={formData.prize}
                    onChange={(e) => setFormData({...formData, prize: e.target.value})}
                    placeholder="৳ ২০,০০০ + সনদ"
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">শেষ তারিখ *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">বিবরণ</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="প্রতিযোগিতা সম্পর্কে বিস্তারিত..."
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">প্রয়োজনীয়তা</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="যোগ্যতা এবং শর্তাবলী..."
                  className="w-full px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-black font-medium min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Trophy size={18} /> তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionManager;

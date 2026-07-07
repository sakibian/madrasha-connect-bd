
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Loader2, CheckCircle, XCircle, Clock, Plus, Trash2, Send, ArrowRight, BadgeCheck
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { ScholarApplication } from '../types';

const ScholarApply: React.FC = () => {
  const navigate = useNavigate();
  const [existingApp, setExistingApp] = useState<ScholarApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [credentials, setCredentials] = useState<string[]>(['']);
  const [references, setReferences] = useState<string[]>(['']);

  useEffect(() => {
    const check = async () => {
      const app = await dataService.getMyScholarApplication();
      setExistingApp(app);
      setLoading(false);
    };
    check();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !specialization.trim()) return;
    setSubmitting(true);
    try {
      await dataService.submitScholarApplication({
        title: title.trim(),
        specialization: specialization.trim(),
        institution: institution.trim(),
        location: location.trim(),
        bio: bio.trim(),
        credentials: credentials.filter(c => c.trim()),
        references: references.filter(r => r.trim()),
      });
      const app = await dataService.getMyScholarApplication();
      setExistingApp(app);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (existingApp) {
    return (
      <div className="space-y-12 animate-fadeIn">
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <div className="caps-label text-gray-400">Scholar Portal</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">আবেদনের অবস্থা।</h1>
        </div>

        <div className="max-w-2xl">
          {existingApp.status === 'pending' && (
            <div className="p-12 bg-amber-50 border border-amber-200 space-y-6">
              <Clock size={48} className="text-amber-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold">আবেদন পর্যালোচনাধীন</h2>
                <p className="text-gray-600 font-medium">আপনার আবেদনটি অ্যাডমিন পর্যালোচনার জন্য অপেক্ষা করছে। আমাদের টিম শীঘ্রই এটি পর্যালোচনা করবে।</p>
              </div>
              <div className="p-4 bg-white space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500">পদবি</span>
                  <span className="font-bold">{existingApp.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500">বিশেষজ্ঞতা</span>
                  <span className="font-bold">{existingApp.specialization}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500">আবেদনের তারিখ</span>
                  <span className="font-bold">{new Date(existingApp.createdAt).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
            </div>
          )}

          {existingApp.status === 'approved' && (
            <div className="p-12 bg-bd-green/5 border border-bd-green/20 space-y-6">
              <BadgeCheck size={48} className="text-bd-green" />
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-bd-green">অভিনন্দন! আপনি ভেরিফায়েড!</h2>
                <p className="text-gray-600 font-medium">আপনার স্কলার আবেদন অনুমোদিত হয়েছে। আপনি এখন স্কলার ড্যাশবোর্ড ব্যবহার করতে পারবেন।</p>
              </div>
              <button
                onClick={() => navigate('/scholar-dashboard')}
                className="px-8 py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                স্কলার ড্যাশবোর্ড <ArrowRight size={16} />
              </button>
            </div>
          )}

          {existingApp.status === 'rejected' && (
            <div className="p-12 bg-red-50 border border-red-200 space-y-6">
              <XCircle size={48} className="text-red-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-red-600">আবেদন প্রত্যাখ্যাত</h2>
                <p className="text-gray-600 font-medium">আপনার আবেদনটি প্রত্যাখ্যান করা হয়েছে।</p>
              </div>
              {existingApp.adminNotes && (
                <div className="p-4 bg-white space-y-1">
                  <div className="caps-label text-gray-400">অ্যাডমিন নোট</div>
                  <p className="text-gray-700 font-medium">{existingApp.adminNotes}</p>
                </div>
              )}
              <button
                onClick={() => setExistingApp(null)}
                className="px-8 py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all"
              >
                পুনরায় আবেদন করুন
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Scholar Portal</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">স্কলার আবেদন।</h1>
        <p className="text-gray-500 font-medium max-w-xl">আপনার জ্ঞান ও অভিজ্ঞতা শেয়ার করতে আমাদের স্কলার টিমে যোগ দিন। ভেরিফায়েড স্কলাররা ফতোয়ার উত্তর দিতে এবং কন্টেন্ট যাচাই করতে পারেন।</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="bg-white p-12 minimal-border space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold">পদবি ও বিশেষজ্ঞতা</h2>
            <p className="text-sm text-gray-400 font-medium">আপনার একাডেমিক বা পেশাগত পরিচয়</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="caps-label text-gray-400">পদবি *</label>
              <select
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              >
                <option value="">পদবি নির্বাচন করুন</option>
                <option value="মুফতি">মুফতি</option>
                <option value="মাওলানা">মাওলানা</option>
                <option value="ক্বারী">ক্বারী</option>
                <option value="ড.">ড.</option>
                <option value="প্রফেসর">প্রফেসর</option>
                <option value="মুহাদ্দিস">মুহাদ্দিস</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="caps-label text-gray-400">বিশেষজ্ঞতা *</label>
              <input
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                placeholder="যেমন: ফিকহ, হাদিস, তাফসির"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="caps-label text-gray-400">প্রতিষ্ঠান</label>
              <input
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="আপনার শিক্ষা বা কর্ম প্রতিষ্ঠান"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="caps-label text-gray-400">অবস্থান</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="যেমন: ঢাকা, বাংলাদেশ"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="caps-label text-gray-400">জীবনবৃত্তান্ত</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="আপনার শিক্ষাগত যোগ্যতা, অভিজ্ঞতা এবং গবেষণার বিবরণ..."
              rows={4}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>
        </div>

        <div className="bg-white p-12 minimal-border space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold">যোগ্যতা ও সনদ</h2>
            <p className="text-sm text-gray-400 font-medium">আপনার একাডেমিক সনদ ও প্রশিক্ষণ</p>
          </div>

          {credentials.map((cred, i) => (
            <div key={i} className="flex gap-3 items-start">
              <input
                value={cred}
                onChange={e => {
                  const next = [...credentials];
                  next[i] = e.target.value;
                  setCredentials(next);
                }}
                placeholder="যেমন: দাওরায়ে হাদিস, জামিয়া ইসলামিয়া"
                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              />
              {credentials.length > 1 && (
                <button
                  type="button"
                  onClick={() => setCredentials(credentials.filter((_, j) => j !== i))}
                  className="p-4 text-red-500 hover:bg-red-50 border border-gray-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCredentials([...credentials, ''])}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-all"
          >
            <Plus size={16} /> আরেকটি যোগ্যতা যোগ করুন
          </button>
        </div>

        <div className="bg-white p-12 minimal-border space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold">রেফারেন্স</h2>
            <p className="text-sm text-gray-400 font-medium">আপনার সুপারিশকারীদের নাম ও পরিচিতি</p>
          </div>

          {references.map((ref, i) => (
            <div key={i} className="flex gap-3 items-start">
              <input
                value={ref}
                onChange={e => {
                  const next = [...references];
                  next[i] = e.target.value;
                  setReferences(next);
                }}
                placeholder="যেমন: মাওলানা আব্দুর রহিম, অধ্যক্ষ, দারুল উলুম"
                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold"
              />
              {references.length > 1 && (
                <button
                  type="button"
                  onClick={() => setReferences(references.filter((_, j) => j !== i))}
                  className="p-4 text-red-500 hover:bg-red-50 border border-gray-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setReferences([...references, ''])}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-all"
          >
            <Plus size={16} /> আরেকটি রেফারেন্স যোগ করুন
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim() || !specialization.trim()}
          className="w-full py-5 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-3"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          আবেদন জমা দিন
        </button>
      </form>
    </div>
  );
};

export default ScholarApply;

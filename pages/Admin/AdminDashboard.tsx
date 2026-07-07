
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingBag, 
  Users, 
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  ArrowUpRight,
  Shield,
  X,
  Loader2,
  GraduationCap
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Job, Product, User, Fatwa, Source, ContentFlag, ScholarApplication } from '../../types';
import CitationBadge from '../../components/CitationBadge';
import CitationPicker from '../../components/CitationPicker';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'products' | 'users' | 'moderation'>('overview');
  const [stats, setStats] = useState({
    jobs: 0,
    products: 0,
    users: 0,
    posts: 0
  });

  useEffect(() => {
    const load = async () => {
      const [jobs, products, users, posts] = await Promise.all([
        dataService.getJobs(),
        dataService.getProducts(),
        dataService.getUsers(),
        dataService.getPosts(),
      ]);
      setStats({
        jobs: jobs.length,
        products: products.length,
        users: users.length,
        posts: posts.length,
      });
    };
    load();
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">System Control</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">অ্যাডমিন প্যানেল।</h1>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 minimal-border w-fit">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={16} />} label="ওভারভিউ" />
        <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={16} />} label="চাকরি" />
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<ShoppingBag size={16} />} label="মার্কেটপ্লেস" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={16} />} label="ইউজার" />
        <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} icon={<Shield size={16} />} label="মডারেশন" />
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-gray-100 minimal-border">
          <StatBox icon={<Briefcase size={20} />} label="মোট সার্কুলার" value={stats.jobs} />
          <StatBox icon={<ShoppingBag size={20} />} label="পণ্য সংখ্যা" value={stats.products} />
          <StatBox icon={<Users size={20} />} label="নিবন্ধিত ইউজার" value={stats.users} />
          <StatBox icon={<MessageSquare size={20} />} label="কমিউনিটি পোস্ট" value={stats.posts} />
        </div>
      )}

      {activeTab === 'jobs' && <ManageJobs />}
      {activeTab === 'products' && <ManageProducts />}
      {activeTab === 'users' && <ManageUsers />}
      {activeTab === 'moderation' && <ModerationHub />}
    </div>
  );
};

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const loadJobs = async () => setJobs(await dataService.getJobs());
  useEffect(() => { loadJobs(); }, []);

  return (
    <div className="bg-white minimal-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
          <tr>
            <th className="px-8 py-5">সার্কুলার / পদবি</th>
            <th className="px-8 py-5">প্রতিষ্ঠান</th>
            <th className="px-8 py-5">অবস্থা</th>
            <th className="px-8 py-5 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-8 py-6">
                <p className="font-bold text-gray-800 text-lg">{job.title}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.type}</p>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-gray-500">{job.institution}</td>
              <td className="px-8 py-6">
                <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${job.verified ? 'bg-bd-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {job.verified ? 'VERIFIED' : 'PENDING'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3">
                  {!job.verified && (
                    <button onClick={async () => { await dataService.saveJob({...job, verified: true}); loadJobs(); }} className="p-3 bg-black text-white hover:bg-bd-green transition-all">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={async () => { await dataService.deleteJob(job.id); loadJobs(); }} className="p-3 border border-gray-200 text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', price: 0, category: 'Sunnah Food', image: 'https://picsum.photos/400/300' });

  const loadProducts = async () => setProducts(await dataService.getProducts());
  useEffect(() => { loadProducts(); }, []);

  const handleAdd = async () => {
    await dataService.saveProduct({ ...newProd as any, id: `prod-${Date.now()}` });
    setIsAdding(false);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setIsAdding(true)} className="bg-black text-white px-8 py-4 font-bold text-xs flex items-center gap-2 hover:bg-gray-800 transition-all">
          <Plus size={18} /> নতুন পণ্য
        </button>
      </div>
      
      {isAdding && (
        <div className="bg-white p-10 minimal-border space-y-8 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="caps-label text-gray-400">Name</label>
              <input placeholder="পণ্যের নাম" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none font-bold" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="caps-label text-gray-400">Price (৳)</label>
              <input type="number" placeholder="দাম" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none font-bold" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="caps-label text-gray-400">Category</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 outline-none font-bold" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                <option>Sunnah Food</option>
                <option>Calligraphy</option>
                <option>Modest Fashion</option>
                <option>Books</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAdd} className="bg-black text-white px-8 py-3 font-bold text-xs">সেভ করুন</button>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 font-bold text-xs">বাতিল</button>
          </div>
        </div>
      )}

      <div className="bg-white minimal-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-8 py-5">পণ্য</th>
              <th className="px-8 py-5">ক্যাটাগরি</th>
              <th className="px-8 py-5">দাম</th>
              <th className="px-8 py-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 overflow-hidden grayscale">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">{p.name}</span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-gray-500">{p.category}</td>
                <td className="px-8 py-6 font-black text-xl text-black">৳{p.price}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={async () => { await dataService.deleteProduct(p.id); loadProducts(); }} className="p-3 border border-gray-100 text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userSubTab, setUserSubTab] = useState<'users' | 'institutions'>('users');

  const loadUsers = async () => setUsers(await dataService.getUsers());
  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    await dataService.updateUserRole(userId, role);
    await loadUsers();
  };

  const handleBanToggle = async (userId: string, currentlyBanned: boolean) => {
    await dataService.banUser(userId, !currentlyBanned);
    await loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-100 p-1 minimal-border w-fit">
        <SubTabButton active={userSubTab === 'users'} onClick={() => setUserSubTab('users')} label="ইউজার ম্যানেজমেন্ট" />
        <SubTabButton active={userSubTab === 'institutions'} onClick={() => setUserSubTab('institutions')} label="প্রতিষ্ঠান অনুমোদন" />
      </div>

      {userSubTab === 'users' && (
        <div className="bg-white minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">ইউজার / প্রোফাইল</th>
                <th className="px-8 py-5">রোল</th>
                <th className="px-8 py-5">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.banned ? 'opacity-50' : ''}`}>
                  <td className="px-8 py-6 flex items-center gap-4">
                    <img src={u.avatar} className="w-10 h-10 bg-gray-50 border border-gray-200" alt="" />
                    <div>
                      <span className="font-bold text-gray-800 text-lg">{u.name}</span>
                      {u.institutionName && <p className="text-[10px] font-bold text-gray-400">{u.institutionName}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {u.role === 'ADMIN' ? (
                      <span className="text-[9px] font-black px-3 py-1 bg-black text-white uppercase tracking-widest">ADMIN</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-[9px] font-black px-3 py-1 bg-gray-100 text-gray-500 uppercase tracking-widest border-none outline-none cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="INSTITUTION">INSTITUTION</option>
                        <option value="SCHOLAR">SCHOLAR</option>
                      </select>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {u.banned ? (
                      <span className="text-[9px] font-black px-3 py-1 bg-red-100 text-red-600 uppercase tracking-widest">ব্যানড</span>
                    ) : (
                      <span className="text-[9px] font-black px-3 py-1 bg-green-100 text-green-600 uppercase tracking-widest">সক্রিয়</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleBanToggle(u.id, !!u.banned)}
                        className={`text-[10px] font-black uppercase tracking-widest border px-4 py-2 transition-all ${
                          u.banned ? 'border-green-200 text-green-600 hover:bg-green-600 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-red-600 hover:text-white'
                        }`}
                      >
                        {u.banned ? 'আনব্যান' : 'ব্যান'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userSubTab === 'institutions' && <ManageInstitutions />}
    </div>
  );
};

const ManageInstitutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await dataService.getPendingInstitutions();
    setInstitutions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    await dataService.verifyInstitution(id);
    await load();
  };

  const handleReject = async (id: string) => {
    await dataService.deleteInstitution(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={20} />
        <span className="font-bold text-lg">প্রতিষ্ঠান অনুমোদন</span>
        <span className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-500">{institutions.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : institutions.length === 0 ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">কোনো পেন্ডিং প্রতিষ্ঠান নেই</div>
      ) : (
        <div className="bg-white minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">প্রতিষ্ঠান</th>
                <th className="px-8 py-5">ধরন</th>
                <th className="px-8 py-5">অবস্থান</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutions.map(inst => (
                <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-800 text-lg">{inst.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black px-3 py-1 bg-gray-100 uppercase tracking-widest">{inst.type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-500">
                    {inst.location}{inst.district ? `, ${inst.district}` : ''}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(inst.id)}
                        className="px-5 py-2.5 bg-black text-white font-bold text-[10px] hover:bg-bd-green transition-all flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> অনুমোদন
                      </button>
                      <button
                        onClick={() => handleReject(inst.id)}
                        className="px-5 py-2.5 border border-gray-200 text-red-600 font-bold text-[10px] hover:bg-red-50 transition-all flex items-center gap-1"
                      >
                        <X size={14} /> বাতিল
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ManageModeration: React.FC = () => {
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState<Fatwa | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedSources, setSelectedSources] = useState<Source[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await dataService.getPendingFatwas();
    setFatwas(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async () => {
    if (!answering || !answerText.trim()) return;
    setSubmitting(true);
    try {
      await dataService.approveFatwa(
        answering.id,
        answerText,
        selectedSources.map(s => s.id)
      );
      setAnswering(null);
      setAnswerText('');
      setSelectedSources([]);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (fatwa: Fatwa) => {
    await dataService.rejectFatwa(fatwa.id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={20} />
        <span className="font-bold text-lg">ফতোয়া মডারেশন কিউ</span>
        <span className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-500">{fatwas.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : fatwas.length === 0 ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">কোনো পেন্ডিং ফতোয়া নেই</div>
      ) : (
        <div className="space-y-1 bg-gray-100 minimal-border">
          {fatwas.map(fatwa => (
            <div key={fatwa.id} className="bg-white p-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="caps-label text-bd-green">{fatwa.category}</div>
                  <h3 className="text-2xl font-extrabold leading-tight">{fatwa.question}</h3>
                  <div className="text-xs font-bold text-gray-400">{fatwa.askedAt}</div>
                </div>
              </div>

              {fatwa.aiSuggestion && (
                <div className="p-6 bg-gray-50 border-l-4 border-gray-300 space-y-2">
                  <div className="caps-label text-gray-400">এআই প্রস্তাবনা</div>
                  <p className="text-sm text-gray-600 italic">{fatwa.aiSuggestion}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setAnswering(fatwa)}
                  className="px-6 py-3 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all"
                >
                  উত্তর দিন & অনুমোদন
                </button>
                <button
                  onClick={() => handleReject(fatwa)}
                  className="px-6 py-3 border border-gray-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-all"
                >
                  প্রত্যাখ্যান
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {answering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setAnswering(null)}>
          <div className="bg-white w-full max-w-2xl p-12 space-y-8 animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold">ফতোয়ার উত্তর</h2>
                <p className="text-sm text-gray-500 font-medium">{answering.question}</p>
              </div>
              <button onClick={() => setAnswering(null)} className="text-gray-400 hover:text-black"><X size={24} /></button>
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
              placeholder="মুফতির উত্তর লিখুন..."
              className="w-full p-6 border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black font-medium min-h-[200px]"
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="caps-label text-gray-400">সোর্স সাইটেশন</span>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs font-bold border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition-all"
                >
                  + সোর্স যোগ করুন
                </button>
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
              <button
                onClick={handleApprove}
                disabled={submitting || !answerText.trim()}
                className="flex-1 py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                উত্তর প্রকাশ করুন
              </button>
              <button
                onClick={() => setAnswering(null)}
                className="px-8 py-4 border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

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

const ModerationHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'fatwas' | 'flags' | 'scholars'>('fatwas');
  return (
    <div className="space-y-8">
      <div className="flex gap-1 bg-gray-100 p-1 minimal-border w-fit">
        <SubTabButton active={subTab === 'fatwas'} onClick={() => setSubTab('fatwas')} label="পেন্ডিং ফতোয়া" />
        <SubTabButton active={subTab === 'flags'} onClick={() => setSubTab('flags')} label="রিপোর্ট করা কন্টেন্ট" />
        <SubTabButton active={subTab === 'scholars'} onClick={() => setSubTab('scholars')} label="স্কলার আবেদন" />
      </div>
      {subTab === 'fatwas' && <ManageModeration />}
      {subTab === 'flags' && <ManageFlags />}
      {subTab === 'scholars' && <ManageScholarApplications />}
    </div>
  );
};

const ManageFlags: React.FC = () => {
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await dataService.getFlags('open');
    setFlags(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={20} />
        <span className="font-bold text-lg">রিপোর্ট করা কন্টেন্ট</span>
        <span className="text-[9px] font-black px-2 py-1 bg-red-50 text-red-500">{flags.length} টি</span>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : flags.length === 0 ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">কোনো রিপোর্ট নেই</div>
      ) : (
        <div className="bg-white minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">কন্টেন্ট টাইপ</th>
                <th className="px-8 py-5">কন্টেন্ট আইডি</th>
                <th className="px-8 py-5">কারণ</th>
                <th className="px-8 py-5">তারিখ</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flags.map(flag => (
                <tr key={flag.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black px-2 py-1 bg-gray-100 uppercase tracking-widest">{flag.content_type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-mono text-gray-400">{flag.content_id.slice(0, 12)}...</td>
                  <td className="px-8 py-6 font-bold text-sm text-gray-700">{flag.reason}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-400">
                    {flag.created_at ? new Date(flag.created_at).toLocaleDateString('bn-BD') : ''}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={async () => { await dataService.resolveFlag(flag.id); load(); }}
                        className="px-4 py-2 bg-black text-white font-bold text-[10px] hover:bg-bd-green transition-all"
                      >
                        সমাধান
                      </button>
                      <button
                        onClick={async () => { await dataService.dismissFlag(flag.id); load(); }}
                        className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-[10px] hover:bg-gray-50 transition-all"
                      >
                        খারিজ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ManageScholarApplications: React.FC = () => {
  const [apps, setApps] = useState<ScholarApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<ScholarApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await dataService.getScholarApplications('pending');
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (app: ScholarApplication) => {
    await dataService.approveScholarApplication(app.id, adminNotes);
    setReviewing(null);
    setAdminNotes('');
    await load();
  };

  const handleReject = async (app: ScholarApplication) => {
    await dataService.rejectScholarApplication(app.id, adminNotes);
    setReviewing(null);
    setAdminNotes('');
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap size={20} />
        <span className="font-bold text-lg">স্কলার আবেদন</span>
        <span className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-500">{apps.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : apps.length === 0 ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">কোনো পেন্ডিং আবেদন নেই</div>
      ) : (
        <div className="space-y-1 bg-gray-100 minimal-border">
          {apps.map(app => (
            <div key={app.id} className="bg-white p-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black px-2 py-1 bg-black text-white uppercase tracking-widest">{app.title}</span>
                    <span className="caps-label text-bd-green">{app.specialization}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold">{app.userId.slice(0, 8)}...</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                    {app.institution && <span>{app.institution}</span>}
                    {app.location && <span>{app.location}</span>}
                  </div>
                </div>
              </div>

              {app.bio && (
                <div className="p-4 bg-gray-50 text-sm text-gray-600">{app.bio}</div>
              )}

              {app.credentials.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-gray-400">যোগ্যতা</div>
                  <div className="flex flex-wrap gap-2">
                    {app.credentials.map((c, i) => (
                      <span key={i} className="text-xs font-bold px-3 py-1 bg-gray-100">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setReviewing(app)}
                  className="px-6 py-3 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all"
                >
                  পর্যালোচনা
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setReviewing(null)}>
          <div className="bg-white w-full max-w-2xl p-12 space-y-8 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black px-2 py-1 bg-black text-white uppercase tracking-widest">{reviewing.title}</span>
                  <span className="caps-label text-bd-green">{reviewing.specialization}</span>
                </div>
                <h2 className="text-xl font-extrabold">স্কলার আবেদন পর্যালোচনা</h2>
              </div>
              <button onClick={() => setReviewing(null)} className="text-gray-400 hover:text-black"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="caps-label text-gray-400">প্রতিষ্ঠান</div>
                  <p className="font-bold">{reviewing.institution || '—'}</p>
                </div>
                <div className="space-y-1">
                  <div className="caps-label text-gray-400">অবস্থান</div>
                  <p className="font-bold">{reviewing.location || '—'}</p>
                </div>
              </div>

              {reviewing.bio && (
                <div className="space-y-1">
                  <div className="caps-label text-gray-400">জীবনবৃত্তান্ত</div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4">{reviewing.bio}</p>
                </div>
              )}

              {reviewing.credentials.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-gray-400">যোগ্যতা</div>
                  <ul className="list-disc list-inside space-y-1">
                    {reviewing.credentials.map((c, i) => (
                      <li key={i} className="text-sm font-medium text-gray-700">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reviewing.references.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-gray-400">রেফারেন্স</div>
                  <ul className="list-disc list-inside space-y-1">
                    {reviewing.references.map((r, i) => (
                      <li key={i} className="text-sm font-medium text-gray-700">{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <div className="caps-label text-gray-400">অ্যাডমিন নোট</div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="অ্যাডমিনের মন্তব্য..."
                  rows={3}
                  className="w-full p-4 border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black font-medium"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleApprove(reviewing)}
                className="flex-1 py-4 bg-bd-green text-white font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> অনুমোদন
              </button>
              <button
                onClick={() => handleReject(reviewing)}
                className="flex-1 py-4 bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> প্রত্যাখ্যান
              </button>
              <button
                onClick={() => setReviewing(null)}
                className="px-8 py-4 border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SubTabButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-6 py-3 transition-all font-bold text-xs uppercase tracking-widest ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'}`}>
    {label}
  </button>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 transition-all font-bold text-xs uppercase tracking-widest ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'}`}>
    {icon} {label}
  </button>
);

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: number }> = ({ icon, label, value }) => (
  <div className="bg-white p-10 flex flex-col gap-6 group hover:bg-black hover:text-white transition-all">
    <div className="text-bd-green group-hover:text-white transition-colors">{icon}</div>
    <div className="space-y-1">
      <div className="text-4xl font-extrabold tracking-tight">{value}</div>
      <div className="caps-label text-gray-400 group-hover:text-gray-500">{label}</div>
    </div>
  </div>
);

export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import CompetitionManager from './CompetitionManager';
import SadaqahApprovals from './SadaqahApprovals';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingBag, 
  Users, 
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Shield,
  X,
  Loader2,
  GraduationCap,
  History,
  Building2,
  FolderOpen
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Job, Product, User, Fatwa, Source, ContentFlag, ScholarApplication, AdminAuditLog } from '../../types';
import CitationBadge from '../../components/CitationBadge';
import CitationPicker from '../../components/CitationPicker';
import { StatCard, Button, Badge, LoadingSkeleton, EmptyState, ImageWithFallback } from '../../components/ui';
import FeedbackPanel from './FeedbackPanel';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'products' | 'users' | 'moderation' | 'feedback' | 'audit'>('overview');
  const [stats, setStats] = useState({
    jobs: 0,
    products: 0,
    users: 0,
    posts: 0
  });
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-border pb-12">
        <div className="caps-label text-muted-foreground">System Control</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">অ্যাডমিন প্যানেল।</h1>
      </div>

      <div className="flex gap-6 p-1 minimal-border w-fit">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={16} />} label="ওভারভিউ" />
        <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={16} />} label="চাকরি" />
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<ShoppingBag size={16} />} label="মার্কেটপ্লেস" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={16} />} label="ইউজার" />
        <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} icon={<Shield size={16} />} label="মডারেশন" />
        <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<MessageSquare size={16} />} label="ফিডব্যাক" />
        <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<History size={16} />} label="অডিট লগ" />
      </div>

      {activeTab === 'overview' && (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton variant="card" count={4} />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Briefcase size={20} />} label="মোট সার্কুলার" value={stats.jobs} />
          <StatCard icon={<ShoppingBag size={20} />} label="পণ্য সংখ্যা" value={stats.products} />
          <StatCard icon={<Users size={20} />} label="নিবন্ধিত ইউজার" value={stats.users} />
          <StatCard icon={<MessageSquare size={20} />} label="কমিউনিটি পোস্ট" value={stats.posts} />
        </div>
        )
      )}

      {activeTab === 'jobs' && <ManageJobs />}
      {activeTab === 'products' && <ManageProducts />}
      {activeTab === 'users' && <ManageUsers />}
      {activeTab === 'moderation' && <ModerationHub />}
      {activeTab === 'feedback' && <FeedbackPanel />}
      {activeTab === 'audit' && <AuditLogViewer />}
    </div>
  );
};

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const loadJobs = async () => setJobs(await dataService.getJobs());
  useEffect(() => { loadJobs(); }, []);

  return (
    <div className="bg-card minimal-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
          <tr>
            <th className="px-8 py-5">সার্কুলার / পদবি</th>
            <th className="px-8 py-5">প্রতিষ্ঠান</th>
            <th className="px-8 py-5">অবস্থা</th>
            <th className="px-8 py-5 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-muted transition-colors">
              <td className="px-8 py-6">
                <p className="font-bold text-foreground text-lg">{job.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{job.type}</p>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-muted-foreground">{job.institution}</td>
              <td className="px-8 py-6">
                <span className={`text-[9px] font-bold px-3 py-1 uppercase tracking-widest ${job.verified ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {job.verified ? 'VERIFIED' : 'PENDING'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3">
                  {!job.verified && (
                    <button onClick={async () => { await dataService.saveJob({...job, verified: true}); loadJobs(); }} className="p-3 bg-primary text-primary-foreground hover:bg-secondary transition-all">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={async () => { await dataService.deleteJob(job.id); loadJobs(); }} className="p-3 border border-border text-foreground hover:bg-muted transition-all">
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
        <button onClick={() => setIsAdding(true)} className="bg-primary text-primary-foreground px-8 py-4 font-bold text-xs flex items-center gap-2 hover:bg-secondary transition-all">
          <Plus size={18} /> নতুন পণ্য
        </button>
      </div>
      
      {isAdding && (
        <div className="bg-card p-10 minimal-border space-y-8 animate-slideDown" rounded-lg border border-border>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="caps-label text-muted-foreground">Name</label>
              <input placeholder="পণ্যের নাম" className="w-full px-4 py-3 bg-muted border border-border outline-none font-bold" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="caps-label text-muted-foreground">Price (৳)</label>
              <input type="number" placeholder="দাম" className="w-full px-4 py-3 bg-muted border border-border outline-none font-bold" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="caps-label text-muted-foreground">Category</label>
              <select className="w-full px-4 py-3 bg-muted border border-border outline-none font-bold" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                <option>Sunnah Food</option>
                <option>Calligraphy</option>
                <option>Modest Fashion</option>
                <option>Books</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAdd} className="bg-primary text-primary-foreground px-8 py-3 font-bold text-xs">সেভ করুন</button>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground font-bold text-xs">বাতিল</button>
          </div>
        </div>
      )}

      <div className="bg-card minimal-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
            <tr>
              <th className="px-8 py-5">পণ্য</th>
              <th className="px-8 py-5">ক্যাটাগরি</th>
              <th className="px-8 py-5">দাম</th>
              <th className="px-8 py-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-muted transition-colors">
                <td className="px-8 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted overflow-hidden grayscale">
                    <ImageWithFallback src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="font-bold text-foreground text-lg">{p.name}</span>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-muted-foreground">{p.category}</td>
                <td className="px-8 py-6 font-bold text-xl text-foreground">৳{p.price}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={async () => { await dataService.deleteProduct(p.id); loadProducts(); }} className="p-3 border border-border text-foreground hover:bg-muted transition-all">
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
      <div className="flex gap-6 p-1 minimal-border w-fit">
        <SubTabButton active={userSubTab === 'users'} onClick={() => setUserSubTab('users')} label="ইউজার ম্যানেজমেন্ট" />
        <SubTabButton active={userSubTab === 'institutions'} onClick={() => setUserSubTab('institutions')} label="প্রতিষ্ঠান অনুমোদন" />
      </div>

      {userSubTab === 'users' && (
        <div className="bg-card minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
              <tr>
                <th className="px-8 py-5">ইউজার / প্রোফাইল</th>
                <th className="px-8 py-5">রোল</th>
                <th className="px-8 py-5">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-muted transition-colors ${u.banned ? 'opacity-50' : ''}`}>
                  <td className="px-8 py-6 flex items-center gap-4">
                    <ImageWithFallback src={u.avatar} name={u.name} className="w-10 h-10 bg-muted border border-border" alt="" />
                    <div>
                      <span className="font-bold text-foreground text-lg">{u.name}</span>
                      {u.institutionName && <p className="text-[10px] font-bold text-muted-foreground">{u.institutionName}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {u.role === 'ADMIN' ? (
                      <span className="text-[9px] font-bold px-3 py-1 bg-primary text-primary-foreground uppercase tracking-widest">ADMIN</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="text-[9px] font-bold px-3 py-1 bg-muted text-muted-foreground uppercase tracking-widest border-none outline-none cursor-pointer"
                      >
                        <option value="USER">USER</option>
                        <option value="INSTITUTION">INSTITUTION</option>
                        <option value="SCHOLAR">SCHOLAR</option>
                      </select>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {u.banned ? (
                      <span className="text-[9px] font-bold px-3 py-1 bg-muted text-foreground uppercase tracking-widest">ব্যানড</span>
                    ) : (
                      <span className="text-[9px] font-bold px-3 py-1 bg-muted text-foreground uppercase tracking-widest">সক্রিয়</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleBanToggle(u.id, !!u.banned)}
                        className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 transition-all ${
                          u.banned ? 'border-primary text-foreground hover:bg-secondary hover:text-primary-foreground' : 'border-border text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground'
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
        <span className="text-[9px] font-bold px-2 py-1 bg-muted text-muted-foreground">{institutions.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <LoadingSkeleton variant="table" />
      ) : institutions.length === 0 ? (
        <EmptyState icon={<Building2 size={48} />} title="কোনো পেন্ডিং প্রতিষ্ঠান নেই" />
      ) : (
        <div className="bg-card minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
              <tr>
                <th className="px-8 py-5">প্রতিষ্ঠান</th>
                <th className="px-8 py-5">ধরন</th>
                <th className="px-8 py-5">অবস্থান</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutions.map(inst => (
                <tr key={inst.id} className="hover:bg-muted transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-foreground text-lg">{inst.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge>{inst.type}</Badge>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-muted-foreground">
                    {inst.location}{inst.district ? `, ${inst.district}` : ''}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleApprove(inst.id)} icon={<CheckCircle size={14} />}>
                        অনুমোদন
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReject(inst.id)} icon={<X size={14} />}>
                        বাতিল
                      </Button>
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
        <span className="text-[9px] font-bold px-2 py-1 bg-muted text-muted-foreground">{fatwas.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>লোড হচ্ছে...</div>
      ) : fatwas.length === 0 ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>কোনো পেন্ডিং ফতোয়া নেই</div>
      ) : (
        <div className="space-y-1 bg-muted minimal-border">
          {fatwas.map(fatwa => (
            <div key={fatwa.id} className="bg-card p-10 space-y-6" rounded-lg border border-border>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="caps-label text-foreground">{fatwa.category}</div>
                  <h3 className="text-2xl font-bold leading-tight">{fatwa.question}</h3>
                  <div className="text-xs font-bold text-muted-foreground">{fatwa.askedAt}</div>
                </div>
              </div>

              {fatwa.aiSuggestion && (
                <div className="p-6 bg-muted border-l-4 border-border space-y-2">
                  <div className="caps-label text-muted-foreground">এআই প্রস্তাবনা</div>
                  <p className="text-sm text-muted-foreground italic">{fatwa.aiSuggestion}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setAnswering(fatwa)}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold text-xs hover:bg-secondary transition-all"
                >
                  উত্তর দিন & অনুমোদন
                </button>
                <button
                  onClick={() => handleReject(fatwa)}
                  className="px-6 py-3 border border-border text-foreground font-bold text-xs hover:bg-muted transition-all"
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
          <div className="bg-card w-full max-w-2xl p-12 space-y-8 animate-slideUp max-h-[90vh] overflow-y-auto" rounded-lg border border-border onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">ফতোয়ার উত্তর</h2>
                <p className="text-sm text-muted-foreground font-medium">{answering.question}</p>
              </div>
              <button onClick={() => setAnswering(null)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>

            {answering.aiSuggestion && (
              <div className="p-4 bg-muted text-sm text-muted-foreground italic border-l-4 border-border">
                <div className="caps-label text-muted-foreground mb-2">এআই প্রস্তাবনা</div>
                {answering.aiSuggestion}
              </div>
            )}

            <textarea
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="মুফতির উত্তর লিখুন..."
              className="w-full p-6 border border-border bg-muted outline-none focus:ring-2 focus:ring-ring font-medium min-h-[200px]"
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="caps-label text-muted-foreground">সোর্স সাইটেশন</span>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs font-bold border border-border px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all"
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

            <div className="flex gap-4 pt-4 border-t border-border">
              <button
                onClick={handleApprove}
                disabled={submitting || !answerText.trim()}
                className="flex-1 py-4 bg-primary text-primary-foreground font-bold text-sm hover:bg-secondary transition-all disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                উত্তর প্রকাশ করুন
              </button>
              <button
                onClick={() => setAnswering(null)}
                className="px-8 py-4 border border-border text-muted-foreground font-bold text-sm hover:bg-muted transition-all"
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
      <div className="flex gap-6 p-1 minimal-border w-fit">
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
        <span className="text-[9px] font-bold px-2 py-1 bg-muted text-muted-foreground">{flags.length} টি</span>
      </div>

      {loading ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>লোড হচ্ছে...</div>
      ) : flags.length === 0 ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>কোনো রিপোর্ট নেই</div>
      ) : (
        <div className="bg-card minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
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
                <tr key={flag.id} className="hover:bg-muted transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-bold px-2 py-1 bg-muted uppercase tracking-widest">{flag.content_type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-mono text-muted-foreground">{flag.content_id.slice(0, 12)}...</td>
                  <td className="px-8 py-6 font-bold text-sm text-foreground">{flag.reason}</td>
                  <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                    {flag.created_at ? new Date(flag.created_at).toLocaleDateString('bn-BD') : ''}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={async () => { await dataService.resolveFlag(flag.id); load(); }}
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold text-[10px] hover:bg-secondary transition-all"
                      >
                        সমাধান
                      </button>
                      <button
                        onClick={async () => { await dataService.dismissFlag(flag.id); load(); }}
                        className="px-4 py-2 border border-border text-muted-foreground font-bold text-[10px] hover:bg-muted transition-all"
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
        <span className="text-[9px] font-bold px-2 py-1 bg-muted text-muted-foreground">{apps.length} পেন্ডিং</span>
      </div>

      {loading ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>লোড হচ্ছে...</div>
      ) : apps.length === 0 ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>কোনো পেন্ডিং আবেদন নেই</div>
      ) : (
        <div className="space-y-1 bg-muted minimal-border">
          {apps.map(app => (
            <div key={app.id} className="bg-card p-10 space-y-6" rounded-lg border border-border>
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold px-2 py-1 bg-primary text-primary-foreground uppercase tracking-widest">{app.title}</span>
                    <span className="caps-label text-foreground">{app.specialization}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{app.userId.slice(0, 8)}...</h3>
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground">
                    {app.institution && <span>{app.institution}</span>}
                    {app.location && <span>{app.location}</span>}
                  </div>
                </div>
              </div>

              {app.bio && (
                <div className="p-4 bg-muted text-sm text-muted-foreground">{app.bio}</div>
              )}

              {app.credentials.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-muted-foreground">যোগ্যতা</div>
                  <div className="flex flex-wrap gap-2">
                    {app.credentials.map((c, i) => (
                      <span key={i} className="text-xs font-bold px-3 py-1 bg-muted">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setReviewing(app)}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold text-xs hover:bg-secondary transition-all"
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
          <div className="bg-card w-full max-w-2xl p-12 space-y-8 animate-slideUp" rounded-lg border border-border onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold px-2 py-1 bg-primary text-primary-foreground uppercase tracking-widest">{reviewing.title}</span>
                  <span className="caps-label text-foreground">{reviewing.specialization}</span>
                </div>
                <h2 className="text-xl font-bold">স্কলার আবেদন পর্যালোচনা</h2>
              </div>
              <button onClick={() => setReviewing(null)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="caps-label text-muted-foreground">প্রতিষ্ঠান</div>
                  <p className="font-bold">{reviewing.institution || '—'}</p>
                </div>
                <div className="space-y-1">
                  <div className="caps-label text-muted-foreground">অবস্থান</div>
                  <p className="font-bold">{reviewing.location || '—'}</p>
                </div>
              </div>

              {reviewing.bio && (
                <div className="space-y-1">
                  <div className="caps-label text-muted-foreground">জীবনবৃত্তান্ত</div>
                  <p className="text-sm text-muted-foreground bg-muted p-4">{reviewing.bio}</p>
                </div>
              )}

              {reviewing.credentials.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-muted-foreground">যোগ্যতা</div>
                  <ul className="list-disc list-inside space-y-1">
                    {reviewing.credentials.map((c, i) => (
                      <li key={i} className="text-sm font-medium text-foreground">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reviewing.references.length > 0 && (
                <div className="space-y-2">
                  <div className="caps-label text-muted-foreground">রেফারেন্স</div>
                  <ul className="list-disc list-inside space-y-1">
                    {reviewing.references.map((r, i) => (
                      <li key={i} className="text-sm font-medium text-foreground">{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <div className="caps-label text-muted-foreground">অ্যাডমিন নোট</div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="অ্যাডমিনের মন্তব্য..."
                  rows={3}
                  className="w-full p-4 border border-border bg-muted outline-none focus:ring-2 focus:ring-ring font-medium"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <button
                onClick={() => handleApprove(reviewing)}
                className="flex-1 py-4 bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> অনুমোদন
              </button>
              <button
                onClick={() => handleReject(reviewing)}
                className="flex-1 py-4 border border-border text-foreground font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> প্রত্যাখ্যান
              </button>
              <button
                onClick={() => setReviewing(null)}
                className="px-8 py-4 border border-border text-muted-foreground font-bold text-sm hover:bg-muted transition-all"
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

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await dataService.getAuditLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const actionLabels: Record<string, string> = {
    ban_user: 'ব্যান',
    unban_user: 'আনব্যান',
    update_user_role: 'রোল পরিবর্তন',
    approve_institution: 'প্রতিষ্ঠান অনুমোদন',
    reject_institution: 'প্রতিষ্ঠান বাতিল',
    approve_fatwa: 'ফতোয়া অনুমোদন',
    reject_fatwa: 'ফতোয়া প্রত্যাখ্যান',
    approve_scholar: 'স্কলার অনুমোদন',
    reject_scholar: 'স্কলার প্রত্যাখ্যান',
    resolve_flag: 'রিপোর্ট সমাধান',
    dismiss_flag: 'রিপোর্ট খারিজ',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History size={20} />
        <span className="font-bold text-lg">অ্যাডমিন অডিট লগ</span>
        <span className="text-[9px] font-bold px-2 py-1 bg-muted text-muted-foreground">{logs.length} টি</span>
      </div>

      {loading ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>লোড হচ্ছে...</div>
      ) : logs.length === 0 ? (
        <div className="bg-card p-12 text-center text-muted-foreground font-bold" rounded-lg border border-border>কোনো অডিট লগ নেই</div>
      ) : (
        <div className="bg-card minimal-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
              <tr>
                <th className="px-8 py-5">সময়</th>
                <th className="px-8 py-5">অ্যাডমিন</th>
                <th className="px-8 py-5">অ্যাকশন</th>
                <th className="px-8 py-5">টার্গেট</th>
                <th className="px-8 py-5">বিবরণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-muted transition-colors">
                  <td className="px-8 py-6 text-xs font-bold text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('bn-BD')}
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-foreground">{log.adminName || log.adminId.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-bold px-3 py-1 bg-muted uppercase tracking-widest">
                      {actionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-muted-foreground">{log.targetType}:{log.targetId.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-muted-foreground max-w-[200px] truncate">
                    {Object.keys(log.details).length > 0 ? JSON.stringify(log.details) : '—'}
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

const SubTabButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-6 py-3 transition-all font-bold text-xs uppercase tracking-widest ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}>
    {label}
  </button>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-8 py-4 transition-all font-bold text-xs uppercase tracking-widest ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-card'}`}>
    {icon} {label}
  </button>
);

export default AdminDashboard;

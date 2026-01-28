
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { dataService } from '../../services/dataService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'products' | 'users'>('overview');
  const [stats, setStats] = useState({
    jobs: 0,
    products: 0,
    users: 0,
    posts: 0
  });

  useEffect(() => {
    const update = () => {
      setStats({
        jobs: dataService.getJobs().length,
        products: dataService.getProducts().length,
        users: dataService.getUsers().length,
        posts: dataService.getPosts().length
      });
    };
    update();
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-500">পুরো প্ল্যাটফর্মের কার্যক্রম এখান থেকে পরিচালনা করুন।</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="ওভারভিউ" />
        <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={18} />} label="চাকরি" />
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<ShoppingBag size={18} />} label="মার্কেটপ্লেস" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="ইউজার" />
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox color="emerald" icon={<Briefcase />} label="মোট সার্কুলার" value={stats.jobs} />
          <StatBox color="blue" icon={<ShoppingBag />} label="পণ্য সংখ্যা" value={stats.products} />
          <StatBox color="orange" icon={<Users />} label="নিবন্ধিত ইউজার" value={stats.users} />
          <StatBox color="purple" icon={<MessageSquare />} label="কমিউনিটি পোস্ট" value={stats.posts} />
        </div>
      )}

      {activeTab === 'jobs' && <ManageJobs />}
      {activeTab === 'products' && <ManageProducts />}
      {activeTab === 'users' && <ManageUsers />}
    </div>
  );
};

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState(dataService.getJobs());
  useEffect(() => {
    const update = () => setJobs(dataService.getJobs());
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">সার্কুলার</th>
            <th className="px-6 py-4">প্রতিষ্ঠান</th>
            <th className="px-6 py-4">অবস্থা</th>
            <th className="px-6 py-4 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-bold text-gray-800">{job.title}</p>
                <p className="text-xs text-gray-400">{job.type}</p>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{job.institution}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${job.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {job.verified ? 'VERIFIED' : 'PENDING'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  {!job.verified && (
                    <button onClick={() => dataService.saveJob({...job, verified: true})} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => dataService.deleteJob(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
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
  const [products, setProducts] = useState(dataService.getProducts());
  const [isAdding, setIsAdding] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', price: 0, category: 'Sunnah Food', image: 'https://picsum.photos/400/300' });

  useEffect(() => {
    const update = () => setProducts(dataService.getProducts());
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, []);

  const handleAdd = () => {
    dataService.saveProduct({ ...newProd as any, id: `prod-${Date.now()}` });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setIsAdding(true)} className="bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800">
          <Plus size={18} /> নতুন পণ্য যুক্ত করুন
        </button>
      </div>
      
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input placeholder="পণ্যের নাম" className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
            <input type="number" placeholder="দাম (৳)" className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} />
            <select className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
              <option>Sunnah Food</option>
              <option>Calligraphy</option>
              <option>Modest Fashion</option>
              <option>Books</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold">সেভ করুন</button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-bold">বাতিল</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">পণ্য</th>
              <th className="px-6 py-4">ক্যাটাগরি</th>
              <th className="px-6 py-4">দাম</th>
              <th className="px-6 py-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="font-bold text-gray-800">{p.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 font-bold text-emerald-700">৳{p.price}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => dataService.deleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
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
  const [users, setUsers] = useState(dataService.getUsers());
  useEffect(() => {
    const update = () => setUsers(dataService.getUsers());
    window.addEventListener('auth_change', update);
    return () => window.removeEventListener('auth_change', update);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">ইউজার</th>
            <th className="px-6 py-4">রোল</th>
            <th className="px-6 py-4">ইমেইল</th>
            <th className="px-6 py-4 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={u.avatar} className="w-8 h-8 rounded-full border border-gray-100" />
                <span className="font-bold text-gray-800">{u.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4 text-right">
                {u.role !== 'ADMIN' && (
                  <button className="text-red-600 hover:underline text-xs font-bold">ব্যান করুন</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon} {label}
  </button>
);

const StatBox: React.FC<{ color: string, icon: React.ReactNode, label: string, value: number }> = ({ color, icon, label, value }) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

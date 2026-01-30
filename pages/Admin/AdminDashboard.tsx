
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
  ArrowUpRight
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
                    <button onClick={() => dataService.saveJob({...job, verified: true})} className="p-3 bg-black text-white hover:bg-bd-green transition-all">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={() => dataService.deleteJob(job.id)} className="p-3 border border-gray-200 text-red-600 hover:bg-red-50 transition-all">
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
                  <button onClick={() => dataService.deleteProduct(p.id)} className="p-3 border border-gray-100 text-red-600 hover:bg-red-50 transition-all">
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
  const [users, setUsers] = useState(dataService.getUsers());
  useEffect(() => {
    const update = () => setUsers(dataService.getUsers());
    window.addEventListener('auth_change', update);
    return () => window.removeEventListener('auth_change', update);
  }, []);

  return (
    <div className="bg-white minimal-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
          <tr>
            <th className="px-8 py-5">ইউজার / প্রোফাইল</th>
            <th className="px-8 py-5">রোল</th>
            <th className="px-8 py-5">ইমেইল</th>
            <th className="px-8 py-5 text-right">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-8 py-6 flex items-center gap-4">
                <img src={u.avatar} className="w-10 h-10 bg-gray-50 border border-gray-200" alt="" />
                <span className="font-bold text-gray-800 text-lg">{u.name}</span>
              </td>
              <td className="px-8 py-6">
                <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-gray-400">{u.email}</td>
              <td className="px-8 py-6 text-right">
                {u.role !== 'ADMIN' && (
                  <button className="text-[10px] font-black uppercase tracking-widest border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition-all">ব্যান করুন</button>
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

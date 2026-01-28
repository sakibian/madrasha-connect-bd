
import React, { useState, useEffect } from 'react';
import { Building, Plus, Briefcase, Users, CheckCircle, Clock, Trash2, Edit2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getCurrentUser } from '../../services/authService';
import { Job } from '../../types';
import { Link } from 'react-router-dom';

const InstitutionDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [myJobs, setMyJobs] = useState<Job[]>([]);

  useEffect(() => {
    const update = () => {
      const allJobs = dataService.getJobs();
      setMyJobs(allJobs.filter(j => j.institution === user?.institutionName));
    };
    update();
    window.addEventListener('data_update', update);
    return () => window.removeEventListener('data_update', update);
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm('সার্কুলারটি কি চিরতরে মুছে ফেলতে চান?')) {
      dataService.deleteJob(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-blue-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><Building size={32} /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.institutionName}</h1>
            <p className="text-gray-500 text-sm font-medium">অফিসিয়াল ড্যাশবোর্ড</p>
          </div>
        </div>
        <Link to="/professional" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all flex items-center gap-2">
           <Plus size={20} /> নতুন পোস্ট
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashCard icon={<Briefcase />} label="পোস্ট সংখ্যা" value={myJobs.length} color="blue" />
        <DashCard icon={<Users />} label="আবেদন" value={myJobs.length * 5} color="emerald" />
        <DashCard icon={<CheckCircle />} label="ভেরিফাইড" value={myJobs.filter(j => j.verified).length} color="purple" />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
           <h2 className="text-lg font-bold text-gray-800">নিয়োগ বিজ্ঞপ্তি ব্যবস্থাপনা</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">পদবি</th>
                <th className="px-6 py-4">অবস্থা</th>
                <th className="px-6 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">{job.title}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {job.postedAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${job.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {job.verified ? 'নিশ্চিত' : 'অপেক্ষমান'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashCard = ({ icon, label, value, color }: any) => {
  const c: any = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${c[color]}`}>{icon}</div>
      <div><p className="text-xl font-black text-gray-800">{value}</p><p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p></div>
    </div>
  );
};

export default InstitutionDashboard;

import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { toast } from '../../services/toast';

const SadaqahApprovals: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await (window as any).supabase
        .from('sadaqah_funding_applications')
        .select('*, institutions(name), user_profiles(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error('আবেদন লোড করতে সমস্যা হয়েছে।');
      setApplications([]);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await (window as any).supabase
        .from('sadaqah_funding_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await (window as any).supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('আবেদন অনুমোদিত হয়েছে!');
      loadApplications();
    } catch (error: any) {
      toast.error(error?.message || 'অনুমোদন করতে সমস্যা হয়েছে।');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await (window as any).supabase
        .from('sadaqah_funding_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await (window as any).supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('আবেদন প্রত্যাখ্যাত হয়েছে।');
      loadApplications();
    } catch (error: any) {
      toast.error(error?.message || 'প্রত্যাখ্যান করতে সমস্যা হয়েছে।');
    }
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const reviewedApps = applications.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">সাদাকাহ তহবিল আবেদন</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-gray-600">পেন্ডিং: {pendingApps.length}</span>
          <span className="font-bold text-gray-400">পর্যালোচিত: {reviewedApps.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">লোড হচ্ছে...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Heart size={48} className="mx-auto text-gray-200" />
          <p className="text-xl font-bold text-gray-400">কোনো তহবিল আবেদন নেই।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {pendingApps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <Clock size={18} className="text-gray-800" />
                পর্যালোচনার জন্য অপেক্ষমান ({pendingApps.length})
              </h3>
              <div className="space-y-3">
                {pendingApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onApprove={() => handleApprove(app.id)}
                    onReject={() => handleReject(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviewed Applications */}
          {reviewedApps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-500">পর্যালোচিত আবেদন ({reviewedApps.length})</h3>
              <div className="space-y-3">
                {reviewedApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} reviewed />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ApplicationCard: React.FC<{
  app: any;
  onApprove?: () => void;
  onReject?: () => void;
  reviewed?: boolean;
}> = ({ app, onApprove, onReject, reviewed }) => {
  return (
    <div className="bg-white border border-gray-100 p-4 md:p-6 hover:border-black transition-all">
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-6">
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">{app.project_title}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="font-bold">{app.institutions?.name || 'প্রতিষ্ঠান'}</span>
                <span>•</span>
                <span>{new Date(app.created_at).toLocaleDateString('bn-BD')}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 font-black uppercase tracking-widest">
                  {app.category}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">অনুরোধকৃত পরিমাণ</p>
              <p className="text-2xl font-black text-black">৳ {app.amount_requested?.toLocaleString('bn-BD')}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">অবস্থা</p>
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-black uppercase tracking-widest ${
                app.status === 'pending' ? 'bg-gray-50 text-gray-900' :
                app.status === 'approved' ? 'bg-gray-100 text-gray-900' :
                'bg-gray-200 text-gray-900'
              }`}>
                {app.status === 'pending' && <Clock size={12} />}
                {app.status === 'approved' && <CheckCircle size={12} />}
                {app.status === 'rejected' && <XCircle size={12} />}
                {app.status === 'pending' ? 'পেন্ডিং' :
                 app.status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-l-4 border-black space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">বিবরণ</p>
              <p className="text-sm text-gray-700 font-medium">{app.description}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">যৌক্তিকতা</p>
              <p className="text-sm text-gray-700 font-medium">{app.justification}</p>
            </div>
          </div>
        </div>

        {!reviewed && onApprove && onReject && (
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={onApprove}
              className="px-4 md:px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <CheckCircle size={16} /> অনুমোদন
            </button>
            <button
              onClick={onReject}
              className="px-4 md:px-6 py-3 bg-gray-200 text-black font-bold text-sm hover:bg-gray-300 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <XCircle size={16} /> প্রত্যাখ্যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SadaqahApprovals;

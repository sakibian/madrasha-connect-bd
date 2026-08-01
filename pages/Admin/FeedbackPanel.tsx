import React, { useEffect, useState } from 'react';
import { Loader2, Inbox, MessageSquare, CheckCircle, Archive, Play, Filter, ExternalLink } from 'lucide-react';
import {
  listFeedback,
  getFeedbackCounts,
  updateFeedbackStatus,
  FeedbackRow,
  FeedbackStatus,
  FeedbackCategoryCode,
  FeedbackCounts,
} from '../../services/adminService';

/**
 * Admin Feedback Triage Panel.
 *
 * Reads the `feedback` table (RLS restricts reads to ADMINs) and provides a
 * simple triage UX: filter by status/category, view details, transition
 * items through the lifecycle (new → in_progress → resolved / archived),
 * and leave admin notes.
 *
 * Mounted as a tab inside AdminDashboard.tsx.
 */

const CATEGORY_LABELS: Record<FeedbackCategoryCode, string> = {
  bug: 'বাগ',
  idea: 'আইডিয়া',
  content: 'কন্টেন্ট',
  donation: 'সাদাকাহ',
  other: 'অন্যান্য',
};

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: 'নতুন',
  in_progress: 'কাজ চলছে',
  resolved: 'সমাধানিত',
  archived: 'আর্কাইভ',
};

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  new: 'bg-black text-white',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-bd-green/10 text-bd-green',
  archived: 'bg-gray-100 text-gray-500',
};

const FeedbackPanel: React.FC = () => {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [counts, setCounts] = useState<FeedbackCounts>({ total: 0, new: 0, in_progress: 0, resolved: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('new');
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategoryCode | 'all'>('all');
  const [selected, setSelected] = useState<FeedbackRow | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const [items, counts] = await Promise.all([
      listFeedback({ status: statusFilter, category: categoryFilter }),
      getFeedbackCounts(),
    ]);
    setRows(items);
    setCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter, categoryFilter]);

  const changeStatus = async (id: string, next: FeedbackStatus, adminNotes?: string) => {
    setSavingId(id);
    const ok = await updateFeedbackStatus(id, next, adminNotes);
    setSavingId(null);
    if (ok) {
      await load();
      if (selected?.id === id) {
        setSelected((s) => (s ? { ...s, status: next, admin_notes: adminNotes ?? s.admin_notes } : s));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header + counts */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <div className="caps-label text-gray-400">Community Voice</div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
            <Inbox size={22} /> কমিউনিটি ফিডব্যাক
          </h2>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-bold">
          <Stat label="মোট" value={counts.total} />
          <Stat label="নতুন" value={counts.new} accent="bg-black text-white" />
          <Stat label="কাজ চলছে" value={counts.in_progress} accent="bg-amber-50 text-amber-700" />
          <Stat label="সমাধানিত" value={counts.resolved} accent="bg-bd-green/10 text-bd-green" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="caps-label text-gray-400 mr-2 flex items-center gap-1"><Filter size={12} /> Filter</span>
        <FilterChip label="সব স্ট্যাটাস" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        {(Object.keys(STATUS_LABELS) as FeedbackStatus[]).map((s) => (
          <FilterChip key={s} label={STATUS_LABELS[s]} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
        <span className="mx-2 h-4 w-px bg-gray-200" aria-hidden />
        <FilterChip label="সব ক্যাটাগরি" active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} />
        {(Object.keys(CATEGORY_LABELS) as FeedbackCategoryCode[]).map((c) => (
          <FilterChip key={c} label={CATEGORY_LABELS[c]} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">
          <Loader2 size={24} className="animate-spin mx-auto mb-4" />
          লোড হচ্ছে...
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">
          <MessageSquare size={32} className="mx-auto mb-4 text-gray-200" />
          এই ফিল্টারে কোনো ফিডব্যাক নেই
        </div>
      ) : (
        <div className="bg-white minimal-border divide-y divide-gray-100">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => { setSelected(r); setNotes(r.admin_notes ?? ''); }}
              className="w-full text-left p-6 hover:bg-gray-50 transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            >
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest ${STATUS_STYLES[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  <span className="text-[9px] font-black px-2 py-1 uppercase tracking-widest bg-gray-100 text-gray-500">
                    {CATEGORY_LABELS[r.category]}
                  </span>
                  {!r.user_id && (
                    <span className="text-[9px] font-black px-2 py-1 uppercase tracking-widest bg-gray-100 text-gray-400">
                      অনামা
                    </span>
                  )}
                  {r.rating && (
                    <span className="text-[9px] font-black px-2 py-1 uppercase tracking-widest bg-amber-50 text-amber-700">
                      ★ {r.rating}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800 line-clamp-2">{r.message}</p>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex flex-wrap gap-3">
                  <span>{new Date(r.created_at).toLocaleString('bn-BD')}</span>
                  {r.contact && <span>• {r.contact}</span>}
                  {r.page_url && <span>• {r.page_url}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <FeedbackDetail
          item={selected}
          saving={savingId === selected.id}
          notes={notes}
          onNotesChange={setNotes}
          onClose={() => setSelected(null)}
          onChangeStatus={(next) => changeStatus(selected.id, next, notes)}
        />
      )}
    </div>
  );
};

// --- helpers ---------------------------------------------------------------
const Stat: React.FC<{ label: string; value: number; accent?: string }> = ({ label, value, accent }) => (
  <div className="flex items-center gap-2">
    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${accent ?? 'bg-gray-100 text-gray-600'}`}>
      {value.toLocaleString('bn-BD')}
    </span>
    <span className="text-gray-500">{label}</span>
  </div>
);

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border ${
      active
        ? 'bg-black text-white border-black'
        : 'bg-white text-gray-500 border-gray-200 hover:border-black'
    }`}
  >
    {label}
  </button>
);

interface DetailProps {
  item: FeedbackRow;
  saving: boolean;
  notes: string;
  onNotesChange: (v: string) => void;
  onClose: () => void;
  onChangeStatus: (next: FeedbackStatus) => void;
}

const FeedbackDetail: React.FC<DetailProps> = ({ item, saving, notes, onNotesChange, onClose, onChangeStatus }) => (
  <div
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="feedback-detail-title"
  >
    <div
      className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between p-6 border-b border-gray-100">
        <div className="space-y-1">
          <div className="caps-label text-gray-400">ID • {item.id.slice(0, 8)}</div>
          <h3 id="feedback-detail-title" className="text-xl font-extrabold tracking-tight">
            {CATEGORY_LABELS[item.category]} · {STATUS_LABELS[item.status]}
          </h3>
        </div>
        <button type="button" onClick={onClose} className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-black" aria-label="বন্ধ করুন">
          ✕
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">মেসেজ</div>
          <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{item.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600">
          <Meta label="তারিখ" value={new Date(item.created_at).toLocaleString('bn-BD')} />
          <Meta label="ইউজার" value={item.user_id ? item.user_id.slice(0, 8) : 'অনামা'} />
          {item.contact && <Meta label="যোগাযোগ" value={item.contact} />}
          {item.page_url && (
            <Meta
              label="পৃষ্ঠা"
              value={<a href={item.page_url} className="text-bd-green inline-flex items-center gap-1 hover:underline">{item.page_url}<ExternalLink size={10} /></a>}
            />
          )}
          {item.rating && <Meta label="রেটিং" value={`★ ${item.rating}`} />}
          {item.user_agent && <Meta label="ডিভাইস" value={item.user_agent.slice(0, 40) + '…'} />}
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-notes" className="caps-label text-gray-400">অ্যাডমিন নোটস</label>
          <textarea
            id="admin-notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            placeholder="ট্রায়াজ নোট, ফলো-আপ প্ল্যান, রিলেটেড টিকেট..."
            className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          {item.status !== 'in_progress' && (
            <button
              type="button"
              onClick={() => onChangeStatus('in_progress')}
              disabled={saving}
              className="px-5 py-3 bg-amber-500 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play size={14} /> কাজ শুরু
            </button>
          )}
          {item.status !== 'resolved' && (
            <button
              type="button"
              onClick={() => onChangeStatus('resolved')}
              disabled={saving}
              className="px-5 py-3 bg-bd-green text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={14} /> সমাধান
            </button>
          )}
          {item.status !== 'archived' && (
            <button
              type="button"
              onClick={() => onChangeStatus('archived')}
              disabled={saving}
              className="px-5 py-3 border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Archive size={14} /> আর্কাইভ
            </button>
          )}
          {saving && <Loader2 size={20} className="animate-spin text-gray-400 self-center" />}
        </div>
      </div>
    </div>
  </div>
);

const Meta: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="caps-label text-gray-400">{label}</div>
    <div className="text-xs font-bold text-gray-700 break-all">{value}</div>
  </div>
);

export default FeedbackPanel;

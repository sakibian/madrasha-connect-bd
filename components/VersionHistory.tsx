
import React, { useState, useEffect } from 'react';
import { History, X, Clock, User } from 'lucide-react';
import { ContentVersion } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  contentType: string;
  contentId: string;
}

const VersionHistory: React.FC<Props> = ({ contentType, contentId }) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      dataService.getVersions(contentType, contentId).then(data => {
        setVersions(data);
        setLoading(false);
      });
    }
  }, [isOpen, contentType, contentId]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
      >
        <History size={14} /> সংস্করণ ইতিহাস
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-card w-full max-w-lg p-8 space-y-6 animate-slideUp max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <History size={18} />
                <h2 className="font-extrabold text-lg">সংস্করণ ইতিহাস</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground font-bold">লোড হচ্ছে...</div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-medium">কোনো সংস্করণ পাওয়া যায়নি</div>
            ) : (
              <div className="space-y-3">
                {versions.map((v, i) => (
                  <div key={v.id} className={`p-4 ${i === 0 ? 'bg-muted border border-border' : 'bg-card border border-border'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Clock size={12} />
                        {new Date(v.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {i === 0 && <span className="text-[9px] font-black px-2 py-0.5 bg-primary text-primary-foreground">সর্বশেষ</span>}
                    </div>
                    {v.title && <p className="font-bold text-sm mb-1">{v.title}</p>}
                    <p className="text-xs text-muted-foreground line-clamp-3">{v.body}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-muted-foreground">
                      <User size={10} /> {v.changedBy}
                    </div>
                    {v.changeSummary && (
                      <div className="mt-2 text-[10px] text-muted-foreground italic">{v.changeSummary}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VersionHistory;

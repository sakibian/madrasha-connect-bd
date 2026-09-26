
import React from 'react';
import { Shield, Clock, CheckCircle } from 'lucide-react';
import Badge from './Badge';
import { Fatwa } from '../../types';

interface FatwaCardProps {
  fatwa: Fatwa;
  onAnswer?: () => void;
  onView?: () => void;
}

const FatwaCard: React.FC<FatwaCardProps> = ({ fatwa, onAnswer, onView }) => (
  <div className="bg-card p-8 minimal-border hover:border-border transition-all space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={fatwa.status === 'ANSWERED' ? 'success' : fatwa.status === 'REJECTED' ? 'error' : 'warning'}>
            {fatwa.status === 'ANSWERED' ? 'উত্তরিত' : fatwa.status === 'REJECTED' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
          </Badge>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{fatwa.category}</span>
        </div>
        <h3 className="text-xl font-extrabold leading-tight">{fatwa.question}</h3>
        <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
          <Clock size={12} /> {fatwa.askedAt}
        </div>
      </div>
    </div>
    {fatwa.answer && (
      <div className="p-4 bg-muted text-sm text-muted-foreground border-l-4 border-border">
        {fatwa.answer.length > 200 ? `${fatwa.answer.slice(0, 200)}...` : fatwa.answer}
      </div>
    )}
    <div className="flex gap-3">
      {onAnswer && (
        <button
          onClick={onAnswer}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1"
        >
          <Shield size={14} /> উত্তর দিন
        </button>
      )}
      {onView && (
        <button
          onClick={onView}
          className="px-5 py-2.5 border border-border text-muted-foreground font-bold text-xs hover:bg-muted transition-all flex items-center gap-1"
        >
          <CheckCircle size={14} /> দেখুন
        </button>
      )}
    </div>
  </div>
);

export default FatwaCard;


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
  <div className="bg-white p-8 minimal-border hover:border-gray-300 transition-all space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={fatwa.status === 'ANSWERED' ? 'success' : fatwa.status === 'REJECTED' ? 'error' : 'warning'}>
            {fatwa.status === 'ANSWERED' ? 'উত্তরিত' : fatwa.status === 'REJECTED' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
          </Badge>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{fatwa.category}</span>
        </div>
        <h3 className="text-xl font-extrabold leading-tight">{fatwa.question}</h3>
        <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
          <Clock size={12} /> {fatwa.askedAt}
        </div>
      </div>
    </div>
    {fatwa.answer && (
      <div className="p-4 bg-gray-50 text-sm text-gray-600 border-l-4 border-gray-300">
        {fatwa.answer.length > 200 ? `${fatwa.answer.slice(0, 200)}...` : fatwa.answer}
      </div>
    )}
    <div className="flex gap-3">
      {onAnswer && (
        <button
          onClick={onAnswer}
          className="px-5 py-2.5 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-1"
        >
          <Shield size={14} /> উত্তর দিন
        </button>
      )}
      {onView && (
        <button
          onClick={onView}
          className="px-5 py-2.5 border border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all flex items-center gap-1"
        >
          <CheckCircle size={14} /> দেখুন
        </button>
      )}
    </div>
  </div>
);

export default FatwaCard;


import React from 'react';
import { MapPin, Users } from 'lucide-react';
import Badge from './Badge';
import { Institution } from '../../types';

interface InstitutionCardProps {
  institution: Institution;
  onClick?: () => void;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-8 minimal-border hover:border-gray-300 transition-all cursor-pointer space-y-4 group"
  >
    <div className="flex items-start gap-6">
      <div className="w-16 h-16 bg-gray-100 overflow-hidden grayscale flex-shrink-0">
        <img src={institution.image} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={institution.verified ? 'success' : 'default'}>
              {institution.verified ? 'ভেরিফাইড' : 'পেন্ডিং'}
            </Badge>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{institution.type}</span>
          </div>
          <h3 className="text-xl font-extrabold leading-tight group-hover:underline">{institution.name}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
          <span className="flex items-center gap-1.5"><MapPin size={14} /> {institution.location}, {institution.district}</span>
          {institution.studentCount && (
            <span className="flex items-center gap-1.5"><Users size={14} /> {institution.studentCount} শিক্ষার্থী</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default InstitutionCard;

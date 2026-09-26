
import React from 'react';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import Badge from './Badge';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApply?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => (
  <div className="bg-card p-8 minimal-border hover:border-border transition-all space-y-4">
    <div className="flex justify-between items-start gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={job.verified ? 'success' : 'default'}>
            {job.verified ? 'VERIFIED' : 'PENDING'}
          </Badge>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{job.type}</span>
        </div>
        <h3 className="text-xl font-extrabold leading-tight">{job.title}</h3>
        <p className="text-sm font-bold text-muted-foreground">{job.institution}</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-muted-foreground">
      <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
      <span className="flex items-center gap-1.5"><DollarSign size={14} /> {job.salary}</span>
    </div>
    {onApply && (
      <button
        onClick={onApply}
        className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold text-xs hover:opacity-90 transition-all uppercase tracking-widest"
      >
        আবেদন করুন
      </button>
    )}
  </div>
);

export default JobCard;

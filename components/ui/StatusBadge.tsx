/**
 * StatusBadge — the ONE source of truth for status pills.
 *
 * Any status displayed anywhere in the app should render through this
 * component so the same state always looks (and reads) the same way.
 */

import React from 'react';

export type StatusKind =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'banned'
  | 'draft'
  | 'active'
  | 'archived'
  | 'flagged';

interface StatusBadgeProps {
  status: StatusKind;
  /** Optional custom label (defaults to the Bangla label). */
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<StatusKind, { bn: string; en: string; cls: string }> = {
  pending:  { bn: 'পেন্ডিং',   en: 'Pending',  cls: 'bg-warning-50  text-warning-700 border border-warning-200' },
  approved: { bn: 'অনুমোদিত',  en: 'Approved', cls: 'bg-brand-50    text-brand-700   border border-brand-200'   },
  rejected: { bn: 'বাতিল',      en: 'Rejected', cls: 'bg-danger-50   text-danger-700  border border-danger-200'  },
  banned:   { bn: 'ব্যানড',    en: 'Banned',   cls: 'bg-danger-50   text-danger-700  border border-danger-200'  },
  draft:    { bn: 'ড্রাফট',    en: 'Draft',    cls: 'bg-info-50     text-info-700    border border-info-200'    },
  active:   { bn: 'সক্রিয়',    en: 'Active',   cls: 'bg-brand-50    text-brand-700   border border-brand-200'   },
  archived: { bn: 'আর্কাইভড',  en: 'Archived', cls: 'bg-info-50     text-info-700    border border-info-200'    },
  flagged:  { bn: 'ফ্ল্যাগড',  en: 'Flagged',  cls: 'bg-warning-50  text-warning-700 border border-warning-200' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const cfg = STATUS_CONFIG[status];
  const text = label ?? cfg.bn;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-widest ${cfg.cls} ${className}`}
      data-status={status}
      aria-label={`${cfg.en} status`}
    >
      {text}
    </span>
  );
};

export default StatusBadge;

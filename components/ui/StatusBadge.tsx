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
  pending:  { bn: 'পেন্ডিং',   en: 'Pending',  cls: 'bg-gray-50  text-gray-900 border border-gray-300' },
  approved: { bn: 'অনুমোদিত',  en: 'Approved', cls: 'bg-gray-50    text-black   border border-gray-300'   },
  rejected: { bn: 'বাতিল',      en: 'Rejected', cls: 'bg-gray-100   text-black  border border-gray-300'  },
  banned:   { bn: 'ব্যানড',    en: 'Banned',   cls: 'bg-gray-100   text-black  border border-gray-300'  },
  draft:    { bn: 'ড্রাফট',    en: 'Draft',    cls: 'bg-gray-50     text-gray-900    border border-gray-300'    },
  active:   { bn: 'সক্রিয়',    en: 'Active',   cls: 'bg-gray-50    text-black   border border-gray-300'   },
  archived: { bn: 'আর্কাইভড',  en: 'Archived', cls: 'bg-gray-50     text-gray-900    border border-gray-300'    },
  flagged:  { bn: 'ফ্ল্যাগড',  en: 'Flagged',  cls: 'bg-gray-50  text-gray-900 border border-gray-300' },
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

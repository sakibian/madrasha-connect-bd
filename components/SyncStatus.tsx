
import React from 'react';
import { Wifi, WifiOff, Cloud, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '../contexts/SyncStatusContext';

const SyncStatus: React.FC = () => {
  const { status, isOnline, lastSyncAt, triggerSync } = useSyncStatus();

  const config = {
    online: { icon: Wifi, label: 'সংযুক্ত', className: 'text-bd-green' },
    offline: { icon: WifiOff, label: 'অফলাইন', className: 'text-red-500' },
    syncing: { icon: RefreshCw, label: 'সিঙ্ক হচ্ছে...', className: 'text-blue-500' },
    error: { icon: Cloud, label: 'সিঙ্ক ত্রুটি', className: 'text-yellow-500' },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <button
      onClick={triggerSync}
      className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${className} transition-all hover:opacity-70`}
      title={lastSyncAt ? `শেষ সিঙ্ক: ${lastSyncAt.toLocaleTimeString('bn-BD')}` : 'অপেক্ষমান'}
    >
      <Icon size={12} className={status === 'syncing' ? 'animate-spin' : ''} />
      <span>{label}</span>
    </button>
  );
};

export default SyncStatus;

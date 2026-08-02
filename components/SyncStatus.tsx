
import React from 'react';
import { Wifi, WifiOff, Cloud, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '../contexts/SyncStatusContext';

const SyncStatus: React.FC = () => {
  const { status, isOnline, lastSyncAt, triggerSync } = useSyncStatus();

  // Sync state colours use the brand palette:
  //   online  -> black (all good)
  //   offline -> gray (neutral, avoid alarming users on flaky mobile networks)
  //   syncing -> black (spinner + neutral text; no arbitrary blue)
  //   error   -> red-600 (genuine failure, matches all other error banners)
  const config = {
    online: { icon: Wifi, label: 'সংযুক্ত', className: 'text-black' },
    offline: { icon: WifiOff, label: 'অফলাইন', className: 'text-gray-500' },
    syncing: { icon: RefreshCw, label: 'সিঙ্ক হচ্ছে...', className: 'text-black' },
    error: { icon: Cloud, label: 'সিঙ্ক ত্রুটি', className: 'text-gray-900' },
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

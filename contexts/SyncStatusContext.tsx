
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type SyncStatus = 'online' | 'offline' | 'syncing' | 'error';

interface SyncStatusContextType {
  status: SyncStatus;
  isOnline: boolean;
  lastSyncAt: Date | null;
  triggerSync: () => void;
}

const SyncStatusContext = createContext<SyncStatusContextType>({
  status: 'online',
  isOnline: true,
  lastSyncAt: null,
  triggerSync: () => {},
});

export const useSyncStatus = () => useContext(SyncStatusContext);

export const SyncStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SyncStatus>('online');
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = useCallback(() => {
    setStatus('syncing');
    setTimeout(() => {
      setStatus(navigator.onLine ? 'online' : 'offline');
      setLastSyncAt(new Date());
    }, 500);
  }, []);

  return (
    <SyncStatusContext.Provider value={{ status, isOnline: navigator.onLine, lastSyncAt, triggerSync }}>
      {children}
    </SyncStatusContext.Provider>
  );
};

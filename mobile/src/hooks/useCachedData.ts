
import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { cacheData, getCachedData } from '../services/cache';

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number; enabled?: boolean }
): { data: T | null; loading: boolean; isOffline: boolean; refresh: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      await cacheData(key, result, options?.ttl);
      setIsOffline(false);
    } catch {
      const cached = await getCachedData<T>(key);
      if (cached) {
        setData(cached);
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options?.ttl]);

  useEffect(() => {
    if (options?.enabled === false) return;
    fetchData();
  }, [fetchData, options?.enabled]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return { data, loading, isOffline, refresh: fetchData };
}

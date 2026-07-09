
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { useCachedData } from '../hooks/useCachedData';
import { Job } from '../types';

const JobsScreen: React.FC = () => {
  const [search, setSearch] = useState('');

  const fetchJobs = useCallback(async (): Promise<Job[]> => {
    const { data } = await supabase
      .from('jobs')
      .select('*, institutions(name)')
      .order('created_at', { ascending: false });
    if (!data) return [];
    return data.map(j => ({
      id: j.id,
      title: j.title,
      institution: (j as any).institutions?.name || '',
      location: j.location || '',
      salary: j.salary || '',
      type: j.type,
      postedAt: j.created_at || '',
      verified: j.status === 'verified',
      contactInfo: j.contact_info,
    }));
  }, []);

  const { data: jobs, loading, isOffline, refresh } = useCachedData<Job[]>('jobs_list', fetchJobs, { ttl: 1000 * 60 * 15 });

  const filtered = (jobs || []).filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.institution.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>চাকরি বোর্ড</Text>
        <Text style={styles.subtitle}>{jobs?.length || 0}টি পদ উপলব্ধ</Text>
      </View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={14} color="#fff" />
          <Text style={styles.offlineText}>অফলাইন মোড — ক্যাশ থেকে দেখাচ্ছে</Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="চাকরি খুঁজুন..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTypeBadge}>
                <Text style={styles.jobTypeText}>{item.type}</Text>
              </View>
              {item.verified && (
                <Ionicons name="checkmark-circle" size={18} color="#006a4e" />
              )}
            </View>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobInstitution}>{item.institution}</Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobLocation}>📍 {item.location}</Text>
              <Text style={styles.jobSalary}>{item.salary}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{loading ? 'লোড হচ্ছে...' : 'কোনো চাকরি পাওয়া যায়নি'}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  offlineBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F59E0B', padding: 8, gap: 6,
  },
  offlineText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  list: { padding: 16, paddingTop: 8 },
  jobCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobTypeBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  jobTypeText: { fontSize: 10, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' },
  jobTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 },
  jobInstitution: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 12 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobLocation: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  jobSalary: { fontSize: 12, fontWeight: '800', color: '#006a4e' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9CA3AF', fontWeight: '600' },
});

export default JobsScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const FatwaScreen: React.FC = () => {
  const [fatwas, setFatwas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFatwas(); }, []);

  const loadFatwas = async () => {
    const { data } = await supabase
      .from('fatwas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFatwas(data);
    setLoading(false);
  };

  const filtered = fatwas.filter(f => {
    const matchesSearch = f.question?.toLowerCase().includes(search.toLowerCase()) ||
                          f.category?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || f.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusColors: Record<string, string> = {
    PENDING: '#F59E0B',
    ANSWERED: '#10B981',
    REJECTED: '#EF4444',
  };
  const statusLabels: Record<string, string> = {
    PENDING: 'অপেক্ষমাণ',
    ANSWERED: 'উত্তর দেওয়া হয়েছে',
    REJECTED: 'প্রত্যাখ্যাত',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ফতোয়া কেন্দ্র</Text>
        <Text style={styles.subtitle}>আপনার মাসআলা জিজ্ঞাসা করুন</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="ফতোয়া খুঁজুন..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.filters}>
        {[
          { key: 'ALL', label: 'সব' },
          { key: 'PENDING', label: 'অপেক্ষমাণ' },
          { key: 'ANSWERED', label: 'উত্তরপ্রাপ্ত' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBadge, filter === f.key && styles.activeFilter]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.activeFilterText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.askButton}>
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.askButtonText}>নতুন প্রশ্ন করুন</Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#9CA3AF' }]}>
                <Text style={styles.statusText}>{statusLabels[item.status] || item.status}</Text>
              </View>
              {item.category && (
                <Text style={styles.categoryText}>{item.category}</Text>
              )}
            </View>
            <Text style={styles.question}>{item.question}</Text>
            {item.answer && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>উত্তর:</Text>
                <Text style={styles.answer} numberOfLines={3}>{item.answer}</Text>
              </View>
            )}
            {item.askedBy && (
              <Text style={styles.askedBy}>— {item.askedBy}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{loading ? 'লোড হচ্ছে...' : 'কোনো ফতোয়া পাওয়া যায়নি'}</Text>
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
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    margin: 16, marginBottom: 8, padding: 14, borderRadius: 12,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  filters: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  filterBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  activeFilter: { backgroundColor: '#111827' },
  activeFilterText: { color: '#fff' },
  askButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#006a4e', margin: 16, marginBottom: 8, padding: 16, borderRadius: 12, gap: 8,
  },
  askButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  list: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  question: { fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 22 },
  answerContainer: { marginTop: 12, padding: 12, backgroundColor: '#F0FDF4', borderRadius: 8 },
  answerLabel: { fontSize: 11, fontWeight: '800', color: '#006a4e', marginBottom: 4 },
  answer: { fontSize: 13, lineHeight: 20, color: '#374151', fontWeight: '500' },
  askedBy: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginTop: 8 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9CA3AF', fontWeight: '600' },
});

export default FatwaScreen;

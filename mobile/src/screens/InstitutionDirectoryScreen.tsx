
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const InstitutionDirectoryScreen: React.FC = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadInstitutions(); }, []);

  const loadInstitutions = async () => {
    const { data } = await supabase
      .from('institutions')
      .select('*')
      .order('name');
    if (data) setInstitutions(data);
    setLoading(false);
  };

  const filtered = institutions.filter(inst => {
    const matchesSearch = inst.name?.toLowerCase().includes(search.toLowerCase()) ||
                          inst.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || inst.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>মাদ্রাসা ডিরেক্টরি</Text>
        <Text style={styles.subtitle}>{institutions.length}টি প্রতিষ্ঠান</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="নাম বা এলাকা খুঁজুন..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.filters}>
        {['All', 'Qawmi', 'Alia', 'Mosque'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBadge, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
              {f === 'All' ? 'সব' : f === 'Qawmi' ? 'কওমি' : f === 'Alia' ? 'আলিয়া' : 'মসজিদ'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              {item.verified && (
                <Ionicons name="checkmark-circle" size={18} color="#006a4e" />
              )}
            </View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardStat}>{item.student_count || 'N/A'} শিক্ষার্থী</Text>
              <Text style={styles.cardStat}>{item.established || 'N/A'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{loading ? 'লোড হচ্ছে...' : 'কোনো প্রতিষ্ঠান পাওয়া যায়নি'}</Text>
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
  list: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 4 },
  cardLocation: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardStat: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: '#9CA3AF', fontWeight: '600' },
});

export default InstitutionDirectoryScreen;

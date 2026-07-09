
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { getCurrentUser } from '../services/auth';
import { User } from '../types';

const DashboardScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ xp: 0, level: 1, badges: 0, referrals: 0 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const u = await getCurrentUser();
    setUser(u);
    if (u) {
      const { data: xpData } = await supabase.from('user_xp').select('xp').eq('user_id', u.id).single();
      const { data: badges } = await supabase.from('user_badges').select('id').eq('user_id', u.id);
      const { data: referrals } = await supabase.from('referrals').select('id').eq('referrer_id', u.id);
      setStats({
        xp: xpData?.xp || 0,
        level: Math.floor(Math.sqrt((xpData?.xp || 0) / 100)) + 1,
        badges: badges?.length || 0,
        referrals: referrals?.length || 0,
      });
    }
    setRefreshing(false);
  };

  const menuItems = [
    { icon: 'briefcase-outline', label: 'আমার আবেদন', screen: 'Jobs' },
    { icon: 'chatbubbles-outline', label: 'আমার পোস্ট', screen: 'Community' },
    { icon: 'people-outline', label: 'বন্ধুদের আমন্ত্রণ', screen: 'Referral' },
    { icon: 'book-outline', label: 'আমার কোর্স', screen: 'Knowledge' },
    { icon: 'trophy-outline', label: 'লিডারবোর্ড', screen: 'Leaderboard' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadDashboard} />}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user?.name || 'ব্যবহারকারী'}</Text>
        <Text style={styles.role}>{user?.role || 'USER'}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.xp}</Text>
          <Text style={styles.statLabel}>CP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.level}</Text>
          <Text style={styles.statLabel}>লেভেল</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.badges}</Text>
          <Text style={styles.statLabel}>ব্যাজ</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.referrals}</Text>
          <Text style={styles.statLabel}>রেফারেল</Text>
        </View>
      </View>

      <View style={styles.levelCard}>
        <Text style={styles.levelTitle}>লেভেল {stats.level}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(100, (stats.xp % 100))}%` }]} />
        </View>
        <Text style={styles.progressText}>{stats.xp % 100}/100 CP</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color="#6B7280" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { alignItems: 'center', padding: 32, paddingBottom: 16 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#6B7280' },
  name: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 16 },
  role: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: {
    width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '900', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', marginTop: 4 },
  levelCard: {
    backgroundColor: '#006a4e', margin: 16, marginTop: 0, padding: 20, borderRadius: 16,
  },
  levelTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginTop: 8 },
  menuSection: { padding: 16, paddingTop: 0 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 14 },
});

export default DashboardScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, signOut } from '../services/auth';
import { User } from '../types';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const menuItems = [
    { icon: 'person-outline', label: 'প্রোফাইল এডিট', screen: 'ProfileBuilder' },
    { icon: 'briefcase-outline', label: 'আমার আবেদন', screen: 'Applications' },
    { icon: 'bookmark-outline', label: 'সংরক্ষিত', screen: 'Saved' },
    { icon: 'trophy-outline', label: 'লিডারবোর্ড', screen: 'Leaderboard' },
    { icon: 'people-outline', label: 'বন্ধুদের আমন্ত্রণ', screen: 'Referral' },
    { icon: 'help-circle-outline', label: 'সাহায্য', screen: 'Help' },
    { icon: 'settings-outline', label: 'সেটিংস', screen: 'Settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </View>
        <Text style={styles.name}>{user?.name || 'ব্যবহারকারী'}</Text>
        <Text style={styles.role}>{user?.role || 'USER'}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>১২০</Text>
          <Text style={styles.statLabel}>CP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>লেভেল ৩</Text>
          <Text style={styles.statLabel}>লেভেল</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>৫</Text>
          <Text style={styles.statLabel}>ব্যাজ</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color="#6B7280" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>লগ আউট</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { alignItems: 'center', padding: 32, paddingBottom: 16 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#6B7280' },
  onlineIndicator: { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', borderWidth: 3, borderColor: '#F9FAFB' },
  name: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 16 },
  role: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },
  stats: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB' },
  menu: { padding: 16, paddingTop: 0 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 14 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
});

export default ProfileScreen;

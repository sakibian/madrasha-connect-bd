
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { supabase } from '../services/supabase';
import { COLORS } from '../utils/theme';

const HomeScreen: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('সুপ্রভাত');
    else if (hour < 17) setGreeting('শুভ অপরাহ্ন');
    else setGreeting('শুভ সন্ধ্যা');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const quickActions = [
    { icon: '📖', title: 'ফতোয়া কেন্দ্র', subtitle: 'প্রশ্ন করুন', screen: 'Fatwa' },
    { icon: '💼', title: 'চাকরি খুঁজুন', subtitle: '১০০+ পদ', screen: 'Jobs' },
    { icon: '🏫', title: 'মাদ্রাসা', subtitle: 'ডিরেক্টরি', screen: 'Institutions' },
    { icon: '📚', title: 'কোর্স', subtitle: 'দীন-১০১', screen: 'Knowledge' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting} 👋</Text>
        <Text style={styles.title}>মাদ্রাসা কানেক্ট</Text>
        <Text style={styles.subtitle}>আধুনিক মাদ্রাসা ইকোসিস্টেম</Text>
      </View>

      <View style={styles.quickActions}>
        {quickActions.map((action, i) => (
          <TouchableOpacity key={i} style={styles.actionCard}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>আজকের হাদিস</Text>
        <View style={styles.hadithCard}>
          <Text style={styles.hadithText}>
            "যে ব্যক্তি ইসলামের উপর প্রতিষ্ঠিত থাকে, আল্লাহ তাকে সুপ্রতিষ্ঠিত করেন।"
          </Text>
          <Text style={styles.hadithSource}>— সহীহ মুসলিম</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>জনপ্রিয় কোর্স</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['দীন-১০১', 'তাজবীদ', 'সীরাত', 'আরবি ভাষা'].map((course, i) => (
            <TouchableOpacity key={i} style={styles.courseCard}>
              <Text style={styles.courseTitle}>{course}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingTop: 16 },
  greeting: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '900', marginTop: 4, color: '#111827' },
  subtitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: { fontSize: 32, marginBottom: 12 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  actionSubtitle: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  hadithCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hadithText: { fontSize: 15, lineHeight: 24, color: '#374151', fontWeight: '500' },
  hadithSource: { fontSize: 12, color: '#006a4e', fontWeight: '700', marginTop: 12 },
  courseCard: {
    backgroundColor: '#006a4e',
    padding: 20,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 140,
  },
  courseTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

export default HomeScreen;

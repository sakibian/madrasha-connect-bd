
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const courses = [
  { id: '1', title: 'দীন-১০১', subtitle: 'ইসলামের মৌলিক শিক্ষা', icon: '📖', color: '#006a4e' },
  { id: '2', title: 'তাজবীদ', subtitle: 'কুরআন উচ্চারণ', icon: '🎤', color: '#1E40AF' },
  { id: '3', title: 'সীরাত', subtitle: 'নবীজির জীবনী', icon: '🌙', color: '#9333EA' },
  { id: '4', title: 'আরবি ভাষা', subtitle: 'ভাষা শিক্ষা', icon: '✍️', color: '#DC2626' },
];

const KnowledgeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>শিক্ষা কেন্দ্র</Text>
        <Text style={styles.subtitle}>ইসলামিক জ্ঞানের ভান্ডার</Text>
      </View>

      <View style={styles.grid}>
        {courses.map(course => (
          <TouchableOpacity key={course.id} style={[styles.courseCard, { borderLeftColor: course.color }]}>
            <Text style={styles.courseIcon}>{course.icon}</Text>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>শুরু করুন</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>জনপ্রিয় রিসোর্স</Text>
        {[
          { title: 'কুরআন তিলাওয়াত', desc: 'সূরা ও আয়াত শুনুন' },
          { title: 'দৈনিক আমল', desc: 'সকাল-সন্ধ্যার যিকির' },
          { title: 'ফিকহ মাসআলা', desc: 'দৈনিক জীবনের শরীয়াহ' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  grid: { padding: 16, gap: 12 },
  courseCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  courseIcon: { fontSize: 28, marginBottom: 8 },
  courseTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  courseSubtitle: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 4 },
  startButton: { marginTop: 12, backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  startButtonText: { fontSize: 12, fontWeight: '800', color: '#111827' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  resourceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  resourceTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  resourceDesc: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 4 },
});

export default KnowledgeScreen;

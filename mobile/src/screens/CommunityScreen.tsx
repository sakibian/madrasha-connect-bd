
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const CommunityScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>কমিউনিটি</Text>
        <Text style={styles.subtitle}>সাথে আলোচনা করুন</Text>
      </View>

      <View style={styles.categories}>
        {['সাধারণ', 'চাকরি', 'শিক্ষা', 'ইভেন্ট'].map((cat, i) => (
          <TouchableOpacity key={i} style={[styles.categoryBadge, i === 0 && styles.activeBadge]}>
            <Text style={[styles.categoryText, i === 0 && styles.activeBadgeText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ম</Text>
          </View>
          <View>
            <Text style={styles.postAuthor}>মুফতি আব্দুল্লাহ</Text>
            <Text style={styles.postTime}>২ ঘণ্টা আগে</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>রমজানের প্রস্তুতি ও আমাদের সামাজিক দায়িত্ব</Text>
        <Text style={styles.postContent}>আসসালামু আলাইকুম। রমজান সমাগত হতে যাচ্ছে। আমরা সকলে মিলে...</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>👍 ১২৪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>💬 ১৮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>↗️ শেয়ার</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>স</Text>
          </View>
          <View>
            <Text style={styles.postAuthor}>মাওলানা সাঈদ</Text>
            <Text style={styles.postTime}>৫ ঘণ্টা আগে</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>নাহু ও সরফ শিখার সহজ ৫টি কৌশল</Text>
        <Text style={styles.postContent}>ইলমে দ্বীন শিক্ষার শুরুতেই আরবী ব্যাকরণ নিয়ে...</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>👍 ৮৫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>💬 ৪৫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Text style={styles.postActionText}>↗️ শেয়ার</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  categories: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  categoryText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  activeBadge: { backgroundColor: '#111827' },
  activeBadgeText: { color: '#fff' },
  postCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#6B7280' },
  postAuthor: { fontSize: 14, fontWeight: '700', color: '#111827' },
  postTime: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  postTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 8 },
  postContent: { fontSize: 14, lineHeight: 22, color: '#6B7280', fontWeight: '500' },
  postFooter: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 16 },
  postAction: {},
  postActionText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
});

export default CommunityScreen;

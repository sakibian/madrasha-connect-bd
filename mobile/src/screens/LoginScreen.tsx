import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signIn, sendPhoneOtp, verifyPhoneOtp } from '../services/auth';
import { COLORS } from '../utils/theme';

/**
 * Two-tab login screen: Phone OTP (default) or Email + Password.
 *
 * Bangladesh-first: the vast majority of madrasa students and imams don't
 * use email daily but always have a mobile number. Phone OTP is the primary
 * lane; email exists for admin / institutional accounts.
 *
 * Requires Supabase Phone Auth to be enabled + an SMS provider (Twilio,
 * SSL Wireless, etc.) configured in the Supabase dashboard.
 */

type Tab = 'phone' | 'email';

const LoginScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('ইমেইল ও পাসওয়ার্ড দিন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      // Navigation happens automatically once onAuthStateChange fires.
    } catch (e: any) {
      setError(e.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('ফোন নম্বর দিন');
      return;
    }
    setLoading(true);
    setError('');
    const res = await sendPhoneOtp(phone);
    setLoading(false);
    if (res.ok) setOtpSent(true);
    else setError(res.error || 'OTP পাঠানো যায়নি');
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError('সম্পূর্ণ কোড দিন');
      return;
    }
    setLoading(true);
    setError('');
    const res = await verifyPhoneOtp(phone, otp);
    setLoading(false);
    if (!res.user) setError(res.error || 'OTP মিলছে না');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoBlock}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>মাদ্রাসা কানেক্ট</Text>
          <Text style={styles.subtitle}>ফোন OTP অথবা ইমেইল দিয়ে প্রবেশ করুন</Text>
        </View>

        {/* Tab selector */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'phone' && styles.tabActive]}
            onPress={() => { setTab('phone'); setError(''); }}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'phone' }}
          >
            <Ionicons name="call" size={14} color={tab === 'phone' ? '#fff' : '#9CA3AF'} />
            <Text style={[styles.tabText, tab === 'phone' && styles.tabTextActive]}>ফোন OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'email' && styles.tabActive]}
            onPress={() => { setTab('email'); setError(''); }}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'email' }}
          >
            <Ionicons name="mail" size={14} color={tab === 'email' ? '#fff' : '#9CA3AF'} />
            <Text style={[styles.tabText, tab === 'email' && styles.tabTextActive]}>ইমেইল</Text>
          </TouchableOpacity>
        </View>

        {tab === 'phone' ? (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ফোন নম্বর</Text>
              <View style={styles.iconInput}>
                <Ionicons name="call" size={18} color="#9CA3AF" style={styles.leadIcon} />
                <TextInput
                  style={styles.iconInputField}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="01712345678"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  editable={!otpSent}
                  accessibilityLabel="বাংলাদেশী ফোন নম্বর"
                />
              </View>
            </View>

            {otpSent && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>OTP কোড</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="key" size={18} color="#9CA3AF" style={styles.leadIcon} />
                  <TextInput
                    style={[styles.iconInputField, { letterSpacing: 6 }]}
                    value={otp}
                    onChangeText={(v) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    accessibilityLabel="OTP কোড"
                  />
                </View>
              </View>
            )}

            {error ? (
              <View style={styles.error}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>{otpSent ? 'যাচাই করুন' : 'OTP পাঠান'}</Text>
              )}
            </TouchableOpacity>

            {otpSent && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => { setOtpSent(false); setOtp(''); setError(''); }}
              >
                <Text style={styles.linkText}>ফোন নম্বর পরিবর্তন করুন</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.footNote}>বিনামূল্যে SMS ওটিপি • প্ল্যাটফর্ম সম্পূর্ণ অলাভজনক</Text>
          </View>
        ) : (
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ইমেইল</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>পাসওয়ার্ড</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordField}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="পাসওয়ার্ড লিখুন"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                  accessibilityLabel={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.error}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>লগইন</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 48, justifyContent: 'center' },

  logoBlock: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 64, height: 64, borderRadius: 16, backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', marginTop: 16 },
  subtitle: {
    fontSize: 13, color: '#9CA3AF', fontWeight: '600',
    marginTop: 6, textAlign: 'center', paddingHorizontal: 20,
  },

  tabs: {
    flexDirection: 'row', backgroundColor: '#E5E7EB', padding: 4,
    borderRadius: 12, marginBottom: 24, gap: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 8, gap: 8, backgroundColor: 'transparent',
  },
  tabActive: { backgroundColor: '#111827' },
  tabText: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  tabTextActive: { color: '#fff' },

  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11, fontWeight: '800', color: '#6B7280',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1,
  },
  input: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12, fontSize: 15,
    fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E5E7EB',
  },
  iconInput: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12,
  },
  leadIcon: { marginRight: 8 },
  iconInputField: {
    flex: 1, paddingVertical: 16, fontSize: 15, fontWeight: '600', color: '#111827',
  },
  passwordRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  passwordField: { flex: 1, padding: 16, fontSize: 15, fontWeight: '600', color: '#111827' },
  eyeButton: { padding: 16 },

  error: {
    backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8,
    marginBottom: 12, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { fontSize: 13, color: '#DC2626', fontWeight: '700', textAlign: 'center' },

  primaryButton: {
    backgroundColor: '#111827', padding: 18, borderRadius: 12, alignItems: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  linkButton: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 13, color: '#6B7280', fontWeight: '700' },

  footNote: {
    fontSize: 11, color: '#9CA3AF', fontWeight: '700', textAlign: 'center',
    marginTop: 24, textTransform: 'uppercase', letterSpacing: 1,
  },
});

export default LoginScreen;

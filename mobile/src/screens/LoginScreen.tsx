
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signIn } from '../services/auth';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('ইমেইল ও পাসওয়ার্ড দিন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (e: any) {
      setError(e.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>মাদ্রাসা কানেক্ট</Text>
          <Text style={styles.subtitle}>আপনার অ্যাকাউন্টে প্রবেশ করুন</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="পাসওয়ার্ড লিখুন"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>পাসওয়ার্ড ভুলে গেছেন?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? 'প্রবেশ করছে...' : 'লগইন'}</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>অ্যাকাউন্ট নেই? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>নিবন্ধন করুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginTop: 4 },
  errorContainer: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { fontSize: 13, color: '#DC2626', fontWeight: '600', textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, fontSize: 15, fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  passwordContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  passwordInput: { flex: 1, padding: 16, fontSize: 15, fontWeight: '600', color: '#111827' },
  eyeButton: { padding: 16 },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 13, fontWeight: '700', color: '#006a4e' },
  loginButton: { backgroundColor: '#111827', padding: 18, borderRadius: 12, alignItems: 'center' },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  registerLink: { fontSize: 14, fontWeight: '800', color: '#006a4e' },
});

export default LoginScreen;

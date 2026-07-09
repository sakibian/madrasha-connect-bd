
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export async function pickImage(options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: options?.allowsEditing ?? true,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled || !result.assets?.[0]) return null;
  return result.assets[0].uri;
}

export async function takePhoto(options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: options?.allowsEditing ?? true,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled || !result.assets?.[0]) return null;
  return result.assets[0].uri;
}

export async function uploadAvatar(userId: string, uri: string): Promise<string | null> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = uri.split('.').pop() || 'jpg';
  const path = `avatars/${userId}.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, blob, { contentType: `image/${ext}`, upsert: true });

  if (error) return null;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function uploadImage(
  bucket: string,
  folder: string,
  uri: string,
  fileName?: string
): Promise<string | null> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = uri.split('.').pop() || 'jpg';
  const name = fileName || `${Date.now()}`;
  const path = `${folder}/${name}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: `image/${ext}`, upsert: false });

  if (error) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

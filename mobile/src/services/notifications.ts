
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'সাধারণ',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#006a4e',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    return null;
  }

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    return pushToken.data;
  } catch {
    return null;
  }
}

export async function savePushToken(userId: string, token: string): Promise<void> {
  const { error } = await supabase.from('push_tokens').upsert(
    {
      user_id: userId,
      token,
      platform: Platform.OS,
      is_active: true,
    },
    { onConflict: 'user_id,token' }
  );

  if (error) {
    console.error('Failed to save push token:', error.message);
  }
}

export async function removePushToken(token: string): Promise<void> {
  const { error } = await supabase
    .from('push_tokens')
    .update({ is_active: false })
    .eq('token', token);

  if (error) {
    console.error('Failed to remove push token:', error.message);
  }
}

export function addNotificationListeners(
  onReceived: (notification: Notifications.Notification) => void,
  onTapped: (response: Notifications.NotificationResponse) => void
): { removeReceived: () => void; removeTapped: () => void } {
  const receivedListener = Notifications.addNotificationReceivedListener(onReceived);
  const responseListener = Notifications.addNotificationResponseReceivedListener(onTapped);

  return {
    removeReceived: () => receivedListener.remove(),
    removeTapped: () => responseListener.remove(),
  };
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    }),
  });
}

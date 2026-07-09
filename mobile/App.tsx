
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainerRef } from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import { registerForPushNotifications, savePushToken, addNotificationListeners } from './src/services/notifications';
import { getCurrentUser } from './src/services/auth';

export default function App() {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const token = await registerForPushNotifications();
      if (token) {
        await savePushToken(user.id, token);
      }

      const listeners = addNotificationListeners(
        (_notification) => {},
        (response) => {
          const data = response.notification.request.content.data;
          if (data?.screen && navRef.current) {
            (navRef.current as any).navigate(data.screen, data.params);
          }
        }
      );

      cleanup = () => {
        listeners.removeReceived();
        listeners.removeTapped();
      };
    };

    setup();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigation ref={navRef} />
    </SafeAreaProvider>
  );
}

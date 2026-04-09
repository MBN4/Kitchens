import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/utils/notifications';
import useAuthStore from './src/store/useAuthStore';
import { userService } from './src/api/userService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const { user, isAuthenticated } = useAuthStore();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (isAuthenticated && user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          userService.updateProfile(user.id, { push_token: token });
        }
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification Received:", notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Notification Tapped:", response);
      });

      return () => {
        Notifications.rpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63(notificationListener.current);
        Notifications.rpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63(responseListener.current);
      };
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
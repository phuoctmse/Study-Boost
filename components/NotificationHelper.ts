import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler (optional: show alert when app is foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // iOS 17+
    shouldShowList: true,   // iOS 17+
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function schedulePomodoroNotification({
  secondsFromNow = 0,
  title = 'Pomodoro hoàn thành!',
  body = 'Đã đến lúc nghỉ ngơi hoặc chuyển sang hoạt động tiếp theo.',
}: {
  secondsFromNow?: number;
  title?: string;
  body?: string;
}) {
  await requestNotificationPermission();
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: 'timeInterval',
      seconds: secondsFromNow,
      repeats: false,
      ...(Platform.OS === 'android' ? { channelId: 'pomodoro-timer' } : {}),
    } as any, // Workaround for Expo Notifications type issues
  });
}

// (Optional) Call this once on Android to set up a notification channel
export async function setupAndroidNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('pomodoro-timer', {
      name: 'Pomodoro Timer',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
} 
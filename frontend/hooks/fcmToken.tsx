import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const FCM_PUSH_TOKEN_KEY = 'fcmPushToken';

export const saveFcmPushToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(FCM_PUSH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save FCM push token to AsyncStorage:', error);
  }
};

export const getFcmPushToken = async (): Promise<string | null> => {
  const { status: expoStatus } = await Notifications.getPermissionsAsync();
  console.log('Expo Notification Permissions:', expoStatus);

  if (expoStatus !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    console.log('New Expo Notification Permissions:', newStatus);

    if (newStatus !== 'granted') {
      console.error('Expo notification permissions not granted');
      return null;
    }
  }

  try {
    return await AsyncStorage.getItem(FCM_PUSH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get FCM push token from AsyncStorage:', error);
    return null;
  }

  
};

export async function registerForFcmNotifications(): Promise<string | null> {
  const authStatus = await messaging().requestPermission();
  const isAuthorized =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!isAuthorized) {
    console.error('Notification permission not granted');
    return null;
  }

  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  // Save the token for later use
  await saveFcmPushToken(token);

  return token;
}
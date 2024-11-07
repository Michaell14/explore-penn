import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUSH_TOKEN_KEY = 'expoPushToken';

export const saveExpoPushToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(EXPO_PUSH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save expo push token to AsyncStorage:', error);
  }
};

export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(EXPO_PUSH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get expo push token from AsyncStorage:', error);
    return null;
  }
};
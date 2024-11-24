// app/index.tsx
import React, {useState, useEffect} from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { baseURL } from '../config.js';
import axios from 'axios'
import { getExpoPushToken, saveExpoPushToken } from '@/hooks/pushToken';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { startBackgroundUpdate } from '@/hooks/registerBackground';

// interface LocationType {
//   latitude: number;
//   longitude: number;
// }

// interface Pin {
//   id: string;
//   latitude: number;
//   longitude: number;
// }

// const Index = () => {
//   const {signOut, user} = useAuth()
//   const router = useRouter();
//   const [locationError, setLocationError] = React.useState<string | null>(null);
//   const [location, setLocation] = useState<LocationType | null>(null);
//   const [pins, setPins] = useState<Pin[]>([]);
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

//   const handleSignOut = async () => {
//     try {
//       await signOut().then(() => router.replace('/auth/sign-in'));
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
//   };

//   const getLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') return;

//       const locationResult = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: locationResult.coords.latitude,
//         longitude: locationResult.coords.longitude,
//       });
//     } catch (error) {
//       console.error('Error getting location:', error);
//     }
//   };

//   const getNearbyPins = async () => {
//     if (!location) return;
//     try {
//       const response = await axios.post<Pin[]>(
//         `${baseURL}/api/pins/location`,
//         {
//           radius: 0.0011,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       );
//       setPins(response.data);
//     } catch (e) {
//       console.log('Error getting nearby pins:', e);
//     }
//   };

//   useEffect(() => {
//     const initializeApp = async () => {
//       const permissionsGranted = await requestPermissions();
//       if (permissionsGranted) {
//         // Initialize push notifications
//         const storedToken = await getExpoPushToken();
//         if (storedToken) {
//           setExpoPushToken(storedToken);
//         } else {
//           const token = await registerForPushNotificationsAsync();
//           if (token) {
//             setExpoPushToken(token);
//             await saveExpoPushToken(token);
//           }
//         }

//         // Register background fetch task
//         // await startBackgroundUpdate();
//       }
//     };

//     initializeApp().catch((error) => {
//       console.error('Failed to initialize app:', error);
//     });

//     const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
//       console.log('Notification received:', notification);
//     });

//     const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log('Notification response received:', response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, []);

  

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome {user?.displayName}</Text>
//       <Button title="Update Location" onPress={getLocation} />
//       <Button title="Get Pins" onPress={getNearbyPins} />
//       <Text>
//         {location?.latitude} {location?.longitude}
//       </Text>
//       <Text>Nearby Pins: {pins.length}</Text>
//       <Text>Expo Push Token: {expoPushToken}</Text>
//       {pins.map((pin) => (
//         <Text key={pin.id}>{pin.id}</Text>
//       ))}
//       <Button title="Log Out" onPress={handleSignOut} />
//     </View>
//   );
// };

// async function registerForPushNotificationsAsync(): Promise<string | null> {
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus === 'granted') {
//     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log('Expo Push Token:', token);
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//       });
//     }
//     return token;
//   } else {
//     alert('Failed to get push token for push notification!');
//     return null;
//   }
// }

// const requestPermissions = async (): Promise<boolean> => {
//   // Request foreground location permission
//   const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//   if (foregroundStatus !== 'granted') {
//     console.error('Foreground location permission not granted');
//     return false;
//   }

//   // Request background location permission
//   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//   if (backgroundStatus !== 'granted') {
//     console.error('Background location permission not granted');
//     return false;
//   }

//   // Request notification permission
//   const { status: notificationsStatus } = await Notifications.requestPermissionsAsync();
//   if (notificationsStatus !== 'granted') {
//     console.error('Notification permission not granted');
//     return false;
//   }

//   return true;
// };

// export default Index;

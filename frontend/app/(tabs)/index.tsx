import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PinBottomSheet from '@/components/PinBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { baseURL } from '@/config';
import { getExpoPushToken, saveExpoPushToken } from '@/hooks/pushToken';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

interface PinData {
  title: string,
  description: string,
  longitude: number,
  latitude: number,
}


interface LocationType {
  latitude: number;
  longitude: number;
}



const HomeScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pin, setPin] = useState<PinData | undefined>();
  const {signOut, user} = useAuth()
  const router = useRouter();
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [pins, setPins] = useState<PinData[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const locationResult = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const getNearbyPins = async () => {
    if (!location) return;
    try {
      const response = await axios.post<PinData[]>(
        `${baseURL}/api/pins/location`,
        {
          radius: 0.0011,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setPins(response.data);
    } catch (e) {
      console.log('Error getting nearby pins:', e);
    }
  };

  const handleMarkerPress = (pin: PinData) => {
    console.log(pin.longitude);
    console.log(pin.latitude)
    setPin(pin);
  };
  React.useEffect(() => {
    const initializeApp = async () => {
      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        // Initialize push notifications
        const storedToken = await getExpoPushToken();
        if (storedToken) {
          setExpoPushToken(storedToken);
          console.log(storedToken)
        } else {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            setExpoPushToken(token);
            await saveExpoPushToken(token);
          }
        }

        // Register background fetch task
        // await startBackgroundUpdate();
      }
    };

    initializeApp().catch((error) => {
      console.error('Failed to initialize app:', error);
    });

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);

  return (
    <View style={[styles.container]}>
      {/* map section */}
      <MapView
        style={styles.map}
        // mapType="satellite"
        initialRegion={{
          // penn coords
          latitude: 39.9522,
          longitude: -75.1932,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{ latitude: 39.9522, longitude: -75.1932 }}
          title="Van Pelt Library"
          description="where best spark team is working rn"
          onPress={(e) => handleMarkerPress({
            title: "Van Pelt Library",
            description: "where best spark team is working rn",
            longitude: 39.9522,
            latitude: -75.1932
          })}
        />
        <Marker
          coordinate={{ latitude: 39.9509, longitude: -75.1939 }}
          title="Houston Hall"
          description="This is where the ping pong table is"
          onPress={(e) => handleMarkerPress({
            title: "Houston Hall",
            description: "This is where the ping pong table is",
            longitude: 39.9509,
            latitude: -75.1939
          })}
        />
      </MapView>

      <PinBottomSheet pin={pin} ref={bottomSheetRef} />

    </View>
  );
};


async function registerForPushNotificationsAsync(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus === 'granted') {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    return token;
  } else {
    alert('Failed to get push token for push notification!');
    return null;
  }
}

const requestPermissions = async (): Promise<boolean> => {
  // Request foreground location permission
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.error('Foreground location permission not granted');
    return false;
  }

  // Request background location permission
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.error('Background location permission not granted');
    return false;
  }

  // Request notification permission
  const { status: notificationsStatus } = await Notifications.requestPermissionsAsync();
  if (notificationsStatus !== 'granted') {
    console.error('Notification permission not granted');
    return false;
  }

  return true;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //padding for weird iphone top bar thing
    //paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },

  header: {
    padding: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  map: {
    width: Dimensions.get('window').width,
    // uhh this is for my iphone, just hardcoded it for now but might be diff for other phoens
    height: Dimensions.get('window').height - 140,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});



export default HomeScreen;

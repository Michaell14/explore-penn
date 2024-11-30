import React, { useRef, useState, useEffect } from 'react';
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
import { startBackgroundUpdate } from '@/hooks/registerBackground';
import { PinData, fetchCurrentPins } from '@/api/eventPinApi';

interface LocationType {
  latitude: number;
  longitude: number;
}

const pins_data = [
  {
    id: "",
    header: "Hill College House",
    description: "Hill College House is a low-rise First Year Community located on the east side of Penn’s campus with convenient access to academic buildings, as well as Philadelphia’s 30th Street Station.",
    loc_description: "desc",
    org_id: "test",
    coords: [39.9530, -75.1907],
    start_time: 5,
    end_time: 5,
    photo: null,
    isActive: false,
  }
]


const HomeScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pins, setPins] = useState<PinData[]>(pins_data);
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const { signOut, user } = useAuth()
  const router = useRouter();
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true);

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

  // const getNearbyPins = async () => {
  //   if (!location) return;
  //   try {
  //     const response = await axios.post<PinData[]>(
  //       `${baseURL}/api/pins/location`,
  //       {
  //         radius: 0.0011,
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //       },
  //       { headers: { 'Content-Type': 'application/json' } }
  //     );
  //     setPins(response.data);
  //   } catch (e) {
  //     console.log('Error getting nearby pins:', e);
  //   }
  // };


  const loadPins = async () => {
    try {
      const currentPins = await fetchCurrentPins();
      console.log('Fetched pins:', currentPins);
      setPins(currentPins);
    } catch (error) {
      console.error('Error loading pins:', error);
    }
  };

  const handleMarkerPress = (pin: PinData) => {
    setSelectedPin(pin);
    handleOpenPress();
  };

  useEffect(() => {
    const initializeApp = async () => {
      await getLocation();
      await loadPins();

      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        // Initialize push notifications
        const storedToken = await getExpoPushToken();
        if (storedToken) {
          setExpoPushToken(storedToken);
          console.log(storedToken)
        } else {
          const token = await registerForPushNotificationsAsync();
          console.log(token)
          if (token) {
            setExpoPushToken(token);
            await saveExpoPushToken(token);
          }
        }

        // Register background fetch task
        await startBackgroundUpdate();
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
        {pins && pins.map((pin: PinData, index: React.Key | null | undefined) => (
          <Marker
            key={index}
            coordinate={{
              latitude: pin.coords[0], // Access latitude from coords array
              longitude: pin.coords[1], // Access longitude from coords array
            }}
            title={pin.header}
            onPress={() => handleMarkerPress(pin)}
            image={require('../../assets/images/map-pin.png')}
          />
        ))}

      </MapView>

      <PinBottomSheet pin={selectedPin} ref={bottomSheetRef} />

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
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});



export default HomeScreen;
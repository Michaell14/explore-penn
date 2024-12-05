import React, { useRef, useState, useEffect } from 'react';
import {
  View, KeyboardAvoidingView, StyleSheet, Dimensions, Platform, TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import PinBottomSheet from '@/components/map/PinBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
// import { startBackgroundUpdate } from '@/hooks/registerBackground';
import { PinData, fetchCurrentPins } from '@/api/eventPinApi';
import BouncingMarker from '@/components/map/BouncingMarker';
import { getFcmPushToken, registerForFcmNotifications } from '@/hooks/fcmToken';
import SearchBar from '../../components/map/SearchBar';
// import customMapStyle from '../../constants/MapStyle';
import { usePin } from '@/hooks/usePin';
import { getDistance } from 'geolib';

interface LocationType {
  latitude: number;
  longitude: number;
}

const pins_data: PinData[] = [
  {
    id: "1",
    header: "Hill College House",
    description: "Hill College House is a low-rise First Year Community located on the east side of Penn’s campus with convenient access to academic buildings, as well as Philadelphia’s 30th Street Station.",
    loc_description: "desc",
    org_id: "test",
    coords: [39.9530, -75.1907],
    start_time: 5,
    end_time: 5,
    photo: null,
    isActive: false,
  },
];

const HomeScreen: React.FC = () => {
  const { selectedPin, selectPin, clearPin } = usePin();

  const mapViewRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pins, setPins] = useState<PinData[]>(pins_data);
  const [clickedPinId, setClickedPinId] = useState<string | null>(null);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState<LocationType | null>(null);

  
  //for the search bar
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // will add later
  };

  // Fetch the user's current location
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

  // Fetch pins from the backend
  const loadPins = async () => {
    try {
      const currentPins = await fetchCurrentPins();
      console.log('Fetched pins:', currentPins);
      setPins(currentPins);
    } catch (error) {
      console.error('Error loading pins:', error);
    }
  };

  useEffect(() => {
    if (selectedPin) {
      console.log('Pin selected, triggering animation:', selectedPin.coords);
      handleOpenPress(selectedPin.coords[0], selectedPin.coords[1]);
    }
  }, [selectedPin]);

  const handleMarkerPress = (pin: PinData) => {
    //second click: open bottom sheet and zoom in
    if (clickedPinId === pin.id) {
      //update pindata hook
      selectPin(pin);
      setClickedPinId(null);
      handleOpenPress(pin.coords[0], pin.coords[1]);
    } else {
      setClickedPinId(pin.id || null);
    }
  };

  // Process pins: filter by distance and show notifications
  const processPins = async (pins: PinData[]) => {
    console.log('Processing pins:', pins);

    if (location) {
      const nearbyPins = pins.filter((pin) => {
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: pin.coords[0], longitude: pin.coords[1] }
        );
        return distance <= 2000; // Example: 1000 meters radius
      });

      // Display a notification for each nearby pin
      for (const pin of nearbyPins) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: pin.header,
            body: pin.loc_description,
            data: {
              id: pin.id,
              coords: pin.coords,
              header: pin.header,
              loc_description: pin.loc_description,
            },
          },
          trigger: null, // Immediate notification
        });
      }
    }
  };

  // Handle notifications
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      if (data && data.pins) {
        const pins = JSON.parse(data.pins);
        processPins(pins);
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data && data.pins) {
        const pins = JSON.parse(data.pins);
        processPins(pins);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [location]);

  useEffect(() => {
    const initializeApp = async () => {
      await getLocation();
      await loadPins();
  
      const storedToken = await getFcmPushToken();
      if (!storedToken) {
        const newToken = await registerForFcmNotifications();
        console.log('Registered FCM Token:', newToken);
      } else {
        console.log('Using stored FCM Token:', storedToken);
      }
    };
  
    initializeApp().catch((error) => {
      console.error('Failed to initialize app:', error);
    });
  }, []);
  
  // Close the bottom sheet
  const handleClosePress = () => bottomSheetRef.current?.close();

  // Open the bottom sheet and center the map on the pin
  const handleOpenPress = (latitude: number, longitude: number) => {
    bottomSheetRef.current?.snapToIndex(2);

    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: latitude - 0.0004,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        1000 // duration
      );
    } else {
      console.error('mapViewRef is undefined');
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Search Bar */}
          {/*<View className="p-4 mt-4">
            <SearchBar placeholder="Search for locations..." onSearch={handleSearch} />
          </View>*/}
          {/* Map Section */}
          <MapView
            ref={mapViewRef}
            style={styles.map}
            //needs developer acc or dev build
            // provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 39.9522,
              longitude: -75.1932,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            // customMapStyle={customMapStyle}
          >
            {pins.map((pin) => (
              <BouncingMarker
                key={pin.id}
                coordinate={{
                  latitude: pin.coords[0],
                  longitude: pin.coords[1],
                }}
                id={pin.id || ''}
                isSelected={clickedPinId === pin.id}
                onPress={() => handleMarkerPress(pin)}
                staticImageSource={require('../../assets/images/map-pin.png')}
                //will replace with better aftereffects gif
                gifImageSource={require('../../assets/images/map-pin.gif')}
                title={pin.header}
              />
            ))}
          </MapView>

          {/* Bottom Sheet Section */}
          <PinBottomSheet pin={selectedPin} ref={bottomSheetRef} />
        </View>
      </TouchableWithoutFeedback >
    </KeyboardAvoidingView >
  );
};

async function registerForPushNotificationsAsync(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (finalStatus !== 'granted') {
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
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.error('Foreground location permission not granted');
    return false;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.error('Background location permission not granted');
    return false;
  }

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
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default HomeScreen;

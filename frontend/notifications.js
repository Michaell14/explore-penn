// import * as Notifications from 'expo-notifications';
// import * as Location from 'expo-location';
// import * as TaskManager from 'expo-task-manager';

// // Task name for location updates
// const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

// // Request permissions for notifications and location
// export async function requestPermissions() {
//   const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
//   const { status: backgroundLocationStatus } = await Location.requestBackgroundPermissionsAsync();
  
//   if (locationStatus !== 'granted' || backgroundLocationStatus !== 'granted') {
//     alert('Permission to access location was denied');
//     return;
//   }

//   const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
//   if (notificationStatus !== 'granted') {
//     alert('Permission to send notifications was denied');
//     return;
//   }
// }

// // Configure notifications handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//     if (error) {
//       console.error('Error with background location task:', error);
//       return;
//     }
  
//     if (data) {
//       const { locations } = data; // Array of location objects
//       const location = locations[0]; // Get the latest location
//       console.log('Current Location:', location);
  
//       // Check if user is in a specific area
//       if (location && checkIfInTargetArea(location.coords)) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: 'You’re here!',
//             body: 'You’ve arrived at your target location.',
//           },
//           trigger: null, // Send immediately
//         });
//       }
//     }
//   });
  
//   // Function to check if user is in a specific area
//   function checkIfInTargetArea(coords) {
//     const targetLatitude = 37.7749;
//     const targetLongitude = -122.4194;
//     const radius = 0.01; // Approx. 1km
  
//     const distance = Math.sqrt(
//       Math.pow(coords.latitude - targetLatitude, 2) +
//       Math.pow(coords.longitude - targetLongitude, 2)
//     );
  
//     return distance <= radius;
//   }
  
//   export async function startLocationTracking() {
//     const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  
//     if (!isTaskDefined) {
//       console.log('Background task is not defined');
//       return;
//     }
  
//     const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
//     if (!hasStarted) {
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.High,
//         timeInterval: 10000, // Every 10 seconds
//         distanceInterval: 0, // Update regardless of distance
//         showsBackgroundLocationIndicator: true, // For iOS
//         foregroundService: {
//           notificationTitle: 'Tracking Location',
//           notificationBody: 'Your location is being used in the background.',
//         },
//       });
//     }
//   }
  
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure your Firebase setup is imported here

// Request permissions for notifications and location
export async function requestPermissions() {
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  if (locationStatus !== 'granted') {
    alert('Permission to access location was denied');
    return;
  }

  const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
  if (notificationStatus !== 'granted') {
    alert('Permission to send notifications was denied');
    return;
  }
}

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Report location to Firebase Firestore
async function reportLocationToFirestore(location) {
  try {
    const userId = await AsyncStorage.getItem('userId'); // Retrieve user ID from storage
    if (!userId) {
      console.warn('No user ID found in AsyncStorage');
      return;
    }

    const userDoc = doc(collection(db, 'users'), userId);
    await setDoc(userDoc, {
      lastLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      },
    }, { merge: true });
    console.log('Location updated in Firestore');
  } catch (error) {
    console.error('Error updating location in Firestore:', error);
  }
}

// Start location tracking
export async function startLocationTracking() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Location permission not granted');
    return;
  }

  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // Send location every 30 seconds
      distanceInterval: 50, // Minimum distance change in meters
    },
    async (location) => {
      console.log('Location:', location);
      await reportLocationToFirestore(location);
    }
  );
}

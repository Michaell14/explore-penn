import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// Task name for location updates
const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

// Request permissions for notifications and location
export async function requestPermissions() {
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: backgroundLocationStatus } = await Location.requestBackgroundPermissionsAsync();
  
  if (locationStatus !== 'granted' || backgroundLocationStatus !== 'granted') {
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

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('Error with background location task:', error);
      return;
    }
  
    if (data) {
      const { locations } = data; // Array of location objects
      const location = locations[0]; // Get the latest location
      console.log('Current Location:', location);
  
      // Check if user is in a specific area
      if (location && checkIfInTargetArea(location.coords)) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'You’re here!',
            body: 'You’ve arrived at your target location.',
          },
          trigger: null, // Send immediately
        });
      }
    }
  });
  
  // Function to check if user is in a specific area
  function checkIfInTargetArea(coords) {
    const targetLatitude = 37.7749;
    const targetLongitude = -122.4194;
    const radius = 0.01; // Approx. 1km
  
    const distance = Math.sqrt(
      Math.pow(coords.latitude - targetLatitude, 2) +
      Math.pow(coords.longitude - targetLongitude, 2)
    );
  
    return distance <= radius;
  }
  
  export async function startLocationTracking() {
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  
    if (!isTaskDefined) {
      console.log('Background task is not defined');
      return;
    }
  
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Every 10 seconds
        distanceInterval: 0, // Update regardless of distance
        showsBackgroundLocationIndicator: true, // For iOS
        foregroundService: {
          notificationTitle: 'Tracking Location',
          notificationBody: 'Your location is being used in the background.',
        },
      });
    }
  }
  
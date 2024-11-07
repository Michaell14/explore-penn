import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { notifyUserOfNearbyPins } from './notifyUsers';
import { getExpoPushToken } from './pushToken';
import axios from 'axios';
import { baseURL } from '@/config';


const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// Define the background fetch task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Background fetch task executed at: ${new Date(now).toISOString()}`);

  try {
    // Request background location permission
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Background location permission not granted');
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    console.log(location)

    // Fetch nearby pins
    const response = await axios.post(
      `${baseURL}/api/pins/location`,
      { radius: 0.0011, latitude, longitude },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const pins = response.data;
    console.log('Nearby pins fetched in background:', pins);

    // Notify user if there are nearby pins
    if (pins.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'You have nearby pins!',
          body: `There are ${pins.length} pins near you.`,
          data: { pins },
        },
        trigger: null, // Send the notification immediately
      });
    }

    // Indicate successful fetch
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Error in background fetch task:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});


const startBackgroundUpdate = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

  if (status === BackgroundFetch.BackgroundFetchStatus.Available && !isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background fetch task registered');
  } else {
    console.error('Background fetch is not available or already registered');
  }
}
export { startBackgroundUpdate };
import axios from 'axios'
import { baseURL } from '../config';
export const notifyUserOfNearbyPins = async (expoPushToken: string, latitude: number, longitude: number, radius: number) => {
    console.log(expoPushToken, latitude, longitude, radius);
    try {
      const response = await axios.post(`${baseURL}/api/notify`, {
        expoPushToken,
        latitude,
        longitude, 
        radius
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(response.data.message); // Success message from backend
    } catch (error) {
      console.error('Error notifying user of nearby pins:', error);
    }
  };
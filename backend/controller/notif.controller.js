import {auth} from 'google-auth-library';
import axios from 'axios'
import fs from 'fs'
import { getNearbyPins } from './eventPin.controller.js';
import { notifServiceAccount } from '../server.js';

const sendPushNotification = async (expoPushToken, title, body) => {
    try {
        await axios.post('https://exp.host/--/api/v2/push/send', {
          to: expoPushToken,
          sound: 'default',
          title: title,
          body: body,
        });
        console.log('Notification sent successfully');
      } catch (error) {
        console.error('Error sending notification:', error);
      }
};


export const notify = async(req, res) => {
    const { expoPushToken, latitude, longitude, radius } = req.body; // Receive user's push token and location from frontend
  
    try {
      // Get nearby pins based on user's location
      const nearbyPins = await getNearbyPins(latitude, longitude, radius);
  
      if (nearbyPins.length > 0) {
        // Send a push notification if there are nearby pins
        await sendPushNotification(expoPushToken, 'New pins near you!', 'There are new pins near your location!');
      }

      res.status(200).json({ success: true, message: 'Notification sent if nearby pins found.' });
    } catch (error) {
      console.error('Error in /notify endpoint:', error);
      res.status(500).json({ success: false, error: 'Failed to send notification' });
    }
  }
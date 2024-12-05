import admin from 'firebase-admin';
import 'dotenv/config';

// Ensure Firebase Admin SDK is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID.replace(/\\n/g, '\n'),
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    }),
  });
  console.log('Firebase Admin initialized successfully');
}

export const getActivePins = async () => {
  try {
    const eventPinRef = admin.firestore().collection('eventPins');
    const snapshot = await eventPinRef.where('isActive', '==', true).get();

    if (snapshot.empty) {
      console.log('No active pins found.');
      return [];
    }

    const activePins = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return activePins;
  } catch (error) {
    console.error('Error fetching active pins:', error.message);
    throw new Error('Failed to fetch active pins');
  }
};

// Function to send push notifications
export const sendPushNotificationWithData = async (deviceToken, title, body, pins) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      data: {
        pins: JSON.stringify(pins), // Pins as JSON string
      },
    };

    await admin.messaging().send(message);
    console.log(`Notification sent to token: ${deviceToken}`);
  } catch (error) {
    if (error.code === 'messaging/registration-token-not-registered') {
      console.error('Token is no longer valid. Remove it from your database.');
      // Logic to remove the invalid token
    } else {
      console.error('Error sending notification:', error.message);
    }
  }
};

// Periodic notification sender
export const startPeriodicNotifications = async () => {
  setInterval(async () => {
    console.log('Fetching device tokens and sending notifications...');
    try {
      // Example hardcoded token (replace with dynamic fetching from Firestore or DB)
      const deviceTokens = [
        'dnzfA1AAm0vRjnmTUE5t7A:APA91bGIO6XOGWHYJFSd5LEbg3S-_we6u5HIXHYk5cioa2oTeSn_7hf1aKul94TuBma8vRUxO7V7l10wrQwMRse0nr-ieIK9F-aTvI72mEyXFdLdElyCQvI',
      ];
      const allPins = await getActivePins();
      console.log('All pins:', allPins);
      const activePins = allPins.filter((pin) => pin.isActive).map((pin) => ({
        id: pin.id,
        coords: pin.coords,
        header: pin.header,
        loc_description: pin.loc_description,
      }));

      if (activePins.length > 0) {
        for (const deviceToken of deviceTokens) {
          await sendPushNotificationWithData(
            deviceToken,
            'Nearby Active Pins',
            `There are ${activePins.length} active pins near you.`,
            activePins
          );
        }
      } else {
        console.log('No active pins to notify about.');
      }
    } catch (error) {
      console.error('Error during periodic notifications:', error.message);
    }
  }, 20000); // Every 20 seconds
};

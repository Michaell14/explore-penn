import { db } from "../server.js";

/**
 * Function to set up a Firestore listener for real-time updates on open/close status of locations.
 * @param {function} callback - Function to call when the snapshot updates.
 */
export const listenForOpenStatusUpdates = (callback) => {
  db.collection('locations').onSnapshot((snapshot) => {
    const updatedLocations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(updatedLocations);
  }, (error) => {
    console.error('Error listening for updates:', error);
  });
};

/**
 * Utility function to update the `isOpen` field in Firestore documents periodically.
 */
export const updateCurrentPins = async () => {
  const currentTime = new Date(); // Get the current date and time

  try {
    // Fetch only active pins from Firestore
    const eventPinsSnapshot = await db.collection('eventPins').where('isActive', '==', true).get();

    eventPinsSnapshot.forEach(async (doc) => {
      const pinsData = doc.data();
      const endTime = pinsData.end_time?.toDate(); // Convert Firestore Timestamp to JavaScript Date

      // Determine the new `isActive` status
      let isActive = true;
      if (endTime && currentTime > endTime) {
        isActive = false; // Pin should be marked inactive if `end_time` has passed
      }

      // Update `isActive` status only if it has changed
      if (pinsData.isActive !== isActive) {
        await doc.ref.update({ isActive });
      }
    });

    console.log('Async: Active status updated for all pins.');
  } catch (error) {
    console.error('Error updating active pins:', error);
  }
};


  
  
  export const updateHistoricalPins = async () => {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1); // Set the date to one month ago
  
    try {
      // Fetch only active pins that have a start_time
      const eventPinsSnapshot = await db.collection('eventPins').where('isActive', '==', true).get();
      
      eventPinsSnapshot.forEach(async (doc) => {
        const pinsData = doc.data();
        const isActive = pinsData.isActive || false;
        const startTime = pinsData.start_time.toDate(); // Firestore Timestamp to JavaScript Date
  
        // Check if the pin is older than one month
        if (isActive && startTime < oneMonthAgo) {
          // If pin is older than one month, delete it
          try {
            await doc.ref.delete();
            console.log(`Pin with ID ${doc.id} has been deleted due to expiration.`);
          } catch (error) {
            console.error(`Error deleting pin with ID ${doc.id}:`, error);
          }
        }
      });
  
      console.log('asyc: checked all pins for expiration.');
    } catch (error) {
      console.error('Error updating historical pins:', error);
    }
  };
  
/**
 * Function to start a periodic update of the `isOpen` field.
 * @param {number} interval - The interval in milliseconds to run the updates (default is 5 minutes).
 */
export const startPinUpdates = (interval = 300000) => {
    // Update current pins at the specified interval (default is every 5 minutes)
    updateCurrentPins();
    
    // Update historical pins once every day (86,400,000 ms = 24 hours)
    updateHistoricalPins(); // Call immediately when the service starts
    
    setInterval(() => {
      updateCurrentPins();
    }, interval);
  
    // Set an interval for historical pins to run once per day
    setInterval(() => {
      updateHistoricalPins();
    }, 86400000); // 86,400,000 ms = 24 hours
  };
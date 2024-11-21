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
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    const currentTime = parseInt(new Date().toTimeString().slice(0, 5).replace(':', ''), 10); // Convert current time to a number format HHMM
    
    try {
      // Fetch only active pins from Firestore
      const eventPinsSnapshot = await db.collection('eventPins').where('isActive', '==', true).get();
      
      eventPinsSnapshot.forEach(async (doc) => {
        const pinsData = doc.data();
        const isActive = pinsData.isActive || false;
  
        // Skip inactive pins
        if (!isActive) {
          return;
        }
  
        // Check if there are no hours defined (empty array)
        if (pinsData.hours?.length === 0) {
          // If no hours are defined, set `isOpen` to true and update if necessary
          if (pinsData.isOpen !== true) {
            await doc.ref.update({ isOpen: true });
          }
          return; // Skip further processing for this location
        }
  
        // Find today's schedule
        const todaySchedule = pinsData.hours.find(day => day.day === currentDay);
        let isOpen = false;
    
        // Check if `todaySchedule.hours` is a valid array
        if (todaySchedule && Array.isArray(todaySchedule.hours)) {
          for (const timeRange of todaySchedule.hours) {
            const { open, close } = timeRange;
    
            // Ensure `open` and `close` exist and are numbers
            if (typeof open === 'number' && typeof close === 'number') {
              // Check if current time is between open and close time (inclusive of close time)
              if (currentTime >= open && currentTime <= close) {
                isOpen = true;
                break; // No need to check further if already open
              }
            }
          }
        }
  
        // Update `isOpen` status only if changed
        if (pinsData.isOpen !== isOpen) {
          await doc.ref.update({ isOpen });
        }
      });
  
      console.log('Open status updated for all locations.');
    } catch (error) {
      console.error('Error updating open status:', error);
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
  
      console.log('Checked all pins for expiration.');
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
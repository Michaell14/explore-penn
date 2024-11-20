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
      const locationsSnapshot = await db.collection('locations').get();
      locationsSnapshot.forEach(async (doc) => {
        const locationData = doc.data();
        const hours = locationData.hours || [];
  
        // Check if there are no hours defined (empty array)
        if (hours.length === 0) {
          // If no hours are defined, set `isOpen` to true and update if necessary
          if (locationData.isOpen !== true) {
            await doc.ref.update({ isOpen: true });
          }
          return; // Skip further processing for this location
        }
  
        // Find today's schedule
        const todaySchedule = hours.find(day => day.day === currentDay);
        let isOpen = false;
  
        // Check if `todaySchedule.hours` is a valid array
        if (todaySchedule && Array.isArray(todaySchedule.hours)) {
          for (const timeRange of todaySchedule.hours) {
            const { open, close } = timeRange;
  
            // Ensure `open` and `close` exist and are numbers
            if (typeof open === 'number' && typeof close === 'number') {
              if (currentTime >= open && currentTime <= close) {
                isOpen = true;
                break;
              }
            }
          }
        }
  
        // Update `isOpen` status only if changed
        if (locationData.isOpen !== isOpen) {
          await doc.ref.update({ isOpen });
        }
      });
  
      console.log('Open status updated for all locations.');
    } catch (error) {
      console.error('Error updating open status:', error);
    }
  };
  
  export const updateHistoricalPins = async () => {
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    const currentTime = parseInt(new Date().toTimeString().slice(0, 5).replace(':', ''), 10); // Convert current time to a number format HHMM
  
    try {
      const locationsSnapshot = await db.collection('locations').get();
      locationsSnapshot.forEach(async (doc) => {
        const locationData = doc.data();
        const hours = locationData.hours || [];
  
        // Check if there are no hours defined (empty array)
        if (hours.length === 0) {
          // If no hours are defined, set `isOpen` to true and update if necessary
          if (locationData.isOpen !== true) {
            await doc.ref.update({ isOpen: true });
          }
          return; // Skip further processing for this location
        }
  
        // Find today's schedule
        const todaySchedule = hours.find(day => day.day === currentDay);
        let isOpen = false;
  
        // Check if `todaySchedule.hours` is a valid array
        if (todaySchedule && Array.isArray(todaySchedule.hours)) {
          for (const timeRange of todaySchedule.hours) {
            const { open, close } = timeRange;
  
            // Ensure `open` and `close` exist and are numbers
            if (typeof open === 'number' && typeof close === 'number') {
              if (currentTime >= open && currentTime <= close) {
                isOpen = true;
                break;
              }
            }
          }
        }
  
        // Update `isOpen` status only if changed
        if (locationData.isOpen !== isOpen) {
          await doc.ref.update({ isOpen });
        }
      });
  
      console.log('Open status updated for all locations.');
    } catch (error) {
      console.error('Error updating open status:', error);
    }
  };
   
  
/**
 * Function to start a periodic update of the `isOpen` field.
 * @param {number} interval - The interval in milliseconds to run the updates (default is 5 minutes).
 */
export const startPeriodicUpdates = (interval = 300000) => {
  updateOpenStatus();
  setInterval(updateOpenStatus, interval);
};

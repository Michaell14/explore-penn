import { db } from "../server.js";
import admin from 'firebase-admin';
import { listenForOpenStatusUpdates } from "../utils/openingTimeUpdates.js";

export const getLocation = async (req, res) => {
  const { location_id } = req.params;

  if (!location_id) {
    return res.status(400).json({ error: "Location ID is required." });
  }

  try {
    const locationRef = db.collection('locations').doc(location_id);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({ message: "Location not found." });
    }

    const locationData = locationDoc.data();
    res.status(200).json({ location: locationData });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to fetch location." });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const locationsSnapshot = await db.collection('locations').get();
    const locations = locationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ locations });
  } catch (error) {
    console.error("Error fetching all locations:", error);
    res.status(500).json({ error: "Failed to fetch locations." });
  }
};

export const getRandomFunFact = async (req, res) => {
  const { location_id } = req.params;

  if (!location_id) {
    return res.status(400).json({ error: "Location ID is required." });
  }

  try {
    const locationRef = db.collection('locations').doc(location_id);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({ message: "Location not found." });
    }

    const locationData = locationDoc.data();
    const factsArray = locationData.facts || [];
    const randomFact = getRandomFact(factsArray);

    res.status(200).json({ randomFact });
  } catch (error) {
    console.error("Error fetching random fun fact:", error);
    res.status(500).json({ error: "Failed to fetch random fun fact." });
  }
};

const getRandomFact = (factsArray) => {
  if (factsArray.length === 0) {
    return "No fun facts available for this location.";
  }
  const randomIndex = Math.floor(Math.random() * factsArray.length);
  return factsArray[randomIndex];
};

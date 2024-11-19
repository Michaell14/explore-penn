import { db } from "../server.js";
import admin from "firebase-admin";

// =====================
// Utility Functions
// =====================

/**
 * Calculate the Euclidean distance between a pin and a given location.
 */
const calculateDistance = (pin, latitude, longitude) => {
  const xDist2 = Math.pow(pin.coordinate.lat - latitude, 2);
  const yDist2 = Math.pow(pin.coordinate.lng - longitude, 2);
  return Math.sqrt(xDist2 + yDist2);
};

// =====================
// Pins APIs
// =====================

/**
 * Get all pins in the database.
 * Use for displaying all pins on a map.
 * @route GET /pins
 */
export const getPins = async (req, res) => {
  try {
    const eventPinRef = db.collection("eventPins");
    const snapshot = await eventPinRef.get();
    const pins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(pins);
  } catch (error) {
    console.error("Error fetching pins:", error);
    res.status(500).json({ error: "Failed to fetch pins" });
  }
};

/**
 * Get pins within a specific location radius.
 * Use for location-based filtering.
 * @route POST /pins/location
 * @body { latitude: number, longitude: number, radius: number }
 */
export const getPinsByLocation = async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  try {
    const eventPinRef = db.collection("eventPins");
    const snapshot = await eventPinRef.get();
    const pinsWithinRadius = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((pin) => calculateDistance(pin, latitude, longitude) <= radius);
    res.status(200).json(pinsWithinRadius);
  } catch (error) {
    console.error("Error fetching pins by location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get historical pins posted before a specific date.
 * @route GET /pins/historical
 * @query beforeDate: string (ISO date format)
 */
export const getHistoricalPins = async (req, res) => {
  const { beforeDate } = req.query;
  try {
    const eventPinRef = db.collection("eventPins");
    const query = eventPinRef.where(
      "time_posted",
      "<",
      admin.firestore.Timestamp.fromDate(new Date(beforeDate))
    );
    const snapshot = await query.get();
    const pins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(pins);
  } catch (error) {
    console.error("Error fetching historical pins:", error);
    res.status(500).json({ error: "Failed to fetch historical pins" });
  }
};

/**
 * Get details of a specific pin.
 * @route GET /pins/:pin_id
 */
export const getPin = async (req, res) => {
  const { pin_id } = req.params;
  try {
    const eventPinRef = db.collection("eventPins");
    const pinDoc = await eventPinRef.doc(pin_id).get();
    if (!pinDoc.exists) {
      return res.status(404).json({ error: "Pin not found" });
    }

    const pinData = pinDoc.data();
    const orgDoc = await db.collection("organizations").doc(pinData.org_id).get();

    if (!orgDoc.exists) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json({
      pin: { ...pinData, pin_id },
      user: orgDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching pin details:", error);
    res.status(500).json({ error: "Failed to fetch pin details" });
  }
};

/**
 * Add a new pin to the database.
 * @route POST /pins
 * @body { description, loc_description, org_id, coordinate, start_time, end_time, photo }
 */
export const addPin = async (req, res) => {
  const { description, loc_description, org_id, coordinate, start_time, end_time, photo } = req.body;

  if (!description || !org_id || !start_time || !end_time || !coordinate?.lat || !coordinate?.lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const eventPinRef = db.collection("eventPins");
    const newPin = {
      description,
      org_id,
      coords: [coordinate.lat, coordinate.lng],
      start_time: admin.firestore.Timestamp.fromDate(new Date(start_time)),
      end_time: admin.firestore.Timestamp.fromDate(new Date(end_time)),
      time_posted: admin.firestore.FieldValue.serverTimestamp(),
      loc_description,
      photo,
    };

    const pinRef = await eventPinRef.add(newPin);
    res.status(200).json({ message: "Pin successfully added", pinId: pinRef.id });
  } catch (error) {
    console.error("Error adding pin:", error);
    res.status(500).json({ error: "Failed to add pin" });
  }
};

/**
 * Delete a pin and all its associated posts.
 * @route DELETE /pins/:pin_id
 */
export const deletePin = async (req, res) => {
  const { pin_id } = req.params;
  try {
    const eventPinRef = db.collection("eventPins");
    const pinRef = eventPinRef.doc(pin_id);
    const pinDoc = await pinRef.get();
    if (!pinDoc.exists) {
      return res.status(404).json({ error: "Pin not found" });
    }

    const postsQuery = await db.collection("posts").where("pin_id", "==", pin_id).get();
    const batch = db.batch();

    postsQuery.docs.forEach((post) => batch.delete(post.ref));
    batch.delete(pinRef);
    await batch.commit();

    res.status(200).json({ message: "Pin and associated posts successfully deleted" });
  } catch (error) {
    console.error("Error deleting pin:", error);
    res.status(500).json({ error: "Failed to delete pin" });
  }
};


// =====================
// Posts APIs
// =====================

/**
 * Get posts for a specific pin.
 * Use for retrieving all posts associated with a pin.
 * @route GET /pins/:pin_id/posts
 */
export const getPosts = async (req, res) => {
    const { pin_id } = req.params;
  
    try {
      const postsRef = db.collection("eventPins").doc(pin_id).collection("posts");
      const postsSnapshot = await postsRef.get();
      const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts for pin:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  };
  
  
/**
 * Add a post to a specific pin.
 * @route POST /pins/:pin_id/posts
 */
export const addPost = async (req, res) => {
    const { pin_id } = req.params;
    const { x, y, rotation, words, picture } = req.body;
  
    if (!x || !y || !rotation || !words) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const postsRef = db.collection("eventPins").doc(pin_id).collection("posts");
      const newPost = {
        x,
        y,
        rotation,
        words,
        picture,
        time_posted: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      const postRef = await postsRef.add(newPost);
      res.status(200).json({ message: "Post successfully added", postId: postRef.id });
    } catch (error) {
      console.error("Error adding post:", error);
      res.status(500).json({ error: "Failed to add post" });
    }
  };
  

/**
 * Move a post by updating its coordinates.
 * @route POST /pins/:pin_id/posts/move
 */
export const movePost = async (req, res) => {
    const { pin_id, post_id, x, y, rotation } = req.body;
  
    if (!pin_id || !post_id || !x || !y || !rotation) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const postRef = db.collection("eventPins").doc(pin_id).collection("posts").doc(post_id);
      const postDoc = await postRef.get();
  
      if (!postDoc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      await postRef.update({ x, y, rotation });
      res.status(200).json({ message: "Post successfully moved" });
    } catch (error) {
      console.error("Error moving post:", error);
      res.status(500).json({ error: "Failed to move post" });
    }
  };
  

/**
 * Delete a specific post.
 * Use for removing a post from a specific pin.
 * @route DELETE /pins/:pin_id/posts/:post_id
 */
export const deletePost = async (req, res) => {
    const { pin_id, post_id } = req.params;
  
    try {
      const postRef = db.collection("eventPins").doc(pin_id).collection("posts").doc(post_id);
      const postDoc = await postRef.get();
  
      if (!postDoc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      await postRef.delete();
      res.status(200).json({ message: "Post successfully deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  };
  
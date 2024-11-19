import express from 'express';
import {
  getPins,
  getHistoricalPins,
  addPin,
  getPin,
  getPosts,
  addPost,
  movePost,
  getPinsByLocation,
  deletePost,
  deletePin
} from "../controller/eventPin.controller.js";

const router = express.Router();

// Main routes
router.get('/', getPins); // Fetch all pins
router.get('/historical', getHistoricalPins); // Fetch historical pins
router.post('/', addPin); // Add a new pin
router.get('/:pin_id', getPin); // Get details for a specific pin
router.get('/:pin_id/posts', getPosts); // Get posts for a pin
router.post('/:pin_id/posts', addPost); // Add a post to a pin
router.post('/:pin_id/posts/move', movePost); // Move a post (adjust its coordinates)
router.post('/location', getPinsByLocation); // Fetch pins by location
router.delete('/:pin_id/posts/:post_id', deletePost); // Delete a post from a pin
router.delete('/:pin_id', deletePin); // Delete a pin

export default router;


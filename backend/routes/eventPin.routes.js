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
  deletePin,

  getStickers,
  addSticker,
  deleteSticker,
  moveSticker
} from "../controller/eventPin.controller.js";

const router = express.Router();

// Main routes
router.get('/', getPins); // all current pins
router.get('/historical', getHistoricalPins); // pins in last month

router.post('/', addPin);
router.delete('/:pin_id', deletePin);
router.get('/:pin_id', getPin);
router.post('/location', getPinsByLocation);

/*Posts: subcollection inside each pin*/
router.get('/:pin_id/posts', getPosts);
router.post('/:pin_id/posts', addPost);
router.post('/:pin_id/posts/move', movePost);
router.delete('/:pin_id/posts/:post_id', deletePost);

/*Stickers: subcollection inside each pin, can store separately*/
router.get('/:pin_id/stickers', getStickers);
router.post('/:pin_id/stickers', addSticker);
router.post('/:pin_id/stickers/move', moveSticker);
router.delete('/:pin_id/stickers/:sticker_id', deleteSticker);

export default router;

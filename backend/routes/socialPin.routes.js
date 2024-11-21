import express from 'express';
import { getPinsByLocation, getPin, addPin } from "../controller/socialPin.controller.js";

const router = express.Router();

// Main routes
router.post('/nearby', getPinsByLocation); // pins in last month

router.post('/', addPin);
router.get('/:pin_id', getPin);

export default router;


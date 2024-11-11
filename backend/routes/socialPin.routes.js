import express from 'express';
import {
    getPinsByLocation,
    getPin,
    addPin
} from '../controllers/socialPinsController.js';

const router = express.Router();

router.post('/location', getPinsByLocation);
router.get('/:pin_id', getPin);
router.post('/', addPin);

export default router;

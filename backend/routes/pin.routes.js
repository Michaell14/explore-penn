import express from 'express'
import { getPin, addPin, getTopPins, getReactions, postReaction } from "../controller/pin.controller.js"

const router = express.Router();

//router.post('/', ()=>{});
router.get('/topPins', getTopPins);
router.post('/postPin', addPin);
router.get('/:pin_id', getPin);
router.get('/:pin_id/getReactions', getReactions);
router.post('/:pin_id/postReactions', postReaction);

export default router;

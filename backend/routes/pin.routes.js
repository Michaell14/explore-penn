import express from 'express'
import { getPin, getTopPins, getReactions, postReaction } from "../controller/pin.controller.js"

const router = express.Router();

//router.post('/', ()=>{});
router.get('/top-pins', getTopPins);
// router.get('/:pin_id', getPin);
// router.get('/:pin_id/getReactions', getReactions);
// router.post('/:pin_id/postReactions', postReaction);

export default router;

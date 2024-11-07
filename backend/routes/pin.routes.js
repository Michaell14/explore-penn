import express from 'express'
import { getPinsByLocation } from '../controller/pin.controller.js';

const router = express.Router();

router.post('/', ()=>{});
router.post('/location', getPinsByLocation);


export default router;

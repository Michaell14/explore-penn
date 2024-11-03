import express from 'express'
import { getLocation } from "../controller/locations.controller.js"

const router = express.Router();
router.get('/getLocation/:location_id', getLocation);


export default router;

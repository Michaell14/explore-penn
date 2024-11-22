import express from 'express';
import { getLocation, getRandomFunFact, getAllLocations } from "../controller/locations.controller.js";

const router = express.Router();
router.get('/getLocation/:location_id', getLocation);
router.get('/getRandomFunFact/:location_id', getRandomFunFact);
router.get('/getAllLocations', getAllLocations);

export default router;

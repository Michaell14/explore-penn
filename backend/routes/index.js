import express from 'express'
import userRoutes from './user.routes.js'
import orgRoutes from './organization.routes.js';
import eventPinsRoutes from './eventPin.routes.js';
import socialPinsRoutes from './socialPin.routes.js';
import { sendPushNotificationWithData } from '../controller/notif.controller.js'
import locRoutes from './locations.routes.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/org', orgRoutes);
router.use('/eventPins', eventPinsRoutes);
router.use('/socialPins', socialPinsRoutes);
router.post('/notify', sendPushNotificationWithData);
router.use('/loc', locRoutes);

export default router;


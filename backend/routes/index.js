import express from 'express'
import userRoutes from './user.routes.js'
import socialPinsRoutes from './routes/socialPinsRoutes.js';
import eventPinsRoutes from './routes/eventPinsRoutes.js';
import { notify } from '../controller/notif.controller.js'
import locRoutes from './locations.routes.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/api/socialPins', socialPinsRoutes);
router.use('/api/eventPins', eventPinsRoutes);
router.post('/notify', notify);
router.use('/loc', locRoutes);

export default router;


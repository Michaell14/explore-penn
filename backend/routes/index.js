import express from 'express'
import userRoutes from './user.routes.js'
import pinRoutes from './pin.routes.js'
import { notify } from '../controller/notif.controller.js'
import locRoutes from './locations.routes.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/pins', pinRoutes);
router.post('/notify', notify);
router.use('/loc', locRoutes);

export default router;


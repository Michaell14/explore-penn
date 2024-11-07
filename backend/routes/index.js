import express from 'express'
import userRoutes from './user.routes.js'
import pinRoutes from './pin.routes.js'
import { notify } from '../controller/notif.controller.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/pins', pinRoutes);
router.post('/notify', notify);

export default router;


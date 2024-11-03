import express from 'express'
import userRoutes from './user.routes.js'
import pinRoutes from './pin.routes.js'
import locRoutes from './locations.routes.js'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/pins', pinRoutes);
router.use('/loc', locRoutes);

export default router;


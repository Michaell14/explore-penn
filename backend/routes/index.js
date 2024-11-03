import express from 'express'
import userRoutes from './user.routes.js'
import pinRoutes from './pin.routes.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.send("hello hello hello");
});

router.use('/users', userRoutes);
router.use('/pins', pinRoutes);

export default router;


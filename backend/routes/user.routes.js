import express from 'express'
import {createUser} from '../controller/user.controller.js'

const router = express.Router();
router.post('/register', createUser);
// router.post('/login', userController.loginUser);
// router.get('/profile/:id', userController.getUserProfile);

export default router;

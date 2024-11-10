import express from 'express'
import { createUser, getMyPosts, getReactedPosts, getTopPins } from '../controller/user.controller.js'

const router = express.Router();
router.post('/register', createUser);
router.get('/myPosts/:u_id', getMyPosts);
router.get('/myReactions/:u_id', getReactedPosts);
router.get('/myTopPosts/:u_id', getTopPins);
// router.post('/login', userController.loginUser);
// router.get('/profile/:id', userController.getUserProfile);


export default router;
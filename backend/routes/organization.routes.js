import express from 'express'
import { createOrg, getOrgPosts } from '../controller/organization.controller.js'

const router = express.Router();
router.post('/register', createOrg);
router.get('/orgPosts/:o_id', getOrgPosts);

export default router;

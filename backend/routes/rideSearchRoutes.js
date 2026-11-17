import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { searchRides } from '../controllers/rideSearchController.js';

const router = express.Router();


router.get('/search', verifyToken, searchRides);

export default router;
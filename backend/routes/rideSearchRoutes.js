import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { searchRides } from '../controllers/rideSearchController.js';

const router = express.Router();

// Closed community: only logged-in DIU members can browse rides.
router.get('/search', verifyToken, searchRides);

export default router;

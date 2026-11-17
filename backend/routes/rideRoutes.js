import express from 'express';
import {
  createRide,
  getMyPublishedRides,
  updateRideStatus,
} from '../controllers/rideController.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('driver'), createRide);
router.get('/my', verifyToken, authorizeRoles('driver'), getMyPublishedRides);
router.patch('/:rideId/status', verifyToken, authorizeRoles('driver'), updateRideStatus);

export default router;

import express from 'express';
import {
  cancelRide,
  createRide,
  getMyPublishedRides,
  updateRideStatus,
} from '../controllers/rideController.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create ride (base and /create alias)
router.post('/', verifyToken, authorizeRoles('driver'), createRide);
router.post('/create', verifyToken, authorizeRoles('driver'), createRide);

// Get my published rides (base and /my-rides alias)
router.get('/my', verifyToken, authorizeRoles('driver'), getMyPublishedRides);
router.get('/my-rides', verifyToken, authorizeRoles('driver'), getMyPublishedRides);

// Update ride status (PATCH and PUT)
router.patch('/:rideId/status', verifyToken, authorizeRoles('driver'), updateRideStatus);
router.put('/:rideId/status', verifyToken, authorizeRoles('driver'), updateRideStatus);

// Cancel ride (PUT and PATCH)
router.put('/:rideId/cancel', verifyToken, authorizeRoles('driver'), cancelRide);
router.patch('/:rideId/cancel', verifyToken, authorizeRoles('driver'), cancelRide);

export default router;

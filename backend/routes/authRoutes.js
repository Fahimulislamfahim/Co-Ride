import express from 'express';
import { getDriverProfile, registerUser, loginUser } from '../controllers/authController.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';
import { uploadLicenseDocument } from '../middleware/licenseUploadMiddleware.js';

const router = express.Router();

router.post('/register', uploadLicenseDocument, registerUser);
router.post('/login', loginUser);
router.get('/driver-profile', verifyToken, authorizeRoles('driver'), getDriverProfile);


router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
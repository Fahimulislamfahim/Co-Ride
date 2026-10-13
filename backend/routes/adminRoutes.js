import express from 'express';
import { getLicenseDocument, getPendingVerifications, updateVerificationStatus } from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/pending', getPendingVerifications);
router.get('/license/:userId', getLicenseDocument);


router.put('/verify/:userId', updateVerificationStatus);

export default router;
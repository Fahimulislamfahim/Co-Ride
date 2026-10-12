import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
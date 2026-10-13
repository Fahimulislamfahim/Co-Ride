import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const uploadDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');


export const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isVerified: false,
      verificationStatus: { $ne: 'rejected' },
    }).select('-password');
    return res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (status === 'approve') {
      user.isVerified = true;
      user.verificationStatus = 'approved';
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User ${user.name} has been verified successfully.`,
        user,
      });
    } else if (status === 'reject') {
      user.isVerified = false;
      user.verificationStatus = 'rejected';
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User ${user.name} verification request rejected.`,
        user,
      });
    } else {
      return res.status(400).json({ message: 'Invalid status action. Use "approve" or "reject".' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLicenseDocument = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('licenseDocument');
    if (!user?.licenseDocument) {
      return res.status(404).json({ message: 'License document not found' });
    }

    return res.sendFile(path.join(uploadDirectory, path.basename(user.licenseDocument)));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
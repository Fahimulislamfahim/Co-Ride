import User from '../models/User.js';

// ii. Pending Verification: Fetches unapproved users/drivers for admin review
export const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false }).select('-password');
    return res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// iii. Update Verification Status: Approves or rejects submitted documents
export const updateVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'approve' or 'reject'

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (status === 'approve') {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User ${user.name} has been verified successfully.`,
        user,
      });
    } else if (status === 'reject') {
      user.isVerified = false;
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
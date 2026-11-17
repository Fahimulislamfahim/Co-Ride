import User from "../models/User.js";

const getId = (req) => req.user?._id || req.user?.id || req.userId;

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(getId(req)).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, emergencyContact } = req.body;
    const user = await User.findByIdAndUpdate(
      getId(req),
      { name, email, phone, emergencyContact },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
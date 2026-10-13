import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { unlink } from 'fs/promises';


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};


export const registerUser = async (req, res) => {
  try {
    const { name, studentId, email, password, role, phone, vehicleType, vehicleModel, registrationPlate } = req.body;
    const accountRole = role || 'passenger';
    const rejectRegistration = async (status, message) => {
      if (req.file) await unlink(req.file.path).catch(() => {});
      return res.status(status).json({ message });
    };

   
    if (!email || !email.endsWith('@diu.edu.bd')) {
      return rejectRegistration(400, 'Registration restricted to DIU email addresses (@diu.edu.bd)');
    }

    if (!['passenger', 'driver'].includes(accountRole)) {
      return rejectRegistration(400, 'Invalid account role');
    }

    let vehicle;
    if (accountRole === 'driver') {
      const normalizedPlate = registrationPlate?.trim().toUpperCase();
      if (!['motorcycle', 'car'].includes(vehicleType)) {
        return rejectRegistration(400, 'Select a valid vehicle type');
      }
      if (!vehicleModel?.trim() || vehicleModel.trim().length > 80) {
        return rejectRegistration(400, 'Enter a vehicle model of 80 characters or fewer');
      }
      if (!normalizedPlate || !/^[A-Z0-9][A-Z0-9 -]{2,24}$/.test(normalizedPlate)) {
        return rejectRegistration(400, 'Enter a valid registration plate number');
      }
      if (!req.file) {
        return rejectRegistration(400, 'Upload a driving license image');
      }
      vehicle = {
        type: vehicleType,
        model: vehicleModel.trim(),
        registrationPlate: normalizedPlate,
      };
    } else if (req.file) {
      return rejectRegistration(400, 'License uploads are only accepted for driver accounts');
    }

   
    const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existingUser) {
      return rejectRegistration(400, 'Email or Student ID already registered');
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await User.create({
      name,
      studentId,
      email,
      password: hashedPassword,
      role: accountRole,
      phone: phone || '',
      vehicle,
      licenseDocument: req.file ? req.file.filename : '',
      verificationStatus: 'pending',
    });

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        studentId: newUser.studentId,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        vehicle: newUser.vehicle,
        hasLicenseDocument: Boolean(newUser.licenseDocument),
        verificationStatus: newUser.verificationStatus,
      },
    });
  } catch (error) {
    if (req.file) await unlink(req.file.path).catch(() => {});
    return res.status(500).json({ message: error.message });
  }
};

export const getDriverProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    profile: {
      id: req.user._id,
      name: req.user.name,
      studentId: req.user.studentId,
      email: req.user.email,
      phone: req.user.phone,
      vehicle: req.user.vehicle,
      hasLicenseDocument: Boolean(req.user.licenseDocument),
      isVerified: req.user.isVerified,
      verificationStatus: req.user.verificationStatus,
    },
  });
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
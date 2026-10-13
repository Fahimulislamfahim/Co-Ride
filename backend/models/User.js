import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    studentId: {
      type: String,
      required: [true, 'Please enter your Student ID'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your university email'],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@diu\.edu\.bd$/,
        'Please enter a valid DIU institutional email (@diu.edu.bd)',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['passenger', 'driver', 'admin'],
      default: 'passenger',
    },
    phone: {
      type: String,
      default: '',
    },
    vehicle: {
      type: new mongoose.Schema(
        {
          type: { type: String, enum: ['motorcycle', 'car'] },
          model: { type: String, trim: true, maxlength: 80 },
          registrationPlate: { type: String, trim: true, uppercase: true, maxlength: 25 },
        },
        { _id: false }
      ),
      default: undefined,
    },
    licenseDocument: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
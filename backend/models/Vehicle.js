import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['motorcycle', 'car'],
      required: [true, 'Vehicle type is required'],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      maxlength: 80,
    },
    registrationPlate: {
      type: String,
      required: [true, 'Registration plate is required'],
      trim: true,
      uppercase: true,
      maxlength: 25,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;

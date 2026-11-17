import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A driver is required to publish a ride'],
    },
    origin: {
      type: String,
      required: [true, 'Please enter an origin'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please enter a destination'],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Please select a departure date'],
    },
    departureTime: {
      type: String,
      required: [true, 'Please select a departure time'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Please enter a valid departure time'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please enter the available seats'],
      min: [1, 'Available seats must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Available seats must be a whole number',
      },
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please enter the total seats'],
      min: [1, 'Total seats must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Total seats must be a whole number',
      },
    },
    splitFare: {
      type: Number,
      required: [true, 'Please enter the split fare'],
      min: [0, 'Split fare cannot be negative'],
    },
    originCoordinates: coordinateSchema,
    destinationCoordinates: coordinateSchema,
    status: {
      type: String,
      enum: ['scheduled', 'en_route', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;

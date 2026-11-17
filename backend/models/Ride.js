import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    origin: {
      title: { type: String, required: true, trim: true },
      coordinates: {
        type: [Number], // [latitude, longitude]
        required: true,
      },
    },
    destination: {
      title: { type: String, required: true, trim: true },
      coordinates: {
        type: [Number], // [latitude, longitude]
        required: true,
      },
    },
    departureTime: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    farePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
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
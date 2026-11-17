import mongoose from 'mongoose';


const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: 100,
    },
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    origin: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required'],
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'A ride needs at least 1 seat'],
      max: [8, 'A ride cannot offer more than 8 seats'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
      validate: {
        validator: function (value) {
          return value <= this.totalSeats;
        },
        message: 'Available seats cannot exceed total seats',
      },
    },
    // Split fare charged to each passenger, in BDT.
    farePerSeat: {
      type: Number,
      required: [true, 'Fare per seat is required'],
      min: [0, 'Fare cannot be negative'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'en_route', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

rideSchema.index({ status: 1, departureTime: 1 });

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;

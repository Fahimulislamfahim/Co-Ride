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
    departureDate: {
      type: Date,
      required: [true, 'Please select a departure date'],
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
    farePerSeat: {
      type: Number,
      required: [true, 'Fare per seat is required'],
      min: [0, 'Fare cannot be negative'],
    },
    splitFare: {
      type: Number,
      required: [true, 'Please enter the split fare'],
      min: [0, 'Split fare cannot be negative'],
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

rideSchema.pre('validate', async function () {
  if (!this.departureDate && this.departureTime) {
    this.departureDate = this.departureTime;
  }
  if (!this.departureTime && this.departureDate) {
    this.departureTime = this.departureDate;
  }
  if (this.farePerSeat === undefined && this.splitFare !== undefined) {
    this.farePerSeat = this.splitFare;
  }
  if (this.splitFare === undefined && this.farePerSeat !== undefined) {
    this.splitFare = this.farePerSeat;
  }
  if (this.totalSeats === undefined && this.availableSeats !== undefined) {
    this.totalSeats = this.availableSeats;
  }
});

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;

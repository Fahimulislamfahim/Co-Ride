import Ride from '../models/Ride.js';
import mongoose from 'mongoose';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const validStatuses = ['scheduled', 'en_route', 'completed', 'cancelled'];
const allowedTransitions = {
  scheduled: ['scheduled', 'en_route', 'cancelled'],
  en_route: ['en_route', 'completed', 'cancelled'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

const parseCoordinates = (coordinates, fieldName) => {
  if (coordinates === undefined || coordinates === null) return undefined;
  if (
    typeof coordinates !== 'object'
    || !Number.isFinite(Number(coordinates.latitude))
    || !Number.isFinite(Number(coordinates.longitude))
  ) {
    throw new Error(`${fieldName} coordinates must include valid latitude and longitude`);
  }

  return {
    latitude: Number(coordinates.latitude),
    longitude: Number(coordinates.longitude),
  };
};

export const createRide = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      departureTime,
      availableSeats,
      totalSeats,
      splitFare,
      originCoordinates,
      destinationCoordinates,
    } = req.body;

    if (
      typeof origin !== 'string'
      || typeof destination !== 'string'
      || !origin.trim()
      || !destination.trim()
      || !departureDate
      || !departureTime
    ) {
      return res.status(400).json({
        message: 'Origin, destination, departure date, and departure time are required',
      });
    }

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return res.status(400).json({ message: 'Origin and destination must be different' });
    }

    if (!timePattern.test(departureTime)) {
      return res.status(400).json({ message: 'Please enter a valid departure time' });
    }

    const departureDateTime = new Date(`${departureDate}T${departureTime}`);
    if (Number.isNaN(departureDateTime.getTime())) {
      return res.status(400).json({ message: 'Please enter a valid departure date' });
    }

    const seats = Number(availableSeats);
    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({ message: 'Available seats must be a positive whole number' });
    }

    const seatsTotal = totalSeats === undefined || totalSeats === null || totalSeats === ''
      ? seats
      : Number(totalSeats);
    if (!Number.isInteger(seatsTotal) || seatsTotal <= 0 || seats > seatsTotal) {
      return res.status(400).json({
        message: 'Total seats must be a positive whole number and cannot be less than available seats',
      });
    }

    if (splitFare === undefined || splitFare === null || splitFare === '') {
      return res.status(400).json({ message: 'Split fare is required' });
    }

    const fare = Number(splitFare);
    if (!Number.isFinite(fare) || fare < 0) {
      return res.status(400).json({ message: 'Split fare must be a valid non-negative amount' });
    }

    const originLocation = parseCoordinates(originCoordinates, 'Origin');
    const destinationLocation = parseCoordinates(destinationCoordinates, 'Destination');
    if (!originLocation || !destinationLocation) {
      return res.status(400).json({ message: 'Origin and destination coordinates are required' });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      origin: {
        name: origin.trim(),
        lat: originLocation.latitude,
        lng: originLocation.longitude,
      },
      destination: {
        name: destination.trim(),
        lat: destinationLocation.latitude,
        lng: destinationLocation.longitude,
      },
      departureDate: departureDateTime,
      departureTime: departureDateTime,
      availableSeats: seats,
      totalSeats: seatsTotal,
      splitFare: fare,
      farePerSeat: fare,
    });

    return res.status(201).json({
      success: true,
      message: 'Ride published successfully',
      ride,
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.message.includes('coordinates')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Could not publish ride' });
  }
};

export const getMyPublishedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .sort({ departureDate: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      rides: rides.map((ride) => ({
        ...ride,
        totalSeats: ride.totalSeats ?? ride.availableSeats,
        status: ride.status === 'en-route' ? 'en_route' : ride.status,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch published rides' });
  }
};

export const updateRideStatus = async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(rideId)) {
    return res.status(400).json({ message: 'Invalid ride ID' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid ride status' });
  }

  try {
    const ride = await Ride.findOne({ _id: rideId, driver: req.user._id });
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const currentStatus = ride.status === 'en-route' ? 'en_route' : ride.status;
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change ride status from ${currentStatus} to ${status}`,
      });
    }

    ride.status = status;
    await ride.save();

    return res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      ride,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Could not update ride status' });
  }
};

import Ride from '../models/Ride.js';


const DHAKA_OFFSET = '+06:00';
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_TEXT_LENGTH = 100;
const MAX_SEATS = 8;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;


const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


const readText = (value) => (typeof value === 'string' ? value.trim() : '');


const dayRangeInDhaka = (dateText) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return null;
  const start = new Date(`${dateText}T00:00:00${DHAKA_OFFSET}`);
  if (Number.isNaN(start.getTime())) return null;
  
  const roundTrip = new Date(start.getTime() + 6 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (roundTrip !== dateText) return null;
  return { start, end: new Date(start.getTime() + DAY_MS) };
};


export const buildSearchFilter = (query = {}, { userId, now = new Date() } = {}) => {
  const origin = readText(query.origin);
  const destination = readText(query.destination);
  const date = readText(query.date);

  if (origin.length > MAX_TEXT_LENGTH || destination.length > MAX_TEXT_LENGTH) {
    return { error: `Location must be ${MAX_TEXT_LENGTH} characters or fewer` };
  }

  let seats = 1;
  if (query.seats !== undefined && query.seats !== '') {
    seats = Number(readText(String(query.seats)));
    if (!Number.isInteger(seats) || seats < 1 || seats > MAX_SEATS) {
      return { error: `Seats must be a whole number between 1 and ${MAX_SEATS}` };
    }
  }

  
  let departureTime = { $gte: now };
  if (date) {
    const range = dayRangeInDhaka(date);
    if (!range) return { error: 'Date must be a valid date in YYYY-MM-DD format' };
    departureTime = {
      $gte: range.start > now ? range.start : now,
      $lt: range.end,
    };
  }

  const filter = {
    status: 'scheduled',
    availableSeats: { $gte: seats },
    departureTime,
  };

  if (userId) filter.driver = { $ne: userId }; // a driver doesn't book their own ride
  if (origin) filter['origin.name'] = { $regex: escapeRegex(origin), $options: 'i' };
  if (destination) filter['destination.name'] = { $regex: escapeRegex(destination), $options: 'i' };

  return { filter };
};


export const searchRides = async (req, res) => {
  try {
    const { filter, error } = buildSearchFilter(req.query, { userId: req.user._id });
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    let limit = Number.parseInt(readText(String(req.query.limit ?? '')), 10);
    if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_LIMIT;
    limit = Math.min(limit, MAX_LIMIT);

    const rides = await Ride.find(filter)
      .sort({ departureTime: 1, farePerSeat: 1 })
      .limit(limit)
      
      .populate('driver', 'name isVerified verificationStatus averageRating tripCount vehicle')
      .lean();

 
    const results = rides.filter((ride) => ride.driver);

    res.status(200).json({ success: true, count: results.length, rides: results });
  } catch (err) {
    console.error('Search rides error:', err.message);
    res.status(500).json({ success: false, message: 'Server error while searching rides' });
  }
};

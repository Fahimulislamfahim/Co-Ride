
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';

dotenv.config();

const DAY_MS = 24 * 60 * 60 * 1000;
const CAMPUS = { name: 'DIU Permanent Campus, Ashulia', lat: 23.8769, lng: 90.3198 };

const todayDhaka = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
const tomorrow = new Date(new Date(`${todayDhaka}T00:00:00+06:00`).getTime() + DAY_MS);
const at = (dayOffset, hour, minute = 0) =>
  new Date(tomorrow.getTime() + dayOffset * DAY_MS + (hour * 60 + minute) * 60 * 1000);

const DEMO_DRIVERS = [
  { key: 'rafi',  name: 'Rafi Ahmed',     studentId: 'DEMO-D01', email: 'demo.rafi@diu.edu.bd',  vehicle: { type: 'motorcycle', model: 'Yamaha FZS V3',   registrationPlate: 'DHAKA METRO-LA 12-3456' }, averageRating: 4.8, tripCount: 42 },
  { key: 'tania', name: 'Tania Islam',    studentId: 'DEMO-D02', email: 'demo.tania@diu.edu.bd', vehicle: { type: 'car',        model: 'Toyota Axio',     registrationPlate: 'DHAKA METRO-GA 22-7788' }, averageRating: 4.9, tripCount: 67 },
  { key: 'sabbir', name: 'Sabbir Hossain', studentId: 'DEMO-D03', email: 'demo.sabbir@diu.edu.bd', vehicle: { type: 'car',       model: 'Honda Vezel',     registrationPlate: 'DHAKA METRO-CHA 15-9021' }, averageRating: 4.5, tripCount: 18 },
  { key: 'nusrat', name: 'Nusrat Jahan',   studentId: 'DEMO-D04', email: 'demo.nusrat@diu.edu.bd', vehicle: { type: 'motorcycle', model: 'Honda CB Hornet', registrationPlate: 'DHAKA METRO-HA 31-4410' }, averageRating: 0,   tripCount: 0 },
];

const place = (name, lat, lng) => ({ name, lat, lng });
const SAVAR = place('Savar Bus Stand', 23.8583, 90.2667);
const MIRPUR = place('Mirpur 10', 23.8069, 90.3687);
const UTTARA = place('Uttara Sector 7', 23.8759, 90.3995);
const DHANMONDI = place('Dhanmondi 27', 23.7561, 90.3742);
const GABTOLI = place('Gabtoli Bus Terminal', 23.7788, 90.3446);
const RADIO = place('Radio Colony, Savar', 23.8195, 90.2540);

// [driverKey, origin, destination, departure, totalSeats, availableSeats, farePerSeat]
const RIDES = [
  ['rafi',   SAVAR,     CAMPUS, at(0, 7, 30),  2, 2, 40],
  ['tania',  MIRPUR,    CAMPUS, at(0, 7, 45),  4, 3, 90],
  ['sabbir', UTTARA,    CAMPUS, at(0, 8, 15),  4, 1, 110],
  ['nusrat', RADIO,     CAMPUS, at(0, 9, 0),   1, 1, 35],
  ['tania',  CAMPUS,    MIRPUR, at(0, 16, 30), 4, 4, 90],
  ['rafi',   CAMPUS,    SAVAR,  at(0, 17, 15), 2, 1, 40],
  ['sabbir', CAMPUS,    UTTARA, at(0, 18, 0),  4, 3, 110],
  ['tania',  DHANMONDI, CAMPUS, at(1, 7, 0),   4, 4, 120],
  ['rafi',   GABTOLI,   CAMPUS, at(1, 8, 0),   2, 2, 60],
  ['nusrat', CAMPUS,    RADIO,  at(1, 21, 30), 1, 1, 35],
];

const seed = async () => {
  await connectDB();

  const passwordHash = await bcrypt.hash('Demo@1234', 10);
  const driverIds = {};

  for (const d of DEMO_DRIVERS) {
    const doc = await User.findOneAndUpdate(
      { email: d.email },
      {
        name: d.name,
        studentId: d.studentId,
        email: d.email,
        password: passwordHash,
        role: 'driver',
        vehicle: d.vehicle,
        verificationStatus: 'approved',
        isVerified: true,
        averageRating: d.averageRating,
        tripCount: d.tripCount,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    driverIds[d.key] = doc._id;
  }

 
  await Ride.deleteMany({ driver: { $in: Object.values(driverIds) } });

  const created = await Ride.insertMany(
    RIDES.map(([key, origin, destination, departureTime, totalSeats, availableSeats, farePerSeat]) => ({
      driver: driverIds[key],
      origin,
      destination,
      departureTime,
      totalSeats,
      availableSeats,
      farePerSeat,
      status: 'scheduled',
    }))
  );

  console.log(`Seeded ${DEMO_DRIVERS.length} demo drivers and ${created.length} rides.`);
  console.log('Demo driver login: demo.rafi@diu.edu.bd / Demo@1234 (same password for all demo drivers)');
  await mongoose.disconnect();
};

seed().catch(async (err) => {
  console.error('Seeding failed:', err.message);
  await mongoose.disconnect();
  process.exit(1);
});

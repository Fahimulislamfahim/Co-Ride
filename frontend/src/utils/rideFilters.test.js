// Run with:  npm run test:utils   (plain Node, no extra packages needed)
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterRidesByTime,
  formatDeparture,
  getDhakaHour,
  todayInDhaka,
} from './rideFilters.js';

// Dhaka is UTC+6, so 07:30 in Dhaka = 01:30 UTC.
const ride = (id, utc, fare = 50) => ({ _id: id, departureTime: `${utc}Z`, farePerSeat: fare });
const R = {
  morning: ride('morning', '2026-11-17T01:30:00', 40),    // 07:30 Dhaka
  noon: ride('noon', '2026-11-17T06:00:00', 70),          // 12:00 Dhaka (afternoon boundary)
  afternoon: ride('afternoon', '2026-11-17T10:30:00', 90),// 16:30
  evening: ride('evening', '2026-11-17T11:00:00', 60),    // 17:00 (evening boundary)
  late: ride('late', '2026-11-17T16:00:00', 35),          // 22:00 -> night
  predawn: ride('predawn', '2026-11-17T20:00:00', 80),    // 02:00 next day -> night
};
const all = Object.values(R);
const ids = (list) => list.map((r) => r._id);

test('getDhakaHour uses Dhaka time regardless of device time zone', () => {
  assert.equal(getDhakaHour('2026-11-17T01:30:00Z'), 7);
  assert.equal(getDhakaHour('2026-11-16T18:00:00Z'), 0); // midnight in Dhaka
  assert.equal(getDhakaHour('not a date'), null);
});

test('time windows narrow the list (boundaries are start-inclusive)', () => {
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'morning' })), ['morning']);
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'afternoon' })), ['noon', 'afternoon']);
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'evening' })), ['evening']);
});

test('night window wraps past midnight', () => {
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'night' })), ['late', 'predawn']);
});

test("'all' keeps everything, earliest first by default", () => {
  assert.deepEqual(ids(filterRidesByTime(all)), ['morning', 'noon', 'afternoon', 'evening', 'late', 'predawn']);
});

test('cheapest sorts by fare, ties broken by earlier departure', () => {
  const tied = [ride('b', '2026-11-17T05:00:00', 50), ride('a', '2026-11-17T01:00:00', 50), ride('c', '2026-11-17T02:00:00', 20)];
  assert.deepEqual(ids(filterRidesByTime(tied, { sortBy: 'cheapest' })), ['c', 'a', 'b']);
});

test('maxFare caps the fare; empty string / null means no cap', () => {
  assert.deepEqual(ids(filterRidesByTime(all, { maxFare: 60, sortBy: 'cheapest' })), ['late', 'morning', 'evening']);
  assert.equal(filterRidesByTime(all, { maxFare: '' }).length, all.length);
  assert.equal(filterRidesByTime(all, { maxFare: null }).length, all.length);
});

test('window and fare filters combine', () => {
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'afternoon', maxFare: 80 })), ['noon']);
});

test('does not mutate the input array', () => {
  const input = [R.evening, R.morning];
  const snapshot = ids(input);
  filterRidesByTime(input, { sortBy: 'cheapest' });
  assert.deepEqual(ids(input), snapshot);
});

test('bad input is handled safely', () => {
  assert.deepEqual(filterRidesByTime(undefined), []);
  assert.deepEqual(filterRidesByTime('nope'), []);
  const broken = [{ _id: 'x', departureTime: 'garbage', farePerSeat: 'free' }, R.morning];
  assert.deepEqual(ids(filterRidesByTime(broken)), ['morning', 'x']);       // invalid sinks to the bottom
  assert.deepEqual(ids(filterRidesByTime(broken, { timeWindow: 'morning' })), ['morning']);
  assert.deepEqual(ids(filterRidesByTime(all, { timeWindow: 'unknown-id' })).length, all.length); // falls back to 'all'
});

test('todayInDhaka returns YYYY-MM-DD', () => {
  assert.match(todayInDhaka(), /^\d{4}-\d{2}-\d{2}$/);
});

test('formatDeparture formats in Dhaka time', () => {
  const out = formatDeparture('2026-11-17T01:30:00Z');
  assert.equal(out.time, '7:30 AM');
  assert.match(out.day, /Tue/);
  assert.equal(formatDeparture('nope').day, 'Time to be confirmed');
});

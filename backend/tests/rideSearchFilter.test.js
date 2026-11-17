import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchFilter } from '../controllers/rideSearchController.js';

// Fixed "now": 2026-11-16 10:00 in Dhaka (04:00 UTC)
const NOW = new Date('2026-11-16T04:00:00.000Z');
const USER_ID = 'user-123';
const build = (query) => buildSearchFilter(query, { userId: USER_ID, now: NOW });

test('only scheduled, future rides with enough seats, excluding my own rides', () => {
  const { filter, error } = build({});
  assert.equal(error, undefined);
  assert.equal(filter.status, 'scheduled');
  assert.deepEqual(filter.availableSeats, { $gte: 1 });
  assert.deepEqual(filter.departureTime, { $gte: NOW });
  assert.deepEqual(filter.driver, { $ne: USER_ID });
});

test('seats parameter sets the minimum available seats', () => {
  assert.deepEqual(build({ seats: '3' }).filter.availableSeats, { $gte: 3 });
});

test('rejects invalid seat counts', () => {
  for (const seats of ['0', '-1', '2.5', 'abc', '9']) {
    assert.match(build({ seats }).error, /Seats must be/, `seats=${seats}`);
  }
});

test('date becomes a Dhaka-time day range', () => {
  const { filter } = build({ date: '2026-11-20' });
  assert.equal(filter.departureTime.$gte.toISOString(), '2026-11-19T18:00:00.000Z'); // 00:00 +06:00
  assert.equal(filter.departureTime.$lt.toISOString(), '2026-11-20T18:00:00.000Z');
});

test('searching for today never returns rides that already left', () => {
  const { filter } = build({ date: '2026-11-16' });
  assert.equal(filter.departureTime.$gte.getTime(), NOW.getTime());
});

test('rejects malformed or impossible dates', () => {
  for (const date of ['20-11-2026', '2026/11/20', '2026-13-01', '2026-02-31', 'tomorrow']) {
    assert.match(build({ date }).error, /valid date/, `date=${date}`);
  }
});

test('location text is matched case-insensitively and literally (regex is escaped)', () => {
  const { filter } = build({ origin: 'Savar (Bus) .*', destination: 'DIU' });
  assert.equal(filter['origin.name'].$options, 'i');
  assert.equal(filter['origin.name'].$regex, 'Savar \\(Bus\\) \\.\\*');
  assert.equal(filter['destination.name'].$regex, 'DIU');
});

test('NoSQL operator injection through location params is ignored', () => {
  // Express/qs turns ?origin[$ne]=x into { origin: { $ne: 'x' } }
  const { filter } = build({ origin: { $ne: 'x' }, destination: ['a', 'b'] });
  assert.equal(filter['origin.name'], undefined);
  assert.equal(filter['destination.name'], undefined);
});

test('operator objects in seats are rejected', () => {
  assert.match(build({ seats: { $gt: 0 } }).error, /Seats must be/);
});

test('rejects very long location text', () => {
  assert.match(build({ origin: 'a'.repeat(101) }).error, /100 characters/);
});


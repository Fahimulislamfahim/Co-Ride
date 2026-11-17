

const TIME_ZONE = 'Asia/Dhaka';

export const TIME_WINDOWS = [
  { id: 'all', label: 'Any time', hint: '' },
  { id: 'morning', label: 'Morning', hint: '5 AM – 12 PM', from: 5, to: 12 },
  { id: 'afternoon', label: 'Afternoon', hint: '12 PM – 5 PM', from: 12, to: 17 },
  { id: 'evening', label: 'Evening', hint: '5 PM – 9 PM', from: 17, to: 21 },
  { id: 'night', label: 'Night', hint: '9 PM – 5 AM', from: 21, to: 5 },
];

export const SORT_OPTIONS = [
  { id: 'earliest', label: 'Earliest departure' },
  { id: 'cheapest', label: 'Lowest fare' },
];

const hourFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  hourCycle: 'h23',
  timeZone: TIME_ZONE,
});

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

export const getDhakaHour = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Number(hourFormatter.format(date));
};

export const todayInDhaka = () => dateKeyFormatter.format(new Date());

const isInWindow = (hour, window) => {
  if (!window || window.id === 'all') return true;
  if (hour === null) return false;
  return window.from < window.to
    ? hour >= window.from && hour < window.to
    : hour >= window.from || hour < window.to;
};

const timeOf = (ride) => {
  const t = new Date(ride.departureTime).getTime();
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
};

const fareOf = (ride) => {
  const fare = Number(ride.farePerSeat);
  return Number.isFinite(fare) ? fare : Number.POSITIVE_INFINITY;
};

export const filterRidesByTime = (
  rides,
  { timeWindow = 'all', sortBy = 'earliest', maxFare = null } = {}
) => {
  if (!Array.isArray(rides)) return [];

  const window = TIME_WINDOWS.find((w) => w.id === timeWindow) || TIME_WINDOWS[0];
  const fareCap = maxFare === null || maxFare === '' ? null : Number(maxFare);

  const narrowed = rides.filter((ride) => {
    if (!isInWindow(getDhakaHour(ride.departureTime), window)) return false;
    if (fareCap !== null && Number.isFinite(fareCap) && fareOf(ride) > fareCap) return false;
    return true;
  });

  const byTime = (a, b) => timeOf(a) - timeOf(b) || fareOf(a) - fareOf(b);
  const byFare = (a, b) => fareOf(a) - fareOf(b) || timeOf(a) - timeOf(b);
  const compare = sortBy === 'cheapest' ? byFare : byTime;

  const sorted = narrowed.slice().sort((a, b) => {
    const result = compare(a, b);
    return Number.isNaN(result) ? 0 : result;
  });
  return sorted;
};

export const formatDeparture = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: 'Time to be confirmed', time: '' };
  return {
    day: new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: TIME_ZONE,
    }).format(date),
    time: new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: TIME_ZONE,
    }).format(date),
  };
};
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import API from '../services/api';
import RideCard from '../components/RideCard';
import {
  SORT_OPTIONS,
  TIME_WINDOWS,
  filterRidesByTime,
  todayInDhaka,
} from '../utils/rideFilters';
import '../styles/rides.css';

// Search Available Rides (Module 2, Anika): form + results + client-side time/fare filters.
function FindRidesPage({ onBack }) {
  const today = todayInDhaka();
  const [form, setForm] = useState({ origin: '', destination: '', date: today, seats: 1 });
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({ timeWindow: 'all', sortBy: 'earliest', maxFare: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const controllerRef = useRef(null);

  // Cancel any in-flight request when leaving the page.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  const handleSearch = async (e) => {
    e.preventDefault();

    // A newer search replaces the previous one, so old responses can't overwrite new ones.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError('');
    try {
      const params = { seats: form.seats };
      if (form.origin.trim()) params.origin = form.origin.trim();
      if (form.destination.trim()) params.destination = form.destination.trim();
      if (form.date) params.date = form.date;

      const res = await API.get('/rides/search', { params, signal: controller.signal });
      setRides(res.data.rides || []);
      setHasSearched(true);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setRides([]);
      setHasSearched(true);
      setError(err.response?.data?.message || 'Could not search rides. Please try again.');
    } finally {
      if (controllerRef.current === controller) setLoading(false);
    }
  };

  const visibleRides = useMemo(() => filterRidesByTime(rides, filters), [rides, filters]);
  const filtersActive = filters.timeWindow !== 'all' || filters.maxFare !== '';

  return (
    <main className="rides_page">
      <section className="rides_shell">
        <header className="rides_header">
          <button type="button" onClick={onBack} className="back_button" aria-label="Go back">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="rides_title">Find a Ride</h1>
          <p className="rides_subtitle">
            Search verified DIU drivers heading your way. Leave a location empty to see all rides.
          </p>
        </header>

        <form className="rides_search_form" onSubmit={handleSearch}>
          <div className="form_field">
            <label className="form_label" htmlFor="ride-origin">Pickup</label>
            <div className="input_with_icon">
              <MapPin size={16} className="field_icon" />
              <input
                id="ride-origin"
                type="text"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="e.g. Savar, Mirpur 10"
                maxLength={100}
                className="form_input"
              />
            </div>
          </div>

          <div className="form_field">
            <label className="form_label" htmlFor="ride-destination">Destination</label>
            <div className="input_with_icon">
              <Navigation size={16} className="field_icon" />
              <input
                id="ride-destination"
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. DIU Permanent Campus"
                maxLength={100}
                className="form_input"
              />
            </div>
          </div>

          <div className="form_field">
            <label className="form_label" htmlFor="ride-date">Date</label>
            <div className="input_with_icon">
              <Calendar size={16} className="field_icon" />
              <input
                id="ride-date"
                type="date"
                name="date"
                value={form.date}
                min={today}
                onChange={handleChange}
                className="form_input"
              />
            </div>
          </div>

          <div className="form_field">
            <label className="form_label" htmlFor="ride-seats">Seats needed</label>
            <div className="input_with_icon">
              <Users size={16} className="field_icon" />
              <select
                id="ride-seats"
                name="seats"
                value={form.seats}
                onChange={handleChange}
                className="form_input"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'seat' : 'seats'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="save_profile_button rides_search_btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={17} className="btn_spinner" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={17} />
                <span>Search Rides</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="form_feedback feedback_error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {hasSearched && !error && rides.length > 0 && (
          <div className="rides_filter_bar">
            <div className="rides_filter_label">
              <SlidersHorizontal size={16} />
              <span>Filter &amp; sort</span>
            </div>

            <div className="rides_time_chips" role="group" aria-label="Departure time">
              {TIME_WINDOWS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`rides_chip_btn ${filters.timeWindow === w.id ? 'rides_chip_btn--active' : ''}`}
                  aria-pressed={filters.timeWindow === w.id}
                  title={w.hint}
                  onClick={() => handleFilter('timeWindow', w.id)}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div className="rides_filter_inputs">
              <label className="rides_inline_field">
                <span>Sort by</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilter('sortBy', e.target.value)}
                  className="form_input rides_compact_input"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="rides_inline_field">
                <span>Max fare (৳)</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={filters.maxFare}
                  onChange={(e) => handleFilter('maxFare', e.target.value)}
                  placeholder="Any"
                  className="form_input rides_compact_input"
                />
              </label>
            </div>
          </div>
        )}

        <div className="rides_results" aria-live="polite">
          {hasSearched && !error && (
            <p className="rides_count">
              {visibleRides.length} {visibleRides.length === 1 ? 'ride' : 'rides'} found
              {filtersActive && rides.length !== visibleRides.length && ` (filtered from ${rides.length})`}
            </p>
          )}

          {visibleRides.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}

          {hasSearched && !error && rides.length === 0 && (
            <div className="rides_empty">
              <p>No rides match your search.</p>
              <span>Try another date, a nearby pickup point, or fewer seats.</span>
            </div>
          )}

          {hasSearched && !error && rides.length > 0 && visibleRides.length === 0 && (
            <div className="rides_empty">
              <p>No rides match these filters.</p>
              <span>Try a different time of day or a higher max fare.</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default FindRidesPage;

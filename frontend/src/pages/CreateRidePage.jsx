import { useState } from 'react';
import API from '../services/api';
import MapView from '../components/MapView';
import { CAMPUS_HUBS } from '../components/campusHubs';

const initialForm = {
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  availableSeats: '',
  splitFare: '',
};

const CreateRidePage = ({ onRideCreated }) => {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [routePoints, setRoutePoints] = useState({
    origin: null,
    destination: null,
  });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleHubChange = (field, event) => {
    const hub = CAMPUS_HUBS.find((item) => item.name === event.target.value) || null;
    setFormData((current) => ({ ...current, [field]: hub?.name || '' }));
    setRoutePoints((current) => ({ ...current, [field]: hub }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      setError('Origin and destination must be different');
      return;
    }

    if (!routePoints.origin || !routePoints.destination) {
      setError('Select both an origin and destination on the map');
      return;
    }

    if (Number(formData.availableSeats) <= 0 || !Number.isInteger(Number(formData.availableSeats))) {
      setError('Available seats must be a positive whole number');
      return;
    }

    if (!Number.isFinite(Number(formData.splitFare)) || Number(formData.splitFare) < 0) {
      setError('Split fare must be a valid non-negative amount');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/rides', {
        ...formData,
        originCoordinates: {
          latitude: routePoints.origin.coords[0],
          longitude: routePoints.origin.coords[1],
        },
        destinationCoordinates: {
          latitude: routePoints.destination.coords[0],
          longitude: routePoints.destination.coords[1],
        },
        availableSeats: Number(formData.availableSeats),
        splitFare: Number(formData.splitFare),
      });
      setMessage(response.data.message);
      setFormData(initialForm);
      setRoutePoints({ origin: null, destination: null });
      onRideCreated?.();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not publish ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ride_publish_card">
      <header className="ride_publish_header">
        <h2>Publish a ride</h2>
        <p>Share your route and available seats with fellow passengers.</p>
      </header>

      {message && <div className="ride_notice success_notice" role="status">{message}</div>}
      {error && <div className="ride_notice error_message" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="ride_form">
        <div className="ride_form_grid">
          <div className="form_field">
            <label className="form_label" htmlFor="origin">Origin</label>
            <select id="origin" className="form_input form_select" name="origin" value={formData.origin} onChange={(event) => handleHubChange('origin', event)} required>
              <option value="" disabled>Select pickup location</option>
              {CAMPUS_HUBS.map((hub) => <option key={hub.name} value={hub.name}>{hub.name}</option>)}
            </select>
          </div>
          <div className="form_field">
            <label className="form_label" htmlFor="destination">Destination</label>
            <select id="destination" className="form_input form_select" name="destination" value={formData.destination} onChange={(event) => handleHubChange('destination', event)} required>
              <option value="" disabled>Select destination</option>
              {CAMPUS_HUBS.map((hub) => <option key={hub.name} value={hub.name}>{hub.name}</option>)}
            </select>
          </div>
          <div className="form_field">
            <label className="form_label" htmlFor="departureDate">Departure date</label>
            <input id="departureDate" className="form_input" type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
          </div>
          <div className="form_field">
            <label className="form_label" htmlFor="departureTime">Departure time</label>
            <input id="departureTime" className="form_input" type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
          </div>
          <div className="form_field">
            <label className="form_label" htmlFor="availableSeats">Available seats</label>
            <input id="availableSeats" className="form_input" type="number" min="1" step="1" name="availableSeats" value={formData.availableSeats} onChange={handleChange} required />
          </div>
          <div className="form_field">
            <label className="form_label" htmlFor="splitFare">Split fare</label>
            <input id="splitFare" className="form_input" type="number" min="0" step="0.01" name="splitFare" value={formData.splitFare} onChange={handleChange} required />
          </div>
        </div>
        <MapView
          start={routePoints.origin && { title: routePoints.origin.name, coordinates: routePoints.origin.coords }}
          end={routePoints.destination && { title: routePoints.destination.name, coordinates: routePoints.destination.coords }}
        />
        <button type="submit" className="auth_submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish ride'}
        </button>
      </form>
    </section>
  );
};

export default CreateRidePage;

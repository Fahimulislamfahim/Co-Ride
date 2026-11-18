import { useEffect, useState } from 'react';
import API from '../services/api';

const statusLabels = {
  scheduled: 'Scheduled',
  en_route: 'En Route',
  'en-route': 'En Route',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusTransitions = {
  scheduled: ['scheduled', 'en_route', 'cancelled'],
  en_route: ['en_route', 'completed', 'cancelled'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

const formatDate = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Not available'
    : parsedDate.toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (date) => {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Not available'
    : parsedDate.toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatLocation = (location) => {
  if (typeof location === 'string') return location;
  return location?.name || 'Location unavailable';
};

const formatFare = (fare) => {
  const amount = Number(fare);
  return Number.isFinite(amount) ? amount.toFixed(2) : 'Not available';
};

const MyPublishedRides = ({ refreshKey = 0 }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingRideId, setUpdatingRideId] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [cancelingRideId, setCancelingRideId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isActive = true;
    const fetchRides = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await API.get('/rides/my');
        if (isActive) setRides(response.data.rides || []);
      } catch (requestError) {
        if (isActive) {
          setError(requestError.response?.data?.message || 'Could not load published rides');
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchRides();

    return () => {
      isActive = false;
    };
  }, [refreshKey]);

  const handleStatusChange = async (rideId, status) => {
    setUpdatingRideId(rideId);
    setUpdateError('');
    setSuccessMessage('');

    try {
      const response = await API.patch(`/rides/${rideId}/status`, { status });
      setRides((currentRides) => currentRides.map((ride) => (
        ride._id === rideId ? { ...ride, status: response.data.ride.status } : ride
      )));
      setSuccessMessage(response.data.message);
    } catch (requestError) {
      setUpdateError(requestError.response?.data?.message || 'Could not update ride status');
    } finally {
      setUpdatingRideId('');
    }
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;

    setCancelingRideId(rideId);
    setUpdateError('');
    setSuccessMessage('');

    try {
      const response = await API.patch(`/rides/${rideId}/status`, { status: 'cancelled' });
      setRides((currentRides) => currentRides.map((ride) => (
        ride._id === rideId ? { ...ride, status: response.data.ride.status } : ride
      )));
      setSuccessMessage('Ride cancelled successfully');
    } catch (requestError) {
      setUpdateError(requestError.response?.data?.message || 'Could not cancel ride');
    } finally {
      setCancelingRideId('');
    }
  };

  return (
    <section className="published_rides_card">
      <header className="published_rides_header">
        <div>
          <h2>My published rides</h2>
          <p>Active and past rides created from your driver account.</p>
        </div>
        {!loading && !error && <span className="ride_count">{rides.length} ride{rides.length === 1 ? '' : 's'}</span>}
      </header>

      {loading && <p className="ride_status_message">Loading your published rides...</p>}
      {error && <p className="ride_status_message error_text" role="alert">{error}</p>}
      {updateError && <p className="ride_status_message error_text" role="alert">{updateError}</p>}
      {successMessage && <p className="ride_status_message success_text" role="status">{successMessage}</p>}
      {!loading && !error && rides.length === 0 && (
        <p className="ride_status_message">You have not published any rides yet.</p>
      )}

      {!loading && !error && rides.length > 0 && (
        <div className="published_rides_list">
          {rides.map((ride) => {
            const currentStatus = ride.status === 'en-route' ? 'en_route' : ride.status || 'scheduled';
            const status = statusLabels[currentStatus] || 'Scheduled';
            const statusClass = currentStatus;
            const availableTransitions = statusTransitions[currentStatus] || ['scheduled'];

            return (
              <article className="published_ride_item" key={ride._id}>
                <div className="published_ride_route">
                  <div>
                    <span className="ride_detail_label">Origin</span>
                    <strong>{formatLocation(ride.origin)}</strong>
                  </div>
                  <span className="route_arrow" aria-hidden="true">→</span>
                  <div>
                    <span className="ride_detail_label">Destination</span>
                    <strong>{formatLocation(ride.destination)}</strong>
                  </div>
                  <span className={`ride_status_badge ride_status_${statusClass}`}>{status}</span>
                </div>

                <dl className="published_ride_details">
                  <div><dt>Departure date</dt><dd>{formatDate(ride.departureDate)}</dd></div>
                  <div><dt>Departure time</dt><dd>{formatTime(ride.departureTime)}</dd></div>
                  <div><dt>Available seats</dt><dd>{ride.availableSeats}</dd></div>
                  <div><dt>Total seats</dt><dd>{ride.totalSeats ?? ride.availableSeats}</dd></div>
                  <div><dt>Split fare</dt><dd>{formatFare(ride.splitFare)}</dd></div>
                </dl>
                <div className="ride_status_controls">
                  <label className="ride_status_control_label" htmlFor={`ride-status-${ride._id}`}>
                    Update status
                  </label>
                  <select
                    id={`ride-status-${ride._id}`}
                    className="form_input ride_status_select"
                    value={currentStatus}
                    onChange={(event) => handleStatusChange(ride._id, event.target.value)}
                    disabled={updatingRideId === ride._id || availableTransitions.length === 1}
                  >
                    {availableTransitions.map((nextStatus) => (
                      <option key={nextStatus} value={nextStatus}>
                        {statusLabels[nextStatus]}
                      </option>
                    ))}
                  </select>
                  {updatingRideId === ride._id && <span className="ride_update_loading">Updating...</span>}
                  {!['completed', 'cancelled'].includes(currentStatus) && (
                    <button
                      type="button"
                      className="cancel_ride_button"
                      onClick={() => handleCancelRide(ride._id)}
                      disabled={cancelingRideId === ride._id || updatingRideId === ride._id}
                    >
                      {cancelingRideId === ride._id ? 'Cancelling...' : 'Cancel ride'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyPublishedRides;

import { useState } from 'react';
import {
  Bike,
  Car,
  ChevronDown,
  Clock,
  MapPin,
  Navigation,
  Star,
  Users,
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { formatDeparture } from '../utils/rideFilters';

const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);


export default function RideCard({ ride, onRequestSeat }) {
  const [expanded, setExpanded] = useState(false);
  const { driver = {}, origin, destination } = ride;
  const vehicle = driver.vehicle || {};
  const { day, time } = formatDeparture(ride.departureTime);

  const seatsLeft = ride.availableSeats ?? 0;
  const seatClass =
    seatsLeft === 0 ? 'ride_seats--full' : seatsLeft === 1 ? 'ride_seats--low' : 'ride_seats--ok';
  const VehicleIcon = vehicle.type === 'motorcycle' ? Bike : Car;
  const detailsId = `ride-details-${ride._id}`;
  const rating = Number(driver.averageRating);

  return (
    <article className="ride_card" aria-label={`Ride from ${origin?.name} to ${destination?.name}`}>
      <header className="ride_card_top">
        <div className="ride_driver">
          <div className="ride_driver_avatar" aria-hidden="true">
            {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="ride_driver_meta">
            <span className="ride_driver_name">{driver.name || 'Driver'}</span>
            <span className="ride_driver_stats">
              <Star size={13} className="ride_star" aria-hidden="true" />
              {rating > 0 ? `${rating.toFixed(1)}` : 'New'}
              <span className="ride_dot" aria-hidden="true">•</span>
              {driver.tripCount ?? 0} trips
            </span>
          </div>
        </div>

        <div className="ride_fare" aria-label={`Fare ${ride.farePerSeat} taka per seat`}>
          <span className="ride_fare_amount">৳{ride.farePerSeat}</span>
          <span className="ride_fare_unit">per seat</span>
        </div>
      </header>

      <div className="ride_route">
        <div className="ride_route_line" aria-hidden="true">
          <MapPin size={15} className="ride_route_pin ride_route_pin--from" />
          <span className="ride_route_connector" />
          <Navigation size={15} className="ride_route_pin ride_route_pin--to" />
        </div>
        <div className="ride_route_places">
          <span className="ride_place">{origin?.name}</span>
          <span className="ride_place">{destination?.name}</span>
        </div>
      </div>

      <div className="ride_info_row">
        <span className="ride_chip">
          <Clock size={14} aria-hidden="true" />
          {day}
          {time && <strong>{time}</strong>}
        </span>
        <span className={`ride_chip ride_seats ${seatClass}`}>
          <Users size={14} aria-hidden="true" />
          {seatsLeft === 0
            ? 'Full'
            : `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
        </span>
        <span className="ride_chip">
          <VehicleIcon size={14} aria-hidden="true" />
          {capitalize(vehicle.type) || 'Vehicle'}
        </span>
      </div>

      <div className="ride_card_actions">
        <button
          type="button"
          className="ride_toggle"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-controls={detailsId}
        >
          <span>{expanded ? 'Hide details' : 'View details'}</span>
          <ChevronDown size={16} className={expanded ? 'ride_chevron ride_chevron--open' : 'ride_chevron'} />
        </button>

        {onRequestSeat && (
          <button
            type="button"
            className="ride_request_btn"
            onClick={() => onRequestSeat(ride)}
            disabled={seatsLeft === 0}
          >
            Request Seat
          </button>
        )}
      </div>

      {expanded && (
        <dl className="ride_details" id={detailsId}>
          <div className="ride_detail_row">
            <dt>Driver status</dt>
            <dd>
              <VerificationBadge
                isVerified={driver.isVerified}
                status={driver.verificationStatus}
              />
            </dd>
          </div>
          <div className="ride_detail_row">
            <dt>Vehicle</dt>
            <dd>{vehicle.model || 'Not provided'}</dd>
          </div>
          <div className="ride_detail_row">
            <dt>Plate number</dt>
            <dd className="plate_badge">{vehicle.registrationPlate || 'Not provided'}</dd>
          </div>
          <div className="ride_detail_row">
            <dt>Seats</dt>
            <dd>
              {seatsLeft} of {ride.totalSeats} available
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}
v
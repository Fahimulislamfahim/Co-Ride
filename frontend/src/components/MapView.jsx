import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// DIU Campus Center 
const DIU_CAMPUS_CENTER = [23.8767, 90.3202];

//quic selectors
export const CAMPUS_HUBS = [
  { name: 'DIU Permanent Campus (Ashulia)', coords: [23.8767, 90.3202] },
  { name: 'Daffodil Smart City Main Gate', coords: [23.8742, 90.3228] },
  { name: 'Khagan Bazar', coords: [23.8825, 90.3180] },
  { name: 'Ashulia Bus Stand', coords: [23.8968, 90.3235] },
  { name: 'Uttara House Building', coords: [23.8741, 90.3984] },
  { name: 'Mirpur 10 Golchattar', coords: [23.8069, 90.3687] },
  { name: 'Dhanmondi 27', coords: [23.7549, 90.3764] },
];

// iii. Calculate Route Bounds: Auto-zooms map to fit active coordinates
const RouteBoundsUpdater = ({ startCoords, endCoords }) => {
  const map = useMap();

  useEffect(() => {
    const points = [];
    if (startCoords && startCoords.length === 2) points.push(startCoords);
    if (endCoords && endCoords.length === 2) points.push(endCoords);

    if (points.length === 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.setView(DIU_CAMPUS_CENTER, 14);
    }
  }, [startCoords, endCoords, map]);

  return null;
};

const MapView = ({ start, end, height = '400px' }) => {
  const hasStart = start?.coordinates && start.coordinates.length === 2;
  const hasEnd = end?.coordinates && end.coordinates.length === 2;

  // ii. Render Route: Coordinate array for Polyline
  const routeLine = hasStart && hasEnd ? [start.coordinates, end.coordinates] : [];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 shadow-lg" style={{ height }}>
      {/* i. Init Map: OpenStreetMap Tile Layer */}
      <MapContainer
        center={DIU_CAMPUS_CENTER}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        {hasStart && (
          <Marker position={start.coordinates}>
            <Popup>
              <strong>Pickup:</strong> {start.title || 'Starting Point'}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {hasEnd && (
          <Marker position={end.coordinates}>
            <Popup>
              <strong>Destination:</strong> {end.title || 'Drop-off Point'}
            </Popup>
          </Marker>
        )}

        {/* Connecting Route Polyline */}
        {routeLine.length === 2 && (
          <Polyline
            positions={routeLine}
            pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85, dashArray: '8, 6' }}
          />
        )}

        {/* Auto-fit Bounds */}
        <RouteBoundsUpdater
          startCoords={hasStart ? start.coordinates : null}
          endCoords={hasEnd ? end.coordinates : null}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
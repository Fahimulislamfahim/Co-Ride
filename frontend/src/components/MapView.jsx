import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
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

const DIU_CAMPUS_CENTER = [23.8767, 90.3202];

const RouteBoundsUpdater = ({ startCoords, endCoords }) => {
  const map = useMap();

  useEffect(() => {
    const points = [startCoords, endCoords].filter((point) => point?.length === 2);
    if (points.length === 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 15 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.setView(DIU_CAMPUS_CENTER, 14);
    }
  }, [startCoords, endCoords, map]);

  return null;
};

const MapView = ({ start, end, height = '300px' }) => {
  const hasStart = start?.coordinates?.length === 2;
  const hasEnd = end?.coordinates?.length === 2;
  const routeLine = hasStart && hasEnd ? [start.coordinates, end.coordinates] : [];

  return (
    <div className="ride_map" style={{ height }}>
      <MapContainer center={DIU_CAMPUS_CENTER} zoom={14} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasStart && (
          <Marker position={start.coordinates}>
            <Popup><strong>Pickup:</strong> {start.title}</Popup>
          </Marker>
        )}
        {hasEnd && (
          <Marker position={end.coordinates}>
            <Popup><strong>Destination:</strong> {end.title}</Popup>
          </Marker>
        )}
        {routeLine.length === 2 && (
          <Polyline positions={routeLine} pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85, dashArray: '8, 6' }} />
        )}
        <RouteBoundsUpdater
          startCoords={hasStart ? start.coordinates : null}
          endCoords={hasEnd ? end.coordinates : null}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;

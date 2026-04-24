import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const FitBounds = ({ pickup, dropoff }) => {
  const map = useMap();
  useEffect(() => {
    if (pickup && dropoff) {
      map.fitBounds([pickup, dropoff], { padding: [40, 40] });
    } else if (pickup) {
      map.setView(pickup, 14);
    } else if (dropoff) {
      map.setView(dropoff, 14);
    }
  }, [pickup, dropoff, map]);
  return null;
};

const RideMap = ({ pickupCoords, dropoffCoords }) => {
  const center = pickupCoords || dropoffCoords || [30.2849, -97.7341]; // Austin, TX

  return (
    <MapContainer center={center} zoom={13} style={{ height: '260px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      <FitBounds pickup={pickupCoords} dropoff={dropoffCoords} />
      {pickupCoords  && <Marker position={pickupCoords}  icon={pickupIcon}  />}
      {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon} />}
      {pickupCoords && dropoffCoords && (
        <Polyline positions={[pickupCoords, dropoffCoords]} color="#7c3aed" weight={3} dashArray="6,8" />
      )}
    </MapContainer>
  );
};

export default RideMap;

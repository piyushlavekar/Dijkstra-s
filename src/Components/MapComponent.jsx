import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const MapComponent = ({ path, cities, center }) => {
  return (
    <MapContainer center={center} zoom={8} className="h-screen w-screen">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {path && <Polyline positions={path} color="blue" />}
      {cities.map((city, index) => (
        <Marker key={index} position={city.position} />
      ))}
    </MapContainer>
  );
};

export default MapComponent;

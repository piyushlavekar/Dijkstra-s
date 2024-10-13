
import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import OpenRouteService from 'openrouteservice-js';
import './App.css';

function App() {
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);

  const handleCalculateRoute = () => {
    if (!startCity || !endCity) {
      alert('Please select both start and end cities.');
      return;
    }

    const ors = new OpenRouteService.Directions({
      api_key: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
    });

    ors.calculate({
      coordinates: [
        [startCity.lon, startCity.lat],
        [endCity.lon, endCity.lat],
      ],
      profile: 'driving-car',
      format: 'geojson',
    })
      .then(function (json) {
        const routeGeometry = json.features[0].geometry.coordinates;
        const routeDistance = json.features[0].properties.segments[0].distance;

        setRoute(routeGeometry);
        setDistance((routeDistance / 1000).toFixed(2));
      })
      .catch(function (err) {
        console.error(err);
      });
  };
const citiesInMaharashtra = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Nashik', lat: 19.9975, lon: 73.7898 },
  { name: 'Chhatrapati Sambhaji Nagar', lat: 19.8762, lon: 75.3433 },
  { name: 'Ahilya Nagar', lat: 19.0896, lon: 74.7388 }, // Added Ahilya Nagar
  { name: 'Thane', lat: 19.2183, lon: 72.9781 },
  { name: 'Solapur', lat: 17.6599, lon: 75.9064 },
  { name: 'Kolhapur', lat: 16.7056, lon: 74.2410 },
  { name: 'Akola', lat: 20.7062, lon: 77.0000 },
  { name: 'Amravati', lat: 20.9370, lon: 77.2752 },
  { name: 'Jalna', lat: 19.8401, lon: 75.8804 },
  { name: 'Sangli', lat: 16.8600, lon: 74.5700 },
  { name: 'Bhiwandi', lat: 19.3004, lon: 73.0409 },
  { name: 'Malegaon', lat: 20.5538, lon: 74.5277 },
  { name: 'Dhule', lat: 20.8994, lon: 74.7778 },
  { name: 'Kalyan-Dombivli', lat: 19.2186, lon: 73.1487 },
  { name: 'Ratnagiri', lat: 16.9955, lon: 73.3101 },
  { name: 'Sindhudurg', lat: 16.7001, lon: 73.9636 },
  { name: 'Palghar', lat: 19.6555, lon: 72.7480 },
  { name: 'Karad', lat: 17.2820, lon: 74.1431 },
  { name: 'Bhandara', lat: 20.9160, lon: 79.6395 },
  { name: 'Buldhana', lat: 20.6500, lon: 76.2000 },
  { name: 'Chandrapur', lat: 19.9482, lon: 79.2965 },
  { name: 'Gadchiroli', lat: 20.0889, lon: 80.1286 },
  { name: 'Gondia', lat: 21.4592, lon: 80.1995 },
  { name: 'Hingoli', lat: 19.7134, lon: 77.1314 },
  { name: 'Latur', lat: 18.4030, lon: 76.2904 },
  { name: 'Nandurbar', lat: 21.2500, lon: 74.2500 },
  { name: 'Dharashiv', lat: 18.1760, lon: 76.0600 },
  { name: 'Parbhani', lat: 19.2665, lon: 76.7748 },
  { name: 'Panchgani', lat: 17.9174, lon: 73.7433 },
  { name: 'Raigad', lat: 18.2192, lon: 73.2048 },
  { name: 'Satara', lat: 17.6869, lon: 73.9708 },
  { name: 'Thane', lat: 19.2183, lon: 72.9781 },
]
  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center transition duration-500 ease-in-out ${isNightMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300'}`}>
      <h1 className="text-5xl font-bold mb-6 text-center transition duration-1000 ease-in-out transform hover:scale-110">
        Welcome to LV Groups
      </h1>

      <h2 className="text-3xl font-semibold mb-6 text-center p-4 bg-blue-600 text-white rounded-lg shadow-lg transform transition duration-700 hover:scale-105">
        Shortest Path Finder in Maharashtra
      </h2>

      <button
        className={`mb-6 py-2 px-4 rounded ${isNightMode ? 'bg-yellow-500' : 'bg-blue-600'} text-white hover:bg-opacity-80 transition duration-300`}
        onClick={toggleTheme}
      >
        Toggle {isNightMode ? 'Day' : 'Night'} Mode
      </button>

      <div className="flex flex-col items-center mb-6 space-y-4">
        <div className="flex space-x-4">
          <select
            className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} hover:bg-gray-400 focus:ring focus:ring-blue-300`}
            onChange={(e) => setStartCity(citiesInMaharashtra.find(city => city.name === e.target.value))}
          >
            <option value="">Select Start City</option>
            {citiesInMaharashtra.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>

          <select
            className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} hover:bg-gray-400 focus:ring focus:ring-blue-300`}
            onChange={(e) => setEndCity(citiesInMaharashtra.find(city => city.name === e.target.value))}
          >
            <option value="">Select End City</option>
            {citiesInMaharashtra.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={handleCalculateRoute}
        >
          Calculate Route
        </button>
      </div>

      {route && (
        <MapContainer center={[startCity.lat, startCity.lon]} zoom={8} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />
          <Marker position={[startCity.lat, startCity.lon]}>
            <Popup>{startCity.name}</Popup>
          </Marker>
          <Marker position={[endCity.lat, endCity.lon]}>
            <Popup>{endCity.name}</Popup>
          </Marker>
        </MapContainer>
      )}

      {distance > 0 && <p className="mt-4 text-lg">Distance: {distance} km</p>}
    </div>
  );
}

export default App;

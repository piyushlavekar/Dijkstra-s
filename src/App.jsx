
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
  // Konkan Division
  { name: 'Mumbai City', lat: 18.9750, lon: 72.8258 },
  { name: 'Mumbai Suburban', lat: 19.0728, lon: 72.8826 },
  { name: 'Thane', lat: 19.2183, lon: 72.9781 },
  { name: 'Palghar', lat: 19.6555, lon: 72.7480 },
  { name: 'Raigad', lat: 18.2192, lon: 73.2048 },
  { name: 'Ratnagiri', lat: 16.9955, lon: 73.3101 },
  { name: 'Sindhudurg', lat: 16.7001, lon: 73.9636 },

  // Nashik Division
  { name: 'Nashik', lat: 19.9975, lon: 73.7898 },
  { name: 'Dhule', lat: 20.8994, lon: 74.7778 },
  { name: 'Nandurbar', lat: 21.2500, lon: 74.2500 },
  { name: 'Jalgaon', lat: 21.0054, lon: 75.5699 },
  { name: 'Ahilya Nagar', lat: 19.0956, lon: 74.7388 },  // Changed from Ahmednagar

  // Pune Division
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Satara', lat: 17.6869, lon: 73.9708 },
  { name: 'Sangli', lat: 16.8600, lon: 74.5700 },
  { name: 'Kolhapur', lat: 16.7056, lon: 74.2410 },
  { name: 'Solapur', lat: 17.6599, lon: 75.9064 },

  // Aurangabad Division
  { name: 'Chhatrapati Sambhaji Nagar', lat: 19.8762, lon: 75.3433 },  // Changed from Aurangabad
  { name: 'Jalna', lat: 19.8401, lon: 75.8804 },
  { name: 'Beed', lat: 19.6324, lon: 75.4401 },
  { name: 'Dharashiv', lat: 18.1970, lon: 76.0325 },  // Changed from Osmanabad
  { name: 'Nanded', lat: 19.0998, lon: 77.2821 },
  { name: 'Latur', lat: 18.4030, lon: 76.2904 },
  { name: 'Parbhani', lat: 19.2665, lon: 76.7748 },
  { name: 'Hingoli', lat: 19.7134, lon: 77.1314 },

  // Amravati Division
  { name: 'Amravati', lat: 20.9370, lon: 77.2752 },
  { name: 'Akola', lat: 20.7062, lon: 77.0000 },
  { name: 'Yavatmal', lat: 20.4131, lon: 78.1143 },
  { name: 'Washim', lat: 20.2040, lon: 77.1600 },
  { name: 'Buldhana', lat: 20.6500, lon: 76.2000 },

  // Nagpur Division
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Wardha', lat: 20.7483, lon: 78.7998 },
  { name: 'Bhandara', lat: 20.9160, lon: 79.6395 },
  { name: 'Gondia', lat: 21.4592, lon: 80.1995 },
  { name: 'Chandrapur', lat: 19.9482, lon: 79.2965 },
  { name: 'Gadchiroli', lat: 20.0889, lon: 80.1286 },
];

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

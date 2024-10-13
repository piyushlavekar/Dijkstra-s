import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import OpenRouteService from 'openrouteservice-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import citiesInMaharashtra from './data'; // Assuming you have a data file with city information
import './App.css';
import Spinner from './components/Spinner'; // Import the Spinner component

function App() {
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [route, setRoute] = useState(null);
  const [nearestCity, setNearestCity] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show a toast message when the app loads
  useEffect(() => {
    toast.info('Welcome to LV Groups! This website is currently under development.', {
      autoClose: 4000,
    });
  }, []);

  const findNearestCity = (latitude, longitude) => {
    let closestCity = null;
    let minDistance = Infinity;

    citiesInMaharashtra.forEach(city => {
      const distance = Math.sqrt(
        Math.pow(city.lat - latitude, 2) + Math.pow(city.lon - longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const handleCalculateRoute = () => {
    if (!startCity || !endCity) {
      alert('Please select both start and end cities.');
      return;
    }

    // Clear previous route and distance
    setRoute(null);
    setDistance(0);
    setNearestCity(null);

    const ors = new OpenRouteService.Directions({
      api_key: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
    });

    setLoading(true);
    console.log(`Calculating route from ${startCity.name} (${startCity.lat}, ${startCity.lon}) to ${endCity.name} (${endCity.lat}, ${endCity.lon})`);

    ors.calculate({
      coordinates: [
        [startCity.lon, startCity.lat],
        [endCity.lon, endCity.lat],
      ],
      profile: 'driving-car',
      format: 'geojson',
    })
      .then(function (json) {
        console.log('API response:', json);
        if (json.features && json.features.length > 0) {
          const routeFeature = json.features[0];
          if (routeFeature.geometry && routeFeature.geometry.coordinates) {
            const routeGeometry = routeFeature.geometry.coordinates;
            const routeDistance = routeFeature.properties?.segments?.[0]?.distance || 0;

            if (routeGeometry.length > 0) {
              console.log(`Route found with distance ${routeDistance} meters`);
              setRoute(routeGeometry);
              setDistance((routeDistance / 1000).toFixed(2));

              toast.success('Route successfully found!', {
                autoClose: 3000,
              });
            } else {
              console.warn('No route geometry found.');
              handleNoRouteFound(); // Call function to find nearest city
            }
          } else {
            console.warn('Invalid route geometry.');
            handleNoRouteFound(); // Call function to find nearest city
          }
        } else {
          console.warn('No valid route found.');
          handleNoRouteFound(); // Call function to find nearest city
        }
      })
      .catch(function (err) {
        console.error('Error fetching route:', err);
        toast.error('Error fetching route. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNoRouteFound = () => {
    // Find the nearest city to the starting city
    const nearest = findNearestCity(startCity.lat, startCity.lon);
    if (nearest) {
      setNearestCity(nearest);
      console.log(`Nearest city found: ${nearest.name}`);

      // Calculate route to the nearest city
      const ors = new OpenRouteService.Directions({
        api_key: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
      });

      ors.calculate({
        coordinates: [
          [startCity.lon, startCity.lat],
          [nearest.lon, nearest.lat],
        ],
        profile: 'driving-car',
        format: 'geojson',
      })
      .then(function (json) {
        const routeFeature = json.features[0];
        if (routeFeature.geometry && routeFeature.geometry.coordinates) {
          const routeGeometry = routeFeature.geometry.coordinates;
          const routeDistance = routeFeature.properties?.segments?.[0]?.distance || 0;

          if (routeGeometry.length > 0) {
            setRoute(routeGeometry);
            setDistance((routeDistance / 1000).toFixed(2));
            toast.warn(`No route found. Showing route to nearest city: ${nearest.name}`, {
              autoClose: 4000,
            });
          }
        }
      })
      .catch(function (err) {
        console.error('Error fetching route to nearest city:', err);
        toast.error('Error fetching route to nearest city. Please try again.');
      });
    } else {
      toast.error('No nearest city found.');
    }
  };

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  const calculateBounds = (route) => {
    const lats = route.map(coord => coord[1]);
    const lons = route.map(coord => coord[0]);
    const southWest = [Math.min(...lats), Math.min(...lons)];
    const northEast = [Math.max(...lats), Math.max(...lons)];
    return [southWest, northEast];
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Main Content with transparency adjustment */}
      <div
        className={`relative h-full w-full flex flex-col items-center justify-center transition duration-500 ease-in-out ${
          isNightMode ? 'bg-gray-800 bg-opacity-70 text-white' : 'bg-white bg-opacity-60 text-black'
        } px-4`}
      >
        <ToastContainer />
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center transition duration-1000 ease-in-out transform hover:scale-110">
          Welcome To Lv Groups
        </h1>

        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center p-4 bg-blue-600 bg-opacity-80 text-white rounded-lg shadow-lg transform transition duration-700 hover:scale-105">
          Discover the Shortest Routes in Maharashtra
        </h2>

        <button
          className={`mb-6 py-2 px-4 rounded ${
            isNightMode ? 'bg-yellow-500' : 'bg-blue-600'
          } text-white hover:bg-opacity-80 transition duration-300`}
          onClick={toggleTheme}
        >
          Toggle {isNightMode ? 'Day' : 'Night'} Mode
        </button>

        <div className="flex flex-col items-center mb-6 space-y-4 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <select
              className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${
                isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'
              } hover:bg-gray-400 focus:ring focus:ring-blue-300 flex-1`}
              onChange={(e) => {
                const selected = citiesInMaharashtra.find(city => city.name === e.target.value);
                setStartCity(selected || '');
                if (selected) {
                  console.log(`Start city selected: ${selected.name}`);
                }
              }}
              value={startCity.name || ''}
            >
              <option value="">Select Start City</option>
              {citiesInMaharashtra.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            <select
              className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${
                isNightMode ? 'bg-gray-700 text-white' : 'bg-white text-black'
              } hover:bg-gray-400 focus:ring focus:ring-blue-300 flex-1`}
              onChange={(e) => {
                const selected = citiesInMaharashtra.find(city => city.name === e.target.value);
                setEndCity(selected || '');
                if (selected) {
                  console.log(`End city selected: ${selected.name}`);
                }
              }}
              value={endCity.name || ''}
            >
              <option value="">Select End City</option>
              {citiesInMaharashtra.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300`}
            onClick={handleCalculateRoute}
          >
            Calculate Route
          </button>
        </div>

        {loading && <Spinner />} {/* Show loading spinner while fetching route */}

        {route && (
          <MapContainer
            center={[route[0][1], route[0][0]]}
            zoom={8}
            className="h-1/2 w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />
            {nearestCity && (
              <Marker position={[nearestCity.lat, nearestCity.lon]}>
                <Popup>{nearestCity.name}</Popup>
              </Marker>
            )}
            <Marker position={[startCity.lat, startCity.lon]}>
              <Popup>{startCity.name}</Popup>
            </Marker>
            <Marker position={[endCity.lat, endCity.lon]}>
              <Popup>{endCity.name}</Popup>
            </Marker>
          </MapContainer>
        )}
        {distance > 0 && (
          <p className="text-lg font-semibold mt-4">
            Distance: {distance} km
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

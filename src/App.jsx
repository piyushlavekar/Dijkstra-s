import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Toaster, toast } from "react-hot-toast";
import citiesInMaharashtra from "./Data/data"; // Assuming you have a data file with city information
import "./App.css";
import Spinner from "./components/Spinner"; // Import the Spinner component
import logo from "./images/logo.png"; // Replace with the correct path to your logo
import NearestCityFinder from "./components/NearestCityFinder"; // Import the NearestCityFinder
import gpsIcon from "./images/gps.png"; // Import the GPS icon
import {
  FaSun,
  FaMoon,
  FaMapMarkerAlt,
  FaRoute,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"; // Import icons

function App() {
  const { findNearestCity } = NearestCityFinder(); // Use the NearestCityFinder
  const [startCity, setStartCity] = useState(null); // Initialize as null
  const [endCity, setEndCity] = useState(null); // Initialize as null
  const [route, setRoute] = useState(null);
  const [intermediateCities, setIntermediateCities] = useState([]); // New state for intermediate cities
  const [nearestCity, setNearestCity] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true); // State for map visibility

  // Show a toast message when the app loads
  useEffect(() => {
    const toastId = toast(
      "Welcome to LV Groups! This website is currently under development.",
      {
        duration: 4000,
      }
    );

    return () => {
      toast.dismiss(toastId); // Cleanup to dismiss the toast if needed
    };
  }, []);

  const handleCalculateRoute = () => {
    if (!startCity || !endCity) {
      alert("Please select both start and end cities.");
      return;
    }

    // Clear previous route and distance
    setRoute(null);
    setDistance(0);
    setNearestCity(null);
    setIntermediateCities([]); // Clear intermediate cities

    // Use OSRM API for route calculation
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCity.lon},${startCity.lat};${endCity.lon},${endCity.lat}?overview=full&geometries=geojson`;

    setLoading(true);

    fetch(osrmUrl)
      .then((response) => response.json())
      .then((json) => {
        if (json.routes && json.routes.length > 0) {
          const routeGeometry = json.routes[0].geometry.coordinates;
          const routeDistance = json.routes[0].distance || 0;

          if (routeGeometry.length > 0) {
            console.log(`Route found with distance ${routeDistance} meters`);
            setRoute(routeGeometry);
            setDistance((routeDistance / 1000).toFixed(2));

            // Calculate intermediate cities based on the route
            const intermediateCoords = routeGeometry.map((coord) => ({
              lat: coord[1],
              lon: coord[0],
            }));

            const intermediateCities = citiesInMaharashtra.filter((city) =>
              intermediateCoords.some(
                (coord) =>
                  Math.abs(coord.lat - city.lat) < 0.05 &&
                  Math.abs(coord.lon - city.lon) < 0.05 // Adjust the threshold as needed
              )
            );

            setIntermediateCities(intermediateCities);

            toast.success("Route successfully found!", {
              duration: 3000,
            });
          } else {
            console.warn("No route geometry found.");
            const nearest = findNearestCity(startCity);
            if (nearest) {
              setNearestCity(nearest);
              toast.error(`No route found. Nearest city is ${nearest.name}.`);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching route:", err);
        toast.error("Error fetching route. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible); // Toggle map visibility
  };

  return (
    <div
    className={`relative h-screen w-screen overflow-hidden ${
      isNightMode ? "night-mode" : "default-mode"
    }`}
  >
    <div
      className={`relative h-full w-full flex flex-col items-center justify-center transition duration-500 ease-in-out ${
        isNightMode
          ? "bg-black text-white"
          : "bg-white bg-opacity-60 text-black"
      } px-4`}
    >
      <Toaster position="top-center" />
      <img
        src={logo}
        alt="Logo"
        className={`rounded-full h-20 w-20 mb-4 transition-transform duration-500 ease-in-out transform hover:scale-110 ${
          isNightMode ? "shadow-white shadow-lg" : "shadow-black shadow-lg"
        }`}
      />

      <h1 className="heading text-5xl md:text-6xl font-bold mb-6 text-center transition duration-1000 ease-in-out transform hover:scale-110">
        Welcome To <span className="text-yellow-500">LV Groups</span>
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center transition duration-700 ease-in-out transform hover:scale-105">
        Discover the Routes in Maharashtra
      </h2>

      <button
        className={`absolute top-5 right-5 p-2 rounded ${
          isNightMode ? "bg-yellow-500" : "bg-blue-600"
        } text-white transition duration-300`}
        onClick={toggleTheme}
      >
        {isNightMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>
      <div className="flex flex-col items-center mb-6 space-y-4 w-full max-w-2xl">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
          <select
            className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${
              isNightMode ? "bg-gray-700 text-white" : "bg-white text-black"
            } hover:bg-gray-400 focus:ring focus:ring-blue-300 flex-1`}
            onChange={(e) => {
              const selected = citiesInMaharashtra.find(
                (city) => city.name === e.target.value
              );
              setStartCity(selected || null); // Set to null if not found
            }}
            value={startCity ? startCity.name : ""}
          >
            <option value="">Select Start City</option>
            {citiesInMaharashtra.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            className={`border border-gray-300 rounded p-3 text-lg transition duration-500 ease-in-out ${
              isNightMode ? "bg-gray-700 text-white" : "bg-white text-black"
            } hover:bg-gray-400 focus:ring focus:ring-blue-300 flex-1`}
            onChange={(e) => {
              const selected = citiesInMaharashtra.find(
                (city) => city.name === e.target.value
              );
              setEndCity(selected || null); // Set to null if not found
            }}
            value={endCity ? endCity.name : ""}
          >
            <option value="">Select End City</option>
            {citiesInMaharashtra.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`mt-4 flex items-center justify-center bg-blue-600 text-white rounded p-3 transition duration-300 hover:bg-blue-700`}
          onClick={handleCalculateRoute}
        >
          <FaRoute className="mr-2" />
          Calculate Route
        </button>

        <button
          className={`mt-4 flex items-center justify-center bg-blue-600 text-white rounded p-3 transition duration-300 hover:bg-blue-700`}
          onClick={toggleMapVisibility}
        >
          {isMapVisible ? (
            <FaEyeSlash className="mr-2" />
          ) : (
            <FaEye className="mr-2" />
          )}
          {isMapVisible ? "Hide Map" : "Show Map"}
        </button>
      </div>

      {loading && <Spinner />}

      {isMapVisible && (
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className={`h-full w-full border-1 rounded-2xl ${
            isNightMode ? "border-white shadow-white" : "border-black shadow-black"
          } shadow-lg`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {route && (
            <Polyline
              positions={route.map((coord) => [coord[1], coord[0]])}
              color="blue"
            />
          )}

          {startCity && (
            <Marker
              position={[startCity.lat, startCity.lon]}
              icon={L.icon({
                iconUrl: gpsIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>{startCity.name}</Popup>
            </Marker>
          )}

          {endCity && (
            <Marker
              position={[endCity.lat, endCity.lon]}
              icon={L.icon({
                iconUrl: gpsIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>{endCity.name}</Popup>
            </Marker>
          )}

          {intermediateCities.map((city) => (
            <Marker
              key={city.name}
              position={[city.lat, city.lon]}
              icon={L.icon({
                iconUrl: gpsIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>{city.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {distance > 0 && (
        <div className="text-center mt-4">
          <p className="text-lg font-bold">Total Distance: {distance} km</p>
        </div>
      )}
    </div>

    {/* Footer Section */}
    <footer className="w-full text-center bg-gray-800 text-white py-4 mt-4">
      <p className="text-sm">
        Copyright © 2024 LV Groups. All Rights Reserved.
      </p>
    </footer>
  </div>
  );
}

export default App;

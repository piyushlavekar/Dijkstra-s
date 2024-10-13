// App.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import OpenRouteService from "openrouteservice-js";
import { Toaster, toast } from "react-hot-toast"; // Update the import
import citiesInMaharashtra from "./Data/data"; // Assuming you have a data file with city information
import "./App.css";
import Spinner from "./components/Spinner"; // Import the Spinner component
import logo from "./logo.png"; // Replace with the correct path to your logo
import NearestCityFinder from "./components/NearestCityFinder"; // Import the NearestCityFinder
import { FaSun, FaMoon } from "react-icons/fa"; // Import theme icons
import { FaMapMarkerAlt, FaRoute, FaEye, FaEyeSlash } from "react-icons/fa"; // Import additional icons

function App() {
  const { findNearestCity } = NearestCityFinder(); // Use the NearestCityFinder
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [route, setRoute] = useState(null);
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

    const ors = new OpenRouteService.Directions({
      api_key: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
    });

    setLoading(true);
    console.log(
      `Calculating route from ${startCity.name} (${startCity.lat}, ${startCity.lon}) to ${endCity.name} (${endCity.lat}, ${endCity.lon})`
    );

    ors
      .calculate({
        coordinates: [
          [startCity.lon, startCity.lat],
          [endCity.lon, endCity.lat],
        ],
        profile: "driving-car",
        format: "geojson",
      })
      .then(function (json) {
        console.log("API response:", json);
        if (json.features && json.features.length > 0) {
          const routeFeature = json.features[0];
          if (routeFeature.geometry && routeFeature.geometry.coordinates) {
            const routeGeometry = routeFeature.geometry.coordinates;
            const routeDistance =
              routeFeature.properties?.segments?.[0]?.distance || 0;

            if (routeGeometry.length > 0) {
              console.log(`Route found with distance ${routeDistance} meters`);
              setRoute(routeGeometry);
              setDistance((routeDistance / 1000).toFixed(2));

              toast.success("Route successfully found!", {
                duration: 3000,
              });
            } else {
              console.warn("No route geometry found.");
              // Call function to find nearest city
            }
          }
        }
      })
      .catch(function (err) {
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

  const calculateBounds = (route) => {
    const lats = route.map((coord) => coord[1]);
    const lons = route.map((coord) => coord[0]);
    const southWest = [Math.min(...lats), Math.min(...lons)];
    const northEast = [Math.max(...lats), Math.max(...lons)];
    return [southWest, northEast];
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
        <Toaster position="top-center" />{" "}
        {/* Position of the toast notifications */}
        <img
          src={logo}
          alt="Logo"
          className="rounded-full h-20 w-20 mb-4 transition duration-500 ease-in-out"
        />
        <h1 className="heading text-5xl md:text-6xl font-bold mb-6 text-center transition duration-1000 ease-in-out transform hover:scale-110">
          Welcome To <span className="text-yellow-500">LV Groups</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center transition duration-700 ease-in-out transform hover:scale-105">
          Discover the Shortest Routes in Maharashtra
        </h2>
        {/* Theme Changer Button positioned to the right */}
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
                setStartCity(selected || "");
              }}
              value={startCity.name || ""}
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
                setEndCity(selected || "");
              }}
              value={endCity.name || ""}
            >
              <option value="">Select End City</option>
              {citiesInMaharashtra.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Route Button with Icon */}
          <button
            className={`mt-4 flex items-center justify-center bg-blue-600 text-white rounded p-3 transition duration-300 hover:bg-blue-700`}
            onClick={handleCalculateRoute}
          >
            <FaRoute className="mr-2" />
            Calculate Route
          </button>

          {/* Toggle Map Visibility Button with Icon */}
          <button
            className={`mt-4 flex items-center justify-center bg-red-600 text-white rounded p-3 transition duration-300 hover:bg-red-700`}
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
        {route && (
          <div className="mt-6 text-lg">
            <p>Distance: {distance} km</p>
          </div>
        )}
        {/* Map component */}
        {isMapVisible && (
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-full w-full"
          >
            {isNightMode ? (
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            )}

            {route && (
              <Polyline
                positions={route.map((coord) => [coord[1], coord[0]])}
                color="blue"
              />
            )}

            {startCity && <Marker position={[startCity.lat, startCity.lon]} />}
            {endCity && <Marker position={[endCity.lat, endCity.lon]} />}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default App;




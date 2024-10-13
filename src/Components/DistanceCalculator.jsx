import { useEffect, useState } from 'react';
import OpenRouteService from 'openrouteservice-js';

const DistanceCalculator = ({ startCity, endCity, onCalculate }) => {
  const [route, setRoute] = useState(null);
  
  useEffect(() => {
    if (startCity && endCity) {
      const ors = new OpenRouteService.Directions({
        api_key: 'your-api-key', // Get API key from OpenRouteService
      });

      ors.calculate({
        coordinates: [[startCity.lon, startCity.lat], [endCity.lon, endCity.lat]],
        profile: 'driving-car',
        format: 'geojson'
      }).then(res => {
        setRoute(res.routes[0]);
        onCalculate(res.routes[0]);
      }).catch(err => console.error(err));
    }
  }, [startCity, endCity]);

  return null;  // This component is just to calculate the route and pass the data
};

export default DistanceCalculator;

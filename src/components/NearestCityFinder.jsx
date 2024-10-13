// src/NearestCityFinder.jsx

import citiesInMaharashtra from '../Data/data'; // Ensure the path to your city data is correct

const NearestCityFinder = () => {
  const findNearestCity = (latitude, longitude) => {
    let closestCity = null;
    let minDistance = Infinity;

    citiesInMaharashtra.forEach((city) => {
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

  return { findNearestCity };
};

export default NearestCityFinder; // Ensure this line is present

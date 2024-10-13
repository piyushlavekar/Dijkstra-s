const RouteInfoComponent = ({ towns, distance }) => {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Shortest Route Information</h2>
        <p>Total Distance: {distance} km</p>
        <h3>Towns on the way:</h3>
        <ul>
          {towns.map((town, index) => (
            <li key={index}>{town}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RouteInfoComponent;
  
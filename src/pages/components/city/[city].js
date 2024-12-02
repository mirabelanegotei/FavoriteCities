import { useRouter } from "next/router";
import styles from "../../../styles/City.module.css";
import { useEffect, useState } from "react";

const City = () => {
  const router = useRouter();
  const { cityName, lat, long, pop, elev, timez } = router.query;

  const [redirecting, setRedirecting] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cityName || !lat || !long) {
      setRedirecting(true);
      setTimeout(() => router.push("/components/Search"), 1000);
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&long=${long}`);
        const data = await res.json();
        if (res.ok) {
          setWeather(data);
        } else {
          setError(data.error || "Weather data not available.");
        }
      } catch(error) {
        setError("Unable to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [router.query]);

  const todayDate = new Date().toLocaleDateString();
  const todayWeather = weather?.time?.find(
    (date) => new Date(date).toLocaleDateString() === todayDate
  );

  if (redirecting) {
    return (
      <div className={styles.container}>
        <h1>No cities found yet!</h1>
        <p>Redirecting to the Search Page...</p>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.container}><h1>Loading weather data...</h1></div>;
  }

  if (!todayWeather) {
    return <div className={styles.container}><h1>{error || "No weather data for today."}</h1></div>;
  }

  const index = weather.time.indexOf(todayWeather);
  return (
    <div className={styles.container}>
      <h1>More details about {cityName}</h1>

      <div className={styles.weatherAndCoordinates}>
        <div className={styles.coordinates}>
          <h3>Coordinates:</h3>
          <div className={styles.boxWeather}>
            <p>Latitude: {lat}</p>
            <p>Longitude: {long}</p>
            <p>Population: {pop}</p>
            <p>Elevation: {elev}</p>
            <p>Timezone: {timez}</p>
          </div>
        </div>

        <div className={styles.weatherInfo}>
          <h2>Today's Weather:</h2>
          <div className={styles.boxWeather}>
            <p>Date: {new Date(todayWeather).toLocaleDateString()}</p>
            <p>Max Temp: {weather.temperature_2m_max[index]}°C</p>
            <p>Min Temp: {weather.temperature_2m_min[index]}°C</p>
            <p>Sunrise: {new Date(weather.sunrise[index]).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weather.sunset[index]).toLocaleTimeString()}</p>
            <p>Precipitation: {weather.precipitation_sum[index]} mm</p>
            <p>Max Wind Speed: {weather.wind_speed_10m_max[index]} m/s</p>
            <p>Wind Direction: {weather.wind_direction_10m_dominant[index]}°</p>
            <p>UV Index: {weather.uv_index_max[index]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default City;
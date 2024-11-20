import { useRouter } from "next/router";
import styles from "../../../styles/City.module.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const City = () => {
  const router = useRouter();
  const { cityName, lat, long, pop, elev, timez } = router.query;

  const [redirecting, setRedirecting] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/favorites?userId=${session.user.id}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data.favorites)) {
          const cityIsFavorite = data.favorites.some((fav) => fav.cityName === cityName);
          setIsFavorite(cityIsFavorite);
        }
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    if (session?.user?.id && cityName) {
      checkIfFavorite();
    }
  }, [session?.user?.id, cityName]);

  const addToFavorites = async () => {
    const newFavoriteCity = {
      cityName,
      lat,
      long,
      pop,
      elev,
      timez,
      userId: session?.user?.id
    };

  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFavoriteCity),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`${cityName} added to favorites!`);
      setIsFavorite(true);
    } else {
      alert(data.error || "Failed to add to favorites.");
    }
  } catch (error) {
    alert("An error occurred while adding to favorites.");
  }
};

  const removeFromFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityName,
          userId: session?.user?.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`${cityName} removed from favorites.`);
        setIsFavorite(false); 
      } else {
        alert(data.error || "Failed to remove from favorites.");
      }
    } catch (error) {
      alert("An error occurred while removing from favorites.");
    }
  };

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
      } catch (error) {
        setError("Unable to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    if (lat && long) {
      fetchWeather();
    }
  }, [lat, long]);

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

  return (
    <div className={styles.container}>
      <h1>More details about {cityName}</h1>
      <button className={styles.btn}
              onClick={isFavorite ? removeFromFavorites : addToFavorites}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
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
            <p>Max Temp: {weather.temperature_2m_max[weather.time.indexOf(todayWeather)]}°C</p>
            <p>Min Temp: {weather.temperature_2m_min[weather.time.indexOf(todayWeather)]}°C</p>
            <p>Sunrise: {new Date(weather.sunrise[weather.time.indexOf(todayWeather)]).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weather.sunset[weather.time.indexOf(todayWeather)]).toLocaleTimeString()}</p>
            <p>Precipitation: {weather.precipitation_sum[weather.time.indexOf(todayWeather)]} mm</p>
            <p>Max Wind Speed: {weather.wind_speed_10m_max[weather.time.indexOf(todayWeather)]} m/s</p>
            <p>Wind Direction: {weather.wind_direction_10m_dominant[weather.time.indexOf(todayWeather)]}°</p>
            <p>UV Index: {weather.uv_index_max[weather.time.indexOf(todayWeather)]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default City;
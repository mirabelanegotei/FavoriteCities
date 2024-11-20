import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "../../styles/Favorite.module.css";
import Link from "next/link";

const Favorites = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/favorites?userId=${session?.user?.id}`);
        const data = await res.json();

        if (res.ok) {
          if(Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
            setError("Received favorites is not an array.");
          }
        } else {
          setError(data.message || "Failed to fetch favorites.");
        }
      } catch (error) {
        setError("An error occurred while fetching favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.id]);

  const removeFromFavorites = async (cityName) => {
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
        setFavorites((prevFavorites) =>
          prevFavorites.filter((city) => city.cityName !== cityName)
        );
        alert(`${cityName} removed from favorites.`);
      } else {
        alert(data.error || "Failed to remove from favorites.");
      }
    } catch (error) {
      alert("An error occurred while removing from favorites.");
    }
  };

  if (loading) {
    return <div className={styles.container}><h1>Loading favorites...</h1></div>;
  }

  if (error) {
    return <div className={styles.container}><h1>{error}</h1></div>;
  }

  return (
      <div className={styles.container}>
        <h1 className={styles.title}>Your Favorite Cities</h1>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <ul className={styles.resultsList}>
          {favorites.length > 0 ? (
              favorites.map((city) => (
                  <li key={city.id} className={styles.resultItem}>
                    <div className={styles.resultInfo}>
                      <strong>{city.cityName}</strong>
                      <br/>
                      <span>Coordinates: {city.lat}, {city.long}</span>
                      <br />
                      <span>Population: {city.population}</span>
                      <br />
                      <span>Elevation: {city.elevation}</span>
                      <br />
                      <span>Timezone: {city.timezone}</span>
                    </div>
                    <button className={styles.btn}
                            onClick={() => removeFromFavorites(city.cityName)}>
                    Remove from Favorite</button>
                  </li>
              ))
          ) : (
              !loading && <li className={styles.noResults}>You have no favorite cities.</li>
          )}
        </ul>
      </div>
  );
};

export default Favorites;
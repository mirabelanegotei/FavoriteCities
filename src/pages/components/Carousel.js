import { useState } from "react";
import styles from "../../styles/Carousel.module.css";

const Carousel = ({title, cities}) => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const nextCity = () => {
    setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
  };

  const prevCity = () => {
    setCurrentCityIndex(
      (prevIndex) => (prevIndex - 1 + cities.length) % cities.length
    );
  };

  if (!cities || cities.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p>No cities to display.</p>
      </div>
    );
  }

  const currentCity = cities[currentCityIndex];

  return (
    <div className={styles.carouselContainer}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.carousel}>
        <div className={styles.arrowContainer} onClick={prevCity}>
          <i className={`fas fa-arrow-left ${styles.arrowColor }`}></i>
        </div>
        <div className={styles.citySlide}>
          <h4>{currentCity.cityName}</h4>
          <p>Coordinates: {currentCity.lat}, {currentCity.long}</p>
          <p>Population: {currentCity.population}</p>
          <p>Elevation: {currentCity.elevation}</p>
          <p>Timezone: {currentCity.timezone}</p>
        </div>
        <div className={styles.arrowContainer} onClick={nextCity}>
          <i className={`fas fa-arrow-right ${styles.arrowColor }`}></i>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
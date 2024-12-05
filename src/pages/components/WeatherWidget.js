import styles from "@/styles/WeatherWidget.module.css";

const WeatherWidget = ({ weather,city }) => {
    
    if (!weather) {
        return <div>Loading weather...</div>;
    }

    const todayDate = new Date().toLocaleDateString();
    const todayWeatherIndex = weather.time.findIndex(
        (date) => new Date(date).toLocaleDateString() === todayDate
      );

      if (todayWeatherIndex === -1) {
        return <div>!</div>;
      }

      const temperature = weather.temperature_2m_max[todayWeatherIndex];
      
    return (
        <div className={styles.weatherWidget}>
            <h2>{city} {temperature}°C</h2>
        </div>
    );
};

export default WeatherWidget;
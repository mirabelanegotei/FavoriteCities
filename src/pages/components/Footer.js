import { useEffect, useState } from "react";
import styles from "../../styles/Footer.module.css";
import WeatherWidget from "./WeatherWidget";

const Footer = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('');
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [error, setError] = useState('');

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => reject(error),
                    { timeout: 10000 }
                );
            } else {
                reject(new Error('Geolocation is not supported by this browser.'));
            }
        }).catch(async () => {
            try {
                const response = await fetch('https://ipinfo.io/json?token=e49297d1f1fdc1');
                const data = await response.json();
                const [latitude, longitude] = data.loc.split(',');
                return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
            } catch (err) {
                throw new Error('Error fetching location from IP.');
            }
        });
    };

    const getCityName = async (latitude, longitude) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        return data?.address?.city || data?.address?.town || data?.address?.village || 'Unknown city';
    };

    const fetchWeather = async (latitude, longitude) => {
        try {
            const res = await fetch(`/api/weather?lat=${latitude}&long=${longitude}`);
            const data = await res.json();

            if (res.ok) {
                setWeather(data);
                setCity(data.city);
            } else {
                setError('Failed to fetch weather data.');
            }
        } catch (err) {
            setError('Error fetching weather data.');
        } finally {
            setLoadingWeather(false);
        }
    };

    useEffect(() => {
        const initializeWeather = async () => {
            try {
                const location = await getUserLocation();
                const cityName = await getCityName(location.latitude, location.longitude);
                await fetchWeather(location.latitude, location.longitude);
                setCity(cityName);
            } catch (err) {
                setError('Unable to fetch weather information.');
            }
        };

        initializeWeather();
    }, []);

    return (
        <div className={styles.footer}>
            <div className={styles.weatherContainer}>
                {loadingWeather ? (
                    <div>Loading weather...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <WeatherWidget weather={weather} city={city} />
                )}
            </div>
            <ul className={styles.menu}>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </div>
    );
};

export default Footer;

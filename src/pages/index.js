import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { signOut, useSession } from "next-auth/react";
import Carousel from "./components/Carousel";
import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";

const HomePage = () =>{
    const router = useRouter();
    const {data: session, status} = useSession();

    const [favorites, setFavorites] = useState([]);
    const [randomCities, setRandomCities] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [loadingRandom, setLoadingRandom] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
            });
        };

        // Fetch favorite cities
        const fetchFavorites = async () => {
            if (session?.user?.id) {
                try {
                    const res = await fetch(`/api/favorites?userId=${session.user.id}`);
                    const data = await res.json();
                    if (res.ok) setFavorites(data.favorites || []);
                } catch (err) {
                    console.error("Failed to fetch favorites:", err);
                } finally {
                    setLoadingFavorites(false);
                }
            } else {
                setLoadingFavorites(false);
            }
        };

        // Fetch random cities
        const fetchCities = async () => {
            try {
                const location = await getUserLocation();
                console.log("Current Latitude:", location.latitude);
                console.log("Current Longitu:", location.longitude);
                const res = await fetch(`/api/random-cities?latitude=${location.latitude}&longitude=${location.longitude}`);
                const data = await res.json();
                console.log("Random Cities API response:", data);
                if (res.ok) {
                    setRandomCities(data);
                } else {
                    setError('Failed to fetch nearby cities.');
                }
            } catch (err) {
                setError('Error fetching your location or cities.');
            } finally {
                setLoadingRandom(false);
            }
        };

        // Fetch user location and random cities
        if (session?.user?.id) {
            fetchCities();
        }

        fetchFavorites();
    }, [session]);

    if(status === "loading" || loadingFavorites){
        return <div>Loading...</div>
    }

    if(!session){
        router.push('auth/SignIn');
        return null;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome, {session.user?.username ? session.user.username : "Guest"}</h1>
            {/* <h3>Let's Discover The World Together!</h3> */}
            <SearchForm/>
            <Carousel title="Your Favorite Cities" cities={favorites} />
            <Carousel title="Explore Random Cities" cities={randomCities} />
        </div>
    );
};

export default HomePage

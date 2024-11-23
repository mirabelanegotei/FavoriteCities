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
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
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
        <SearchForm/>
        <Carousel title="Your Favorite Cities" cities={favorites} />
    </div>
    );
};

export default HomePage
import { useEffect, useState } from "react";
import styles from "../../styles/Search.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchForm from "./SearchForm";

const Search = () =>{

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { term } = router.query;

    const searchCities = async (searchTerm) => {
        setLoading(true);
        try {
          const response = await fetch(`/api/geocoding?name=${searchTerm}`);
          const data = await response.json();
          setResults(data || []);
        } catch (error) {
          console.error("Error fetching city data:", error);
          setResults([]);
        }finally{
        setLoading(false);
        }
      };

      useEffect(() => {
        if (term) {
          searchCities(term);
        }
      }, [term]);

    return (
        <div className={styles.container}>
          <h2 className={styles.title}>Search for cities name</h2>
          <SearchForm defaultTerm={term || ""} onSearchComplete={searchCities} />
          {loading ? (<p>Loading...</p>) : (          
            <ul  className={styles.resultsList}>
            {results.length > 0 ? (results.map((result)=>(
                <li key={result.id} className={styles.resultItem}>
                  <div className={styles.resultInfo}>
                    <strong>{result.name}</strong> - {result.country}
                    <br/>
                    <span>Coordinates: {result.latitude},{result.longitude}</span>
                    <br/>
                    <span>Population: {result.population}</span>
                    <br/>
                    <span>Elevation: {result.elevation}</span>
                    <br/>
                    <span>Timezone: {result.timezone}</span>
                  </div>
                    <Link
                    href={{
                      pathname: "/components/city/city",
                      query: {
                        cityName: result.name,
                        lat: result.latitude,
                        long: result.longitude,
                        pop: result.population,
                        elev: result.elevation,
                        timez: result.timezone,
                    },}}><button className={styles.btn}>More details</button></Link>
                </li>
            ))):(!loading && <li className={styles.noResults}>No locations found</li>)}
          </ul>)}
        </div>)}

export default Search;
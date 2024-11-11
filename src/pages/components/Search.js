import styles from "../../styles/Search.module.css";

const Search = () =>{
    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Welcome to Search Page</h1>
          <h2 className={styles.title}>Search for cities name</h2>
          <form className={styles.form}>
            <input className={styles.input} type="search" placeholder="Search here ..." />
            <i className={`fas fa-search ${styles.icon}`} ></i> 
          </form>
          <ul  className={styles.resultsList}>
           <li className={styles.noResults}>No results found</li>
          </ul>
        </div>)}

export default Search;
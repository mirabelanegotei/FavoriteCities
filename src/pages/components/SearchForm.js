import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/SearchForm.module.css";

const SearchForm = ({ defaultTerm = "", onSearchComplete }) => {
  const [searchTerm, setSearchTerm] = useState(defaultTerm);
  const router = useRouter();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/components/Search?term=${searchTerm}`); 
      if (onSearchComplete) {
        onSearchComplete(searchTerm); 
      }
    }
  };

  const handleIconClick = () => {
    if (searchTerm.trim()) {
      router.push(`/components/Search?term=${searchTerm}`);
      if (onSearchComplete) {
        onSearchComplete(searchTerm);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSearch}>
      <input
        className={styles.input}
        type="search"
        placeholder="Search here ..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <i className={`fas fa-search ${styles.icon}`} onClick={handleIconClick}></i>
    </form>
  );
};

export default SearchForm;
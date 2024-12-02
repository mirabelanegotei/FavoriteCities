import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useState } from "react";

const Navbar = () =>{
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(prevState => !prevState);
      };

      const closeMenu = () => {
        setIsChecked(false);
      };
    return (
        <div className={styles.navigation}>
            <input type="checkbox" className={styles.toggle} 
            checked={isChecked} onChange={handleToggle}/>
            <div className={styles.hamburger} onClick={handleToggle}></div>
            <ul className={styles.menu}>
                <Link href="/" passHref><li onClick={closeMenu}>Home</li></Link>
                <Link href="/components/Search" passHref><li onClick={closeMenu}>Search</li></Link>
                <Link href="/components/Favorites" passHref><li onClick={closeMenu}>Favorite</li></Link>
                <Link href="/components/city/City" passHref><li onClick={closeMenu}>City</li></Link>
            </ul>
        </div>
    )
}
export default Navbar;

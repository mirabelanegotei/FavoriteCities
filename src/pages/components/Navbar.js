import Link from "next/link";
import styles from "../../styles/Navbar.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

const Navbar = () =>{
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(prevState => !prevState);
      };

      const closeMenu = () => {
        setIsChecked(false);
      };

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Search", path: "/components/Search" },
        { name: "Favorite", path: "/components/Favorites" },
        { name: "City", path: "/components/city/City" },
      ];
    const isActive = (path) => router.pathname === path ? styles.active : "";

    return (
        <div className={styles.navigation}>
            <input type="checkbox" className={styles.toggle} 
            checked={isChecked} onChange={handleToggle}/>
            <div className={styles.hamburger} onClick={handleToggle}></div>
            <ul className={styles.menu}>
                {menuItems.map(({ name, path }) => (
                    <Link key={path} href={path} passHref>
                      <li className={`${isActive(path)} ${styles.menuItem}`}onClick={closeMenu}>
                        {name}
                      </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
export default Navbar;

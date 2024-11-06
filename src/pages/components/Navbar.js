import Link from "next/link";
import styles from "../../styles/Navbar.module.css";

const Navbar = () =>{

    return (
        <div className={styles.navigation}>
            <input type="checkbox" className={styles.toggle}/>
            <div className={styles.hamburger}></div>
            <ul className={styles.menu}>
                <Link href="/"><li>Home</li></Link>
                <Link href="/components/Search"><li>Search</li></Link>
                <Link href="/components/Favorites"><li>Favorite</li></Link>
                <Link href="/components/City"><li>City</li></Link>
            </ul>
        </div>
    )
}
export default Navbar;

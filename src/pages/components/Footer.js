import styles from "../../styles/Footer.module.css";
const Footer = () =>{
    return (
        <div className={styles.footer}>
            <ul className={styles.menu}>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </div>
    )
}

export default Footer;
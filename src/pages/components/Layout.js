import Link from 'next/link';
import Navbar from './Navbar'; 
import styles from '@/styles/Home.module.css'; 
import Footer from './Footer';

const Layout = ({ children }) => { 
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* <Link href="/"><img rel="icon" src="/logo.svg" alt="Logo" /></Link> */}
          <Link href="/"><h1>Favorite Cities</h1></Link>
        </div>
        <Navbar />
      </header>     
      <main className={styles.main}>
        {children} 
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
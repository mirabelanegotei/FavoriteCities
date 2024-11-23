import Link from 'next/link';
import Navbar from './Navbar'; 
import styles from '@/styles/Home.module.css'; 
import Footer from './Footer';
import { signOut, useSession } from "next-auth/react";

const Layout = ({ children }) => { 
  const {data: session, status} = useSession();

  if(status === "loading"){
    return <div>Loading...</div>
}

if(!session){
    router.push('auth/SignIn');
    return null;
}

  const handleSignOut = () =>{
    signOut({redirect: true}).then(()=>{
        router.push('auth/SignIn');
    });
};

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
      <div
      className={styles.signOutContainer}
      onClick={() => handleSignOut()}>
      <i className={`fas fa-sign-out-alt ${styles.whiteSignOut }`}></i>
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
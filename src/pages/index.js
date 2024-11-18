import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { signOut, useSession } from "next-auth/react";

 const HomePage = () =>{
    const router = useRouter();
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
    <div className={styles.container}>
        <h1>Welcome, {session.user?.username ? session.user.username : "Guest"}</h1>
        <h3>Let's Discover The World Together!</h3>
        <button onClick={handleSignOut} className={styles.btn}>Sign Out</button>
    </div>
    );
};

export default HomePage
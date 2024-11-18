import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/sign.module.css";
import Link from "next/link"; 

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", { redirect: false, username, password });

    if (result.error) {
      setError("Authentication failed! Please check your details.");
    } else {
      router.push("/"); 
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className={styles.btn} type="submit">
          Sign In
        </button>
        <div className={styles.message}>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/SignUp" passHref>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/signUp.module.css";
import Link from "next/link"; 

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/auth/SignIn"); 
    } else {
      setError(data.error || "An error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className={styles.btn}>
          Sign Up
        </button>
        <div className={styles.message}>
          <p>
            Already have an account?{" "}
            <Link href="/auth/SignIn" passHref>
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
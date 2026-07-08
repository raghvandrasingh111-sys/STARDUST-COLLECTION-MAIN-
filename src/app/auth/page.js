"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import styles from "./auth.module.css";

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Redirect to home if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: "Signed in successfully! Redirecting...", type: "success" });
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        });
        if (error) throw error;
        setMessage({
          text: "Registration successful! If email verification is enabled, check your inbox.",
          type: "success",
        });
      }
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.authCard}>
          <div className={styles.titleSection}>
            <span className="shimmer-text" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Welcome to Stardust
            </span>
            <h2>{isSignIn ? "Cosmic Login" : "Join the Galaxy"}</h2>
            <p>Access your orders and premium jewelry vault</p>
          </div>

          <div className={styles.tabs}>
            <button
              onClick={() => {
                setIsSignIn(true);
                setMessage({ text: "", type: "" });
              }}
              className={`${styles.tab} ${isSignIn ? styles.activeTab : ""}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignIn(false);
                setMessage({ text: "", type: "" });
              }}
              className={`${styles.tab} ${!isSignIn ? styles.activeTab : ""}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@cosmic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? "Aligning stars..." : isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <button onClick={handleGoogleSignIn} disabled={loading} className={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {message.text && (
            <div className={`${styles.message} ${message.type === "error" ? styles.error : styles.success}`}>
              {message.text}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

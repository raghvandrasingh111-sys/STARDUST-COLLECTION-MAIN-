"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, LogOut, ShieldAlert, Search, Heart, MapPin, User } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Monitor scroll behavior to add shadow/white bg on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      checkAdminStatus(currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = (currentUser) => {
    if (!currentUser || !currentUser.email) {
      setIsAdmin(false);
      return;
    }
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase());
    setIsAdmin(adminEmails.includes(currentUser.email.toLowerCase()));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/catalog`);
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      {/* CaratLane Announcement Strip */}
      <div className={styles.announcementStrip}>
        <span>CARATLANE - A TANISHQ PARTNERSHIP</span>
        <div className={styles.stripLinks}>
          <Link href="/catalog">Find a Store</Link>
          <span className={styles.separator}>|</span>
          <Link href="/">Book Try at Home</Link>
        </div>
      </div>

      <div className={styles.navbar}>
        {/* Logo */}
        <Link href="/" className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 8L92 42L50 92L8 42L50 8Z" fill="currentColor" />
              <path d="M50 8V92" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 42H92" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="42" r="10" fill="#ffffff" />
            </svg>
          </div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoMain}>CARATLANE</span>
            <span className={styles.logoSub}>A TANISHQ Partnership</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for Rings, Earrings, Solitaires..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            aria-label="Search jewelry"
          />
          <button onClick={triggerSearch} className={styles.searchBtn} aria-label="Submit search">
            <Search size={18} />
          </button>
        </div>

        {/* Action Controls */}
        <div className={styles.actions}>
          {/* Pincode Info */}
          <div className={styles.pincodeContainer}>
            <MapPin size={18} />
            <span className={styles.pincodeText}>Pincode</span>
          </div>

          {/* Admin Tag */}
          {isAdmin && (
            <Link href="/admin" className={styles.adminLink} title="Admin Portal">
              <ShieldAlert size={18} />
            </Link>
          )}

          {/* User Account */}
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userTrigger} aria-label="Account Menu">
                <User size={20} />
                <span className={styles.userName}>{user.email.split("@")[0]}</span>
              </button>
              <div className={styles.dropdown}>
                {isAdmin && <Link href="/admin">Admin Panel</Link>}
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className={styles.loginLink}>
              <User size={20} />
              <span className={styles.loginText}>Sign In</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/catalog" className={styles.wishlistLink} aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          {/* Cart */}
          <Link href="/cart" className={styles.cartContainer}>
            <button className={styles.actionBtn} aria-label="Shopping Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>
          </Link>
        </div>
      </div>

      {/* Sub-navigation Menu */}
      <nav className={styles.subNavigation}>
        <ul className={styles.navList}>
          <li><Link href="/catalog?category=Rings">RINGS</Link></li>
          <li><Link href="/catalog?category=Earrings">EARRINGS</Link></li>
          <li><Link href="/catalog?category=Solitaires">SOLITAIRES</Link></li>
          <li><Link href="/catalog?category=Necklaces">NECKLACES</Link></li>
          <li><Link href="/catalog?category=Bracelets">BRACELETS</Link></li>
          <li><Link href="/catalog?category=All">GIFTS</Link></li>
          <li><Link href="/catalog?category=All">NEW ARRIVALS</Link></li>
        </ul>
      </nav>
    </header>
  );
}


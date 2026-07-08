import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* 1. Trust Assurance Bar */}
      <div className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 11l2 2 4-4" />
                </svg>
              </div>
              <div className={styles.trustText}>
                <h4>100% Certified</h4>
                <p>All jewellery certified by international labs</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8l-8 8" />
                  <path d="M8 8l8 8" />
                </svg>
              </div>
              <div className={styles.trustText}>
                <h4>15-Day Money Back</h4>
                <p>100% Refund, no questions asked</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <div className={styles.trustText}>
                <h4>Lifetime Exchange</h4>
                <p>Exchange or upgrade your jewellery easily</p>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className={styles.trustText}>
                <h4>Free & Insured Shipping</h4>
                <p>Safe door-to-door delivery across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className={styles.mainFooter}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div className={styles.brandColumn}>
            <h3>CARATLANE</h3>
            <p className={styles.brandSub}>A TANISHQ Partnership</p>
            <p className={styles.brandDescription}>
              CaratLane is India's leading omni-channel jewellery brand, crafting beautiful, lightweight 
              diamond and gold jewellery designed for everyday wear.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Know Our Brand</h4>
            <ul className={styles.links}>
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Our Story</Link></li>
              <li><Link href="/catalog">Press Room</Link></li>
              <li><Link href="/catalog">Careers</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Jewellery Guide</h4>
            <ul className={styles.links}>
              <li><Link href="/catalog">Diamond Guide</Link></li>
              <li><Link href="/catalog">Gold Guide</Link></li>
              <li><Link href="/catalog">Purity Guide</Link></li>
              <li><Link href="/catalog">Ring Size Guide</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Customer Service</h4>
            <ul className={styles.links}>
              <li><Link href="/catalog">15-Day Returns</Link></li>
              <li><Link href="/catalog">Free Try At Home</Link></li>
              <li><Link href="/catalog">Track Your Order</Link></li>
              <li><Link href="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Credits */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomFlex}>
            <p>&copy; {new Date().getFullYear()} CaratLane Trading Pvt. Ltd. All rights reserved.</p>
            <p className={styles.tataCredit}>Partnered with TATA & Tanishq</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


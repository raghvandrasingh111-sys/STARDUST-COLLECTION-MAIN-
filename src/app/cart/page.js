"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { Trash2, Minus, Plus, CheckCircle } from "lucide-react";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart, isInitialized } = useCart();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const shippingCost = cartTotal > 50 || cartTotal === 0 ? 0 : 4.99;
  const totalAmount = cartTotal + shippingCost;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {
        "Content-Type": "application/json"
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: cart,
          totalAmount,
          shippingDetails: {
            fullName,
            address,
            city,
            postalCode,
            phone
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      if (data.success) {
        setOrderId(data.order._id);
        clearCart();
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`} style={{ textAlign: "center", color: "#9f9fb5" }}>
          Loading your celestial cart...
        </main>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h2>Order Placed!</h2>
            <p>
              Your order has been written in the stars. We have received your order details and are preparing it for delivery.
            </p>
            <div className={styles.orderId}>Order ID: {orderId}</div>
            <div>
              <Link href="/catalog" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`${styles.main} container`}>
        <h1 className={styles.title}>Your Starry Cart</h1>

        {cart.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added any cosmic pieces yet.</p>
            <Link href="/catalog" className="btn-primary">
              Browse Celestial Vault
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Left Column: Items */}
            <div className={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.productId} className={styles.cartItem}>
                  <div className={styles.itemImageWrapper}>
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80"}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100px"
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  </div>
                  <div className={styles.itemControls}>
                    <div className={styles.qtySelector}>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)} 
                      className={styles.removeBtn}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Sidebar & Checkout */}
            <div className={styles.sidebar}>
              {/* Order Summary */}
              <div className={styles.summaryCard}>
                <h3 className={styles.cardTitle}>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryVal}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span className={styles.summaryVal}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p style={{ fontSize: "0.75rem", color: "var(--star-gold)", marginBottom: "1rem" }}>
                    * Add ${(50 - cartTotal).toFixed(2)} more to get FREE shipping!
                  </p>
                )}
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalVal}>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className={styles.checkoutCard}>
                <h3 className={styles.cardTitle}>Shipping Details</h3>
                <form onSubmit={handleCheckout} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Luna Lovegood"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input
                      id="address"
                      type="text"
                      required
                      placeholder="123 Starry Way, Nebula Heights"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="postalCode">Postal / ZIP Code</label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                    {loading ? "Locking order..." : "Place Order ✨"}
                  </button>

                  {error && (
                    <div style={{ color: "#ff7676", fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

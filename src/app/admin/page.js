"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // products or orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Authenticate and verify admin emails
  useEffect(() => {
    async function checkAuth() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        setCheckingAuth(false);
        return;
      }
      
      setSession(currentSession);
      const email = currentSession.user?.email || "";
      const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
      const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase());
      
      if (adminEmails.includes(email.toLowerCase())) {
        setIsAdmin(true);
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  // Fetch admin data once auth is verified
  useEffect(() => {
    if (!isAdmin || !session) return;
    
    async function fetchData() {
      setLoadingData(true);
      try {
        const headers = {
          Authorization: `Bearer ${session.access_token}`
        };
        
        // Fetch products
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);

        // Fetch orders
        const orderRes = await fetch("/api/orders", { headers });
        const orderData = await orderRes.json();
        if (orderData.success) setOrders(orderData.orders);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoadingData(false);
      }
    }
    
    fetchData();
  }, [isAdmin, session]);

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this celestial product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`} style={{ textAlign: "center", color: "#9f9fb5" }}>
          Authenticating dashboard credentials...
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`}>
          <div className={styles.unauthorized}>
            <ShieldAlert size={64} style={{ color: "var(--star-gold)" }} />
            <h2>Admin Portal Locked</h2>
            <p>You must be signed in with an authorized administrator account to access this panel.</p>
            <Link href="/auth" className="btn-primary" style={{ marginTop: '1rem' }}>
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`}>
          <div className={styles.unauthorized}>
            <ShieldAlert size={64} style={{ color: "#ff7676" }} />
            <h2>Access Denied</h2>
            <p>Your email account ({session.user.email}) is not authorized to access this administration panel.</p>
            <Link href="/" className="btn-secondary" style={{ marginTop: '1rem' }}>
              Back to Store
            </Link>
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
        <div className={styles.header}>
          <div>
            <span className="shimmer-text" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Stardust Management
            </span>
            <h1>Control Panel</h1>
          </div>
          
          <div className={styles.controls}>
            <Link href="/admin/new-product" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}>
              <Plus size={16} /> New Product
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.tabs}>
            <button 
              onClick={() => setActiveTab("products")} 
              className={`${styles.tab} ${activeTab === "products" ? styles.activeTab : ""}`}
            >
              Catalog Products ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab("orders")} 
              className={`${styles.tab} ${activeTab === "orders" ? styles.activeTab : ""}`}
            >
              Customer Orders ({orders.length})
            </button>
          </div>

          {loadingData ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-text)" }}>
              Retrieving cosmic dashboard entries...
            </div>
          ) : activeTab === "products" ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} className={styles.productRow}>
                      <td>
                        <div className={styles.thumbnailWrapper}>
                          <Image
                            src={prod.images[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80"}
                            alt={prod.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="50px"
                          />
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{prod.title}</td>
                      <td>{prod.category}</td>
                      <td style={{ color: "var(--star-gold)", fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                      <td>{prod.stock}</td>
                      <td style={{ textAlign: "right" }}>
                        <button 
                          onClick={() => handleDeleteProduct(prod._id)} 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--muted-text)", padding: "2rem" }}>
                        No products inside the cosmic vault. Upload one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className={styles.orderRow}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{order._id.substring(0, 8)}...</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.shippingDetails?.fullName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted-text)" }}>{order.customerEmail}</div>
                      </td>
                      <td>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: "0.85rem" }}>
                            {item.title} (x{item.quantity})
                          </div>
                        ))}
                      </td>
                      <td style={{ color: "var(--star-gold)", fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${order.status === "Pending" ? styles.statusPending : styles.statusShipped}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--muted-text)" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--muted-text)", padding: "2rem" }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

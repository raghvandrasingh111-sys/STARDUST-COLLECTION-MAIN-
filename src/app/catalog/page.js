"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./catalog.module.css";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL params initial values
  const urlCategory = searchParams.get("category") || "All";
  const urlSearch = searchParams.get("search") || "";
  const urlSort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState(urlSearch);
  const [sort, setSort] = useState(urlSort);

  // Sync category from URL if it changes (e.g. clicking categories in Footer)
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          category,
          search,
          sort
        });
        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [category, search, sort]);

  const categories = ["All", "Necklaces", "Rings", "Earrings", "Bracelets"];

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    // Update URL params
    const params = new URLSearchParams(window.location.search);
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const params = new URLSearchParams(window.location.search);
    if (!val) {
      params.delete("search");
    } else {
      params.set("search", val);
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    const params = new URLSearchParams(window.location.search);
    params.set("sort", val);
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  return (
    <main className={`${styles.main} container`}>
      <div className={styles.titleSection}>
        <span className="shimmer-text" style={{ letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
          Explore Stardust
        </span>
        <h1 className="star-glow">The Cosmic Vault</h1>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`${styles.filterBtn} ${category === cat ? styles.activeFilter : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.rightControls}>
          <input
            type="text"
            placeholder="Search celestial jewelry..."
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <select value={sort} onChange={handleSortChange} className={styles.sortSelect}>
            <option value="newest">Newest Releases</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Opening the cosmic vaults...</div>
      ) : products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No Stars Found</h3>
          <p>We couldn't find any jewelry matching your filters. Try resetting search terms or filters.</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setCategory("All");
              setSearch("");
              setSort("newest");
              router.push("/catalog");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </main>
  );
}

export default function CatalogPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '150px', textAlign: 'center', color: '#9f9fb5' }}>Loading starry vault...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </>
  );
}

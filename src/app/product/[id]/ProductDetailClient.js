"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import styles from "./product-detail.module.css";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const defaultImage = (product.images && product.images.length > 0)
    ? product.images[0]
    : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80";

  const [activeImage, setActiveImage] = useState(defaultImage);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Default stock count is 10 if not set, for interactive mock flows
  const stockCount = product.stock !== undefined ? product.stock : 10;

  const incrementQty = () => {
    if (quantity >= stockCount) return;
    setQuantity((q) => q + 1);
  };

  const decrementQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className={`${styles.main} container`}>
      <Link href="/catalog" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className={styles.grid}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={activeImage}
              alt={product.title}
              fill
              className={styles.mainImage}
              sizes="(max-width: 992px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ""}`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span className={styles.categoryTag}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          
          <div className={styles.divider}></div>
          
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.stockStatus}>
            Status:{" "}
            {stockCount > 0 ? (
              <span className={styles.inStock}>In Stock ({stockCount} available)</span>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>

          <div className={styles.divider}></div>

          {stockCount > 0 && (
            <div className={styles.purchaseControls}>
              <div className={styles.quantitySelector}>
                <button onClick={decrementQty} className={styles.qtyBtn} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button onClick={incrementQty} className={styles.qtyBtn} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              
              <button onClick={handleAddToCart} className="btn-primary" style={{ flexGrow: 1 }}>
                {added ? "Added to Cart ✨" : "Add to Cart"}
              </button>
            </div>
          )}

          <div className={styles.specs}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Details & Care</h3>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Material</span>
              <span className={styles.specValue}>Premium non-tarnish alloy with AAA cubic zirconia</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Size</span>
              <span className={styles.specValue}>Adjustable fit, comfort base</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Category</span>
              <span className={styles.specValue}>{product.category}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Care</span>
              <span className={styles.specValue}>Avoid perfumes, wipe clean with micro-fiber cloth</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

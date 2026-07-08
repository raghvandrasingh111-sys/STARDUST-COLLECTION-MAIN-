"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart } from "lucide-react";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Generate realistic CaratLane pricing
  const discountPercent = 15;
  const originalPrice = (product.price / (1 - discountPercent / 100)).toFixed(2);

  // Map category to realistic gold weight and metal purity specs
  const getSpecs = () => {
    if (product.category === "Rings") return "18Kt Yellow Gold • 1.45 g";
    if (product.category === "Earrings") return "18Kt Yellow Gold • 2.10 g";
    if (product.category === "Necklaces") return "14Kt Rose Gold • 3.20 g";
    if (product.category === "Bracelets") return "14Kt Yellow Gold • 4.50 g";
    return "18Kt Yellow Gold • 1.80 g";
  };

  const hasTrendingTag = product.tags && product.tags.some(
    (tag) => tag.toLowerCase() === "trending" || tag.toLowerCase() === "bestseller"
  );
  
  const displayTag = product.tags && product.tags.length > 0 ? product.tags[0] : "Bestseller";

  const imageUrl = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60";

  return (
    <div className={styles.card}>
      <Link href={`/product/${product._id}`}>
        <div className={styles.imageWrapper}>
          {/* Tag Badges */}
          <div className={styles.tagsContainer}>
            <span className={`${styles.tag} ${hasTrendingTag ? styles.trending : ""}`}>
              {displayTag}
            </span>
            <span className={styles.deliveryTag}>1 Day Delivery</span>
          </div>

          {/* Wishlist Heart Icon */}
          <button 
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.activeWishlist : ""}`}
            onClick={handleWishlistToggle}
            aria-label="Toggle wishlist"
          >
            <Heart size={18} fill={isWishlisted ? "var(--shimmer-pink)" : "none"} />
          </button>

          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      </Link>

      <div className={styles.details}>
        {/* Price Row */}
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <span className={styles.originalPrice}>${originalPrice}</span>
          <span className={styles.discount}>({discountPercent}% OFF)</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product._id}`}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>

        {/* Specs Descriptor */}
        <p className={styles.specs}>{getSpecs()}</p>
        
        {/* CaratLane Call to Action Grid */}
        <div className={styles.cardActions}>
          <button 
            className={styles.tryBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert(`Booked Try at Home session for: ${product.title}`);
            }}
          >
            Try at Home
          </button>
          <button 
            onClick={handleAddToCart}
            className={styles.addBtn}
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}


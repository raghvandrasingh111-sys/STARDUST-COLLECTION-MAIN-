"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ShopByBudget.module.css";

const BUDGETS = [
  { label: "All Trending", value: "all" },
  { label: "Under $20", value: "under20" },
  { label: "$20 - $22", value: "20to22" },
  { label: "$22 - $25", value: "22to25" },
  { label: "Above $25", value: "above25" }
];

export default function ShopByBudget({ products }) {
  const [activeBudget, setActiveBudget] = useState("all");

  const filterProducts = () => {
    if (activeBudget === "all") return products;
    return products.filter((product) => {
      const price = product.price;
      if (activeBudget === "under20") return price <= 20;
      if (activeBudget === "20to22") return price > 20 && price <= 22;
      if (activeBudget === "22to25") return price > 22 && price <= 25;
      if (activeBudget === "above25") return price > 25;
      return true;
    });
  };

  const filteredItems = filterProducts();

  return (
    <div className={styles.container}>
      {/* Budget Tabs */}
      <div className={styles.tabList}>
        {BUDGETS.map((budget) => (
          <button
            key={budget.value}
            className={`${styles.tabBtn} ${activeBudget === budget.value ? styles.activeTab : ""}`}
            onClick={() => setActiveBudget(budget.value)}
          >
            {budget.label}
          </button>
        ))}
      </div>

      {/* Filtered Product Grid */}
      {filteredItems.length > 0 ? (
        <div className={styles.productsGrid}>
          {filteredItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No jewellery found in this budget range. Try exploring another budget tier.</p>
        </div>
      )}
    </div>
  );
}

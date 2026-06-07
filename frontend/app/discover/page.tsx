"use client";

import BottomNavigation from "@/components/BottomNavigation";
import styles from "./discover.module.css";

const products = [
  { id: 1, name: "Midnight Gold Saree", price: "$450", image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=400", height: "300px" },
  { id: 2, name: "Crimson Silk Scarf", price: "$120", image: "https://images.unsplash.com/photo-1605001011155-3882a87bfbd0?auto=format&fit=crop&q=80&w=400", height: "200px" },
  { id: 3, name: "Royal Blue Dupatta", price: "$200", image: "https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=400", height: "250px" },
  { id: 4, name: "Emerald Kanchipuram", price: "$550", image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=400", height: "350px" },
  { id: 5, name: "Ivory Cotton Weave", price: "$85", image: "https://images.unsplash.com/photo-1605001011155-3882a87bfbd0?auto=format&fit=crop&q=80&w=400", height: "220px" },
];

export default function Discover() {
  return (
    <main className={styles.discoverContainer}>
      <div className={styles.stickyHeader}>
        <h1 className={styles.title}>Discovery</h1>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search weaves, regions, artisans..." className={styles.searchInput} />
        </div>
        <div className={styles.filterPills}>
          <span className={`${styles.pill} ${styles.activePill}`}>All</span>
          <span className={styles.pill}>Silk</span>
          <span className={styles.pill}>Cotton</span>
          <span className={styles.pill}>Kanchipuram</span>
        </div>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.masonryGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageWrapper} style={{ height: product.height }}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.wishlistIcon}>♡</div>
              </div>
              <div className={styles.productInfo}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: '100px' }}></div>
      </div>
      <BottomNavigation />
    </main>
  );
}

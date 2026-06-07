"use client";

import BottomNavigation from "@/components/BottomNavigation";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.homeContainer}>
      <div className={styles.scrollArea}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Good Evening,</h1>
            <p className={styles.username}>Aisha</p>
          </div>
          <div className={styles.headerIcons}>
            <div className={styles.iconCircle}>🔔</div>
            <div className={styles.profileAvatar}>
              {/* Placeholder for Profile */}
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.heroCard}>
            <img 
              src="https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=800" 
              alt="Story of the week" 
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <span className={styles.badge}>Story of the Week</span>
              <h2 className={styles.heroTitle}>The Silk Threads of Kanchipuram</h2>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>Read Story</button>
            </div>
          </div>
        </section>

        {/* Curated Collections */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Curated For You</h3>
            <span className={styles.seeAll}>See All</span>
          </div>
          <div className={styles.horizontalScroll}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.productCard}>
                <img 
                  src="https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=400" 
                  alt="Product" 
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <p className={styles.productName}>Midnight Gold Saree</p>
                  <p className={styles.productPrice}>$450</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Artisans */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Meet the Masters</h3>
          </div>
          <div className={styles.horizontalScroll}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.artisanAvatar}>
                <img 
                  src="https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=200" 
                  alt="Artisan" 
                  className={styles.artisanImage}
                />
                <p className={styles.artisanName}>Ramesh</p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacer for bottom navigation */}
        <div style={{ height: '100px' }}></div>
      </div>
      
      <BottomNavigation />
    </main>
  );
}

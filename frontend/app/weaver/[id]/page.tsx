"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./weaver.module.css";

export default function WeaverProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Story");

  const tabs = ["Story", "Masterpieces", "Impact"];

  const products = [
    { id: 1, name: "Sunset Silk", image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Indigo Dye", image: "https://images.unsplash.com/photo-1605001011155-3882a87bfbd0?auto=format&fit=crop&q=80&w=400" }
  ];

  return (
    <main className={styles.weaverContainer}>
      <button className={styles.backBtn} onClick={() => router.back()}>← Back</button>
      
      <div className={styles.heroSection}>
        <img 
          src="https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=800" 
          alt="Weaver Portrait" 
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.weaverName}>Ramesh Kumar</h1>
          <p className={styles.weaverLocation}>📍 Varanasi, Uttar Pradesh</p>
          <p className={styles.lineage}>4th Generation Master Weaver</p>
        </div>
      </div>

      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.contentSection}>
        {activeTab === "Story" && (
          <div className={styles.storyContent}>
            <p className={styles.storyText}>
              "My hands learned the rhythm of the loom before I could even walk. Every thread I weave carries the whispers of my ancestors."
            </p>
            <div className={styles.videoPlaceholder}>
              <span className={styles.playIcon}>▶</span>
            </div>
          </div>
        )}

        {activeTab === "Masterpieces" && (
          <div className={styles.grid}>
            {products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <p className={styles.productName}>{product.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Impact" && (
          <div className={styles.impactContent}>
            <div className={styles.metricCard}>
              <h3 className={styles.metricNumber}>12</h3>
              <p className={styles.metricLabel}>Apprentices Trained</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricNumber}>$5k</h3>
              <p className={styles.metricLabel}>Raised for Community</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button className="btn-primary" style={{ width: '100%' }}>Sponsor Ramesh</button>
      </div>
    </main>
  );
}

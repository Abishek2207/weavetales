"use client";

import BottomNavigation from "@/components/BottomNavigation";
import styles from "./map.module.css";

const regions = [
  { id: 1, name: "Varanasi", style: "Banarasi Silk", top: "35%", left: "55%", weavers: 240 },
  { id: 2, name: "Kanchipuram", style: "Kanjivaram Silk", top: "75%", left: "45%", weavers: 310 },
  { id: 3, name: "Dhaka", style: "Jamdani", top: "28%", left: "72%", weavers: 180 },
  { id: 4, name: "Pochampally", style: "Ikat", top: "65%", left: "48%", weavers: 150 },
  { id: 5, name: "Patan", style: "Patola", top: "38%", left: "25%", weavers: 90 },
];

export default function HeritageMap() {
  return (
    <main className={styles.mapContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Heritage Map</h1>
        <p className={styles.subtitle}>India's living weaving clusters</p>
      </div>

      {/* Map Area */}
      <div className={styles.mapArea}>
        {/* India map silhouette background */}
        <svg
          viewBox="0 0 400 500"
          className={styles.mapSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 20 L320 60 L360 120 L370 200 L340 280 L300 360 L250 430 L200 470 L150 430 L100 360 L60 280 L40 200 L50 120 L80 60 Z"
            fill="#1a1a1a"
            stroke="#d4af37"
            strokeWidth="1.5"
            opacity="0.6"
          />
          {/* Major rivers */}
          <path d="M180 80 Q200 150 220 200 Q240 240 200 300" stroke="#d4af3720" strokeWidth="2" fill="none" />
          <path d="M100 200 Q150 220 220 200" stroke="#d4af3720" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Weaving cluster pins */}
        {regions.map((region) => (
          <div
            key={region.id}
            className={styles.pin}
            style={{ top: region.top, left: region.left }}
          >
            <div className={styles.pinDot}>
              <div className={styles.pinPulse}></div>
            </div>
            <div className={styles.pinLabel}>
              <span className={styles.pinName}>{region.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Region Detail Drawer */}
      <div className={styles.drawer}>
        <div className={styles.drawerHandle}></div>
        <h3 className={styles.drawerTitle}>Weaving Clusters</h3>
        <div className={styles.regionList}>
          {regions.map((region) => (
            <div key={region.id} className={styles.regionCard}>
              <div className={styles.regionDot}></div>
              <div className={styles.regionInfo}>
                <span className={styles.regionName}>{region.name}</span>
                <span className={styles.regionStyle}>{region.style}</span>
              </div>
              <span className={styles.regionCount}>{region.weavers} weavers</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ width: "100%", marginTop: "16px" }}>
          Explore All Regions
        </button>
      </div>

      <BottomNavigation />
    </main>
  );
}

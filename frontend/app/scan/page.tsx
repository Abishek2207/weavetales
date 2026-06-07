"use client";

import { useState } from "react";
import styles from "./scan.module.css";
import BottomNavigation from "@/components/BottomNavigation";

export default function ScanPage() {
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => {
    setScanned(true);
  };

  return (
    <main className={styles.scanContainer}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Scan Weave Tag</h1>
        <p className={styles.subtitle}>Point your camera at any WeaveTales QR tag</p>
      </div>

      <div className={styles.viewfinderArea}>
        {!scanned ? (
          <>
            {/* Simulated camera background */}
            <div className={styles.cameraFeed}>
              <img
                src="https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=800"
                alt="Camera feed"
                className={styles.cameraImage}
              />
              <div className={styles.cameraOverlay}></div>
            </div>

            {/* Scanning frame */}
            <div className={styles.scanFrame}>
              <div className={`${styles.corner} ${styles.topLeft}`}></div>
              <div className={`${styles.corner} ${styles.topRight}`}></div>
              <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
              <div className={`${styles.corner} ${styles.bottomRight}`}></div>
              <div className={styles.scanLine}></div>
            </div>

            <div className={styles.controls}>
              <button className={styles.torchBtn}>🔦</button>
              <button className="btn-primary" onClick={handleSimulateScan}>
                Simulate Scan
              </button>
              <button className={styles.torchBtn}>⌨️</button>
            </div>
          </>
        ) : (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Authentic Weave Found!</h2>
            <p className={styles.successSub}>Midnight Gold Kanchipuram Saree</p>
            <p className={styles.weaverInfo}>By Ramesh Kumar · Varanasi</p>
            <div className={styles.aiBadge}>
              <span>🤖 AI Verified Authentic</span>
            </div>
            <a href="/weaver/1" className="btn-primary" style={{ marginTop: "24px", display: "block", textAlign: "center" }}>
              Explore Story
            </a>
            <button className={styles.rescanBtn} onClick={() => setScanned(false)}>
              Scan Another
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}

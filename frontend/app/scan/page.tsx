"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./scan.module.css";
import BottomNavigation from "@/components/BottomNavigation";

export default function ScanPage() {
  const [scanned, setScanned] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasCameraError(true);
      }
    };

    if (!scanned) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanned]);

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
            <div className={styles.cameraFeed}>
              {hasCameraError ? (
                <div style={{ color: "white", padding: "20px", textAlign: "center", marginTop: "40%" }}>
                  Camera access denied or unavailable. Please allow camera permissions in your browser.
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={styles.cameraImage}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              )}
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

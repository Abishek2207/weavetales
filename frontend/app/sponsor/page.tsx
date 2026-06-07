"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sponsor.module.css";

const tiers = [
  {
    id: "thread",
    name: "Thread",
    price: "$10/mo",
    desc: "Covers raw material for one weave session",
    icon: "🧵",
  },
  {
    id: "loom",
    name: "Loom",
    price: "$30/mo",
    desc: "Funds loom maintenance for a month",
    icon: "⚙️",
  },
  {
    id: "legacy",
    name: "Legacy",
    price: "$100/mo",
    desc: "Sponsors an apprentice for a full month",
    icon: "🏛️",
  },
];

export default function SponsorWeaver() {
  const [selected, setSelected] = useState("loom");
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  const selectedTier = tiers.find((t) => t.id === selected)!;

  if (confirmed) {
    return (
      <main className={styles.sponsorContainer}>
        <div className={styles.successState}>
          <div className={styles.confettiArea}>✨ ✨ ✨</div>
          <h1 className={styles.successTitle}>You're a Patron!</h1>
          <p className={styles.successText}>
            Your {selectedTier.name} sponsorship for <strong style={{ color: "#d4af37" }}>Ramesh Kumar</strong> is now active.
            He'll receive a notification with your message of support.
          </p>
          <button className="btn-primary" style={{ width: "100%", marginTop: "32px" }} onClick={() => router.push("/impact")}>
            View My Impact
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.sponsorContainer}>
      <button className={styles.backBtn} onClick={() => router.back()}>← Back</button>

      <div className={styles.scrollArea}>
        <div className={styles.weaverBanner}>
          <img
            src="https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=400"
            alt="Ramesh Kumar"
            className={styles.weaverImg}
          />
          <div>
            <h2 className={styles.weaverName}>Ramesh Kumar</h2>
            <p className={styles.weaverLocation}>Varanasi · Master Weaver</p>
          </div>
        </div>

        <h1 className={styles.title}>Choose Your Support</h1>

        <div className={styles.tiersContainer}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`${styles.tierCard} ${selected === tier.id ? styles.selectedTier : ""}`}
              onClick={() => setSelected(tier.id)}
            >
              <div className={styles.tierIcon}>{tier.icon}</div>
              <div className={styles.tierInfo}>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierDesc}>{tier.desc}</p>
              </div>
              <span className={styles.tierPrice}>{tier.price}</span>
            </div>
          ))}
        </div>

        <div className={styles.impactBox}>
          <h3 className={styles.impactTitle}>Your {selectedTier.name} tier will:</h3>
          <p className={styles.impactDetail}>{selectedTier.desc}. You'll receive monthly updates from Ramesh directly to your dashboard.</p>
        </div>
      </div>

      <div className={styles.footer}>
        <button className="btn-primary" style={{ width: "100%" }} onClick={() => setConfirmed(true)}>
          Confirm Sponsorship · {selectedTier.price}
        </button>
      </div>
    </main>
  );
}

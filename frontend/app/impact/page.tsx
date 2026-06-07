"use client";

import BottomNavigation from "@/components/BottomNavigation";
import styles from "./impact.module.css";

const metrics = [
  { label: "Lives Impacted", value: 1240, unit: "weavers", progress: 0.72, color: "#d4af37" },
  { label: "Carbon Saved", value: 8.4, unit: "tonnes CO₂", progress: 0.55, color: "#4ade80" },
  { label: "Heritage Preserved", value: 34, unit: "techniques", progress: 0.88, color: "#60a5fa" },
];

const timeline = [
  { month: "Jan 2025", event: "Sponsored 3 weavers in Varanasi", icon: "🧵" },
  { month: "Mar 2025", event: "Funded a loom restoration in Kanchipuram", icon: "🏺" },
  { month: "May 2025", event: "Your purchase trained 2 apprentices", icon: "🎓" },
];

function RingChart({ progress, color, size = 90 }: { progress: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a2a" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.5s ease" }}
      />
    </svg>
  );
}

export default function ImpactDashboard() {
  return (
    <main className={styles.impactContainer}>
      <div className={styles.scrollArea}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Impact</h1>
          <p className={styles.subtitle}>Together, we're reweaving heritage</p>
        </header>

        {/* Ring Charts */}
        <section className={styles.ringsSection}>
          {metrics.map((m) => (
            <div key={m.label} className={styles.ringCard}>
              <div className={styles.ringWrapper}>
                <RingChart progress={m.progress} color={m.color} />
                <div className={styles.ringCenter}>
                  <span className={styles.ringValue}>{Math.round(m.progress * 100)}%</span>
                </div>
              </div>
              <p className={styles.ringLabel}>{m.label}</p>
              <p className={styles.ringUnit}><strong style={{ color: m.color }}>{m.value}</strong> {m.unit}</p>
            </div>
          ))}
        </section>

        {/* Summary Banner */}
        <div className={styles.summaryBanner}>
          <p className={styles.summaryText}>
            🌟 You are a <strong style={{ color: "#d4af37" }}>Heritage Patron</strong> — in the top 5% of supporters.
          </p>
        </div>

        {/* Timeline */}
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Your Journey</h2>
          {timeline.map((item, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineIcon}>{item.icon}</div>
              <div className={styles.timelineContent}>
                <p className={styles.timelineEvent}>{item.event}</p>
                <span className={styles.timelineMonth}>{item.month}</span>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div style={{ padding: "0 24px 24px" }}>
          <button className="btn-primary" style={{ width: "100%", marginBottom: "12px" }}>
            Share My Impact
          </button>
          <button className={styles.secondaryBtn}>Increase Monthly Sponsorship</button>
        </div>

        <div style={{ height: "100px" }}></div>
      </div>
      <BottomNavigation />
    </main>
  );
}

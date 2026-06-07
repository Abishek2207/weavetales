"use client";

import BottomNavigation from "@/components/BottomNavigation";
import styles from "./profile.module.css";

const sections = [
  { title: "My Orders", items: ["Midnight Gold Saree · Shipped", "Crimson Scarf · Delivered"] },
  { title: "My Weavers", items: ["Ramesh Kumar · Varanasi", "Priya Devi · Kanchipuram"] },
  { title: "Saved Stories", items: ["Silk Road of Varanasi", "The Last Ikat Masters"] },
];

export default function UserProfile() {
  return (
    <main className={styles.profileContainer}>
      <div className={styles.scrollArea}>
        <header className={styles.heroHeader}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>A</div>
            <div className={styles.patronBadge}>Heritage Patron</div>
          </div>
          <h1 className={styles.name}>Aisha Sharma</h1>
          <p className={styles.email}>aisha@example.com</p>
        </header>

        {/* Wardrobe */}
        <section className={styles.wardrobeSection}>
          <h2 className={styles.sectionTitle}>Digital Wardrobe</h2>
          <div className={styles.wardrobeGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.wardrobeItem}>
                <img
                  src="https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=200"
                  alt="Wardrobe item"
                  className={styles.wardrobeImg}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.title} className={styles.listSection}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.items.map((item) => (
              <div key={item} className={styles.listItem}>
                <span>{item}</span>
                <span className={styles.chevron}>›</span>
              </div>
            ))}
          </section>
        ))}

        {/* Settings */}
        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Settings</h2>
          {["Notifications", "Language", "Privacy", "Log Out"].map((item) => (
            <div key={item} className={`${styles.listItem} ${item === "Log Out" ? styles.logoutItem : ""}`}>
              <span>{item}</span>
              <span className={styles.chevron}>›</span>
            </div>
          ))}
        </section>

        <div style={{ height: "100px" }}></div>
      </div>
      <BottomNavigation />
    </main>
  );
}

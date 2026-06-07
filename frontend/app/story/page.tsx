"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./story.module.css";

const slides = [
  {
    id: 1,
    type: "intro",
    image: "https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=800",
    text: "1200 AD. The courts of Varanasi hum with the rhythm of a thousand looms.",
  },
  {
    id: 2,
    type: "craft",
    image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=800",
    text: "Each thread of the Banarasi silk is woven with 24-carat gold zari — a tradition unchanged for 800 years.",
  },
  {
    id: 3,
    type: "artisan",
    image: "https://images.unsplash.com/photo-1605001011155-3882a87bfbd0?auto=format&fit=crop&q=80&w=800",
    text: "Today, master weaver Ramesh Kumar carries this legacy forward. This is his story.",
  },
];

export default function StoryExperience() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          if (current < slides.length - 1) {
            setCurrent((c) => c + 1);
          } else {
            router.push("/weaver/1");
          }
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x > width / 2) {
      if (current < slides.length - 1) setCurrent((c) => c + 1);
      else router.push("/weaver/1");
    } else {
      if (current > 0) setCurrent((c) => c - 1);
    }
  };

  const slide = slides[current];

  return (
    <main className={styles.storyContainer} onClick={handleTap}>
      {/* Background image */}
      <img src={slide.image} alt="Story" className={styles.storyBg} key={slide.id} />
      <div className={styles.storyOverlay}></div>

      {/* Progress bars */}
      <div className={styles.progressBars}>
        {slides.map((s, i) => (
          <div key={s.id} className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width:
                  i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); router.back(); }}>✕</button>

      {/* Story text */}
      <div className={styles.storyContent} key={`text-${slide.id}`}>
        <p className={styles.storyText}>{slide.text}</p>
      </div>

      {/* Swipe hint */}
      <div className={styles.swipeHint}>
        <span>↑ Swipe up to shop this piece</span>
      </div>
    </main>
  );
}

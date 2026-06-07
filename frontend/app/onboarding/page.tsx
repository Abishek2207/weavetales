"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";

const slides = [
  {
    id: 1,
    title: "Discover Heritage",
    description: "Explore the rich history and intricate craftsmanship of authentic Indian handlooms.",
    image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Meet the Masters",
    description: "Connect directly with the artisans. Hear their stories and see their masterpieces.",
    image: "https://images.unsplash.com/photo-1544026244-8d969b4e7e63?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "AI Authenticated",
    description: "Every weave's journey is verified and preserved using our advanced AI tracing.",
    image: "https://images.unsplash.com/photo-1605001011155-3882a87bfbd0?auto=format&fit=crop&q=80&w=800",
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push("/home");
    }
  };

  const handleSkip = () => {
    router.push("/home");
  };

  return (
    <main className={styles.onboardingContainer}>
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`${styles.imageWrapper} ${index === currentSlide ? styles.activeImage : ""}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title}
            className={styles.bgImage}
          />
          <div className={styles.overlay}></div>
        </div>
      ))}

      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.skipBtn} onClick={handleSkip}>Skip</button>
      </div>

      {/* Bottom Sheet */}
      <div className={styles.bottomSheet}>
        {/* Pagination Dots */}
        <div className={styles.pagination}>
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
            />
          ))}
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.title}>{slides[currentSlide].title}</h2>
          <p className={styles.description}>{slides[currentSlide].description}</p>
        </div>

        <button className="btn-primary" onClick={handleNext}>
          {currentSlide === slides.length - 1 ? "Begin the Journey" : "Next"}
        </button>
      </div>
    </main>
  );
}

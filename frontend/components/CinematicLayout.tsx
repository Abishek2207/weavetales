"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CinematicLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted]         = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrollY, setScrollY]         = useState(0);
  const [cursorX, setCursorX]         = useState(-100);
  const [cursorY, setCursorY]         = useState(-100);
  const [cursorHover, setCursorHover] = useState(false);
  const pathname                      = usePathname();

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    /* Custom cursor */
    const moveCursor = (e: MouseEvent) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);

    /* Hover detection for interactive elements */
    const addHover = () => setCursorHover(true);
    const rmHover  = () => setCursorHover(false);
    
    // MutationObserver to attach hover events to dynamically added elements
    const attachHovers = () => {
      const els = document.querySelectorAll("a, button, [data-cursor-hover]");
      els.forEach(el => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", rmHover);
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", rmHover);
      });
    };

    attachHovers();

    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    /* Scroll progress */
    const handleScroll = () => {
      const el  = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${pct})`;
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    /* Intersection observer for reveals */
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    
    setTimeout(() => {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el => revealObserver.observe(el));
    }, 200);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      revealObserver.disconnect();
    };
  }, [pathname]);

  if (!mounted) return <>{children}</>;

  return (
    <>
      {/* ── Custom Cursor ── */}
      <div className={`cursor-ring${cursorHover ? " hover" : ""}`} style={{ left: cursorX, top: cursorY }} />
      <div className="cursor-dot"  style={{ left: cursorX, top: cursorY }} />

      {/* ── Scroll Progress ── */}
      <div ref={progressRef} className="scroll-progress" />

      {/* ════════════════════════════════════════
          NAVBAR
          ════════════════════════════════════════ */}
      <nav className={`wt-navbar${scrollY > 60 ? " scrolled" : ""}`}>
        <Link href="/">
          <div className="wt-logo">
            <div className="wt-logo-mark">W</div>
            <span className="wt-logo-text">WeaveTales</span>
            <span className="wt-logo-ai">AI</span>
          </div>
        </Link>

        <div className="wt-nav-links">
          <Link href="/#collection" className="wt-nav-link">Collection</Link>
          <Link href="/#how-it-works" className="wt-nav-link">Platform</Link>
          <Link href="/#artisans" className="wt-nav-link">Artisans</Link>
          <Link href="/chat" className="wt-nav-link">AI Guide</Link>
          <Link href="/#verify" className="wt-nav-cta">Verify Product</Link>
        </div>

        <button className={`wt-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`wt-mobile-drawer${menuOpen ? " open" : ""}`}>
        <Link href="/#collection" onClick={() => setMenuOpen(false)}>Collection</Link>
        <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>Platform</Link>
        <Link href="/#artisans" onClick={() => setMenuOpen(false)}>Artisans</Link>
        <Link href="/chat" onClick={() => setMenuOpen(false)}>AI Guide 🤖</Link>
        <Link href="/#verify" onClick={() => setMenuOpen(false)} style={{color:"var(--gold)"}}>Verify Product</Link>
      </div>

      <main>{children}</main>
    </>
  );
}

"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Types ── */
interface Artisan { id: number; name: string; location: string; }
interface Product  { id: number; title: string; material: string; price: number; image_url: string; artisan: Artisan; story: { generated_text: string } | null; }

const API = "http://localhost:8000/api";

const FALLBACK: Product[] = [
  { id: 1, title: "Kanjeevaram Silk Saree", material: "Pure Mulberry Silk", price: 350,
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    artisan: { id: 1, name: "Ramesh Kumar", location: "Kanchipuram, Tamil Nadu" }, story: { generated_text: "A tale of tradition woven in gold..." } },
  { id: 2, title: "Pochampally Ikat", material: "Cotton Silk Blend", price: 120,
    image_url: "https://images.unsplash.com/photo-1583391733958-d15fa1cb075b?auto=format&fit=crop&w=800&q=80",
    artisan: { id: 2, name: "Lakshmi Devi", location: "Bhoodan Pochampally, Telangana" }, story: null },
  { id: 3, title: "Banarasi Brocade", material: "Pure Gold Zari Silk", price: 480,
    image_url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
    artisan: { id: 3, name: "Anwar Hussain", location: "Varanasi, UP" }, story: { generated_text: "Golden threads speak of ancient emperors..." } },
  { id: 4, title: "Chanderi Silk", material: "Handspun Chanderi", price: 180,
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    artisan: { id: 4, name: "Priya Devi", location: "Chanderi, MP" }, story: null },
];

/* ── SVG Icons ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

/* ── Particle config ── */
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 8,
  opacity: Math.random() * 0.5 + 0.2,
}));

/* ── Marquee items ── */
const MARQUEE_ITEMS = [
  "🧵 Banarasi Silk", "🪡 Kanjivaram Weaves", "🌟 Authentic Heritage",
  "✨ AI-Powered Stories", "🏺 GI Certified", "🎨 Natural Dyes",
  "🔐 Verified Artisans", "🌿 Sustainable Craft", "🕌 700+ Year Tradition",
  "🛡️ Blockchain Certified", "💎 Pure Gold Zari", "🪷 Handcrafted Excellence",
];

export default function Home() {
  /* ── State ── */
  const [mounted, setMounted]         = useState(false);
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");

  /* ── Init ── */
  useEffect(() => {
    setMounted(true);

    /* Fetch products */
    fetch(`${API}/products/`)
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) && d.length > 0 ? d : FALLBACK); setLoading(false); })
      .catch(() => { setProducts(FALLBACK); setLoading(false); });

    // Handled by CinematicLayout

    /* Intersection observer for reveals */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    setTimeout(() => {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el => observer.observe(el));
    }, 200);

    return () => {
      observer.disconnect();
    };
  }, []);

  const categories = ["All", "Silk", "Cotton", "Wool"];
  const filtered   = filter === "All" ? products : products.filter(p => p.material.toLowerCase().includes(filter.toLowerCase()));

  if (!mounted) return null;

  return (
    <>

      {/* ════════════════════════════════════════
          HERO
          ════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-grid-overlay" />

        {/* Particles */}
        <div className="hero-particles" aria-hidden>
          {PARTICLES.map(p => (
            <div key={p.id} className="hero-particle" style={{
              width: p.size, height: p.size,
              left: `${p.left}%`,
              bottom: 0,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity,
            }} />
          ))}
        </div>

        {/* Ornament SVG */}
        <svg className="hero-ornament" viewBox="0 0 400 400" aria-hidden>
          {[40,80,120,160,180].map(r => <circle key={r} cx="200" cy="200" r={r} strokeWidth="0.5"/>)}
          {Array.from({length: 12}).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return <line key={i} x1="200" y1="200" x2={200 + 190 * Math.cos(angle)} y2={200 + 190 * Math.sin(angle)} strokeWidth="0.5"/>;
          })}
          <circle cx="200" cy="200" r="15" strokeWidth="1"/>
          {Array.from({length: 8}).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = 200 + 60 * Math.cos(angle);
            const y = 200 + 60 * Math.sin(angle);
            return <circle key={`dot-${i}`} cx={x} cy={y} r="3" strokeWidth="0.5"/>;
          })}
        </svg>

        {/* Left content */}
        <div className="hero-left">
          <div className="hero-badge anim-slide-up">
            <span className="hero-badge-dot" />
            From Loom to Living Legacy
          </div>

          <h1 className="hero-headline anim-slide-up-2">
            Every thread<br/>
            holds a <em>living</em><br/>
            <span className="gradient-text">story.</span>
          </h1>

          <p className="hero-sub anim-slide-up-3">
            WeaveTales AI gives authentic Indian handlooms a verifiable digital identity — connecting global hearts directly to the artisans who breathed life into every weave.
          </p>

          <div className="hero-actions anim-slide-up-4">
            <Link href="#collection" className="btn-hero-primary">
              Explore Collection <ArrowIcon />
            </Link>
            <Link href="/chat" className="btn-hero-ghost">
              Ask AI Guide <span style={{fontSize:"1.1rem"}}>🤖</span>
            </Link>
          </div>

          <div className="hero-metrics anim-slide-up-5">
            <div>
              <div className="hero-metric-num">1.2M+</div>
              <div className="hero-metric-lbl">Artisans to empower</div>
            </div>
            <div className="hero-metric-divider" />
            <div>
              <div className="hero-metric-num">100%</div>
              <div className="hero-metric-lbl">Verifiable authenticity</div>
            </div>
            <div className="hero-metric-divider" />
            <div>
              <div className="hero-metric-num">40+</div>
              <div className="hero-metric-lbl">Weave traditions</div>
            </div>
          </div>
        </div>

        {/* Right — Product Card */}
        <div className="hero-right anim-fade-in">
          {/* Floating badge 1 */}
          <div className="hero-float-badge badge-pos-1">
            <div className="hero-float-badge-icon">🧵</div>
            <div>
              <div className="hero-float-badge-val">142</div>
              <div className="hero-float-badge-lbl">Pieces this season</div>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-showcase-card">
              <img src="/product.png" alt="Midnight Blue Banarasi" className="hero-showcase-img" />
              <div className="hero-showcase-body">
                <div className="hero-showcase-id">Unique ID: WT‑8492‑B</div>
                <div className="hero-showcase-title">Midnight Blue Banarasi</div>
                <div className="hero-showcase-sub">Woven by Ramesh Kumar · Varanasi</div>
              </div>
              <div className="hero-showcase-foot">
                <div className="verified-chip">
                  <div className="verified-chip-icon"><CheckIcon /></div>
                  Verified Authentic
                </div>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="rgba(201,168,76,0.7)">
                  <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zM13 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-4 2h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Floating badge 2 */}
          <div className="hero-float-badge badge-pos-2">
            <div className="hero-float-badge-icon">✨</div>
            <div>
              <div className="hero-float-badge-val">AI Story</div>
              <div className="hero-float-badge-lbl">Ready to unlock</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE TICKER
          ════════════════════════════════════════ */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <React.Fragment key={i}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          COLLECTION
          ════════════════════════════════════════ */}
      <section id="collection" className="section collection-section">
        <div className="container">
          <div className="collection-controls">
            <div className="reveal">
              <div className="section-eyebrow">Curated Gallery</div>
              <h2 className="section-title" style={{marginBottom: "0.5rem"}}>Heritage Collection</h2>
              <p className="section-sub" style={{maxWidth: 420}}>AI-documented for authenticity. Each piece carries a story only its maker can tell.</p>
            </div>

            <div className="filter-pills reveal delay-2">
              {categories.map(c => (
                <button key={c} className={`filter-pill${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="collection-grid">
              {[1,2,3,4].map(i => <div key={i} className="shimmer-card" style={{transitionDelay: `${i * 0.1}s`}} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign:"center", padding:"6rem 2rem", color:"var(--text-muted)"}}>
              <div style={{fontSize:"3rem", marginBottom:"1rem"}}>🪡</div>
              No products found for this filter.
            </div>
          ) : (
            <div className="collection-grid">
              {filtered.map((p, i) => (
                <Link key={p.id} href={`/product/${p.id}`} className={`reveal delay-${Math.min(i+1, 5)}`}>
                  <div className="product-card">
                    <div className="product-card-img-wrap">
                      <img src={p.image_url} alt={p.title} className="product-card-img" />
                      <div className="product-card-overlay" />
                      {p.story && <div className="product-card-story-badge">✨ Story Ready</div>}
                      <div className="product-card-quick-view">View Details →</div>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-location">{p.artisan.location}</div>
                      <h3 className="product-card-title">{p.title}</h3>
                      <div className="product-card-material">{p.material}</div>
                      <div className="product-card-footer">
                        <div className="product-card-price">₹{(p.price * 83).toFixed(0)}</div>
                        <div className="product-card-artisan">
                          <strong>{p.artisan.name}</strong>
                          Master Weaver
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CHALLENGE SECTION
          ════════════════════════════════════════ */}
      <section className="section challenge-section">
        <div className="container">
          <div className="section-header-centered reveal">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>The Challenge</div>
            <h2 className="section-title">A Heritage at Risk</h2>
            <p className="section-sub">Centuries of tradition are eroding. Machine-made replicas, invisible supply chains, and silenced artisans — WeaveTales exists to fix this.</p>
          </div>

          <div className="challenge-cards">
            {[
              { icon: <SearchIcon />, num: "01", title: "Lack of Traceability", desc: "Buyers can't track a product's journey from loom to shelf, severing the living connection to its origin and its maker." },
              { icon: <ShieldIcon />, num: "02", title: "Counterfeit Crisis", desc: "A flood of machine-made replicas undercuts artisans and destroys trust in the authentic handloom tag." },
              { icon: <UserIcon />, num: "03", title: "Lost Narratives", desc: "Cultural significance, ancestral techniques, and personal stories vanish entirely in the modern retail chain." },
              { icon: <GlobeIcon />, num: "04", title: "Limited Visibility", desc: "Weavers lack digital tools to reach international markets willing to pay a premium for authentic craftsmanship." },
            ].map((card, i) => (
              <div key={card.num} className={`challenge-card reveal delay-${i+1}`}>
                <div className="challenge-card-num">{card.num}</div>
                <div className="challenge-card-icon">{card.icon}</div>
                <div className="challenge-card-title">{card.title}</div>
                <div className="challenge-card-desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════ */}
      <section id="how-it-works" className="section how-section">
        <div className="container">
          <div className="section-header-centered reveal">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>The Solution</div>
            <h2 className="section-title">How WeaveTales Works</h2>
            <p className="section-sub">Transforming physical fabric into a verifiable living story through AI, blockchain, and human connection.</p>
          </div>

          <div className="how-steps">
            {[
              { emoji: "🧵", num: "1", title: "Artisan Onboarding", desc: "Weavers register products via a simple mobile app — logging materials, dyeing techniques, and time spent at the loom." },
              { emoji: "🏷️", num: "2", title: "Digital Identity", desc: "A tamper-proof NFC tag or unique QR code is permanently bonded to the finished handloom product at point of creation." },
              { emoji: "✨", num: "3", title: "AI Story Engine", desc: "Seven AI modules craft a rich, multilingual narrative — weaving the artisan's profile with deep regional heritage data." },
              { emoji: "📱", num: "4", title: "Immersive Discovery", desc: "Buyers scan the tag to unlock the full story, verify authenticity on-chain, and directly support the creator." },
            ].map((step, i) => (
              <div key={step.num} className={`how-step reveal delay-${i+1}`}>
                <div className="how-step-circle" data-num={step.num}>
                  <span style={{fontSize:"1.8rem"}}>{step.emoji}</span>
                </div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EXPERIENCE FEATURES
          ════════════════════════════════════════ */}
      <section id="experience" className="section experience-section">
        <div className="container">
          <div className="section-header-centered reveal">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>The Experience</div>
            <h2 className="section-title">Unlock the Story in Every Thread</h2>
            <p className="section-sub">One scan opens a world of culture, craft, and human connection that no luxury brand can replicate.</p>
          </div>

          {/* Feature 1 */}
          <div className="experience-feature">
            <div className="experience-img-frame reveal-left">
              <img src="/product2.png" alt="Digital Certificate of Authenticity" />
              <div className="experience-img-glow" />
              <div className="experience-img-cert">
                <div className="experience-img-cert-icon"><CheckIcon /></div>
                <div>
                  <div className="experience-img-cert-text">GI Certified Authentic</div>
                  <div className="experience-img-cert-sub">Geographic Indication verified</div>
                </div>
              </div>
            </div>
            <div className="experience-content reveal-right">
              <div className="section-eyebrow">Digital Certificate</div>
              <h2 className="section-title" style={{fontSize:"clamp(2rem, 3vw, 3rem)"}}>Buy with absolute <em className="font-serif" style={{fontStyle:"italic", color:"var(--gold-bright)"}}>confidence.</em></h2>
              <p className="section-sub" style={{marginBottom:"1.5rem"}}>Instantly verify origin, materials, and technique. Every claim is cryptographically signed and immutable.</p>
              <div className="experience-features-list">
                {["Cryptographically secure unique ID per piece", "Detailed material breakdown — Mulberry Silk, Pure Gold Zari", "Geographic Indication (GI) tag verification on-chain"].map(feat => (
                  <div key={feat} className="experience-feature-item">
                    <div className="exp-feature-dot" />
                    <div className="exp-feature-text">{feat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="experience-feature flip">
            <div className="experience-img-frame reveal-right" style={{background:"var(--dark-2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem", minHeight:"400px"}}>
              <div className="timeline-block">
                {[
                  { title: "Yarn Preparation", desc: "Locally sourced silk treated with natural enzymes for tensile strength." },
                  { title: "Natural Dyeing", desc: "Dyed using madder root and indigo for a centuries-old crimson hue." },
                  { title: "Loom Setup & Weaving", desc: "Intricate Korvai technique requiring 22 meticulous days to complete." },
                  { title: "Finishing & Certification", desc: "Hand-inspected, photographed, and digitally tagged by the artisan." },
                ].map(item => (
                  <div key={item.title} className="timeline-item">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="experience-content reveal-left">
              <div className="section-eyebrow">Crafting Journey</div>
              <h2 className="section-title" style={{fontSize:"clamp(2rem, 3vw, 3rem)"}}>The story behind <em className="font-serif" style={{fontStyle:"italic", color:"var(--gold-bright)"}}>every stitch.</em></h2>
              <p className="section-sub">Step through the full timeline of creation — from raw fibre to the final weave. Understand the immense human effort your garment represents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ARTISANS
          ════════════════════════════════════════ */}
      <section id="artisans" className="section artisans-section">
        <div className="container">
          <div className="section-header-centered reveal">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>The Creators</div>
            <h2 className="section-title">Meet the Masters</h2>
            <p className="section-sub">Every piece is a labor of love spanning decades of practice. Connect directly with the artisans preserving India's living heritage.</p>
          </div>

          <div className="artisans-grid">
            {[
              { img: "/artisan.png", loc: "Varanasi, Uttar Pradesh", name: "Ramesh Kumar", tags: ["Banarasi", "Gold Brocade", "Pit Loom"], quote: "I learned the art from my grandfather. Every thread I weave carries the spirit of our holy city and 12 generations before me.", years: "30+", pieces: "142" },
              { img: "/artisan2.png", loc: "Kanchipuram, Tamil Nadu", name: "Lakshmi Devi", tags: ["Kanjivaram", "Korvai Technique", "Natural Dyes"], quote: "The loom is my temple and my prayer. The colours I weave reflect the vibrancy of our festivals and the devotion of our women.", years: "25+", pieces: "98" },
            ].map((a, i) => (
              <div key={a.name} className={`artisan-card reveal delay-${i + 1}`}>
                <div className="artisan-card-img-wrap">
                  <img src={a.img} alt={a.name} className="artisan-card-img" />
                  <div className="artisan-card-img-overlay" />
                </div>
                <div className="artisan-card-body">
                  <div className="artisan-card-loc">{a.loc}</div>
                  <h3 className="artisan-card-name">{a.name}</h3>
                  <div className="artisan-tags">
                    {a.tags.map(t => <span key={t} className="artisan-tag">{t}</span>)}
                  </div>
                  <blockquote className="artisan-quote-block">"{a.quote}"</blockquote>
                  <div className="artisan-stats-row">
                    <div>
                      <div className="artisan-stat-val">{a.years}</div>
                      <div className="artisan-stat-lbl">Years of Experience</div>
                    </div>
                    <div>
                      <div className="artisan-stat-val">{a.pieces}</div>
                      <div className="artisan-stat-lbl">Pieces Woven</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SCANNER DEMO
          ════════════════════════════════════════ */}
      <section id="verify" className="section scanner-section">
        <div className="container">
          <div className="scanner-layout">
            <div className="scanner-text reveal-left">
              <div className="section-eyebrow">Live Demo</div>
              <h2 className="section-title">Try the Verification Scanner</h2>
              <p>Experience what the buyer sees. Scan the virtual tag to authenticate this product and unlock the artisan's story — in under two seconds.</p>
              <div style={{display:"flex", gap:"1rem", flexWrap:"wrap"}}>
                <button className="btn-gold">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zM13 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-4 2h2v2h-2zm4 0h2v2h-2z"/>
                  </svg>
                  Activate Camera
                </button>
                <Link href="/chat" className="btn-ghost">Ask AI Guide</Link>
              </div>
            </div>

            <div className="reveal-right">
              <div className="scanner-window">
                <div className="scanner-titlebar">
                  <div className="scanner-titlebar-dot" style={{background:"#ff5f56"}} />
                  <div className="scanner-titlebar-dot" style={{background:"#ffbd2e"}} />
                  <div className="scanner-titlebar-dot" style={{background:"#27c93f"}} />
                  <div className="scanner-url">weavetales.ai/verify</div>
                </div>
                <div className="scanner-body-inner">
                  <div className="scanner-viewfinder">
                    <div className="scanner-corner-br" />
                    <div className="scanner-corner-tr" />
                    <div className="scanner-qr-icon">⬛</div>
                    <div className="scanner-beam" />
                  </div>
                  <div className="scanner-status">Scanning in progress</div>
                  <div className="scanner-result-card">
                    <div className="scanner-result-title">✅ Authentic Handloom Detected</div>
                    <div className="scanner-result-sub">ID: WT‑8492‑B · Kanjivaram Silk · Verified on-chain</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
          ════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-ring" /><div className="cta-ring" /><div className="cta-ring" />
        <div className="cta-content">
          <div className="section-eyebrow" style={{justifyContent:"center"}} data-reveal>
            <span className="reveal">Join the Movement</span>
          </div>
          <h2 className="cta-title reveal">
            Ready to wear <em className="font-serif" style={{fontStyle:"italic", color:"var(--gold)"}}>a story?</em>
          </h2>
          <p className="cta-sub reveal delay-2">Join thousands preserving India's handloom heritage. Every purchase is a direct investment in an artisan family's future.</p>
          <div className="cta-actions reveal delay-3">
            <button className="btn-gold">Shop Verified Collection</button>
            <button className="btn-ghost" style={{borderColor:"rgba(201,168,76,0.3)", color:"var(--gold)"}}>Register as Weaver</button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════ */}
      <footer className="wt-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="wt-logo" style={{fontSize:"1.3rem"}}>
                <img src="/logo.svg" alt="WeaveTales AI Logo" style={{ height: '36px', objectFit: 'contain' }} />
              </div>
              <p>Transforming every handloom into an immersive digital experience. Bridging the gap between India's living heritage and the modern world.</p>
              <div className="footer-socials">
                {["𝕏","in","ig"].map(s => <a key={s} href="#" className="footer-social-btn">{s}</a>)}
              </div>
            </div>

            {[
              { title: "Platform", links: ["How it Works","Verify a Product","For NGOs & Co-ops","Pricing"] },
              { title: "Explore",  links: ["Artisan Directory","Weave Map of India","Journal","Heritage Archive"] },
              { title: "Legal",    links: ["Privacy Policy","Terms of Service","Trust & Safety","Cookie Policy"] },
            ].map(col => (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-col-links">
                  {col.links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              </div>
            ))}
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <div>© 2026 WeaveTales AI. All rights reserved. Hackathon Project.</div>
            <div>Made with ❤️ for Indian Handlooms</div>
          </div>
        </div>
      </footer>
    </>
  );
}

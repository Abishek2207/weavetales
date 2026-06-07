import React, { useEffect, useState } from 'react';

// --- SVGs ---
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const App = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">W</div>
          WeaveTales AI
        </div>
        <div className="navbar-links">
          <a href="#how-it-works">Platform</a>
          <a href="#artisans">Artisans</a>
          <a href="#experience">The Experience</a>
          <a href="#verify" className="nav-cta">Verify Product</a>
        </div>
        <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="hamburger" style={{position:'absolute', top:'1.5rem', right:'2rem'}} onClick={() => setMobileMenuOpen(false)}>✕</button>
        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>Platform</a>
        <a href="#artisans" onClick={() => setMobileMenuOpen(false)}>Artisans</a>
        <a href="#experience" onClick={() => setMobileMenuOpen(false)}>The Experience</a>
        <a href="#verify" onClick={() => setMobileMenuOpen(false)} style={{color:'var(--gold)'}}>Verify Product</a>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg parallax"></div>
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          {Array.from({length: 20}).map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow anim-1">
            <span style={{width:8,height:8,borderRadius:'50%',background:'var(--gold)',boxShadow:'0 0 8px var(--gold)'}}></span>
            From Loom to Legacy
          </div>
          <h1 className="anim-2">
            Every thread has a <span className="grad-text font-display">Story.</span><br/>
            Now, you can hear it.
          </h1>
          <p className="anim-3">
            WeaveTales AI provides verifiable digital identities for authentic Indian handlooms, connecting global buyers directly with the artisans who crafted them.
          </p>
          <div className="hero-ctas anim-4">
            <button className="btn-primary">Try the Experience</button>
            <button className="btn-outline">Partner with Us</button>
          </div>
          
          <div className="hero-stats anim-4" style={{animationDelay:'0.7s'}}>
            <div>
              <div className="hero-stat-num">1.2M+</div>
              <div className="hero-stat-label">Artisans to Empower</div>
            </div>
            <div>
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">Verifiable Authenticity</div>
            </div>
          </div>
        </div>

        <div className="hero-right anim-4">
          <div className="hero-card-float">
            <img src="/product.png" alt="Banarasi Silk" className="hero-card-img" />
            <div className="hero-card-body">
              <div className="hero-card-tag">Unique ID: WT-8492-B</div>
              <div className="hero-card-title">Midnight Blue Banarasi</div>
              <div className="hero-card-sub">Woven by Ramesh Weaver in Varanasi</div>
            </div>
            <div className="hero-card-footer">
              <div className="verified-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Verified Authentic
              </div>
              <div className="qr-mini">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--bg-2)"><path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zM13 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-4 2h2v2h-2zm4 0h2v2h-2z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="section problem-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The Challenge</span>
            <h2>A Heritage at Risk</h2>
            <p>Indian handlooms represent centuries of culture, but the current market structure leaves both artisans and buyers at a disadvantage.</p>
          </div>
          
          <div className="problem-grid">
            <div className="problem-card reveal">
              <div className="text-gold problem-icon"><SearchIcon /></div>
              <h3>Lack of Traceability</h3>
              <p>Buyers have no reliable way to track the journey of a product from the loom to the retail shelf, breaking the connection to its origin.</p>
            </div>
            <div className="problem-card reveal" style={{transitionDelay:'0.1s'}}>
              <div className="text-gold problem-icon"><ShieldCheckIcon /></div>
              <h3>Counterfeit Crisis</h3>
              <p>A high influx of cheap, machine-made replicas undercuts genuine handloom artisans, eroding trust in the "handloom" tag.</p>
            </div>
            <div className="problem-card reveal" style={{transitionDelay:'0.2s'}}>
              <div className="text-gold problem-icon"><UserIcon /></div>
              <h3>Lost Narratives</h3>
              <p>The cultural significance, regional techniques, and the artisan's personal story are entirely lost in traditional retail chains.</p>
            </div>
            <div className="problem-card reveal" style={{transitionDelay:'0.3s'}}>
              <div className="text-gold problem-icon"><GlobeIcon /></div>
              <h3>Limited Visibility</h3>
              <p>Weavers lack the digital tools to showcase their breathtaking craftsmanship to a broader, more lucrative international market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM - HOW IT WORKS */}
      <section id="how-it-works" className="section how-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The Solution</span>
            <h2>How WeaveTales Works</h2>
            <p>Transforming physical fabric into a verifiable piece of history through AI and digital identity.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card reveal">
              <div className="step-num">1</div>
              <div className="step-icon">🧵</div>
              <h3>Artisan Onboarding</h3>
              <p>Weavers register products via a simple mobile app, logging materials, techniques, and time spent.</p>
            </div>
            <div className="step-card reveal" style={{transitionDelay:'0.15s'}}>
              <div className="step-num">2</div>
              <div className="step-icon">🏷️</div>
              <h3>Digital Tagging</h3>
              <p>A secure NFC tag or unique QR code is permanently attached to the finished handloom product.</p>
            </div>
            <div className="step-card reveal" style={{transitionDelay:'0.3s'}}>
              <div className="step-num">3</div>
              <div className="step-icon">✨</div>
              <h3>AI Story Generation</h3>
              <p>Our AI curates a rich, multilingual narrative combining the artisan's profile with regional heritage.</p>
            </div>
            <div className="step-card reveal" style={{transitionDelay:'0.45s'}}>
              <div className="step-num">4</div>
              <div className="step-icon">📱</div>
              <h3>Immersive Discovery</h3>
              <p>Buyers scan the tag to unlock the story, verify authenticity, and directly tip the creator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE EXPERIENCE (PRODUCT MOCKUP) */}
      <section id="experience" className="section product-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The Experience</span>
            <h2>Unlock the Story in Every Thread</h2>
            <p>Scan a WeaveTales tag and enter a world of culture, craft, and human connection.</p>
          </div>

          <div className="product-feature reveal">
            <div className="product-img-wrap">
              <img src="/product2.png" alt="Kanjivaram Silk Experience" />
              <div className="product-img-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gold)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>Authentic Kanjivaram</span>
              </div>
            </div>
            <div className="product-text">
              <h2 className="font-display">The Digital Certificate</h2>
              <p>Instantly verify the origin, materials, and techniques. Eliminate doubt and buy with absolute confidence knowing your piece is a genuine, handcrafted masterpiece.</p>
              
              <ul className="feature-list">
                <li className="feature-item"><div className="feature-dot"></div> Cryptographically secure unique IDs.</li>
                <li className="feature-item"><div className="feature-dot"></div> Detailed material breakdown (e.g., 100% Mulberry Silk, Pure Gold Zari).</li>
                <li className="feature-item"><div className="feature-dot"></div> Geographic Indication (GI) verification.</li>
              </ul>
            </div>
          </div>

          <div className="product-feature reverse reveal">
            <div className="product-img-wrap" style={{background:'var(--bg-2)', display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem'}}>
               <div className="timeline-fancy">
                  <div className="tl-item">
                    <div className="tl-dot"></div>
                    <h4>Yarn Preparation</h4>
                    <p>Locally sourced silk treated with natural enzymes for strength.</p>
                  </div>
                  <div className="tl-item">
                    <div className="tl-dot"></div>
                    <h4>Natural Dyeing</h4>
                    <p>Dyed using extracted madder root for a deep crimson hue.</p>
                  </div>
                  <div className="tl-item">
                    <div className="tl-dot"></div>
                    <h4>Loom Setup & Weaving</h4>
                    <p>Intricate Korvai technique taking 22 days to complete.</p>
                  </div>
               </div>
            </div>
            <div className="product-text">
              <h2 className="font-display">The Crafting Journey</h2>
              <p>Understand the immense effort behind your garment. Step through the timeline of creation, from raw yarn to the final weave.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ARTISANS */}
      <section id="artisans" className="section artisans-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The Creators</span>
            <h2>Meet the Masters</h2>
            <p>Every piece is a labor of love. Connect directly with the artisans preserving India's heritage.</p>
          </div>

          <div className="artisans-grid">
            {/* Artisan 1 */}
            <div className="artisan-card reveal">
              <img src="/artisan.png" alt="Ramesh Weaver" className="artisan-card-img"/>
              <div className="artisan-card-body">
                <div className="artisan-location">Varanasi, UP</div>
                <h3 className="artisan-name">Ramesh Kumar</h3>
                <div className="artisan-tags">
                  <span className="tag">Banarasi</span>
                  <span className="tag">Brocade</span>
                  <span className="tag">Pit Loom</span>
                </div>
                <p className="artisan-quote">"I learned the art from my grandfather. Every thread carries the spirit of our holy city."</p>
                <div className="artisan-stat-row">
                  <div>
                    <div className="artisan-stat-val">30+</div>
                    <div className="artisan-stat-lbl">Years Exp.</div>
                  </div>
                  <div>
                    <div className="artisan-stat-val">142</div>
                    <div className="artisan-stat-lbl">Pieces Woven</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisan 2 */}
            <div className="artisan-card reveal" style={{transitionDelay:'0.15s'}}>
              <img src="/artisan2.png" alt="Lakshmi Devi" className="artisan-card-img"/>
              <div className="artisan-card-body">
                <div className="artisan-location">Kanchipuram, TN</div>
                <h3 className="artisan-name">Lakshmi Devi</h3>
                <div className="artisan-tags">
                  <span className="tag">Kanjivaram</span>
                  <span className="tag">Korvai</span>
                  <span className="tag">Natural Dyes</span>
                </div>
                <p className="artisan-quote">"The loom is my temple. The colors I weave reflect the vibrancy of our local festivals."</p>
                <div className="artisan-stat-row">
                  <div>
                    <div className="artisan-stat-val">25+</div>
                    <div className="artisan-stat-lbl">Years Exp.</div>
                  </div>
                  <div>
                    <div className="artisan-stat-val">98</div>
                    <div className="artisan-stat-lbl">Pieces Woven</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCANNER DEMO CTA */}
      <section id="verify" className="section scanner-section">
        <div className="container" style={{display:'flex', flexWrap:'wrap', gap:'4rem', alignItems:'center'}}>
          <div className="reveal" style={{flex:1, minWidth:'300px'}}>
            <span className="section-label">Live Demo</span>
            <h2 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:'1rem'}}>Try the Verification Scanner</h2>
            <p style={{color:'var(--text-muted)', marginBottom:'2rem'}}>Experience what the buyer sees. Scan the virtual tag to authenticate the product and unlock the artisan's story.</p>
            <button className="btn-primary" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zM13 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-4 2h2v2h-2zm4 0h2v2h-2z"/></svg>
              Activate Camera
            </button>
          </div>
          
          <div className="reveal" style={{flex:1, minWidth:'300px'}}>
            <div className="scanner-demo">
              <div className="scanner-header">
                <div className="scanner-dot" style={{background:'#ff5f56'}}></div>
                <div className="scanner-dot" style={{background:'#ffbd2e'}}></div>
                <div className="scanner-dot" style={{background:'#27c93f'}}></div>
                <span style={{fontSize:'0.8rem', color:'var(--text-muted)', marginLeft:'1rem'}}>weavetales.ai/verify</span>
              </div>
              <div className="scanner-body">
                <div className="scanner-area">
                  <svg viewBox="0 0 24 24" width="80" height="80" fill="var(--gold-subtle)"><path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zM13 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-4 2h2v2h-2zm4 0h2v2h-2z"/></svg>
                  <div className="scanner-line"></div>
                </div>
                <p style={{color:'var(--gold)', fontWeight:600, letterSpacing:'0.05em'}}>SCANNING...</p>
                <div className="scanner-result">
                  <div className="scanner-result-title">Authentic Handloom Detected</div>
                  <div className="scanner-result-sub">ID: WT-8492-B • Kanjivaram Silk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="container" style={{position:'relative', zIndex:2}}>
          <h2>Ready to wear a story?</h2>
          <p>Join the movement to preserve traditional Indian handlooms and empower the artisans who create them.</p>
          <div className="cta-btns">
            <button className="btn-primary">Shop Verified Collection</button>
            <button className="btn-outline" style={{borderColor:'var(--gold)', color:'var(--gold)'}}>Register as Weaver</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{fontSize:'1.5rem'}}>
                <div className="logo-icon">W</div>
                WeaveTales AI
              </div>
              <p>Transforming every handloom product into an immersive digital experience. Bridging the gap between heritage and modern technology.</p>
              <div className="footer-social">
                <a href="#" className="footer-social-btn">𝕏</a>
                <a href="#" className="footer-social-btn">in</a>
                <a href="#" className="footer-social-btn">ig</a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">How it Works</a></li>
                <li><a href="#">Verify a Product</a></li>
                <li><a href="#">For NGOs & Co-ops</a></li>
                <li><a href="#">Pricing</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><a href="#">Artisan Directory</a></li>
                <li><a href="#">Weave Map of India</a></li>
                <li><a href="#">Journal</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Trust & Safety</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div>© 2026 WeaveTales AI. All rights reserved. Hackathon Project.</div>
            <div className="footer-bottom-right">
              <span>Made with ❤️ for Indian Handlooms</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;

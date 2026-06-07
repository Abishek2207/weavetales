"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:8000/api";

interface Story { id: number; generated_text: string; tags: string; }
interface Artisan { name: string; location: string; craft: string; bio: string; years_of_experience: number; }
interface Recommendation { product_id: number; title: string; image_url: string; price: number; artisan_name: string; reason: string; }
interface Product { id: number; title: string; material: string; price: number; image_url: string; artisan: Artisan; story: Story | null; }

type Tab = "story" | "reel" | "translate";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("story");
  const [reel, setReel] = useState<any>(null);
  const [reelLoading, setReelLoading] = useState(false);
  const [translateText, setTranslateText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translated, setTranslated] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [emotion, setEmotionResult] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => { if (id) { fetchProduct(); fetchRecs(); } }, [id]);

  const fetchProduct = () => {
    fetch(`${API}/products/${id}`).then(r => r.json()).then(d => { setProduct(d); setLoading(false); }).catch(() => setLoading(false));
  };

  const fetchRecs = () => {
    fetch(`${API}/ai/recommendations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: Number(id), user_history: [] }) })
      .then(r => r.json()).then(setRecs).catch(() => {});
  };

  const generateStory = () => {
    setGeneratingStory(true);
    fetch(`${API}/products/${id}/generate-story`, { method: "POST" }).then(r => r.json()).then(data => {
      setProduct(prev => prev ? { ...prev, story: data } : null);
      setGeneratingStory(false);
    }).catch(() => setGeneratingStory(false));
  };

  const generateReel = () => {
    setReelLoading(true);
    fetch(`${API}/ai/generate-reel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: Number(id) }) })
      .then(r => r.json()).then(data => { setReel(data); setReelLoading(false); }).catch(() => setReelLoading(false));
  };

  const doTranslate = () => {
    if (!translateText) return;
    setTranslating(true);
    fetch(`${API}/ai/translate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: translateText, target_language_code: targetLang }) })
      .then(r => r.json()).then(data => { setTranslated(data); setTranslating(false); }).catch(() => setTranslating(false));
  };

  const analyzeEmotion = () => {
    if (!reviewText) return;
    fetch(`${API}/ai/detect-emotion`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: reviewText }) })
      .then(r => r.json()).then(setEmotionResult).catch(() => {});
  };

  const emotionEmoji: Record<string, string> = { joy: "😊", curiosity: "🤔", awe: "😍", nostalgia: "🥹", satisfaction: "😌", frustration: "😤", neutral: "😐", trust: "🤝" };
  const sentimentColor: Record<string, string> = { positive: "#2e664b", negative: "#b53b3b", neutral: "var(--secondary)" };

  if (loading) return <div style={{ textAlign: "center", padding: "6rem", color: "var(--secondary)" }}>🪡 Loading...</div>;
  if (!product) return <div style={{ textAlign: "center", padding: "6rem" }}>Product not found.</div>;

  const tabClass = (t: Tab) => activeTab === t ? "ai-tab-btn active" : "ai-tab-btn";

  return (
    <div className="product-detail-wrap anim-fade-in">
      <Link href="/#collection" className="product-detail-back reveal">
        <ArrowIcon /> Back to Collection
      </Link>

      <div className="product-detail-grid">
        {/* Left: Image */}
        <div className="product-detail-img-sticky reveal-scale">
          <img src={product.image_url} alt={product.title} />
        </div>

        {/* Right: Details */}
        <div className="reveal-right">
          <div className="product-detail-badge">
            {product.artisan.craft} · {product.artisan.location}
          </div>
          <h1 className="product-detail-title gradient-text">{product.title}</h1>
          <p className="product-detail-material">{product.material}</p>
          <div className="product-detail-price" style={{ marginBottom: "0.5rem" }}>₹{(product.price * 83).toFixed(0)}</div>
          
          {/* Blockchain Verification Badge */}
          {product.blockchain_hash && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--deep)", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--gold)", marginBottom: "1rem" }}>
              <span style={{ color: "var(--gold)" }}>⛓️ Web3 Verified</span>
              <a 
                href={`http://localhost:8000/api/verify/${product.blockchain_hash}`}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "underline" }}
              >
                View Certificate
              </a>
            </div>
          )}

          {/* Artisan Card */}
          <div className="artisan-info-card reveal delay-2">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
              <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>🧑‍🎨 {product.artisan.name}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{product.artisan.location} · {product.artisan.years_of_experience} yrs</p>
              </div>
              <span className="artisan-verified-badge">Verified Artisan</span>
            </div>
            <p className="artisan-quote-block" style={{ marginBottom: 0, marginTop: "0.5rem" }}>
              "{product.artisan.bio}"
            </p>
          </div>

          {/* AI Feature Tabs */}
          <div className="reveal delay-3">
            <div className="ai-tabs">
              <button className={tabClass("story")} onClick={() => setActiveTab("story")}>📖 Story</button>
              <button className={tabClass("reel")} onClick={() => setActiveTab("reel")}>🎬 Reel Script</button>
              <button className={tabClass("translate")} onClick={() => setActiveTab("translate")}>🌐 Translate</button>
            </div>

            <div className="ai-tab-panel">
              {/* Story Tab */}
              {activeTab === "story" && (
                product.story ? (
                  <div className="anim-fade-in">
                    {product.story.audio_url && (
                      <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--surface-hover)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                        <h4 style={{ color: "var(--gold)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>🎙️ Listen to the Story</h4>
                        <audio controls style={{ width: "100%", height: "40px" }} src={`http://localhost:8000${product.story.audio_url}`}>
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    <p className="story-text">{product.story.generated_text}</p>
                    <div className="story-tags">
                      {product.story.tags.split(",").map((tag, i) => (
                        <span key={i} className="story-tag">#{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="ai-generate-cta anim-fade-in">
                    <p>This piece is waiting for its story to be told.</p>
                    <button className="btn-gold" onClick={generateStory} disabled={generatingStory}>
                      {generatingStory ? "✨ Crafting Story & Audio..." : "✨ Generate AI Story"}
                    </button>
                  </div>
                )
              )}

              {/* Reel Tab */}
              {activeTab === "reel" && (
                <div className="anim-fade-in">
                  {!reel ? (
                    <div className="ai-generate-cta">
                      <p>Generate a viral reel storyboard for social media.</p>
                      <button className="btn-gold" onClick={generateReel} disabled={reelLoading}>
                        {reelLoading ? "🎬 Creating Storyboard..." : "🎬 Generate Reel Script"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.2rem" }}>
                        🎵 Music: <em style={{ color: "var(--gold)" }}>{reel.music_style}</em>
                      </p>
                      {reel.scenes?.map((scene: any) => (
                        <div key={scene.scene} className="reel-scene">
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gold)" }}>Scene {scene.scene}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{scene.duration}</span>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", marginBottom: "0.4rem" }}>📷 {scene.visual}</p>
                          <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>"{scene.on_screen_text}"</p>
                          <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-muted)" }}>🎙 {scene.voiceover}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Translate Tab */}
              {activeTab === "translate" && (
                <div className="anim-fade-in">
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.5rem", color: "var(--text-soft)" }}>Text to Translate</label>
                    <textarea value={translateText} onChange={e => setTranslateText(e.target.value)}
                      placeholder={product.story ? product.story.generated_text.slice(0, 120) + "..." : "Enter text to translate..."}
                      rows={3} />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                    <select value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ flex: 1 }}>
                      {[["hi","Hindi"],["ta","Tamil"],["te","Telugu"],["kn","Kannada"],["bn","Bengali"],["gu","Gujarati"],["mr","Marathi"],["ml","Malayalam"],["fr","French"],["de","German"],["es","Spanish"],["ja","Japanese"]].map(([code,name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                    <button className="btn-gold" style={{ padding: "0.75rem 1.4rem" }} onClick={doTranslate} disabled={translating}>
                      {translating ? "Translating..." : "🌐 Translate"}
                    </button>
                  </div>
                  {translated && (
                    <div className="translate-output anim-slide-up">
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                        Detected: {translated.detected_language} → {translated.target_language}
                      </p>
                      <p style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>{translated.translated_text}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Emotion Detection / Review Box */}
          <div className="share-box reveal delay-4">
            <h4 style={{ marginBottom: "1rem", color: "var(--gold)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>❤️</span> Share Your Thoughts
            </h4>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write your thoughts about this piece..."
              rows={2} style={{ marginBottom: "1rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn-ghost" onClick={analyzeEmotion} style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>Analyze Sentiment</button>
              {emotion && (
                <div className="emotion-result anim-fade-in" style={{ padding: 0, background: "transparent" }}>
                  <span style={{ fontSize: "2rem" }}>{emotionEmoji[emotion.emotion] || "😐"}</span>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: sentimentColor[emotion.sentiment], margin: 0 }}>{emotion.sentiment?.toUpperCase()}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{emotion.emotion} · {Math.round(emotion.confidence * 100)}% confidence</p>
                  </div>
                </div>
              )}
            </div>
            {emotion?.insight && <p style={{ fontSize: "0.85rem", color: "var(--gold-bright)", marginTop: "1rem", fontStyle: "italic", borderLeft: "2px solid var(--gold)", paddingLeft: "0.8rem" }}>{emotion.insight}</p>}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <section style={{ marginTop: "6rem" }} className="reveal">
          <div className="section-eyebrow">Curated for you</div>
          <h2 className="section-title" style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>You May Also Love</h2>
          <p className="section-sub" style={{ marginBottom: "3rem" }}>Selected by AI based on cultural & aesthetic connections</p>
          <div className="collection-grid">
            {recs.map((rec, i) => (
              <Link key={rec.product_id} href={`/product/${rec.product_id}`} className={`reveal delay-${Math.min(i+1, 5)}`}>
                <div className="product-card">
                  <div className="product-card-img-wrap" style={{ height: "220px" }}>
                    <img src={rec.image_url} alt={rec.title} className="product-card-img" />
                    <div className="product-card-overlay" />
                    <div className="product-card-quick-view">View Details →</div>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-title">{rec.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--gold)", fontStyle: "italic", marginBottom: "1rem" }}>"{rec.reason}"</p>
                    <div className="product-card-footer" style={{ marginTop: "auto" }}>
                      <div className="product-card-price" style={{ fontSize: "1.1rem" }}>₹{(rec.price * 83).toFixed(0)}</div>
                      <div className="product-card-artisan">
                        <strong>{rec.artisan_name}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

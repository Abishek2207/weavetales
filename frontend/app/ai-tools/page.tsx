"use client";

import { useState } from "react";
import Link from "next/link";

const API = "http://localhost:8000/api";

export default function AIToolsPage() {
  const [rawNotes, setRawNotes] = useState("");
  const [material, setMaterial] = useState("");
  const [weaveType, setWeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateDescription = async () => {
    if (!rawNotes.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/ai/generate-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_notes: rawNotes, material, weave_type: weaveType })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair, serif)", color: "var(--primary)", marginBottom: "0.5rem" }}>Artisan AI Tools</h1>
        <p style={{ color: "var(--secondary)" }}>Empowering creators with intelligent content generation</p>
      </div>

      <div className="grid grid-cols-2">
        {/* Input Form */}
        <div className="premium-card">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Product Description Generator</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--secondary)", marginBottom: "2rem" }}>
            Turn rough notes into a premium, SEO-optimized product listing in seconds.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Raw Notes (Required)</label>
              <textarea 
                value={rawNotes} 
                onChange={e => setRawNotes(e.target.value)}
                placeholder="e.g., Red saree, gold border, took 20 days to make, lotus motifs"
                rows={4}
                style={{ width: "100%", padding: "0.8rem", borderRadius: 8, border: "1px solid var(--border)", fontFamily: "var(--font-sans)", resize: "vertical", background: "var(--background)", color: "var(--foreground)" }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Material (Optional)</label>
                <input 
                  type="text" 
                  value={material} 
                  onChange={e => setMaterial(e.target.value)}
                  placeholder="e.g., Pure Silk"
                  style={{ width: "100%", padding: "0.8rem", borderRadius: 8, border: "1px solid var(--border)", fontFamily: "var(--font-sans)", background: "var(--background)", color: "var(--foreground)" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Weave Type (Optional)</label>
                <input 
                  type="text" 
                  value={weaveType} 
                  onChange={e => setWeaveType(e.target.value)}
                  placeholder="e.g., Kanjeevaram"
                  style={{ width: "100%", padding: "0.8rem", borderRadius: 8, border: "1px solid var(--border)", fontFamily: "var(--font-sans)", background: "var(--background)", color: "var(--foreground)" }}
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={generateDescription}
              disabled={loading || !rawNotes.trim()}
              style={{ marginTop: "1rem", width: "100%", padding: "1rem" }}
            >
              {loading ? "✨ Generating Listing..." : "✨ Generate Listing"}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="premium-card" style={{ background: "var(--surface-hover)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--secondary)" }}>Generated Output</h2>
          
          {!result && !loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
              <p style={{ color: "var(--secondary)", fontStyle: "italic" }}>Your generated listing will appear here.</p>
            </div>
          )}

          {loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
              <p style={{ color: "var(--primary)", fontWeight: 600, animation: "pulse 1.5s infinite" }}>AI is crafting your content...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeIn 0.5s ease" }}>
              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--secondary)", marginBottom: "0.3rem" }}>Title</h3>
                <h4 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "1.5rem", color: "var(--primary)" }}>{result.title}</h4>
              </div>

              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--secondary)", marginBottom: "0.5rem" }}>Description</h3>
                <p style={{ lineHeight: 1.6, fontSize: "0.95rem" }}>{result.description}</p>
              </div>

              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--secondary)", marginBottom: "0.5rem" }}>Key Features</h3>
                <ul style={{ paddingLeft: "1.2rem", color: "var(--foreground)", fontSize: "0.95rem" }}>
                  {result.features?.map((f: string, i: number) => (
                    <li key={i} style={{ marginBottom: "0.3rem" }}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--secondary)", marginBottom: "0.5rem" }}>SEO Keywords</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {result.keywords?.map((k: string, i: number) => (
                    <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.75rem", color: "var(--primary)" }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

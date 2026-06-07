"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:8000/api";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [artisans, setArtisans] = useState<any[]>([]);

  // Artisan Form
  const [aName, setAName] = useState("");
  const [aLocation, setALocation] = useState("");
  const [aCraft, setACraft] = useState("");
  const [aBio, setABio] = useState("");
  const [aYears, setAYears] = useState(10);

  // Product Form
  const [pTitle, setPTitle] = useState("");
  const [pMaterial, setPMaterial] = useState("");
  const [pPrice, setPPrice] = useState(100);
  const [pImage, setPImage] = useState("");
  const [pArtisanId, setPArtisanId] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem("wt_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchArtisans();
    }
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginError("");
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("wt_admin_token", data.access_token);
      fetchArtisans();
    } catch (err: any) {
      setLoginError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("wt_admin_token");
  };

  const fetchArtisans = () => {
    fetch(`${API}/artisans/`).then(r => r.json()).then(data => {
      setArtisans(data);
      if (data.length > 0) setPArtisanId(data[0].id);
    });
  };

  const addArtisan = async (e: any) => {
    e.preventDefault();
    await fetch(`${API}/artisans/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name: aName, location: aLocation, craft: aCraft, bio: aBio, years_of_experience: aYears })
    });
    alert("Artisan Added!");
    fetchArtisans();
    setAName(""); setALocation(""); setACraft(""); setABio(""); setAYears(10);
  };

  const addProduct = async (e: any) => {
    e.preventDefault();
    await fetch(`${API}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: pTitle, material: pMaterial, price: pPrice, image_url: pImage, artisan_id: pArtisanId })
    });
    alert("Product Added! A blockchain certificate was generated automatically.");
    setPTitle(""); setPMaterial(""); setPPrice(100); setPImage("");
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: "10rem auto", padding: "2rem", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--gold)" }}>Admin Login</h2>
        {loginError && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{loginError}</p>}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
          <button type="submit" className="btn-gold" style={{ padding: "0.8rem" }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "4rem auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h1 style={{ color: "var(--gold)" }}>WeaveTales Admin Dashboard</h1>
        <button className="btn-ghost" onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Artisan Form */}
        <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Add Artisan</h2>
          <form onSubmit={addArtisan} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input placeholder="Name" value={aName} onChange={e => setAName(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <input placeholder="Location" value={aLocation} onChange={e => setALocation(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <input placeholder="Craft" value={aCraft} onChange={e => setACraft(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <textarea placeholder="Bio" value={aBio} onChange={e => setABio(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white", resize: "none" }} rows={3} />
            <input type="number" placeholder="Years of Exp" value={aYears} onChange={e => setAYears(Number(e.target.value))} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <button type="submit" className="btn-gold">Save Artisan</button>
          </form>
        </div>

        {/* Product Form */}
        <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Add Product</h2>
          <form onSubmit={addProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input placeholder="Product Title" value={pTitle} onChange={e => setPTitle(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <input placeholder="Material" value={pMaterial} onChange={e => setPMaterial(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <input placeholder="Image URL" value={pImage} onChange={e => setPImage(e.target.value)} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <input type="number" placeholder="Price (USD)" value={pPrice} onChange={e => setPPrice(Number(e.target.value))} required style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }} />
            <select value={pArtisanId} onChange={e => setPArtisanId(Number(e.target.value))} style={{ padding: "0.8rem", borderRadius: "8px", background: "var(--background)", color: "white" }}>
              {artisans.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.craft})</option>
              ))}
            </select>
            <button type="submit" className="btn-gold">Mint to Blockchain</button>
          </form>
        </div>

      </div>
    </div>
  );
}

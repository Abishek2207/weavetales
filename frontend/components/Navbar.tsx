"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Collection" },
    { href: "/chat", label: "Ask Weave Guide" },
    { href: "/ai-tools", label: "AI Tools" },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(253,251,247,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)", padding: "0 2rem"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.svg" alt="WeaveTales AI Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontWeight: 500, fontSize: "0.9rem", letterSpacing: "0.03em",
              color: pathname === href ? "var(--primary)" : "var(--foreground)",
              textDecoration: "none", borderBottom: pathname === href ? "2px solid var(--primary)" : "2px solid transparent",
              paddingBottom: 2, transition: "all 0.2s"
            }}>
              {label}
            </Link>
          ))}
          <Link href="/ai-tools" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
              ✨ List Your Craft
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

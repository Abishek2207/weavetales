import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeaveTales AI — Heritage Handlooms, Powered by AI",
  description: "Discover authentic Indian handloom textiles. Every thread has a story. AI-powered storytelling, cultural knowledge, and artisan connection.",
};

import CinematicLayout from "@/components/CinematicLayout";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <CinematicLayout>
          {children}
        </CinematicLayout>
      </body>
    </html>
  );
}

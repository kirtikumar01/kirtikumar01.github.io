import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kirtikumar01.github.io"),
  title: "Kirti Kumar Piplaj | Frontend Engineer",
  description:
    "Portfolio of Kirti Kumar Piplaj, a Frontend Engineer with 3+ years of experience specialized in React, Next.js, and Web3 & Fintech Interfaces.",
  keywords: [
    "Kirti Kumar Piplaj",
    "Frontend Engineer",
    "React",
    "Next.js",
    "Web3",
    "Fintech",
    "Portfolio",
    "Web Developer",
    "TypeScript",
  ],
  authors: [{ name: "Kirti Kumar Piplaj" }],
  creator: "Kirti Kumar Piplaj",
  openGraph: {
    title: "Kirti Kumar Piplaj | Frontend Engineer",
    description:
      "Portfolio of Kirti Kumar Piplaj, a Frontend Engineer with 3+ years of experience specialized in React, Next.js, and Web3 & Fintech Interfaces.",
    type: "website",
    locale: "en_US",
    siteName: "Kirti Kumar Piplaj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirti Kumar Piplaj | Frontend Engineer",
    description: "Portfolio of Kirti Kumar Piplaj, a Frontend Engineer with 3+ years of experience specialized in React, Next.js, and Web3 & Fintech Interfaces.",
  },
};

import SmoothScroll from "../components/SmoothScroll";
import CanvasParticles from "../components/CanvasParticles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CanvasParticles />
        <SmoothScroll>
          <main className="app-wrapper">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Kirti Kumar Piplaj | Senior Frontend Developer",
  description:
    "Portfolio of Kirti Kumar Piplaj, a Senior Frontend Developer with 3+ years of experience specialized in ReactJS, NextJS, VueJS, and building premium web applications.",
  keywords: [
    "Kirti Kumar Piplaj",
    "Senior Frontend Developer",
    "ReactJS",
    "NextJS",
    "Vuejs",
    "Portfolio",
    "Web Developer",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Kirti Kumar Piplaj" }],
  creator: "Kirti Kumar Piplaj",
  openGraph: {
    title: "Kirti Kumar Piplaj | Senior Frontend Developer",
    description:
      "Portfolio of Kirti Kumar Piplaj, a Senior Frontend Developer with 3+ years of experience specialized in ReactJS, NextJS, VueJS, and building premium web applications.",
    type: "website",
    locale: "en_US",
    siteName: "Kirti Kumar Piplaj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirti Kumar Piplaj | Senior Frontend Developer",
    description: "Portfolio of Kirti Kumar Piplaj, a Senior Frontend Developer with 3+ years of experience.",
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

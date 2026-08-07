import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirti Kumar Piplaj | Frontend Developer",
  description:
    "Portfolio of Kirti Kumar Piplaj, a Frontend Developer specialized in ReactJS, NextJS, and building premium web applications.",
  keywords: [
    "Kirti Kumar Piplaj",
    "Frontend Developer",
    "ReactJS",
    "NextJS",
    "Vuejs",
    "Portfolio",
    "Web Developer",
  ],
  openGraph: {
    title: "Kirti Kumar Piplaj | Frontend Developer",
    description:
      "Portfolio of Kirti Kumar Piplaj, a Frontend Developer specialized in ReactJS, NextJS, and building premium web applications.",
    type: "website",
    locale: "en_US",
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
    <html lang="en">
      <body>
        <CanvasParticles />
        <SmoothScroll>
          <main className="app-wrapper">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}

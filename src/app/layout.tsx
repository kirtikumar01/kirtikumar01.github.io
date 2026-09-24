import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kirtikumar01.github.io"),
  alternates: {
    canonical: "/",
  },
  title: "Kirti Kumar Piplaj | Frontend Engineer",
  description:
    "Portfolio of Kirti Kumar Piplaj, a Full Stack / Frontend Engineer specializing in React, Next.js, and Web3 & Fintech Interfaces.",
  keywords: [
    "Kirti Kumar Piplaj",
    "Frontend Engineer",
    "Full Stack Developer",
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
    title: "Kirti Kumar Piplaj | Full Stack / Frontend Engineer",
    description:
      "Portfolio of Kirti Kumar Piplaj, a Full Stack / Frontend Engineer specializing in React, Next.js, and Web3 & Fintech Interfaces.",
    type: "website",
    locale: "en_US",
    siteName: "Kirti Kumar Piplaj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirti Kumar Piplaj | Full Stack / Frontend Engineer",
    description: "Portfolio of Kirti Kumar Piplaj, a Full Stack / Frontend Engineer specializing in React, Next.js, and Web3 & Fintech Interfaces.",
  },
};

import SmoothScroll from "../components/SmoothScroll";
import CanvasParticles from "../components/CanvasParticles";
import PageLoader from "../components/PageLoader";

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
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kirti Kumar Piplaj",
              url: "https://kirtikumar01.github.io",
              jobTitle: "Full Stack / Frontend Engineer",
              sameAs: [
                "https://github.com/kirtikumar01",
                "https://linkedin.com/in/kirti-kumar01"
              ],
              worksFor: {
                "@type": "Organization",
                name: "Codes for Tomorrow (CFT)"
              }
            }),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <PageLoader />
        <CanvasParticles />
        <SmoothScroll>
          <main className="app-wrapper">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}

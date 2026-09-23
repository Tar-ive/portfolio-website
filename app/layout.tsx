import type { Metadata } from "next";
import { IBM_Plex_Mono, Spectral, Tiro_Devanagari_Sanskrit } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spectral",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const tiro = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saksham.us"),
  title: "Saksham Adhikari, Machine Learning Engineer",
  description:
    "ML engineer working on inference, recommendation systems, computer vision, and large-scale data. Machine Learning Engineer Intern at AskSLM, former TPU Cloud Researcher at Google.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spectral.variable} ${plexMono.variable} ${tiro.variable}`}
    >
      <head>
        {/* Theme before paint. Light is the default; only a visitor who has
            chosen dark here gets dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('v3-theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

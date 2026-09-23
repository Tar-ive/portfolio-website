import type { Metadata } from "next";

import { Background } from "@/components/v3/Background";
import { Contact } from "@/components/v3/Contact";
import { Education } from "@/components/v3/Education";
import { ExperienceTimeline } from "@/components/v3/ExperienceTimeline";
import { Hero } from "@/components/v3/Hero";
import { Metrics } from "@/components/v3/Metrics";
import { NavBar } from "@/components/v3/NavBar";
import { ProjectCarousel } from "@/components/v3/ProjectCarousel";
import { Research } from "@/components/v3/Research";
import { footer, hero } from "@/content/v3";

export const metadata: Metadata = {
  title: "Saksham Adhikari, Machine Learning Engineer",
  description: hero.tagline,
  alternates: { canonical: "/v3" },
};

export default function V3Page() {
  return (
    <>
      <Background />
      <NavBar />

      <main>
        <Hero />
        <Metrics />
        <ExperienceTimeline />
        <ProjectCarousel />
        <Research />
        <Education />
        <Contact />
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 font-mono text-xs text-faint sm:flex-row sm:px-8">
          <p>{footer.note}</p>
          <a href="/" className="transition-colors hover:text-accent-600">
            <span className="font-devanagari text-accent">॥</span> {footer.streamLabel}
          </a>
        </div>
      </footer>
    </>
  );
}

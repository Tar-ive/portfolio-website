import type { Metadata } from "next";

import { Contact } from "@/components/v3/Contact";
import { CourseCylinder } from "@/components/v3/CourseCylinder";
import { Education } from "@/components/v3/Education";
import { ExperienceTimeline } from "@/components/v3/ExperienceTimeline";
import { Hero } from "@/components/v3/Hero";
import { Kites } from "@/components/v3/Kites";
import { Metrics } from "@/components/v3/Metrics";
import { NavBar } from "@/components/v3/NavBar";
import { HackathonDeck, ProjectDeck } from "@/components/v3/Decks";
import { Research } from "@/components/v3/Research";
import { Sky } from "@/components/v3/Sky";
import { footer, hero } from "@/content/v3";

export const metadata: Metadata = {
  title: "Saksham Adhikari, Machine Learning Engineer",
  description: hero.tagline,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Sky />
      <Kites />
      <NavBar />

      <main>
        <Hero />
        <Metrics />
        <ExperienceTimeline />
        <ProjectDeck />
        <HackathonDeck />
        <Research />
        <Education />
        <CourseCylinder />
        <Contact />
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 font-mono text-xs text-faint sm:flex-row sm:px-8">
          <p>{footer.note}</p>
          <a
            href="#home"
            className="transition-colors hover:text-accent-600"
          >
            <span className="font-devanagari text-accent">॥</span> {footer.backToTop}
          </a>
        </div>
      </footer>
    </>
  );
}

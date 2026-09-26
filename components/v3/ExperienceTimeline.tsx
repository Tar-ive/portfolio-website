"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  MapPin,
  Users,
} from "@/components/v3/icons";
import { useCallback, useEffect, useRef, useState } from "react";

import { experience, sections, type ExperienceEntry } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

const ICONS = {
  engineering: Briefcase,
  research: FlaskConical,
  leadership: Users,
} as const;

function TypeIcon({ type, className }: { type: ExperienceEntry["type"]; className?: string }) {
  const Icon = ICONS[type] ?? Briefcase;
  return <Icon className={className} />;
}

export function ExperienceTimeline() {
  const [index, setIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const entry = experience[index];

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(experience.length - 1, next));
    setIndex(clamped);

    const rail = railRef.current;
    if (rail) {
      const step = rail.scrollWidth / experience.length;
      rail.scrollTo({
        left: Math.max(0, clamped * step - rail.clientWidth / 2 + step / 2),
        behavior: "smooth",
      });
    }
  }, []);

  // Arrow keys move the timeline while it is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (!onScreen) return;

      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  return (
    <Section id="experience">
      <SectionHead
        kicker="$ git log --author=saksham"
        title={sections.experience.title}
        description={sections.experience.description}
      />

      <Reveal>
        <div className="glass overflow-hidden">
          {/* Rail */}
          <div className="relative px-4 pb-8 pt-10 sm:px-8">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous role"
              className="glass absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-accent-600 disabled:opacity-30 sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === experience.length - 1}
              aria-label="Next role"
              className="glass absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-accent-600 disabled:opacity-30 sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div ref={railRef} className="no-scrollbar overflow-x-auto py-4">
              <div className="relative flex min-w-max items-start justify-between px-6">
                <div className="absolute left-0 right-0 top-7 h-[2px] rounded-full bg-line-strong opacity-40" />
                <motion.div
                  className="absolute left-0 top-7 h-[2px] rounded-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((index + 1) / experience.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />

                {experience.map((item, i) => {
                  const on = i === index;
                  return (
                    <div
                      key={item.id}
                      className="relative flex flex-col items-center"
                      style={{ minWidth: "168px" }}
                    >
                      <motion.button
                        onClick={() => goTo(i)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={item.company}
                        className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
                          on
                            ? "border-accent bg-accent text-page shadow-lg"
                            : i < index
                              ? "border-accent bg-accent-050 text-accent-600"
                              : "border-line-strong bg-page text-faint hover:border-accent"
                        }`}
                      >
                        <TypeIcon type={item.type} className="h-4 w-4" />
                      </motion.button>

                      <div className="mt-3 max-w-[150px] text-center">
                        <div className="font-mono text-[11px] text-faint">{item.period}</div>
                        <div
                          className={`mt-1 font-mono text-xs transition-colors ${
                            on ? "text-accent-600" : "text-muted"
                          }`}
                        >
                          {item.company}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="border-t border-line px-5 py-8 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 lg:grid-cols-2"
              >
                <div>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                      <TypeIcon type={entry.type} className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{entry.title}</h3>
                      <p className="font-mono text-sm text-accent-600">{entry.company}</p>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {entry.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {entry.period}
                    </span>
                  </div>

                  <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line bg-tint px-3 py-1 font-mono text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                    What I did
                  </h4>
                  <ul className="space-y-3">
                    {entry.bullets.map((bullet, i) => (
                      <motion.li
                        key={bullet}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-3 text-sm text-body"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 px-8 pb-6">
            {experience.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${item.company}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-accent" : "w-1.5 bg-line-strong hover:bg-accent-300"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center gap-3 px-8 pb-6 sm:hidden">
            <button
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs text-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> prev
            </button>
            <button
              onClick={() => goTo(index + 1)}
              disabled={index === experience.length - 1}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs text-muted disabled:opacity-40"
            >
              next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

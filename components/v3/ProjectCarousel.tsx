"use client";

import { ChevronLeft, ChevronRight, Code2, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { projects, sections } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

const GAP = 20;
const TOTAL = projects.length;

/**
 * The reference's 3D deck: cards sit at a fixed span from the active one and
 * rotate away on the Y axis, with z-index falling off by distance. Wrapping
 * the delta makes the loop seamless in both directions.
 */
export function ProjectCarousel() {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 340, height: 440 });

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setSize({ width: Math.min(w * 0.84, 320), height: 460 });
      } else if (w < 1024) {
        setSize({ width: Math.max(w * 0.45, 300), height: 440 });
      } else {
        setSize({ width: Math.max(w * 0.26, 340), height: 430 });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const span = useMemo(() => size.width + GAP * 2, [size.width]);

  const wrap = useCallback((delta: number) => {
    const half = TOTAL / 2;
    if (delta > half) return delta - TOTAL;
    if (delta < -half) return delta + TOTAL;
    if (TOTAL % 2 === 0 && delta === half) return delta - TOTAL;
    return delta;
  }, []);

  const move = (step: number) => setIndex((prev) => (prev + step + TOTAL) % TOTAL);

  return (
    <Section id="projects">
      <SectionHead kicker="$ ls ~/projects" title={sections.projects.title} />

      <Reveal>
        <div className="relative">
          <div
            className="relative mx-auto flex items-center justify-center overflow-hidden"
            style={{ height: size.height + 40 }}
          >
            {projects.map((project, i) => {
              const delta = wrap(i - index);
              const distance = Math.abs(delta);
              const active = delta === 0;

              return (
                <div
                  key={project.id}
                  className="absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: size.width,
                    height: size.height,
                    transform: `perspective(1200px) translateX(${delta * span}px) rotateY(${
                      active ? 0 : delta < 0 ? 40 : -40
                    }deg) scale(${active ? 1 : 0.94})`,
                    zIndex: active ? TOTAL + 1 : TOTAL - distance,
                    opacity: distance > 2 ? 0 : active ? 1 : 0.55,
                    pointerEvents: active ? "auto" : "none",
                  }}
                  aria-hidden={!active}
                >
                  <div
                    className={`glass sweep flex h-full flex-col p-6 transition-shadow ${
                      active ? "shadow-2xl" : ""
                    }`}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                      <Code2 className="h-5 w-5" />
                    </div>

                    <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                    {project.status ? (
                      <p className="mt-1 font-mono text-xs text-accent-600">{project.status}</p>
                    ) : null}

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {project.summary}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-line bg-tint px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs transition-colors ${
                            link.kind === "primary"
                              ? "bloom bg-accent text-page hover:bg-accent-700"
                              : "border border-line text-body hover:border-accent hover:text-accent-600"
                          }`}
                        >
                          {link.kind === "primary" ? (
                            <ExternalLink className="h-3.5 w-3.5" />
                          ) : (
                            <Code2 className="h-3.5 w-3.5" />
                          )}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => move(-1)}
              aria-label="Previous project"
              className="glass absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-accent-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => move(1)}
              aria-label="Next project"
              className="glass absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-accent-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {projects.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${project.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-accent" : "w-1.5 bg-line-strong hover:bg-accent-300"
                }`}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { education } from "@/content/v3";

/**
 * The reference pins a section and rolls its coursework around a cylinder as
 * you scroll. Same mechanic, without GSAP: the tall outer block supplies the
 * scroll distance, a sticky screen does the pinning, and the drum's rotateX is
 * driven straight off scroll progress.
 *
 * The drum is built the fixed-radius way — the list is pushed back by the
 * radius and each course rotated out to it — so whichever course faces the
 * viewer sits at the same depth as every other one, and the type never
 * magnifies as it swings around.
 */

const ITEMS = [
  ...education.coursework.map((course) =>
    course.note
      ? `${course.code} · ${course.title} · ${course.note}`
      : `${course.code} · ${course.title}`,
  ),
  ...education.certifications.map((cert) => `${cert.note} · ${cert.title}`),
];

const SPACING = 180 / ITEMS.length;
const LAST = SPACING * (ITEMS.length - 1);

export function CourseCylinder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(380);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // A course faces the viewer when the drum's rotation cancels its own angle,
  // so the sweep runs from just before the first to just past the last.
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [SPACING, -(LAST + SPACING)],
  );

  useEffect(() => {
    const measure = () =>
      setRadius(
        Math.max(300, Math.min(window.innerWidth, window.innerHeight) * 0.42),
      );

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (still) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <li key={item} className="glass p-4 font-mono text-sm text-body">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <p className="absolute left-1/2 top-24 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
          coursework · keep scrolling
        </p>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: `${Math.round(radius * 3)}px`,
            // Courses dissolve before they reach the nav or the next section.
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 18%, #000 84%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 18%, #000 84%, transparent 100%)",
          }}
        >
          <motion.ul
            className="absolute left-1/2 top-1/2 h-0 w-full max-w-[min(92vw,42rem)]"
            style={{
              rotateX,
              z: -radius,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {ITEMS.map((item, i) => (
              <li
                key={item}
                className="absolute left-0 top-0 w-full -translate-x-1/2 px-5 text-center font-display text-2xl font-semibold uppercase leading-tight tracking-wide text-display sm:text-3xl"
                style={{
                  transform: `translateY(-50%) rotateX(${i * SPACING}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}

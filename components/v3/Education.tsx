"use client";

import { GraduationCap, MapPin } from "lucide-react";

import { education, sections } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

/**
 * The reference rotates coursework on a GSAP cylinder. This is the same idea
 * flattened to one axis: a belt of the stack, running slowly, paused on hover.
 */
function SkillBelt() {
  const lane = [...education.skills, ...education.skills];

  return (
    <div className="belt relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-page to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-page to-transparent" />
      <div className="belt-track gap-3">
        {lane.map((skill, i) => (
          <span
            key={`${skill}-${i}`}
            className="glass whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs text-muted"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Education() {
  return (
    <Section id="education">
      <SectionHead
        kicker="$ whoami"
        title={sections.education.title}
        description={sections.education.description}
      />

      <Reveal>
        <div className="glass sweep p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-accent-050 text-accent-600">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold">
                {education.institution}
              </h3>
              <p className="mt-1 font-mono text-sm text-accent-600">{education.degree}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {education.location}
                </span>
                <span className="rounded-full border border-line bg-tint px-3 py-1">
                  {education.gpa}
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm text-muted">{education.note}</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <SkillBelt />
      </Reveal>
    </Section>
  );
}

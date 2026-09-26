"use client";

import { ArrowUpRight, FileText } from "@/components/v3/icons";

import { publications, sections } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

export function Research() {
  return (
    <Section id="research">
      <SectionHead
        kicker="$ cat publications.bib"
        title={sections.research.title}
        description={sections.research.description}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {publications.map((paper, i) => (
          <Reveal key={paper.id} delay={i * 0.08}>
            <a
              href={paper.href}
              target="_blank"
              rel="noreferrer"
              className="glass glass-hover sweep group flex h-full flex-col p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                  <FileText className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-600" />
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-600">
                {paper.role}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
                {paper.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-faint">{paper.venue}</p>
              <p className="mt-3 flex-1 text-sm text-muted">{paper.summary}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

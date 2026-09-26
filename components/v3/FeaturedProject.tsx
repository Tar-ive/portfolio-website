import { Code2, ExternalLink } from "@/components/v3/icons";

import { featuredProject as p } from "@/content/v3";
import { Reveal } from "@/components/v3/Section";

/**
 * The big project, above the deck: cover and pitch side by side, then the
 * problem it was built for and how it works.
 */
export function FeaturedProject() {
  return (
    <Reveal>
      <article className="glass sweep mb-14 overflow-hidden p-5 sm:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <a
            href={p.links[0].href}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-xl border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.imageAlt}
              width={1280}
              height={640}
              loading="lazy"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </a>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              featured · {p.event}
            </p>
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {p.title}
            </h3>
            <p className="mt-3 text-lg leading-snug text-body">{p.tagline}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-accent-600">
                {p.stat.value}
              </span>
              <span className="text-sm text-muted">{p.stat.label}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {p.links.map((link) => (
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

        <div className="mt-8 grid gap-8 border-t border-line pt-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4 text-[15px] leading-relaxed text-muted">
            {p.story.map((para, i) => (
              <p key={i} className={i === p.story.length - 1 ? "text-body" : undefined}>
                {para}
              </p>
            ))}
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              how it works
            </p>
            <p className="text-[15px] leading-relaxed text-muted">{p.how}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-tint px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

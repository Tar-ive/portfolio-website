"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "@/components/v3/icons";
import { KiteHint } from "@/components/v3/KiteHint";

import { hero, socials } from "@/content/v3";

const ICONS = { Github, Linkedin, Mail, Twitter } as const;

/** Reveals a line word by word, the way the reference reveals its headings. */
function Words({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const still = useReducedMotion();
  if (still) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: "0.4em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[86vh] items-center pb-12 pt-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-10 xl:flex-row xl:items-center xl:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-none"
          >
            <div className="absolute inset-0 scale-125 rounded-full bg-accent-100 opacity-60 blur-2xl" />
            <div className="relative h-48 w-48 overflow-hidden rounded-full border border-[var(--glass-line)] shadow-[var(--glass-shadow)] sm:h-60 sm:w-60">
              <img
                src={hero.photo}
                alt={hero.photoAlt}
                width={480}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="glass absolute -bottom-1 left-1 flex h-12 w-12 items-center justify-center rounded-full font-devanagari text-2xl text-accent">
              {hero.mark}
            </span>
          </motion.div>

          <div className="flex-1 text-center xl:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-accent-600"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {hero.status}
            </motion.p>

            <h1 className="mb-6 font-mono text-4xl font-semibold tracking-tight text-display sm:text-5xl xl:text-6xl">
              <Words text={hero.name} stagger={0.08} />
            </h1>

            <div className="glass sweep mb-8 inline-block max-w-2xl px-5 py-4 text-left">
              <p className="font-mono text-sm leading-relaxed text-body sm:text-base">
                <Words text={hero.tagline} delay={0.35} stagger={0.018} />
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col items-center gap-3 sm:flex-row xl:justify-start"
            >
              <a
                href={hero.cta.primary.href}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(hero.cta.primary.href.slice(1))
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bloom group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-mono text-sm text-page shadow-lg transition-colors hover:bg-accent-700"
              >
                {hero.cta.primary.text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={hero.cta.secondary.href}
                target="_blank"
                rel="noreferrer"
                className="glass glass-hover sweep inline-flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm text-body"
              >
                <span className="font-devanagari text-accent">॥</span>
                {hero.cta.secondary.text}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-6 flex items-center justify-center gap-2 xl:justify-start"
            >
              {socials.map((s) => {
                const Icon = ICONS[s.icon as keyof typeof ICONS];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-accent-050 hover:text-accent-600"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
              className="mt-6 text-sm text-muted"
            >
              <KiteHint copy={hero.interactionHint} />
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

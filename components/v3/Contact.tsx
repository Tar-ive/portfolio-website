"use client";

import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

import { contact, sections, socials } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

/**
 * No backend and no third-party form service: submitting composes a mailto so
 * the message leaves from the visitor's own mail client.
 */
export function Contact() {
  const [form, setForm] = useState({ subject: "", message: "" });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      form.subject,
    )}&body=${encodeURIComponent(form.message)}`;
  };

  const field =
    "w-full rounded-xl border border-line bg-tint px-4 py-3 font-mono text-sm text-body outline-none transition-colors placeholder:text-faint focus:border-accent";

  return (
    <Section id="contact">
      <SectionHead
        kicker="$ mail -s"
        title={sections.contact.title}
        description={sections.contact.description}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <div className="flex flex-col gap-4">
          <Reveal>
            <div className="glass glass-hover sweep p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-accent-600">
                {contact.seeking.title}
              </h3>
              <p className="mt-2 text-body">{contact.seeking.body}</p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="glass glass-hover sweep flex h-full flex-col p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-accent-600">
                Find me
              </h3>

              <a
                href={`mailto:${contact.email}`}
                className="mt-4 flex items-center gap-3 font-mono text-sm text-body transition-colors hover:text-accent-600"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                  <Mail className="h-4 w-4" />
                </span>
                {contact.email}
              </a>

              <p className="mt-3 flex items-center gap-3 font-mono text-sm text-muted">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                  <MapPin className="h-4 w-4" />
                </span>
                {contact.location}
              </p>

              <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
                {socials
                  .filter((s) => s.href.startsWith("http"))
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between font-mono text-sm text-muted transition-colors hover:text-accent-600"
                    >
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
                <a
                  href={contact.substack}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between font-mono text-sm text-muted transition-colors hover:text-accent-600"
                >
                  Substack
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <form onSubmit={send} className="glass sweep flex h-full flex-col gap-5 p-6 sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                <Mail className="h-4 w-4" />
              </span>
              {contact.form.title}
            </h3>

            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-faint">
                {contact.form.subjectLabel}
              </span>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder={contact.form.subjectPlaceholder}
                className={field}
              />
            </label>

            <label className="flex flex-1 flex-col">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-faint">
                {contact.form.messageLabel}
              </span>
              <textarea
                required
                rows={7}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={contact.form.messagePlaceholder}
                className={`${field} min-h-40 flex-1 resize-y`}
              />
            </label>

            <button
              type="submit"
              className="bloom group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-mono text-sm text-page transition-colors hover:bg-accent-700"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              {contact.form.button}
            </button>

            <p className="text-center font-mono text-[11px] leading-relaxed text-faint">
              {contact.form.note}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

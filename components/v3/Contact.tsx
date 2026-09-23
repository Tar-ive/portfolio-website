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
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Hello from ${form.name || "your site"}`;
    const body = `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="glass sweep flex h-full flex-col gap-4 p-6 sm:p-8">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 font-mono text-sm text-body transition-colors hover:text-accent-600"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                <Mail className="h-4 w-4" />
              </span>
              {contact.email}
            </a>

            <p className="flex items-center gap-3 font-mono text-sm text-muted">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-050 text-accent-600">
                <MapPin className="h-4 w-4" />
              </span>
              {contact.location}
            </p>

            <div className="mt-2 border-t border-line pt-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                Elsewhere
              </p>
              <div className="flex flex-col gap-2">
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
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={send} className="glass sweep flex h-full flex-col gap-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="your name"
                  className={field}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={field}
                />
              </label>
            </div>

            <label className="flex flex-1 flex-col">
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-faint">
                Message
              </span>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="what are you building?"
                className={`${field} min-h-32 flex-1 resize-y`}
              />
            </label>

            <button
              type="submit"
              className="bloom group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-mono text-sm text-page transition-colors hover:bg-accent-700"
            >
              Send
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="font-mono text-[11px] text-faint">
              This opens your own mail client. Nothing is posted to a server.
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

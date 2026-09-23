"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { navigation, socials } from "@/content/v3";

const ICONS = { Github, Linkedin, Mail } as const;

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("v3-theme", next ? "dark" : "light");
    } catch {
      /* private mode: the choice just doesn't persist */
    }
    setDark(next);
  }, []);

  return { dark, toggle };
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const current = navigation
        .map((item) => item.href.slice(1))
        .find((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top <= 140 && rect.bottom >= 140;
        });
      setActive(current ?? "home");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Main navigation"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass rounded-none border-x-0 border-t-0" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 text-lg font-semibold text-display transition-colors hover:text-accent"
        >
          <span className="font-devanagari text-accent">॥</span>
          <span className="font-mono text-base">saksham</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const on = active === item.href.slice(1);
            return (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                aria-current={on ? "true" : undefined}
                className={`rounded-lg px-3 py-2 font-mono text-sm transition-colors ${
                  on
                    ? "bg-accent-050 text-accent-600"
                    : "text-muted hover:bg-accent-050 hover:text-accent-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {socials
              .filter((s) => s.icon in ICONS)
              .map((s) => {
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
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>

          <button
            onClick={toggle}
            aria-label="Toggle light and dark"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-accent-050 hover:text-accent-600"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-accent-050 hover:text-accent-600 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="glass rounded-none border-x-0 border-t border-b-0 md:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8">
            {navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                className="rounded-lg px-3 py-3 text-left font-mono text-sm text-muted transition-colors hover:bg-accent-050 hover:text-accent-600"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.nav>
  );
}

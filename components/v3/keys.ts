/**
 * Single-letter shortcuts (K for a kite fight, N for night) and the theme
 * switch they share with the navbar.
 */

export const FIGHT_EVENT = "kites:fight";

/** A bare press of `key`: no modifiers, no auto-repeat, not while typing. */
export function isPlainKey(e: KeyboardEvent, key: string) {
  if (e.key.toLowerCase() !== key || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return false;
  const el = e.target as HTMLElement | null;
  return !(el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)));
}

let dusk = 0;

/**
 * Day ↔ night. The page crossfades through a dusk for a moment (the
 * `theme-shift` class drives the sky's warm pass and the colour fades), and
 * the choice is remembered.
 */
export function toggleNight() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  root.classList.add("theme-shift");
  window.clearTimeout(dusk);
  dusk = window.setTimeout(() => root.classList.remove("theme-shift"), 1800);
  root.classList.toggle("dark", next);
  try {
    localStorage.setItem("v3-theme", next ? "dark" : "light");
  } catch {
    /* private mode: the choice just doesn't persist */
  }
  return next;
}

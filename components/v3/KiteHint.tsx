"use client";

import { useEffect, useState } from "react";

import { FIGHT_EVENT, isPlainKey, toggleNight } from "@/components/v3/keys";

/**
 * The line under the hero, with keycaps in it: {K} starts a kite fight, {N}
 * turns night on and off. Pressing the key anywhere (or clicking the cap, for
 * touch) does it, and the cap sinks as if it were hit. Without motion there
 * are no fights, so the line keeps only its first sentence.
 */

const KEYS = {
  K: { label: "Press K to start a kite fight", run: () => window.dispatchEvent(new Event(FIGHT_EVENT)) },
  N: { label: "Press N to toggle night", run: () => toggleNight() },
} as const;

type Key = keyof typeof KEYS;

export function KiteHint({ copy }: { copy: string }) {
  // Read after mount so the server and first client render agree.
  const [still, setStill] = useState(false);
  const [pressed, setPressed] = useState<Key | null>(null);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    let timer = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = (Object.keys(KEYS) as Key[]).find((k) => isPlainKey(e, k.toLowerCase()));
      if (!key) return;
      setPressed(key);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setPressed(null), 140);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  if (still) return <>{copy.split(".")[0]}</>;

  // "a {K} b {N} c" → ["a ", "K", " b ", "N", " c"]
  const parts = copy.split(/\{([A-Z])\}/);

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      {parts.map((part, i) => {
        if (i % 2 === 0) return part.trim() ? <span key={i}>{part.trim()}</span> : null;
        const key = part as Key;
        return (
          <button
            key={i}
            type="button"
            className="kbd-pill"
            data-pressed={pressed === key}
            aria-label={KEYS[key].label}
            onClick={KEYS[key].run}
          >
            {key}
          </button>
        );
      })}
    </span>
  );
}

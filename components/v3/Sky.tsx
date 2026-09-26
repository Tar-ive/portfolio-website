"use client";

/**
 * The reference floats its page over a drifting cloudscape. Same idea here:
 * a blue sky that warms toward the horizon, with blurred cloud banks crossing
 * it at different speeds. Pure CSS — no canvas, no vanta, no three.
 */

// Delays are spread across each duration so the sky is already full of cloud
// on the first frame instead of filling up over the next two minutes.
const CLOUDS = [
  { top: "1%", size: 52, blur: 56, opacity: 0.8, duration: 260, delay: -40 },
  { top: "11%", size: 36, blur: 44, opacity: 0.7, duration: 200, delay: -130 },
  { top: "21%", size: 64, blur: 68, opacity: 0.65, duration: 320, delay: -210 },
  { top: "35%", size: 42, blur: 50, opacity: 0.6, duration: 230, delay: -60 },
  { top: "47%", size: 72, blur: 78, opacity: 0.55, duration: 360, delay: -280 },
  { top: "59%", size: 46, blur: 54, opacity: 0.48, duration: 270, delay: -165 },
  { top: "71%", size: 58, blur: 70, opacity: 0.4, duration: 300, delay: -80 },
  { top: "85%", size: 40, blur: 48, opacity: 0.35, duration: 220, delay: -190 },
];

export function Sky() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-20] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--sky-0) 0%, var(--sky-1) 42%, var(--sky-2) 78%, var(--sky-3) 100%)",
        }}
      />

      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: cloud.top,
            width: `${cloud.size}vw`,
            height: `${cloud.size * 0.42}vw`,
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
            background:
              "radial-gradient(closest-side, var(--cloud) 0%, var(--cloud) 45%, transparent 100%)",
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}

      {/* Passing through dusk while day and night swap. */}
      <div className="dusk absolute inset-0" />

      {/* A vermillion warmth low on the horizon, so the page keeps its accent. */}
      <div
        className="wash wash-b bottom-[-18%] left-[14%] h-[44vw] w-[44vw] opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent-300) 55%, transparent), transparent 68%)",
        }}
      />
    </div>
  );
}

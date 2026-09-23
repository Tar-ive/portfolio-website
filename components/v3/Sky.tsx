"use client";

/**
 * The reference floats its page over a drifting cloudscape. Same idea here:
 * a blue sky that warms toward the horizon, with blurred cloud banks crossing
 * it at different speeds. Pure CSS — no canvas, no vanta, no three.
 */

// Delays are spread across each duration so the sky is already full of cloud
// on the first frame instead of filling up over the next two minutes.
const CLOUDS = [
  { top: "2%", size: 50, blur: 50, opacity: 0.95, duration: 150, delay: -20 },
  { top: "12%", size: 34, blur: 38, opacity: 0.85, duration: 110, delay: -70 },
  { top: "22%", size: 62, blur: 60, opacity: 0.8, duration: 190, delay: -120 },
  { top: "36%", size: 40, blur: 44, opacity: 0.75, duration: 130, delay: -35 },
  { top: "48%", size: 70, blur: 70, opacity: 0.7, duration: 210, delay: -160 },
  { top: "60%", size: 44, blur: 48, opacity: 0.6, duration: 160, delay: -95 },
  { top: "72%", size: 56, blur: 64, opacity: 0.5, duration: 180, delay: -45 },
  { top: "86%", size: 38, blur: 42, opacity: 0.45, duration: 120, delay: -105 },
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

"use client";

/**
 * The reference floats its content over a drifting sky. This is the same idea
 * in paper and vermillion: three slow washes over the page colour, fixed
 * behind everything, no canvas and no dependency.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-page" />
      <div
        className="wash wash-a left-[-12%] top-[-14%] h-[52vw] w-[52vw] opacity-45"
        style={{
          background:
            "radial-gradient(circle at 34% 32%, color-mix(in oklab, var(--accent-300) 70%, transparent), transparent 68%)",
        }}
      />
      <div
        className="wash wash-b right-[-16%] top-[12%] h-[58vw] w-[58vw] opacity-55"
        style={{
          background:
            "radial-gradient(circle at 60% 42%, color-mix(in oklab, var(--accent-100) 95%, transparent), transparent 70%)",
        }}
      />
      <div
        className="wash wash-a bottom-[-20%] left-[18%] h-[48vw] w-[48vw] opacity-50"
        style={{
          animationDelay: "-8s",
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent-300) 45%, transparent), transparent 66%)",
        }}
      />
      <div
        className="wash wash-b right-[6%] bottom-[8%] h-[38vw] w-[38vw] opacity-40"
        style={{
          animationDelay: "-14s",
          background:
            "radial-gradient(circle at 50% 50%, var(--paper-2), transparent 68%)",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A flock of kites instead of the reference's birds. Each kite steers toward
 * its own slot in a loose formation behind the cursor, so the string of them
 * swings when you move. With no pointer (touch, or an untouched page) the
 * formation drifts along a slow lissajous path on its own.
 */

type Kite = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  dark: string;
  light: string;
  slot: { x: number; y: number };
  phase: number;
};

// [sail, counter-sail] — the two tones each kite is quartered in.
const COLORS: [string, string][] = [
  ["#B14E24", "#F7E3D2"],
  ["#C2683A", "#FBF8F1"],
  ["#743114", "#EFD2BB"],
  ["#D78F63", "#FBF8F1"],
  ["#8E3C18", "#F3DCCB"],
  ["#A5451F", "#FBF8F1"],
  ["#E0A075", "#FFFFFF"],
];

// Slots trail up and to the side, the way a real string of kites strings out.
const SLOTS = [
  { x: 0, y: 0 },
  { x: -62, y: -38 },
  { x: -118, y: 18 },
  { x: -168, y: -52 },
  { x: -212, y: 30 },
  { x: -258, y: -20 },
  { x: -300, y: 58 },
];

function drawKite(ctx: CanvasRenderingContext2D, kite: Kite, t: number) {
  const angle = Math.atan2(kite.vy, kite.vx) + Math.PI / 2;
  const s = kite.size;
  const top = -s * 1.3;
  const bottom = s * 1.2;
  const side = s * 0.85;

  ctx.save();
  ctx.translate(kite.x, kite.y);
  ctx.rotate(angle);

  // Tail: a waving line hung with bows.
  ctx.beginPath();
  ctx.moveTo(0, bottom);
  const tailPoints: [number, number][] = [];
  for (let i = 1; i <= 5; i++) {
    const p = i / 5;
    const x = Math.sin(t * 2.2 + kite.phase + i * 0.9) * s * 0.5 * p;
    const y = bottom + p * s * 2.6;
    tailPoints.push([x, y]);
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = kite.dark;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(1, s * 0.08);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Bows along the tail.
  tailPoints.forEach(([x, y], i) => {
    if (i % 2) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t + i);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.26, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = kite.light;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  // Four panels, the way a kite icon quarters the sail: two dark, two light.
  const panels: [number, number, number, number, string][] = [
    [0, top, -side, 0, kite.dark],
    [0, top, side, 0, kite.light],
    [0, bottom, -side, 0, kite.light],
    [0, bottom, side, 0, kite.dark],
  ];

  panels.forEach(([ax, ay, bx, by, fill]) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  });

  // Spars and outline.
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.lineTo(side, 0);
  ctx.lineTo(0, bottom);
  ctx.lineTo(-side, 0);
  ctx.closePath();
  ctx.moveTo(0, top);
  ctx.lineTo(0, bottom);
  ctx.moveTo(-side, 0);
  ctx.lineTo(side, 0);
  ctx.strokeStyle = kite.dark;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = Math.max(1, s * 0.08);
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

export function Kites() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const scale = width < 640 ? 0.62 : 1;
    const kites: Kite[] = SLOTS.map((slot, i) => ({
      x: width * 0.5 + slot.x * scale,
      y: height * 0.38 + slot.y * scale,
      vx: 0,
      vy: 0,
      size: (i === 0 ? 17 : 14 - i * 0.7) * scale,
      dark: COLORS[i % COLORS.length][0],
      light: COLORS[i % COLORS.length][1],
      slot: { x: slot.x * scale, y: slot.y * scale },
      phase: i * 1.3,
    }));

    const pointer = { x: width * 0.5, y: height * 0.38, touched: false };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.touched = true;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    if (still) {
      // One static formation, no loop.
      ctx.clearRect(0, 0, width, height);
      kites.forEach((kite) => {
        kite.vx = 1;
        kite.vy = -0.2;
        kite.x = pointer.x + kite.slot.x;
        kite.y = pointer.y + kite.slot.y;
        drawKite(ctx, kite, 0);
      });

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
      };
    }

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Until the cursor moves, the flock wanders on its own.
      const lead = pointer.touched
        ? pointer
        : {
            x: width * (0.5 + 0.26 * Math.sin(t * 0.17)),
            y: height * (0.42 + 0.16 * Math.sin(t * 0.23 + 1.1)),
          };

      kites.forEach((kite, i) => {
        const targetX = lead.x + kite.slot.x + Math.sin(t * 0.9 + kite.phase) * 10;
        const targetY = lead.y + kite.slot.y + Math.cos(t * 0.7 + kite.phase) * 12;

        // Each kite further down the string is a little lazier.
        const pull = 0.014 - i * 0.0012;
        kite.vx += (targetX - kite.x) * pull;
        kite.vy += (targetY - kite.y) * pull;
        kite.vx *= 0.92;
        kite.vy *= 0.92;
        kite.x += kite.vx;
        kite.y += kite.vy;

        drawKite(ctx, kite, t);
      });

      // The string tying them together.
      ctx.beginPath();
      ctx.moveTo(kites[0].x, kites[0].y);
      for (let i = 1; i < kites.length; i++) {
        const prev = kites[i - 1];
        const kite = kites[i];
        ctx.quadraticCurveTo(
          (prev.x + kite.x) / 2,
          (prev.y + kite.y) / 2 + 14,
          kite.x,
          kite.y,
        );
      }
      ctx.strokeStyle = "#B14E24";
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-10] opacity-90"
    />
  );
}

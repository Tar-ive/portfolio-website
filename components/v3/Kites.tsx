"use client";

import { useEffect, useRef } from "react";

import { FIGHT_EVENT, isPlainKey } from "@/components/v3/keys";

/**
 * Three kites flying in a loose triangle instead of the reference's birds,
 * each on its own line to a flyer standing below the bottom of the screen.
 * The view is the flyers' own: looking downwind, so the screen is the "wind
 * window" and the wind blows into it.
 *
 * Kites are flown with NASA's KiteModeler aerodynamics (Glenn Research
 * Center, Beginner's Guide to Kites):
 *   Cl = Clo / (1 + Clo/(π·AR)),  Clo = 2π·α
 *   Cd = 1.28·sin α + Cl² / (0.7·π·AR)
 *   L = Cl·A·½ρV²,  D = Cd·A·½ρV²
 * The bridle holds the sail at a trim angle of attack to the apparent wind
 * (NASA's torque balance about the bridle point). A kite flying across the
 * window at speed v sees apparent wind at γ = atan(v / U); lift drives it
 * along its nose, L·cos γ − D·sin γ, until v/U reaches L/D, while
 * L·sin γ + D·cos γ loads the line. The wind is strongest in the middle of
 * the window and fades toward its edges (the zenith and the sides), so a kite
 * parked high goes quiet and one diving through the middle picks up speed.
 * Weight acts on it the whole time.
 *
 * The flyer only has the line: to move, they let the nose swing round on a
 * slack line, then pull, and the kite goes where it points. To hold a spot
 * they keep the nose up and give just enough pull that lift carries the
 * weight. The lead's spot is a smoothed cursor (a time-weighted average of
 * recent pointer samples, as the reference does) and the other two hold the
 * back corners behind it. The kites launch from their flyers at page load.
 *
 * Each line hangs as NASA's catenary, y = C2 + (H/w)·cosh(x·w/H + C1), with
 * H the line's tension, so a pulling kite has a taut line and a drifting one
 * sags.
 *
 * Press K (or fire FIGHT_EVENT) for a kite fight. One kite climbs above
 * another and swoops across it until their lines actually cross; then both
 * flyers saw, pulling and giving line. One line parts at the crossing. Its
 * lower half falls away from the flyer. The cut kite, with no line to hold
 * its trim, falls like a flat plate (terminal speed √(2mg / ρ·A·1.28)),
 * fluttering, and is carried downwind, away from us, so it shrinks toward
 * the horizon; the flyer launches a new one.
 *
 * At night (dark mode, or N) the flyers let go and each kite lights up, one
 * after another, into a free sky lantern. The lanterns fly on hot-air
 * buoyancy, modelled after Schuurman & Gransden, "Sky Lantern Safety Flight
 * Profile for Risk Assessment" (TU Delft, AIAA 2017-3289), eq. 9:
 *   [ρ∞ − ρi]·g·V − ½·ρ∞·A·Cd·u|u| = m·(g + a),  ρi = ρ∞·T∞/Ti
 * with their type A lantern (125.5 L, 53.6 g, Cd 0.3). The flame trims the
 * air inside hotter or cooler to rise or sink toward the group's spot, the
 * air drifts them toward the cursor, and they always hang upright, fire at
 * the bottom. Real lanterns are slow, so their clock runs a few times fast.
 */

type Point = { x: number; y: number };
type Mass = { x: number; y: number; px: number; py: number };

// A loose length of line: first point pinned, the rest hanging free.
type Rope = { pts: Mass[]; rest: number[]; age: number; life: number };

type Kite = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  nose: number; // direction the nose points, radians
  spin: number;
  size: number;
  alpha: number;
  mode: "wait" | "fly" | "cut";
  wakeAt: number;
  cutAt: number;
  joined: number; // newer kites take the back corners
  tension: number; // line tension, N
  heat: number; // lantern's inside air, K
  baseSize: number; // size when cut, before distance shrinks it
  pull: number; // how hard the flyer is pulling this frame
  anchor: number; // flyer's position, as a fraction of the width
  glow: number; // 0 kite … 1 lit lantern
  loose: Rope | null; // the cut line trailing a free kite
  dark: string;
  light: string;
  phase: number;
  tail: Mass[];
};

type Cross = { p: Point; i: number; j: number };

type Fight = {
  start: number;
  att: Kite;
  def: Kite;
  side: number; // which way the attacker must pass the defender to cross
  from: Point;
  defHome: Point;
  sawAt: number | null;
  sawFor: number;
  base: [Point, Point] | null;
  cross: Cross | null;
};

// [sail, counter-sail] — the two tones each kite is quartered in.
const COLORS: [string, string][] = [
  ["#B14E24", "#F7E3D2"],
  ["#C2683A", "#FBF8F1"],
  ["#743114", "#EFD2BB"],
];

// Where each kite's flyer stands, across the bottom of the screen.
const ANCHORS = [0.5, 0.2, 0.8];

// The triangle, in the lead's frame: x across its heading, y behind it.
const FORMATION: Point[] = [
  { x: 0, y: 0 },
  { x: -30, y: 40 },
  { x: 30, y: 40 },
];

// Air, and the craft, in SI units.
const RHO = 1.225; // kg/m³, sea-level air
const G = 9.81; // m/s²
const WIND = 5; // m/s, mean breeze
const KITE_AREA = 0.3; // m², a small diamond fighter
const KITE_AR = 1.5; // aspect ratio, span² / area
const KITE_MASS = 0.06; // kg
const KITE_TRIM = 0.35; // rad, angle of attack the bridle holds
const PLATE_CD = 1.28; // flat plate broadside (NASA's Cdo at 90°)
const LINE_W = 0.05; // N/m, line weight per length; heavier than real so the sag reads
const LANTERN_VOLUME = 0.1255; // m³, TU Delft type A
const LANTERN_MASS = 0.0536; // kg
const LANTERN_CD = 0.3;
const LANTERN_AREA = Math.PI * Math.cbrt((3 * LANTERN_VOLUME) / (4 * Math.PI)) ** 2;
const AIR_T = 288; // K
// Inside temperature at which buoyancy exactly carries the lantern.
const LANTERN_T = AIR_T / (1 - LANTERN_MASS / (RHO * LANTERN_VOLUME));
const LANTERN_WARP = 3; // lanterns are slow; their clock runs 3× on the page
const PX_PER_M = 28;

// NASA's flat-plate kite coefficients at angle of attack α (Clo = 2π·sin α
// cos α, which is 2π·α at small angles and stays sane past stall).
function kiteCoefficients(alpha: number) {
  const clo = 2 * Math.PI * Math.sin(alpha) * Math.cos(alpha);
  const cl = clo / (1 + Math.abs(clo) / (Math.PI * KITE_AR));
  const cd = PLATE_CD * Math.abs(Math.sin(alpha)) + (cl * cl) / (0.7 * Math.PI * KITE_AR);
  return { cl, cd };
}

const TRIM = kiteCoefficients(KITE_TRIM);

const LEAD_SIZE = 10;
const WING_SIZE = 8.5;
const TAIL_POINTS = 7;
const LINE_POINTS = 22;
const TRAIL_MS = 320; // pointer samples older than this are dropped
const TRAIL_DECAY_MS = 90; // weight falloff inside that window
const IDLE_MS = 1200; // pointer still this long → start circling
const ENGAGE_S = 1.6; // attacker's climb and swoop across
const GIVE_UP_S = 5.5; // lines never crossed: break off

const LINE_DAY = "#743114";
const LINE_NIGHT = "#EFD2BB";
const SPARK = "#D78F63";
const NIGHT_S = 1.6; // matches the sky's crossfade
const UP = -Math.PI / 2;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const angleDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const ease = (p: number) => p * p * (3 - 2 * p);

function mix(a: string, b: string, p: number) {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * p));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

// Wind as a sum of slow sines: a steady breeze with the odd gust in it.
const windAt = (t: number) =>
  Math.sin(t * 0.37) * 0.6 + Math.sin(t * 1.21 + 2.1) * 0.3 + Math.sin(t * 2.9 + 0.7) * 0.1;

/**
 * Catenary from A to B with catenary constant a (canvas y points down, so the
 * maths runs with y flipped). With S the span and h the rise:
 *   η = S / 2a,  x_C = S/2 − a·asinh(h / (2a·sinh η)),  y_C = −a(cosh(−x_C/a) − 1)
 * which is the same x_C as S/2 + a·asinh(h·e^η / (a(1 − e^2η))).
 */
function catenary(A: Point, B: Point, a: number, n = LINE_POINTS): Point[] {
  const dx = B.x - A.x;
  const S = Math.abs(dx);
  const h = A.y - B.y;
  const pts: Point[] = [];

  if (S < 2) {
    for (let i = 0; i <= n; i++) pts.push({ x: A.x + dx * (i / n), y: A.y - h * (i / n) });
    return pts;
  }

  const eta = S / (2 * a);
  const xC = S / 2 - a * Math.asinh(h / (2 * a * Math.sinh(eta)));
  const yC = -a * (Math.cosh(-xC / a) - 1);
  const dir = Math.sign(dx);

  for (let i = 0; i <= n; i++) {
    const x = (S * i) / n;
    const y = yC + a * (Math.cosh((x - xC) / a) - 1);
    pts.push({ x: A.x + dir * x, y: A.y - y });
  }
  return pts;
}

// Where segments a1–a2 and b1–b2 cross, as a fraction along a, or -1.
function segmentHit(a1: Point, a2: Point, b1: Point, b2: Point): number {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  if (Math.abs(d) < 1e-9) return -1;
  const u = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  const v = ((b1.x - a1.x) * (a2.y - a1.y) - (b1.y - a1.y) * (a2.x - a1.x)) / d;
  return u >= 0 && u <= 1 && v >= 0 && v <= 1 ? u : -1;
}

// Where two lines cross (the highest crossing, nearest the kites), if they do.
function crossing(a: Point[], b: Point[]): Cross | null {
  for (let i = a.length - 2; i >= 0; i--) {
    for (let j = b.length - 2; j >= 0; j--) {
      const u = segmentHit(a[i], a[i + 1], b[j], b[j + 1]);
      if (u >= 0) {
        return {
          p: { x: a[i].x + (a[i + 1].x - a[i].x) * u, y: a[i].y + (a[i + 1].y - a[i].y) * u },
          i,
          j,
        };
      }
    }
  }
  return null;
}

// A rope from a polyline, cut into short even pieces so it hangs smoothly.
function makeRope(line: Point[], life: number): Rope {
  const pts: Mass[] = [];
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i];
    const b = line[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 14));
    for (let s = 0; s < steps; s++) {
      const x = a.x + ((b.x - a.x) * s) / steps;
      const y = a.y + ((b.y - a.y) * s) / steps;
      pts.push({ x, y, px: x, py: y });
    }
  }
  const end = line[line.length - 1];
  pts.push({ x: end.x, y: end.y, px: end.x, py: end.y });
  const rest = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  return { pts, rest, age: 0, life };
}

function stepRope(rope: Rope, pin: Point, dt: number, wind: number) {
  rope.age += dt;
  const [first] = rope.pts;
  first.x = first.px = pin.x;
  first.y = first.py = pin.y;
  for (let i = 1; i < rope.pts.length; i++) {
    const p = rope.pts[i];
    const vx = (p.x - p.px) * 0.985;
    const vy = (p.y - p.py) * 0.985;
    p.px = p.x;
    p.py = p.y;
    p.x += vx + wind * 40 * dt * dt;
    p.y += vy + 420 * dt * dt;
  }
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 1; i < rope.pts.length; i++) {
      const a = rope.pts[i - 1];
      const b = rope.pts[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const diff = (d - rope.rest[i - 1]) / d;
      if (i === 1) {
        b.x -= dx * diff;
        b.y -= dy * diff;
      } else {
        a.x += dx * diff * 0.5;
        a.y += dy * diff * 0.5;
        b.x -= dx * diff * 0.5;
        b.y -= dy * diff * 0.5;
      }
    }
  }
}

function strokePath(ctx: CanvasRenderingContext2D, pts: Point[], alpha: number, color: string) {
  if (alpha < 0.01 || pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.8;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Drawing rotation: the sail is drawn nose-up, so turn it from straight up.
const rotation = (kite: Kite) => kite.nose - UP;

function resetTail(kite: Kite) {
  kite.tail.forEach((p, j) => {
    p.x = p.px = kite.x;
    p.y = p.py = kite.y + kite.size * 1.2 + j * kite.size * 0.5;
  });
}

function tailAnchor(kite: Kite): Point {
  const d = kite.size * 1.2;
  const r = rotation(kite);
  return { x: kite.x - Math.sin(r) * d, y: kite.y + Math.cos(r) * d };
}

function stepTail(kite: Kite, dt: number, wind: number) {
  const seg = kite.size * 0.5;
  const anchor = tailAnchor(kite);
  const gravity = 260;
  const push = wind * 90;

  kite.tail.forEach((p, i) => {
    if (i === 0) {
      p.px = p.x = anchor.x;
      p.py = p.y = anchor.y;
      return;
    }
    const vx = (p.x - p.px) * 0.94;
    const vy = (p.y - p.py) * 0.94;
    p.px = p.x;
    p.py = p.y;
    p.x += vx + push * dt * dt;
    p.y += vy + gravity * dt * dt;
  });

  // Keep each segment its length, pulling from the kite outward.
  for (let i = 1; i < kite.tail.length; i++) {
    const a = kite.tail[i - 1];
    const b = kite.tail[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    b.x = a.x + (dx / d) * seg;
    b.y = a.y + (dy / d) * seg;
  }
}

function drawTail(ctx: CanvasRenderingContext2D, kite: Kite, t: number) {
  const s = kite.size;
  const pts = kite.tail;

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
  const fade = kite.alpha * (1 - 0.8 * kite.glow);
  ctx.strokeStyle = kite.dark;
  ctx.globalAlpha = 0.5 * fade;
  ctx.lineWidth = Math.max(1, s * 0.08);
  ctx.lineCap = "round";
  ctx.stroke();

  // Bows ride the rope, turned across it, with a little flutter.
  ctx.fillStyle = kite.light;
  ctx.globalAlpha = 0.85 * fade;
  for (let i = 2; i < pts.length; i += 2) {
    const a = pts[i - 1];
    const b = pts[i];
    const across = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(across + Math.sin(t * 6 + kite.phase + i) * 0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.26, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawSail(ctx: CanvasRenderingContext2D, kite: Kite) {
  if (kite.glow > 0.99) return;
  const s = kite.size * (1 - 0.45 * kite.glow);
  const top = -s * 1.3;
  const bottom = s * 1.2;
  const side = s * 0.85;

  ctx.save();
  ctx.translate(kite.x, kite.y);
  ctx.rotate(rotation(kite));
  const fade = kite.alpha * (1 - kite.glow);
  ctx.globalAlpha = fade;

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
  ctx.globalAlpha = 0.85 * fade;
  ctx.lineWidth = Math.max(1, s * 0.08);
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

/**
 * A paper lantern: a halo of light, a body wider at the shoulder than at the
 * mouth, lit from a flame inside, with the kite's own colour at its edges.
 * It swells up out of the kite as it lights, and flickers.
 */
function drawLantern(ctx: CanvasRenderingContext2D, kite: Kite, t: number) {
  const g = kite.glow;
  if (g < 0.01) return;
  const s = kite.size * (0.55 + 0.45 * g);
  const flicker =
    0.86 + 0.1 * Math.sin(t * 11 + kite.phase * 3) * Math.sin(t * 6.3 + kite.phase) +
    0.04 * Math.sin(t * 23 + kite.phase);
  const alpha = g * kite.alpha;

  ctx.save();
  ctx.translate(kite.x, kite.y);

  // Halo, added onto whatever is behind so it reads as light.
  ctx.globalCompositeOperation = "lighter";
  const halo = ctx.createRadialGradient(0, s * 0.3, 0, 0, s * 0.3, s * 5);
  halo.addColorStop(0, `rgba(255, 176, 96, ${0.42 * alpha * flicker})`);
  halo.addColorStop(0.35, `rgba(240, 120, 60, ${0.16 * alpha * flicker})`);
  halo.addColorStop(1, "rgba(240, 120, 60, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, s * 0.3, s * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // Always upright: the flame hangs at the bottom.

  const top = -s * 1.25;
  const bottom = s * 1.05;
  const shoulder = s * 0.95;
  const mouth = s * 0.62;

  const body = new Path2D();
  body.moveTo(-shoulder * 0.7, top);
  body.bezierCurveTo(-shoulder * 1.15, top + s * 0.5, -mouth * 1.1, bottom - s * 0.4, -mouth, bottom);
  body.lineTo(mouth, bottom);
  body.bezierCurveTo(mouth * 1.1, bottom - s * 0.4, shoulder * 1.15, top + s * 0.5, shoulder * 0.7, top);
  body.closePath();

  const paper = ctx.createRadialGradient(0, bottom - s * 0.5, s * 0.1, 0, 0, s * 1.6);
  paper.addColorStop(0, "#FFF1CF");
  paper.addColorStop(0.45, "#F8B870");
  paper.addColorStop(1, kite.dark);
  ctx.globalAlpha = alpha * (0.8 + 0.2 * flicker);
  ctx.fillStyle = paper;
  ctx.fill(body);

  // Ribs showing through the paper, and the cap and rim.
  ctx.globalAlpha = alpha * 0.35;
  ctx.strokeStyle = kite.dark;
  ctx.lineWidth = Math.max(0.6, s * 0.06);
  ctx.beginPath();
  for (const k of [-0.35, 0.35]) {
    ctx.moveTo(shoulder * 0.7 * k, top);
    ctx.quadraticCurveTo(shoulder * 1.1 * k, 0, mouth * k, bottom);
  }
  ctx.moveTo(-shoulder * 1.02, top + s * 0.75);
  ctx.quadraticCurveTo(0, top + s * 0.9, shoulder * 1.02, top + s * 0.75);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.9;
  ctx.fillStyle = kite.dark;
  ctx.fillRect(-shoulder * 0.7, top - s * 0.12, shoulder * 1.4, s * 0.16);
  ctx.fillRect(-mouth, bottom - s * 0.04, mouth * 2, s * 0.12);

  // The flame at the mouth.
  ctx.globalCompositeOperation = "lighter";
  const flame = ctx.createRadialGradient(0, bottom - s * 0.2, 0, 0, bottom - s * 0.2, s * 0.55);
  flame.addColorStop(0, `rgba(255, 244, 214, ${alpha * flicker})`);
  flame.addColorStop(1, "rgba(255, 190, 110, 0)");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.arc(0, bottom - s * 0.2, s * 0.55, 0, Math.PI * 2);
  ctx.fill();

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
    const home = { x: width * 0.5, y: height * 0.38 };
    const flyerAt = (kite: Kite): Point => ({ x: width * kite.anchor, y: height + 30 });
    const px = PX_PER_M * scale;

    // How squarely the wind meets a kite at its place in the window: full in
    // the middle, fading toward the zenith and the sides (cos of the angle
    // off the window's centre, from elevation and azimuth).
    const windowCos = (kite: Kite) => {
      const from = flyerAt(kite);
      const elevation = clamp((from.y - kite.y) / (height * 1.1), 0, 1) * 1.35;
      const azimuth = clamp((kite.x - from.x) / (width * 0.75), -1, 1) * 1.2;
      return Math.max(0.08, Math.cos(elevation) * Math.cos(azimuth));
    };

    // Heading of the lead, as a unit vector. Straight up until it moves.
    const heading = { x: 0, y: -1 };

    const kites: Kite[] = FORMATION.map((slot, i) => {
      const kite: Kite = {
        x: width * ANCHORS[i],
        y: height + 30,
        vx: 0,
        vy: 0,
        nose: UP,
        spin: 0,
        size: (i === 0 ? LEAD_SIZE : WING_SIZE) * scale,
        alpha: 1,
        mode: "wait",
        wakeAt: 0.3 + i * 0.7,
        cutAt: 0,
        joined: 0.3 + i * 0.7,
        tension: 1,
        heat: LANTERN_T,
        baseSize: 0,
        pull: 0,
        anchor: ANCHORS[i],
        glow: 0,
        loose: null,
        dark: COLORS[i][0],
        light: COLORS[i][1],
        phase: i * 1.3,
        tail: Array.from({ length: TAIL_POINTS }, () => ({ x: 0, y: 0, px: 0, py: 0 })),
      };
      resetTail(kite);
      return kite;
    });

    const lineOf = (kite: Kite) => {
      const from = flyerAt(kite);
      const dist = Math.hypot(kite.x - from.x, kite.y - from.y) || 1;
      // Catenary constant a = H / w, in pixels; never tighter than a third
      // of the span so a slack line still reads as a line.
      return catenary(from, kite, Math.max(dist * 0.3, (kite.tension / LINE_W) * px));
    };

    const samples: { x: number; y: number; t: number }[] = [];
    const pointer = { x: home.x, y: home.y, touched: false, lastMove: 0 };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      samples.push({ x: e.clientX, y: e.clientY, t: now });
      while (samples.length > 12 || (samples.length && samples[0].t < now - TRAIL_MS)) {
        samples.shift();
      }
      pointer.touched = true;
      pointer.lastMove = now;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    // Night follows the page's dark class, however it gets set.
    const root = document.documentElement;
    let nightTarget = root.classList.contains("dark") ? 1 : 0;
    let night = nightTarget;
    kites.forEach((kite) => (kite.glow = night));

    if (still) {
      // One static formation on hanging lines, no loop, no fights; redrawn
      // as kites or lanterns when the theme changes.
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        const color = LINE_DAY;
        kites.forEach((kite, i) => {
          kite.mode = "fly";
          kite.glow = nightTarget;
          kite.x = home.x + FORMATION[i].x * scale;
          kite.y = home.y + FORMATION[i].y * scale;
          resetTail(kite);
          if (!nightTarget) strokePath(ctx, lineOf(kite), 0.22, color);
        });
        kites.forEach((kite) => {
          drawTail(ctx, kite, 0);
          drawSail(ctx, kite);
          drawLantern(ctx, kite, 0);
        });
      };
      draw();
      const watch = new MutationObserver(() => {
        nightTarget = root.classList.contains("dark") ? 1 : 0;
        draw();
      });
      watch.observe(root, { attributes: true, attributeFilter: ["class"] });

      return () => {
        watch.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
      };
    }

    const watch = new MutationObserver(() => {
      nightTarget = root.classList.contains("dark") ? 1 : 0;
    });
    watch.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Where the lead kite is headed this frame.
    const leadTarget = (now: number, t: number): Point => {
      if (!pointer.touched) {
        return {
          x: width * (0.5 + 0.26 * Math.sin(t * 0.17)),
          y: height * (0.42 + 0.16 * Math.sin(t * 0.23 + 1.1)),
        };
      }

      let sx = 0;
      let sy = 0;
      let sw = 0;
      for (const p of samples) {
        if (p.t < now - TRAIL_MS) continue;
        const w = Math.exp(-(now - p.t) / TRAIL_DECAY_MS);
        sx += p.x * w;
        sy += p.y * w;
        sw += w;
      }
      if (sw > 0) {
        pointer.x = sx / sw;
        pointer.y = sy / sw;
      }

      // Resting pointer: circle it lazily, easing in so there's no jump.
      const idle = now - pointer.lastMove;
      const drift = clamp((idle - IDLE_MS) / 1500, 0, 1);
      return {
        x: pointer.x + Math.cos(t * 0.7) * 46 * drift,
        y: pointer.y + Math.sin(t * 0.95) * 26 * drift,
      };
    };

    let fight: Fight | null = null;
    const fallen: Rope[] = []; // lower halves of cut lines, dropping
    const lines = new Map<Kite, Point[]>();
    let clock = 0;
    let asked = false; // K pressed before the kites were ready: fight when they are

    const startFight = () => {
      // One fight at a time, once every kite is up and settled.
      asked = true;
      // Lanterns fly free, with no lines to cross, so fights are for the day.
      if (nightTarget) {
        asked = false;
        return;
      }
      if (fight || !kites.every((k) => k.mode === "fly" && clock - k.joined > 2.5)) return;
      asked = false;
      const a = Math.floor(Math.random() * kites.length);
      const b = (a + 1 + Math.floor(Math.random() * (kites.length - 1))) % kites.length;
      const att = kites[a];
      const def = kites[b];
      fight = {
        start: clock,
        att,
        def,
        side: Math.sign(def.anchor - att.anchor) || 1,
        from: { x: att.x, y: att.y },
        defHome: { x: def.x, y: def.y },
        sawAt: null,
        sawFor: 1.6 + Math.random() * 1.4,
        base: null,
        cross: null,
      };
    };

    const onKey = (e: KeyboardEvent) => {
      if (isPlainKey(e, "k")) startFight();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(FIGHT_EVENT, startFight);

    // One line parts at the crossing.
    const snap = (f: Fight, cross: Cross) => {
      const attLoses = Math.random() < 0.5;
      const loser = attLoses ? f.att : f.def;
      const winner = attLoses ? f.def : f.att;
      const line = lines.get(loser);
      fight = null;
      if (!line) return;

      const idx = attLoses ? cross.i : cross.j;
      fallen.push(makeRope([...line.slice(0, idx + 1), cross.p], 1.8));
      loser.loose = makeRope([cross.p, ...line.slice(idx + 1)].reverse(), Infinity);

      loser.mode = "cut";
      loser.cutAt = clock;
      loser.baseSize = loser.size;
      loser.pull = 0;
      loser.spin += (Math.random() - 0.5) * 6;

      // Released from the pressure of the other line, the winner pops up.
      winner.vy -= 4 * px;
    };

    // The flyer ties on a new kite and launches it.
    const relaunch = (kite: Kite) => {
      kite.mode = "wait";
      kite.wakeAt = clock + 1;
      kite.joined = clock + 1;
      kite.alpha = 1;
      kite.size = WING_SIZE * scale;
      kite.loose = null;
      kite.tension = 1;
      kite.heat = LANTERN_T;
    };

    let raf = 0;
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      // Real time step, capped so a background tab doesn't fling the kites.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t = (now - start) / 1000;
      clock = t;
      const wind = windAt(t);
      const lead = leadTarget(now, t);

      // Dusk to night (or back) over the sky's crossfade; the lanterns light
      // one after another rather than all at once.
      night = clamp(night + clamp(nightTarget - night, -dt / NIGHT_S, dt / NIGHT_S), 0, 1);
      kites.forEach((kite, i) => {
        kite.glow = clamp((night - i * 0.15) / 0.7, 0, 1);
      });
      const lineColor = mix(LINE_DAY, LINE_NIGHT, night);

      const f = fight as Fight | null;
      const ft = f ? t - f.start : 0;
      const inFight = (k: Kite) => !!f && (k === f.att || k === f.def);

      const flying = kites
        .filter((k) => k.mode === "fly" && !inFight(k))
        .sort((a, b) => a.joined - b.joined);
      const head = flying[0];

      // Turn the triangle toward where the lead is going; when it slows,
      // ease back to pointing up, the way kites hang in the wind.
      if (head) {
        const headSpeed = Math.hypot(head.vx, head.vy);
        const [wantX, wantY, rate] =
          headSpeed > 60 ? [head.vx / headSpeed, head.vy / headSpeed, 3] : [0, -1, 0.8];
        heading.x += (wantX - heading.x) * rate * dt;
        heading.y += (wantY - heading.y) * rate * dt;
        const hl = Math.hypot(heading.x, heading.y) || 1;
        heading.x /= hl;
        heading.y /= hl;
      }

      if (f && ((f.sawAt === null && ft > GIVE_UP_S) || night > 0.3)) fight = null;
      if (asked && !f) startFight();

      kites.forEach((kite) => {
        if (kite.mode === "wait") {
          const from = flyerAt(kite);
          kite.x = from.x;
          kite.y = from.y;
          kite.vx = 0;
          kite.vy = 0;
          kite.nose = UP;
          kite.spin = 0;
          resetTail(kite);
          if (t >= kite.wakeAt) {
            kite.mode = "fly";
            kite.vy = -260 * scale;
          }
          return;
        }

        if (kite.mode === "cut") {
          const ct = t - kite.cutAt;
          const um = kite.vx / px;
          const vm = kite.vy / px;

          // Kite: no line to hold its trim, so it falls like a flat plate,
          // weight against broadside drag, fluttering as it goes.
          const plate = (0.5 * RHO * KITE_AREA * PLATE_CD * Math.hypot(um, vm)) / KITE_MASS;
          const kiteAx = -plate * um + wind * 1.5;
          const kiteAy = G - plate * vm;

          // Lantern: burning free, it rises (eq. 9 with the flame up full).
          const hot = LANTERN_T + 30;
          const w2 = LANTERN_WARP * LANTERN_WARP;
          const lanternM = LANTERN_MASS + RHO * (AIR_T / hot) * LANTERN_VOLUME;
          const lift = RHO * G * LANTERN_VOLUME * (1 - AIR_T / hot) - LANTERN_MASS * G;
          const rel = Math.hypot(um, vm) / LANTERN_WARP;
          const lk = (0.5 * RHO * LANTERN_AREA * LANTERN_CD * rel) / lanternM;
          const lanternAx = (-lk * um) / LANTERN_WARP * w2;
          const lanternAy = (-lift / lanternM - (lk * vm) / LANTERN_WARP) * w2;

          const g = kite.glow;
          kite.vx += (kiteAx + (lanternAx - kiteAx) * g) * px * dt;
          kite.vy += (kiteAy + (lanternAy - kiteAy) * g) * px * dt;

          // Carried downwind, away from us: it shrinks and slides toward the
          // horizon's vanishing point as its distance grows.
          const d0 = 35;
          const depth = d0 / (d0 + WIND * ct);
          const recede = WIND / (d0 + WIND * ct);
          const vanish = { x: width / 2, y: height * 1.1 };
          kite.x += (kite.vx - (kite.x - vanish.x) * recede) * dt;
          kite.y += (kite.vy - (kite.y - vanish.y) * recede) * dt;
          kite.size = kite.baseSize * depth;

          kite.spin += (Math.sin(ct * 2.4 + kite.phase) * 10 - kite.spin * 0.8) * dt * (1 - g);
          kite.nose += kite.spin * dt;
          kite.tension += (0 - kite.tension) * Math.min(1, dt * 4);
          kite.alpha = clamp(1 - (ct - 3) / 2, 0, 1);
          stepTail(kite, dt, wind);
          if (kite.loose) stepRope(kite.loose, kite, dt, wind);

          const gone =
            kite.x < -120 || kite.x > width + 120 || kite.y > height + 120 || kite.y < -120;
          if (kite.alpha <= 0 || gone) relaunch(kite);
          return;
        }

        // Where this kite's flyer wants it.
        let tx: number;
        let ty: number;
        let tensionBoost = 0;

        if (f && kite === f.att) {
          const p = ease(clamp(ft / ENGAGE_S, 0, 1));
          if (f.base) {
            const st = t - (f.sawAt ?? t);
            const from = flyerAt(kite);
            const ux = from.x - f.base[0].x;
            const uy = from.y - f.base[0].y;
            const ul = Math.hypot(ux, uy) || 1;
            const saw = Math.sin(st * 8) * 10 * scale;
            tx = f.base[0].x + (ux / ul) * saw;
            ty = f.base[0].y - 18 * scale * Math.min(st, 1) + (uy / ul) * saw;
            tensionBoost = 2;
          } else {
            // Climb above the defender, then swoop down across its line;
            // keep pressing further across until the lines meet.
            const d = { x: f.defHome.x - f.side * 18 * scale, y: f.defHome.y };
            const extra = Math.max(0, ft - ENGAGE_S) * 40;
            const c1 = { x: d.x - f.side * 10 * scale, y: d.y - 90 * scale };
            const c2 = { x: d.x + f.side * (48 * scale + extra), y: d.y + 14 * scale };
            const q = 1 - p;
            tx = q * q * f.from.x + 2 * q * p * c1.x + p * p * c2.x;
            ty = q * q * f.from.y + 2 * q * p * c1.y + p * p * c2.y;
          }
        } else if (f && kite === f.def) {
          const p = ease(clamp(ft / ENGAGE_S, 0, 1));
          if (f.base) {
            const st = t - (f.sawAt ?? t);
            const from = flyerAt(kite);
            const ux = from.x - f.base[1].x;
            const uy = from.y - f.base[1].y;
            const ul = Math.hypot(ux, uy) || 1;
            const saw = Math.sin(st * 8 + Math.PI) * 10 * scale;
            tx = f.base[1].x + (ux / ul) * saw;
            ty = f.base[1].y - 18 * scale * Math.min(st, 1) + (uy / ul) * saw;
            tensionBoost = 2;
          } else {
            // Edge away and brace as the attacker comes over.
            tx = f.defHome.x - f.side * 18 * scale * p + Math.sin(t * 2.1) * 6;
            ty = f.defHome.y - 8 * scale * p;
          }
        } else {
          // Corners sit behind the lead (against the heading) and to either side.
          const rank = flying.indexOf(kite);
          const slot = FORMATION[rank] ?? FORMATION[FORMATION.length - 1];
          const ox = slot.x * scale;
          const oy = slot.y * scale;
          tx = rank === 0 ? lead.x : head.x - heading.x * oy - heading.y * ox;
          ty = rank === 0 ? lead.y : head.y - heading.y * oy + heading.x * ox;

          // Roles shift after a fight, so sizes ease to match.
          const want = (rank === 0 ? LEAD_SIZE : WING_SIZE) * scale;
          kite.size += (want - kite.size) * Math.min(1, dt * 2);
        }

        const dxm = (tx - kite.x) / px;
        const dym = (ty - kite.y) / px;
        const dist = Math.hypot(dxm, dym);
        const toward = Math.atan2(dym, dxm);
        const upErr = -dym; // metres the spot is above the kite
        const U = WIND * (1 + 0.25 * wind);
        const g = kite.glow;
        let ax = 0;
        let ay = 0;

        // Two substeps: a light kite on a pulled line reacts fast.
        const h = dt / 2;
        for (let step = 0; step < 2; step++) {
          const um = kite.vx / px;
          const vm = kite.vy / px;

          // ---- Kite (KiteModeler) ----
          const ueff = U * windowCos(kite);
          const q0 = 0.5 * RHO * ueff * ueff * KITE_AREA;

          // Far from its spot the flyer lets the nose come round and pulls
          // once it points there; close in, nose up (leaning toward the spot)
          // with just enough pull that lift carries the weight.
          const steer = clamp(dist / 5, 0, 1);
          const rest = UP + clamp(dxm / 6, -0.45, 0.45) + Math.sin(t * 1.1 + kite.phase) * 0.05;
          const aim = inFight(kite) || g < 0.5 ? rest + angleDiff(toward, rest) * steer : UP;
          const aligned = Math.max(0, Math.cos(angleDiff(kite.nose, toward)));
          const hover = (KITE_MASS * G) / Math.max(q0 * TRIM.cl, 1e-3);
          const hold = clamp(hover * (1 + 0.8 * upErr + 0.6 * vm), 0, 1);
          kite.pull = clamp(hold + (aligned * aligned - hold) * steer, 0, 1) * (1 - g);

          // It pivots about the bridle, turning quicker on a slack line.
          kite.spin += (angleDiff(aim, kite.nose) * 40 * (1 - 0.5 * kite.pull) - kite.spin * 7) * h;
          kite.nose += kite.spin * h;

          const nx = Math.cos(kite.nose);
          const ny = Math.sin(kite.nose);
          const un = um * nx + vm * ny; // speed along the nose
          const sx = um - un * nx; // sideslip
          const sy = vm - un * ny;
          const gamma = Math.atan2(un, ueff);
          const q = 0.5 * RHO * (ueff * ueff + un * un) * KITE_AREA;
          const drive = kite.pull * q * (TRIM.cl * Math.cos(gamma) - TRIM.cd * Math.sin(gamma));
          const load = kite.pull * q * (TRIM.cl * Math.sin(gamma) + TRIM.cd * Math.cos(gamma));
          const plate = 0.5 * RHO * KITE_AREA * PLATE_CD;
          const luff = (1 - kite.pull) * plate * Math.hypot(um, vm); // slack: just a flat plate
          const slip = plate * Math.hypot(sx, sy) + 0.3;
          const kiteAx = (drive * nx - luff * um - slip * sx) / KITE_MASS;
          const kiteAy = (drive * ny - luff * vm - slip * sy) / KITE_MASS + G;
          kite.tension = load + tensionBoost;

          // ---- Lantern (TU Delft eq. 9), on its own faster clock ----
          const warp = LANTERN_WARP;
          const upVel = -vm / warp;
          const want = LANTERN_T + 30 * clamp(upErr / 4 - upVel * 0.8, -1, 1);
          kite.heat += (want - kite.heat) * Math.min(1, (h * warp) / 1.5);
          const lanternM = LANTERN_MASS + RHO * (AIR_T / kite.heat) * LANTERN_VOLUME;
          const lift = RHO * G * LANTERN_VOLUME * (1 - AIR_T / kite.heat) - LANTERN_MASS * G;
          // The air carries the group toward the cursor: a light draught.
          const draught = Math.min(dist / 3, 1) * 1.2;
          const airX = 0.3 * wind + (dist > 0 ? (dxm / dist) * draught : 0);
          const airY = dist > 0 ? (dym / dist) * draught * 0.3 : 0;
          const rx = airX - um / warp;
          const ry = airY - vm / warp;
          const lk = (0.5 * RHO * LANTERN_AREA * LANTERN_CD * Math.hypot(rx, ry)) / lanternM;
          const lanternAx = lk * rx * warp * warp;
          const lanternAy = (-lift / lanternM + lk * ry) * warp * warp;

          ax = (kiteAx + (lanternAx - kiteAx) * g) * px;
          ay = (kiteAy + (lanternAy - kiteAy) * g) * px;

          // Keep a little room, so kites don't pass through each other.
          const room = (inFight(kite) ? 18 : 30) * scale;
          for (const other of kites) {
            if (other === kite || other.mode !== "fly") continue;
            const ox = kite.x - other.x;
            const oy = kite.y - other.y;
            const d = Math.hypot(ox, oy);
            if (d > 0 && d < room) {
              const force = (1 - d / room) * 900;
              ax += (ox / d) * force;
              ay += (oy / d) * force;
            }
          }

          kite.vx += ax * h;
          kite.vy += ay * h;
          kite.x += kite.vx * h;
          kite.y += kite.vy * h;
        }

        stepTail(kite, dt, wind);
      });

      // Lines, after the kites have moved.
      lines.clear();
      kites.forEach((kite) => {
        if (kite.mode === "fly") lines.set(kite, lineOf(kite));
      });

      const live = fight as Fight | null;
      if (live) {
        const a = lines.get(live.att);
        const b = lines.get(live.def);
        const cross = a && b ? crossing(a, b) : null;
        if (cross) live.cross = cross;
        if (cross && live.sawAt === null) {
          live.sawAt = t;
          live.base = [
            { x: live.att.x, y: live.att.y },
            { x: live.def.x, y: live.def.y },
          ];
        }
        if (live.sawAt !== null && live.cross && t - live.sawAt > live.sawFor) {
          snap(live, live.cross);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // At night the flyers have let go: the lines fade with the dusk.
      const lineAlpha = 0.22 * (1 - night);
      lines.forEach((pts) => strokePath(ctx, pts, lineAlpha, lineColor));

      // Sawing: a few sparks of friction where the lines rub.
      const sawing = fight as Fight | null;
      if (sawing?.sawAt != null && sawing.cross) {
        ctx.fillStyle = SPARK;
        for (let i = 0; i < 3; i++) {
          if (Math.random() < 0.5) continue;
          ctx.globalAlpha = Math.random() * 0.7;
          ctx.beginPath();
          ctx.arc(
            sawing.cross.p.x + (Math.random() - 0.5) * 8,
            sawing.cross.p.y + (Math.random() - 0.5) * 8,
            Math.random() * 1.4 + 0.4,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Lower halves of cut lines, falling from their flyers.
      for (let i = fallen.length - 1; i >= 0; i--) {
        const rope = fallen[i];
        stepRope(rope, rope.pts[0], dt, wind);
        if (rope.age > rope.life) {
          fallen.splice(i, 1);
          continue;
        }
        strokePath(ctx, rope.pts, lineAlpha * (1 - rope.age / rope.life), lineColor);
      }

      kites.forEach((kite) => {
        if (kite.mode === "wait") return;
        if (kite.loose) strokePath(ctx, kite.loose.pts, lineAlpha * kite.alpha, lineColor);
        drawTail(ctx, kite, t);
        drawSail(ctx, kite);
        drawLantern(ctx, kite, t);
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(FIGHT_EVENT, startFight);
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

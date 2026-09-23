"use client";

import { useEffect, useMemo, useState } from "react";

import { github, metrics, sections } from "@/content/v3";
import { Reveal, Section, SectionHead } from "@/components/v3/Section";

type Day = { date: string; count: number; level: number };

const DAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const BLANK: (Day | null)[][] = Array.from({ length: 53 }, () =>
  new Array(7).fill(null),
);

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/** Columns are weeks; a day sits on its own weekday row. */
function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = new Array(7).fill(null);

  days.forEach((day) => {
    week[weekday(day.date)] = day;
    if (weekday(day.date) === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });

  if (week.some(Boolean)) weeks.push(week);
  return weeks;
}

function monthLabels(weeks: (Day | null)[][]) {
  let prev = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean);
    if (!first) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month === prev) return null;
    prev = month;
    return MONTHS[month];
  });
}

const LEVELS = [
  "bg-[var(--gh-0)]",
  "bg-[var(--gh-1)]",
  "bg-[var(--gh-2)]",
  "bg-[var(--gh-3)]",
  "bg-[var(--gh-4)]",
];

function Contributions() {
  const [state, setState] = useState<{
    status: "loading" | "ok" | "error";
    days: Day[];
    total: number;
    at: string;
  }>({ status: "loading", days: [], total: 0, at: "" });

  useEffect(() => {
    let live = true;

    fetch(github.endpoint)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        if (!live) return;
        const days: Day[] = Array.isArray(json.contributions) ? json.contributions : [];
        const total =
          (json.total && json.total.lastYear) ||
          days.reduce((n, d) => n + (d.count || 0), 0);
        setState({
          status: days.length ? "ok" : "error",
          days,
          total,
          at: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      })
      .catch(() => {
        if (live) setState({ status: "error", days: [], total: 0, at: "" });
      });

    return () => {
      live = false;
    };
  }, []);

  const weeks = useMemo(
    () => (state.days.length ? toWeeks(state.days) : BLANK),
    [state.days],
  );
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const ok = state.status === "ok";

  return (
    <div
      className="glass sweep p-6 sm:p-8"
      style={
        {
          "--gh-0": "var(--paper-2)",
          "--gh-1": "var(--accent-100)",
          "--gh-2": "var(--accent-300)",
          "--gh-3": "var(--accent-500)",
          "--gh-4": "var(--accent-700)",
        } as React.CSSProperties
      }
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-2xl text-display sm:text-3xl">
            {ok
              ? `${state.total.toLocaleString()} contributions`
              : state.status === "loading"
                ? "reading the calendar"
                : "contributions"}
          </p>
          <p className="mt-1 font-mono text-sm text-muted">
            github.com/{github.user} · the last year
          </p>
        </div>
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted">
          <span className="relative flex h-2 w-2">
            {ok ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            ) : null}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${ok ? "bg-accent" : "bg-faint"}`}
            />
          </span>
          {ok ? "LIVE" : state.status === "loading" ? "FETCHING" : "OFFLINE"}
        </p>
      </div>

      {state.status === "error" ? (
        <p className="font-mono text-sm text-faint">
          GitHub did not answer this time. The graph is on{" "}
          <a className="text-accent-600 underline" href={github.profile}>
            the profile
          </a>
          .
        </p>
      ) : (
        <div className="no-scrollbar overflow-x-auto">
          <div className="grid w-max grid-cols-[auto_auto] gap-x-3 gap-y-2">
            <div
              className="col-start-2 row-start-1 grid grid-flow-col font-mono text-[10px] text-faint"
              style={{ gridAutoColumns: "10px" }}
            >
              {months.map((m, i) => (
                <span key={i} className="whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>

            <div
              className="col-start-1 row-start-2 grid items-center gap-[2px] font-mono text-[9px] leading-none text-faint"
              style={{ gridTemplateRows: "repeat(7, 8px)" }}
            >
              {DAY_LABELS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div
              className="col-start-2 row-start-2 grid grid-flow-col gap-[2px]"
              style={{ gridTemplateRows: "repeat(7, 8px)", gridAutoColumns: "8px" }}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) => (
                  <span
                    key={`${wi}-${di}`}
                    title={day ? `${day.count} on ${day.date}` : undefined}
                    className={`h-2 w-2 rounded-[2px] ${day ? LEVELS[day.level] : "bg-transparent"}`}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>
          {ok
            ? `updated ${state.at}`
            : state.status === "loading"
              ? "updating"
              : "last fetch failed"}
        </span>
        <span className="flex items-center gap-[3px]">
          Less
          {LEVELS.map((cls, i) => (
            <i key={i} className={`mx-[1px] h-2 w-2 rounded-[2px] ${cls}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

export function Metrics() {
  return (
    <Section id="metrics">
      <SectionHead
        kicker="$ wc -l the receipts"
        title={sections.metrics.title}
        description={sections.metrics.description}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 0.06}>
            <div className="glass glass-hover sweep h-full p-6">
              <p className="font-mono text-2xl text-display">{metric.value}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-accent-600">
                {metric.label}
              </p>
              <p className="mt-3 text-sm text-muted">{metric.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <Contributions />
      </Reveal>
    </Section>
  );
}

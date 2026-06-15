"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Cloudscape from "@/components/forgeui1/cloudscape";
import {
  getTimeOfDayTheme,
  type TimeOfDayTheme,
} from "@/lib/time-of-day-theme";

type ThemeStyle = CSSProperties & {
  "--hero-text": string;
  "--hero-muted": string;
  "--hero-veil": string;
  "--hero-atmosphere": string;
  "--page-surface": string;
  "--page-surface-to": string;
  "--page-accent": string;
  "--page-text": string;
  "--page-muted": string;
  "--page-panel": string;
  "--page-border": string;
};

interface TimeAwareCloudscapeHomeProps {
  initialTheme: TimeOfDayTheme;
}

/*
 * WHY NO SUSPENSE / useSearchParams HERE?
 * ────────────────────────────────────────
 * The previous architecture used a <Suspense> boundary with a fallback that
 * rendered <CloudscapeView> (which mounted Cloudscape → WebGL context A).
 * When the Suspense resolved, the fallback was replaced and Cloudscape
 * REMOUNTED (WebGL context A destroyed → context B created).
 *
 * On Android Chrome, two rapid getContext("webgl") calls on different canvas
 * elements can exceed the browser's per-page WebGL context limit. The second
 * call returns null, no render loop starts, and the canvas stays transparent.
 * Desktop was fine because desktop browsers have a higher context limit and
 * faster JS, so the timing window was never hit.
 *
 * Fix: searchParams are now resolved in page.tsx (server component) and passed
 * as initialTheme. The client component mounts ONCE, creates ONE WebGL context,
 * and stays alive. No Suspense, no remount, no context limit issue.
 *
 * The 60-second IST interval still runs so the theme auto-updates over time.
 */

export function TimeAwareCloudscapeHome({ initialTheme }: TimeAwareCloudscapeHomeProps) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    // Auto-update theme every minute to track IST time.
    // Only fires if no forced theme was set (forced themes are pinned via URL
    // and reflected in initialTheme from the server — they won't change here).
    const intervalId = window.setInterval(() => {
      setTheme(getTimeOfDayTheme(new Date()));
    }, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const themeStyle: ThemeStyle = {
    "--hero-text": theme.hero.text,
    "--hero-muted": theme.hero.mutedText,
    "--hero-veil": theme.hero.veil,
    "--hero-atmosphere": theme.hero.atmosphere,
    "--page-surface": theme.page.surface,
    "--page-surface-to": theme.page.surfaceTo,
    "--page-accent": theme.page.accent,
    "--page-text": theme.page.text,
    "--page-muted": theme.page.mutedText,
    "--page-panel": theme.page.panel,
    "--page-border": theme.page.border,
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-[var(--page-surface)] text-[var(--page-text)]"
      style={themeStyle}
    >
      {/*
       * Hero: Cloudscape is a block element with height="100vh" — identical to
       * the CLI example. No position:absolute is passed to it. The section's
       * height is driven by the Cloudscape block child.
       */}
      <section style={{ position: "relative", overflow: "hidden" }}>

        <Cloudscape
          colorBottom={theme.hero.colorBottom}
          colorMid={theme.hero.colorMid}
          colorTop={theme.hero.colorTop}
          speed={theme.hero.speed}
          height="100vh"
        />

        {/* Atmosphere (stars / sun glow) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            backgroundImage: "var(--hero-atmosphere)",
          }}
        />

        {/* Veil */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            backgroundImage: "var(--hero-veil)",
          }}
        />

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "12rem",
            background: "linear-gradient(to bottom, transparent, var(--page-surface))",
          }}
        />

        {/* Text content */}
        <div
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "flex-end",
          }}
          className="px-6 py-10 sm:px-10 lg:px-16"
        >
          <div className="max-w-4xl pb-8 sm:pb-12 lg:pb-16">
            <p className="mb-4 text-sm font-medium tracking-[0.22em] text-[var(--hero-muted)] uppercase">
              {theme.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl leading-[0.95] font-semibold text-[var(--hero-text)] sm:text-7xl lg:text-8xl">
              {theme.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--hero-muted)] sm:text-lg">
              {theme.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Below-fold ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-b from-[var(--page-surface)] via-[color-mix(in_oklch,var(--page-surface)_78%,var(--page-surface-to))] to-[var(--page-surface-to)] px-6 py-20 sm:px-10 lg:px-16">
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.45fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[var(--page-muted)]">
              Below the hero
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-[var(--page-text)] sm:text-5xl">
              The page surface follows the sky without stealing attention.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--page-muted)]">
              Morning and afternoon stay clean and bright. Evening warms into a
              cream-orange gradient. Night settles into a darker surface so the
              page feels intentional, not like a light theme with dim colors.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--page-border)] bg-[var(--page-panel)] p-5 shadow-[0_24px_80px_oklch(0_0_0_/_0.12)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-[var(--page-text)]">Active atmosphere</p>
              <span className="rounded-full border border-[var(--page-border)] px-3 py-1 text-xs font-medium text-[var(--page-muted)]">
                IST
              </span>
            </div>
            <p className="mt-8 text-4xl font-semibold text-[var(--page-text)]">
              {theme.label}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <span
                aria-label="Cloudscape bottom color"
                className="h-16 rounded-md border border-[var(--page-border)]"
                style={{ backgroundColor: theme.hero.colorBottom }}
              />
              <span
                aria-label="Cloudscape middle color"
                className="h-16 rounded-md border border-[var(--page-border)]"
                style={{ backgroundColor: theme.hero.colorMid }}
              />
              <span
                aria-label="Cloudscape top color"
                className="h-16 rounded-md border border-[var(--page-border)]"
                style={{ backgroundColor: theme.hero.colorTop }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

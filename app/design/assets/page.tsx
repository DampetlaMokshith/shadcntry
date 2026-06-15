"use client"

import { useState } from "react"
import { IconSun, IconMoon, IconGridDots, IconPackage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import PolaroidGallery from "@/components/design/polaroid-gallery"
import SpotlightLogo from "@/components/design/spotlight-logo"
import UIChips from "@/components/design/ui-chips"
import BrutalBudget from "@/components/design/brutal-budget"
import DoodleWeather from "@/components/design/doodle-weather"

// ─── Component registry ──────────────────────────────────────────────────────
// Each entry here becomes one card in the grid.
// Add new entries by appending to this array.
//
// Fields:
//   id          — unique key
//   title       — display name
//   description — one-liner shown below title
//   tags        — badge array
//   span        — optional: "wide" = 2 columns, "full" = full row
//   height      — optional: custom preview height in px (default 200)
//   component   — React node rendered inside the preview area

type ComponentEntry = {
  id: string
  title: string
  description: string
  tags: string[]
  span?: "wide" | "full"
  height?: number
  component: React.ReactNode
}

const COMPONENTS: ComponentEntry[] = [
  {
    id: "polaroid-gallery",
    title: "Polaroid Gallery",
    description: "Scattered photo cards with pins, clips & tape — click any card to expand",
    tags: ["layout", "interactive", "visual"],
    span: "full",
    height: 560,
    component: <PolaroidGallery />,
  },
  {
    id: "spotlight-logo",
    title: "Spotlight Logo",
    description: "Ultra-bold wordmark with floating social handle chips & avatar badges",
    tags: ["branding", "typography", "animated"],
    span: "full",
    height: 360,
    component: <SpotlightLogo />,
  },
  {
    id: "ui-chips",
    title: "UI Chips",
    description: "Interactive button & badge collection — gradient AI button, avatar chips, filters, status badges, search",
    tags: ["interactive", "buttons", "badges"],
    span: "full",
    height: 380,
    component: <UIChips />,
  },
  {
    id: "brutal-budget",
    title: "Brutal Budget",
    description: "Neo-brutalist finance tracker — live balance, spending meter, add/delete transactions, category filters",
    tags: ["neo-brutalism", "interactive", "finance"],
    span: "full",
    height: 820,
    component: <BrutalBudget />,
  },
  {
    id: "doodle-weather",
    title: "Doodle Weather",
    description: "Live sketchbook-style weather — geolocation → OpenWeatherMap, hand-drawn SVG illustrations, animated states, 7-day forecast & °C/°F toggle",
    tags: ["live-data", "doodle", "svg", "animated", "geolocation"],
    span: "full",
    height: 680,
    component: <DoodleWeather />,
  },
  // ← Next component goes here
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DesignAssetsPage() {
  const [dark, setDark] = useState(false)

  return (
    <div className={cn("min-h-screen transition-colors duration-300", dark ? "dark" : "")}>
      <div className="min-h-screen bg-background text-foreground">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <IconGridDots className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none tracking-tight">
                  Design Assets
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Component showcase &amp; playground
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:flex gap-1.5 text-xs">
                <IconPackage className="h-3 w-3" />
                {COMPONENTS.length} component{COMPONENTS.length !== 1 ? "s" : ""}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle dark mode"
                className="h-9 w-9 rounded-xl"
              >
                {dark
                  ? <IconSun className="h-4 w-4" />
                  : <IconMoon className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
        </header>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        <main className="mx-auto max-w-7xl px-6 py-10">
          {COMPONENTS.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COMPONENTS.map((entry) => (
                <ComponentCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── Component Card ───────────────────────────────────────────────────────────

function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const previewHeight = entry.height ?? 200

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border",
        entry.span === "wide" && "sm:col-span-2",
        entry.span === "full" && "sm:col-span-2 lg:col-span-3",
      )}
    >
      {/* Preview area */}
      <div
        className="flex flex-1 items-center justify-center bg-muted/20 transition-colors group-hover:bg-muted/30 overflow-hidden"
        style={{ minHeight: previewHeight }}
      >
        {entry.component}
      </div>

      {/* Meta */}
      <div className="border-t border-border/60 px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-none">{entry.title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {entry.description}
            </p>
          </div>
        </div>
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-8">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-muted-foreground/20" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-md">
            <IconGridDots className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Ready for components</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Send an image of any UI component and I&apos;ll build an exact replica and add it to this grid.
      </p>
      <div className="mt-10 grid grid-cols-3 gap-3 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 w-32 rounded-xl border-2 border-dashed border-border" />
        ))}
      </div>
    </div>
  )
}

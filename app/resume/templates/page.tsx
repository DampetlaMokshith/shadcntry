"use client";

import Link from "next/link";
import { resumeTemplates } from "@/lib/resume-templates";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

/* ─── Mini Previews ─────────────────────────────────────────────────────────
   Each template gets its own tiny A4 wireframe so the cards look
   visually different from each other — no randomness, fully deterministic.
 ───────────────────────────────────────────────────────────────────────────── */

function Bar({ w = "100%", h = "3px", color = "#e5e7eb" }: { w?: string; h?: string; color?: string }) {
  return <div className="rounded-sm" style={{ height: h, background: color, width: w, marginBottom: "1.5px" }} />;
}

// Template 1: Classic — centred header, underlined sections
function PreviewClassic({ accent, name, title }: { accent: string; name: string; title: string }) {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-sm overflow-hidden" style={{ padding: "8% 7%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "6%" }}>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: "4.5px", color: accent, fontWeight: 500, marginTop: "2px" }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "3px", fontSize: "3px", color: "#9ca3af" }}>
          <span>email@mail.com</span><span>+1 555-000</span><span>City, ST</span>
        </div>
      </div>
      {["SUMMARY", "EXPERIENCE", "SKILLS"].map((s) => (
        <div key={s} style={{ marginBottom: "5%" }}>
          <div style={{ fontSize: "4px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#111827", paddingBottom: "2px", borderBottom: `1px solid ${accent}`, marginBottom: "3px" }}>{s}</div>
          <Bar /><Bar w="90%" /><Bar w="70%" />
        </div>
      ))}
    </div>
  );
}

// Template 2: Sidebar — dark header, two-column (like Image 1)
function PreviewSidebar({ accent, name, title }: { accent: string; name: string; title: string }) {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-sm overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Dark header */}
      <div style={{ background: "#1f2937", padding: "6% 7% 5%", textAlign: "center" }}>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: "4px", color: accent, fontWeight: 500, marginTop: "2px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "3px", fontSize: "2.5px", color: "#9ca3af" }}>
          <span>email@mail.com</span><span>+1 555-000</span>
        </div>
      </div>
      {/* Two column */}
      <div style={{ display: "flex", padding: "4% 5%", gap: "4%" }}>
        {/* Left column - 38% */}
        <div style={{ width: "38%", flexShrink: 0 }}>
          {["EDUCATION", "SKILLS", "CERTS"].map((s) => (
            <div key={s} style={{ marginBottom: "5%" }}>
              <div style={{ fontSize: "3.5px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#111827", paddingBottom: "2px", borderBottom: `1px solid ${accent}`, marginBottom: "3px" }}>{s}</div>
              <Bar w="95%" h="2.5px" /><Bar w="80%" h="2.5px" /><Bar w="60%" h="2.5px" />
            </div>
          ))}
        </div>
        {/* Right column - 62% */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "3.5px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#111827", paddingBottom: "2px", borderBottom: `1px solid ${accent}`, marginBottom: "3px" }}>EXPERIENCE</div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ marginBottom: "4px" }}>
              <div style={{ fontSize: "3px", fontWeight: 600, color: "#111827" }}>Position {i}</div>
              <div style={{ fontSize: "2.5px", color: "#9ca3af", marginBottom: "1px" }}>Company · 2020–Pres</div>
              <Bar w="100%" h="2px" color="#f3f4f6" /><Bar w="90%" h="2px" color="#f3f4f6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Template 3: Modern — colored section bars, grid skills (like Image 2)
function PreviewModern({ accent, name, title }: { accent: string; name: string; title: string }) {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-sm overflow-hidden" style={{ padding: "6% 6%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "5%" }}>
        <div style={{ fontSize: "8px", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.1, textTransform: "uppercase" as const }}>{name}</div>
        <div style={{ fontSize: "4px", color: "#6b7280", fontWeight: 500, marginTop: "2px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{title}</div>
        <div style={{ display: "flex", gap: "6px", marginTop: "3px", fontSize: "2.5px", color: "#9ca3af" }}>
          <span>email@mail.com</span><span>portfolio.com</span>
        </div>
      </div>
      {/* Sections with colored bars */}
      {["SUMMARY", "TECHNICAL SKILLS", "EXPERIENCE", "EDUCATION"].map((s) => (
        <div key={s} style={{ marginBottom: "4%" }}>
          <div style={{ background: accent, padding: "2px 4px", marginBottom: "3px", borderRadius: "1px" }}>
            <span style={{ fontSize: "3.5px", fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{s}</span>
          </div>
          {s === "TECHNICAL SKILLS" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px 4px" }}>
              {["Skill A", "Skill B", "Skill C", "Skill D", "Skill E", "Skill F"].map((sk) => (
                <div key={sk} style={{ fontSize: "2.5px", color: "#374151" }}>{sk}</div>
              ))}
            </div>
          ) : (
            <><Bar w="100%" h="2px" color="#e5e7eb" /><Bar w="85%" h="2px" color="#e5e7eb" /><Bar w="70%" h="2px" color="#e5e7eb" /></>
          )}
        </div>
      ))}
    </div>
  );
}

const previewComponents: Record<string, React.FC<{ accent: string; name: string; title: string }>> = {
  classic: PreviewClassic,
  minimal: PreviewSidebar,
  bold: PreviewModern,
};

/* ─── Template Card ──────────────────────────────────────────────────────── */

function TemplateCard({
  id, name, description, previewAccent, previewGradient, personName, personTitle,
}: {
  id: string; name: string; description: string; previewAccent: string;
  previewGradient: string; personName: string; personTitle: string;
}) {
  const Preview = previewComponents[id] ?? PreviewClassic;
  return (
    <Link href={`/resume/editor?template=${id}`} className="group block">
      <div className="relative rounded-xl border border-border/60 bg-background overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1">
        <div className={`relative p-5 sm:p-6 bg-gradient-to-br ${previewGradient}`}>
          <div className="mx-auto w-full max-w-[140px] shadow-md rounded-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Preview accent={previewAccent} name={personName} title={personTitle} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

/* ─── Blank Card ─────────────────────────────────────────────────────────── */

function BlankCard() {
  return (
    <Link href="/resume/editor?template=blank" className="group block">
      <div className="relative rounded-xl border-2 border-dashed border-border/80 bg-background overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-muted/40 to-muted/80">
          <div className="mx-auto w-full max-w-[140px] aspect-[210/297] bg-white rounded-sm shadow-sm flex flex-col items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-105">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center transition-colors group-hover:from-primary/20 group-hover:to-primary/30">
              <HugeiconsIcon icon={Add01Icon} size={20} className="text-primary" />
            </div>
            <span className="text-[6px] font-medium text-muted-foreground">Start from scratch</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Blank Resume</h3>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Start with a clean canvas and build your resume from scratch.</p>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero gradient header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 px-4 py-16 sm:py-20 md:py-24 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium mb-6">
            <HugeiconsIcon icon={SparklesIcon} size={13} />
            Professional Templates
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Resume templates for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-yellow-200">
              every career
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
            Pick a professionally designed template and customize it in our real-time editor. Or start from a blank canvas.
          </p>
        </div>
      </div>

      {/* Template grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <BlankCard />
          {resumeTemplates.map((t) => (
            <TemplateCard
              key={t.id}
              id={t.id}
              name={t.name}
              description={t.description}
              previewAccent={t.previewAccent}
              previewGradient={t.previewGradient}
              personName={t.data.personalInfo.fullName}
              personTitle={t.data.personalInfo.jobTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

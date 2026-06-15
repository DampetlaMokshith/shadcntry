"use client"

import { useState } from "react"
import {
  IconSparkles,
  IconX,
  IconCloudUpload,
  IconFilter,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconChevronUp,
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconSearch,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ─── Design tokens ────────────────────────────────────────────────────────────
// gradient: violet → pink → coral-orange (purple left/top, orange right/bottom)
const GRADIENT = "linear-gradient(135deg, #7C5CF0 0%, #E879A0 50%, #FF7043 100%)"
// glow: warm diffused below
const GLOW_SHADOW =
  "0 8px 28px rgba(232, 121, 160, 0.50), 0 4px 12px rgba(255, 112, 67, 0.30)"

// ─── Shared chip shell ────────────────────────────────────────────────────────
function Chip({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 select-none",
        onClick && "cursor-pointer",
        className,
      )}
      style={{
        background: "white",
        borderRadius: 14,
        padding: "10px 16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── 1. Ask AI ─────────────────────────────────────────────────────────────────
function AskAIChip() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient glow layer */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: 16,
          background: GRADIENT,
          filter: "blur(12px)",
          opacity: hovered ? 0.75 : 0.55,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: GRADIENT,
          borderRadius: 16,
          padding: "12px 20px",
          cursor: "pointer",
          boxShadow: hovered ? GLOW_SHADOW : "0 4px 16px rgba(124,92,240,0.25)",
          transition: "box-shadow 0.3s ease, transform 0.2s ease",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
        }}
      >
        <IconSparkles
          style={{ color: "white", width: 18, height: 18, flexShrink: 0 }}
        />
        <span
          style={{
            color: "white",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          Ask AI
        </span>
      </div>
    </div>
  )
}

// ─── 2. Ella M. avatar chip ───────────────────────────────────────────────────
function EllaChip({ onRemove }: { onRemove: () => void }) {
  return (
    <Chip style={{ padding: "8px 12px 8px 8px", gap: 10 }}>
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          background: "#C8956C",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" fill="#D4956A" />
          <rect x="0" y="24" width="36" height="12" fill="#8B5A2B" />
          <rect x="14" y="20" width="8" height="6" fill="#C08050" />
          <ellipse cx="18" cy="14" rx="9" ry="10" fill="#D4956A" />
          <ellipse cx="18" cy="7" rx="9" ry="6" fill="#6B3A1F" />
          {/* Hair flowing down sides */}
          <ellipse cx="9" cy="16" rx="4" ry="7" fill="#6B3A1F" />
          <ellipse cx="27" cy="16" rx="4" ry="7" fill="#6B3A1F" />
          {/* Eyes */}
          <ellipse cx="14.5" cy="14" rx="1.5" ry="1.8" fill="#3A2010" />
          <ellipse cx="21.5" cy="14" rx="1.5" ry="1.8" fill="#3A2010" />
          {/* Smile */}
          <path
            d="M14 19 Q18 22 22 19"
            stroke="#B07040"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "#111",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Ella M.
      </span>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          color: "#9CA3AF",
          borderRadius: 4,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
      >
        <IconX style={{ width: 15, height: 15 }} />
      </button>
    </Chip>
  )
}

// ─── 3. Upload chip ───────────────────────────────────────────────────────────
function UploadChip() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        padding: "10px 18px",
        border: `1.8px dashed ${hovered ? "#9CA3AF" : "#D1D5DB"}`,
        background: hovered ? "rgba(0,0,0,0.02)" : "transparent",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
      }}
    >
      <IconCloudUpload
        style={{ width: 17, height: 17, color: "#6B7280", flexShrink: 0 }}
      />
      <span
        style={{
          fontWeight: 500,
          fontSize: 15,
          color: "#374151",
          letterSpacing: "-0.01em",
        }}
      >
        Upload
      </span>
    </div>
  )
}

// ─── 4. Filter chip ───────────────────────────────────────────────────────────
function FilterChip({
  count,
  onClear,
}: {
  count: number
  onClear: () => void
}) {
  return (
    <Chip style={{ gap: 6, padding: "10px 14px" }}>
      <IconFilter
        style={{ width: 16, height: 16, color: "#374151", flexShrink: 0 }}
      />
      <span style={{ fontWeight: 500, fontSize: 15, color: "#111" }}>
        Filter
      </span>
      {count > 0 && (
        <>
          <span style={{ color: "#9CA3AF", fontSize: 15 }}>·</span>
          <span
            style={{ fontWeight: 600, fontSize: 15, color: "#111" }}
          >
            {count}
          </span>
        </>
      )}
      <button
        onClick={onClear}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          color: "#9CA3AF",
          padding: 2,
          borderRadius: 4,
          marginLeft: 2,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
      >
        <IconX style={{ width: 14, height: 14 }} />
      </button>
    </Chip>
  )
}

// ─── 5. Text align toggle ─────────────────────────────────────────────────────
function AlignToggle() {
  const [align, setAlign] = useState<"left" | "center" | "right">("left")

  const options = [
    { key: "left" as const, Icon: IconAlignLeft },
    { key: "center" as const, Icon: IconAlignCenter },
    { key: "right" as const, Icon: IconAlignRight },
  ]

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 6,
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
      }}
    >
      {options.map(({ key, Icon }) => (
        <button
          key={key}
          onClick={() => setAlign(key)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "none",
            background: align === key ? "white" : "white",
            boxShadow:
              align === key
                ? "0 2px 10px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)"
                : "0 1px 4px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "box-shadow 0.15s, opacity 0.15s",
            opacity: align === key ? 1 : 0.55,
          }}
        >
          <Icon style={{ width: 18, height: 18, color: "#111" }} />
        </button>
      ))}
    </div>
  )
}

// ─── 6. Time + Book a Call ────────────────────────────────────────────────────
const TIME_OPTIONS = [15, 20, 30, 45, 60]

function TimeBookChip() {
  const [timeIdx, setTimeIdx] = useState(2) // default 30 mins
  const [hovered, setHovered] = useState(false)

  const increment = () =>
    setTimeIdx((i) => Math.min(i + 1, TIME_OPTIONS.length - 1))
  const decrement = () => setTimeIdx((i) => Math.max(i - 1, 0))

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "white",
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        overflow: "hidden",
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
      }}
    >
      {/* Time section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
        }}
      >
        <span
          style={{ fontWeight: 700, fontSize: 15, color: "#111", whiteSpace: "nowrap" }}
        >
          {TIME_OPTIONS[timeIdx]} mins
        </span>
        {/* Chevron spinner */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <button
            onClick={increment}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "1px 2px",
              display: "flex",
              color: "#9CA3AF",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <IconChevronUp style={{ width: 13, height: 13 }} />
          </button>
          <button
            onClick={decrement}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "1px 2px",
              display: "flex",
              color: "#9CA3AF",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <IconChevronDown style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{ width: 1, height: 28, background: "#F3F4F6", flexShrink: 0 }}
      />

      {/* Book a Call gradient pill */}
      <div style={{ position: "relative", padding: "6px 6px" }}>
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 10,
            background: GRADIENT,
            filter: "blur(8px)",
            opacity: hovered ? 0.65 : 0.45,
            transition: "opacity 0.3s",
          }}
        />
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            background: GRADIENT,
            border: "none",
            borderRadius: 10,
            padding: "8px 14px",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            transform: hovered ? "translateY(-0.5px)" : "translateY(0)",
            transition: "transform 0.2s ease",
          }}
        >
          Book a Call
        </button>
      </div>
    </div>
  )
}

// ─── 7. Sidebar toggle ────────────────────────────────────────────────────────
function SidebarToggle() {
  const [open, setOpen] = useState(true)
  return (
    <Chip
      style={{ padding: "10px", borderRadius: 12 }}
      onClick={() => setOpen((v) => !v)}
    >
      <IconLayoutSidebarLeftCollapse
        style={{
          width: 18,
          height: 18,
          color: "#374151",
          transform: open ? "scaleX(1)" : "scaleX(-1)",
          transition: "transform 0.3s ease",
        }}
      />
    </Chip>
  )
}

// ─── 8. Online badge ──────────────────────────────────────────────────────────
function OnlineBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#DCFCE7",
        borderRadius: 12,
        padding: "10px 18px",
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
      }}
    >
      {/* Pulsing green dot */}
      <div style={{ position: "relative", width: 9, height: 9, flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#22C55E",
            animation: "onlinePulse 2s ease-in-out infinite",
          }}
        />
      </div>
      <span
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "#15803D",
          letterSpacing: "-0.01em",
        }}
      >
        Online
      </span>
    </div>
  )
}

// ─── 9. In progress spinner ───────────────────────────────────────────────────
function InProgressBadge() {
  return (
    <Chip style={{ gap: 8 }}>
      {/* Dashed circle spinner */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ animation: "spinDash 1.4s linear infinite", flexShrink: 0 }}
      >
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="#2563EB"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="14 38"
        />
      </svg>
      <span
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: "#2563EB",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        In progress
      </span>
    </Chip>
  )
}

// ─── 10. Search bar — two separate chips: text pill + circular icon ────────────
function SearchBar() {
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {/* Text pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "white",
          borderRadius: 14,
          padding: "10px 18px",
          boxShadow: focused
            ? "0 2px 12px rgba(0,0,0,0.10), 0 0 0 2px rgba(99,102,241,0.12)"
            : "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.2s ease",
          fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
          minWidth: 120,
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search"
          style={{
            border: "none",
            outline: "none",
            background: "none",
            fontWeight: 400,
            fontSize: 15,
            color: "#111",
            letterSpacing: "-0.01em",
            fontFamily: "inherit",
            width: "100%",
            // placeholder color via CSS trick
          }}
        />
      </div>

      {/* Standalone circular search icon button */}
      <button
        onClick={() => {}}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          flexShrink: 0,
          transition: "box-shadow 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.12)"
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)"
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <IconSearch style={{ width: 17, height: 17, color: "#374151" }} />
      </button>
    </div>
  )
}

// ─── Main showcase component ──────────────────────────────────────────────────

export default function UIChips() {
  const [ellaVisible, setEllaVisible] = useState(true)
  const [filterCount, setFilterCount] = useState(2)

  return (
    <>
      <style>{`
        @keyframes onlinePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.35); opacity: 0.7; }
        }
        @keyframes spinDash {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          background: "#EAEAE6",
          borderRadius: 20,
          width: "100%",
          minHeight: 340,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          {/* ── Row 1: Ask AI · Ella M. · Upload ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <AskAIChip />
            {ellaVisible ? (
              <EllaChip onRemove={() => setEllaVisible(false)} />
            ) : (
              <button
                onClick={() => setEllaVisible(true)}
                style={{
                  background: "white",
                  border: "1px dashed #D1D5DB",
                  borderRadius: 14,
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#9CA3AF",
                  fontFamily: "inherit",
                }}
              >
                + Add person
              </button>
            )}
            <UploadChip />
          </div>

          {/* ── Row 2: Filter · Align · Time+Book ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <FilterChip
              count={filterCount}
              onClear={() => setFilterCount(0)}
            />
            <AlignToggle />
            <TimeBookChip />
          </div>

          {/* ── Row 3: Sidebar · Online · In progress · Search ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <SidebarToggle />
            <OnlineBadge />
            <InProgressBadge />
            <SearchBar />
          </div>
        </div>
      </div>
    </>
  )
}

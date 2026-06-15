"use client"

// ─────────────────────────────────────────────────────────────────────────────
// BRUTAL BUDGET — Neo Brutalism Finance Tracker
//
// Design language:
//   • 3px solid #0D0D0D borders on every surface
//   • 4px / 5px hard drop-shadows (no blur) — the brutalist signature
//   • Warm newsprint background (#F0E8DC) with flat primary-color cards
//   • Buttons physically sink on press: shadow collapses + translate(3px,3px)
//   • Spending meter color shifts green → yellow → red with the fill %
//   • Stagger-in for transaction rows (CSS animation-delay)
//   • All animations < 200ms; layout-only changes are instant
//   • Full mobile responsive: CSS grid media-queries in a scoped <style> block
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useId } from "react"
import {
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconChevronDown,
  IconAlertTriangle,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType = "income" | "expense"
type Tx = {
  id: string
  description: string
  amount: number
  category: string
  type: TxType
}

// ─── Design tokens (inline, not Tailwind — self-contained component) ──────────
const BD = "3px solid #0D0D0D"          // border
const SH  = "4px 4px 0 #0D0D0D"        // standard hard shadow
const SHB = "5px 5px 0 #0D0D0D"        // big hard shadow (hero cards)
const SHS = "2px 2px 0 #0D0D0D"        // small hard shadow
const R   = 4                           // border-radius
const F   = "var(--font-sans, 'Inter', system-ui, sans-serif)"

// ─── Flat color palette ───────────────────────────────────────────────────────
const PAPER   = "#F0E8DC"   // warm newsprint
const BLACK   = "#0D0D0D"
const OFF_W   = "#FDFAF4"   // card white (warm)
const YELLOW  = "#FFE033"   // hero balance
const LIME    = "#AAFF44"   // income
const RED     = "#FF3B3B"   // expense / danger
const BLUE    = "#2F52E0"   // transport
const ORANGE  = "#FF6D35"   // food
const PINK    = "#EE2CF5"   // entertainment
const PURPLE  = "#9B59B6"   // other

// ─── Category registry ────────────────────────────────────────────────────────
const CATS: Record<string, { emoji: string; color: string; type: TxType }> = {
  Income:        { emoji: "💰", color: LIME,   type: "income" },
  Food:          { emoji: "🍕", color: ORANGE, type: "expense" },
  Transport:     { emoji: "🚗", color: BLUE,   type: "expense" },
  Entertainment: { emoji: "🎬", color: PINK,   type: "expense" },
  Shopping:      { emoji: "🛍️", color: YELLOW, type: "expense" },
  Health:        { emoji: "💊", color: RED,    type: "expense" },
  Bills:         { emoji: "🏠", color: PURPLE, type: "expense" },
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED: Tx[] = [
  { id: "s1", description: "Monthly Salary",    amount: 4200.00, category: "Income",        type: "income" },
  { id: "s2", description: "Freelance Project",  amount:  850.00, category: "Income",        type: "income" },
  { id: "s3", description: "Grocery Run",        amount:   87.50, category: "Food",          type: "expense" },
  { id: "s4", description: "Netflix",            amount:   15.99, category: "Entertainment", type: "expense" },
  { id: "s5", description: "Uber Ride",          amount:   22.30, category: "Transport",     type: "expense" },
  { id: "s6", description: "Coffee & Snack",     amount:   12.50, category: "Food",          type: "expense" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Brutalist button that physically sinks on press */
function BrutalBtn({
  children,
  onClick,
  bg = BLACK,
  fg = YELLOW,
  full = false,
  disabled = false,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  bg?: string
  fg?: string
  full?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}) {
  const [down, setDown] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      onTouchStart={() => setDown(true)}
      onTouchEnd={() => setDown(false)}
      style={{
        background: disabled ? "#CCCCCC" : bg,
        color: disabled ? "#888" : fg,
        border: BD,
        borderRadius: R,
        fontFamily: F,
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: "0.05em",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "11px 20px",
        width: full ? "100%" : undefined,
        boxShadow: down ? "1px 1px 0 #0D0D0D" : SH,
        transform: down ? "translate(3px, 3px)" : "translate(0, 0)",
        transition: "box-shadow 80ms, transform 80ms",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Brutalist text/number input */
function BrutalInput({
  value,
  onChange,
  placeholder,
  type = "text",
  onEnter,
  style,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  onEnter?: () => void
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      min={type === "number" ? "0.01" : undefined}
      step={type === "number" ? "0.01" : undefined}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      style={{
        border: BD,
        borderRadius: R,
        background: OFF_W,
        padding: "11px 14px",
        fontFamily: F,
        fontWeight: 500,
        fontSize: 14,
        color: BLACK,
        outline: "none",
        boxShadow: focused ? SH : SHS,
        transition: "box-shadow 120ms",
        width: "100%",
        ...style,
      }}
    />
  )
}

/** Brutalist select */
function BrutalSelect({
  value,
  onChange,
  options,
  style,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: "relative", width: "100%", ...style }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          appearance: "none",
          border: BD,
          borderRadius: R,
          background: OFF_W,
          padding: "11px 36px 11px 14px",
          fontFamily: F,
          fontWeight: 700,
          fontSize: 14,
          color: BLACK,
          outline: "none",
          boxShadow: focused ? SH : SHS,
          transition: "box-shadow 120ms",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {CATS[o]?.emoji} {o}
          </option>
        ))}
      </select>
      <IconChevronDown
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          width: 16,
          height: 16,
          color: BLACK,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BrutalBudget() {
  const [txs, setTxs]       = useState<Tx[]>(SEED)
  const [desc, setDesc]     = useState("")
  const [amt, setAmt]       = useState("")
  const [cat, setCat]       = useState("Food")
  const [filter, setFilter] = useState("All")
  const [error, setError]   = useState("")
  const uid = useId()

  // ── Derived stats ──────────────────────────────────────────────────────────
  const income   = txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const balance  = income - expenses
  const spentPct = income > 0 ? Math.min((expenses / income) * 100, 100) : 0
  const meterColor = spentPct > 80 ? RED : spentPct > 50 ? "#FFAE00" : LIME

  // ── Actions ────────────────────────────────────────────────────────────────
  const addTx = useCallback(() => {
    const parsedAmt = parseFloat(amt)
    if (!desc.trim())                       { setError("Description is required."); return }
    if (isNaN(parsedAmt) || parsedAmt <= 0) { setError("Enter a valid positive amount."); return }

    const catInfo = CATS[cat]
    setTxs(prev => [{
      id: `${uid}-${Date.now()}`,
      description: desc.trim(),
      amount: parsedAmt,
      category: cat,
      type: catInfo.type,
    }, ...prev])
    setDesc("")
    setAmt("")
    setError("")
  }, [desc, amt, cat, uid])

  const delTx = useCallback((id: string) => {
    setTxs(prev => prev.filter(t => t.id !== id))
  }, [])

  const catNames = ["All", ...Object.keys(CATS)]
  const visible  = filter === "All" ? txs : txs.filter(t => t.category === filter)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scoped styles: responsive grid + animations ───────────────────── */}
      <style>{`
        /* ── Layout grids ────────────────────────────────────────────────── */
        .bb-stats {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 14px;
          margin: 18px 0 14px;
        }
        .bb-form {
          display: grid;
          grid-template-columns: 1fr 130px 170px auto;
          gap: 10px;
          align-items: end;
        }
        .bb-form-desc  { grid-column: 1; }
        .bb-form-amt   { grid-column: 2; }
        .bb-form-cat   { grid-column: 3; }
        .bb-form-add   { grid-column: 4; }

        @media (max-width: 720px) {
          .bb-stats {
            grid-template-columns: 1fr 1fr;
          }
          .bb-balance-card {
            grid-column: 1 / -1;
          }
          .bb-form {
            grid-template-columns: 1fr 1fr;
            row-gap: 10px;
          }
          .bb-form-desc { grid-column: 1 / -1; }
          .bb-form-amt  { grid-column: 1; }
          .bb-form-cat  { grid-column: 2; }
          .bb-form-add  { grid-column: 1 / -1; }
        }

        @media (max-width: 480px) {
          .bb-stats {
            grid-template-columns: 1fr;
          }
          .bb-balance-card {
            grid-column: 1;
          }
          .bb-form {
            grid-template-columns: 1fr;
          }
          .bb-form-amt, .bb-form-cat { grid-column: 1; }
        }

        /* ── Transaction row ─────────────────────────────────────────────── */
        .bb-tx {
          display: grid;
          grid-template-columns: 36px 1fr auto auto;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border: ${BD};
          border-radius: ${R}px;
          background: ${OFF_W};
          margin-bottom: 8px;
          box-shadow: ${SHS};
          animation: bbSlideIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (max-width: 480px) {
          .bb-tx {
            grid-template-columns: 30px 1fr auto;
          }
          .bb-tx-amount { font-size: 13px !important; }
          .bb-tx-del { display: none; }
        }

        /* ── Stagger ─────────────────────────────────────────────────────── */
        .bb-tx:nth-child(1) { animation-delay:   0ms; }
        .bb-tx:nth-child(2) { animation-delay:  40ms; }
        .bb-tx:nth-child(3) { animation-delay:  80ms; }
        .bb-tx:nth-child(4) { animation-delay: 120ms; }
        .bb-tx:nth-child(5) { animation-delay: 160ms; }
        .bb-tx:nth-child(n+6){ animation-delay: 200ms; }

        @keyframes bbSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Filter chip hover (desktop only) ────────────────────────────── */
        @media (hover: hover) and (pointer: fine) {
          .bb-filter:not(.bb-filter-active):hover {
            box-shadow: ${SH} !important;
            transform: translate(-2px, -2px) !important;
          }
          .bb-tx:hover {
            box-shadow: 4px 4px 0 #0D0D0D;
            transform: translate(-1px, -1px);
          }
          .bb-del:hover {
            box-shadow: 3px 3px 0 #0D0D0D !important;
            transform: translate(-1px, -1px) !important;
          }
        }

        /* ── Spending bar fill ───────────────────────────────────────────── */
        .bb-meter-fill {
          transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                      background 0.3s ease;
        }

        /* ── Placeholder colour ──────────────────────────────────────────── */
        .bb-input::placeholder { color: #AAAAAA; }

        /* ── prefers-reduced-motion ──────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .bb-tx { animation: none; }
          .bb-meter-fill { transition: none; }
        }
      `}</style>

      {/* ── Outer card ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: PAPER,
          borderRadius: 8,
          width: "100%",
          padding: "28px 28px 32px",
          fontFamily: F,
          boxSizing: "border-box",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: BD,
            paddingBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Logo badge */}
            <div
              style={{
                background: BLACK,
                color: YELLOW,
                border: BD,
                borderRadius: R,
                padding: "6px 11px",
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.08em",
                boxShadow: SHS,
              }}
            >
              ₿UDGET
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: "-0.04em",
                color: BLACK,
              }}
            >
              TRACKER
              <span style={{ color: "#888", fontWeight: 400 }}>.01</span>
            </span>
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 11,
              color: BLACK,
              opacity: 0.38,
              letterSpacing: "0.1em",
            }}
          >
            JUN 2026
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div className="bb-stats">
          {/* Balance — hero card */}
          <div
            className="bb-balance-card"
            style={{
              background: YELLOW,
              border: BD,
              borderRadius: R,
              boxShadow: SHB,
              padding: "22px 22px 18px",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: "0.12em",
                color: BLACK,
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              NET BALANCE
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: "clamp(26px, 5vw, 44px)",
                letterSpacing: "-0.04em",
                color: BLACK,
                lineHeight: 1,
              }}
            >
              ${fmt(Math.abs(balance))}
            </div>
            <div
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: balance >= 0 ? "rgba(0,0,0,0.12)" : RED,
                borderRadius: 2,
                padding: "3px 8px",
                border: "1.5px solid " + BLACK,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: balance >= 0 ? "#16A34A" : OFF_W,
                }}
              />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: balance >= 0 ? BLACK : OFF_W,
                }}
              >
                {balance >= 0 ? "POSITIVE" : "DEFICIT"}
              </span>
            </div>
          </div>

          {/* Income */}
          <div
            style={{
              background: LIME,
              border: BD,
              borderRadius: R,
              boxShadow: SHB,
              padding: "18px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  opacity: 0.55,
                }}
              >
                INCOME
              </div>
              <div
                style={{
                  background: BLACK,
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconArrowUp style={{ width: 13, height: 13, color: LIME }} />
              </div>
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: "clamp(18px, 3vw, 26px)",
                letterSpacing: "-0.03em",
                marginTop: 12,
                lineHeight: 1,
                color: BLACK,
              }}
            >
              +${fmt(income)}
            </div>
            <div
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 11,
                opacity: 0.55,
              }}
            >
              {txs.filter(t => t.type === "income").length} entries
            </div>
          </div>

          {/* Expenses */}
          <div
            style={{
              background: RED,
              border: BD,
              borderRadius: R,
              boxShadow: SHB,
              padding: "18px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: OFF_W,
                  opacity: 0.85,
                }}
              >
                EXPENSES
              </div>
              <div
                style={{
                  background: OFF_W,
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconArrowDown style={{ width: 13, height: 13, color: RED }} />
              </div>
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: "clamp(18px, 3vw, 26px)",
                letterSpacing: "-0.03em",
                marginTop: 12,
                lineHeight: 1,
                color: OFF_W,
              }}
            >
              −${fmt(expenses)}
            </div>
            <div
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 11,
                color: OFF_W,
                opacity: 0.8,
              }}
            >
              {txs.filter(t => t.type === "expense").length} entries
            </div>
          </div>
        </div>

        {/* ── Spending meter ──────────────────────────────────────────────── */}
        <div
          style={{
            background: BLACK,
            border: BD,
            borderRadius: R,
            padding: "14px 16px",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: OFF_W,
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: "0.1em",
              }}
            >
              SPENDING METER
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  color: meterColor,
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {spentPct.toFixed(1)}%
              </span>
              <span
                style={{
                  color: OFF_W,
                  fontSize: 10,
                  fontWeight: 600,
                  opacity: 0.45,
                  letterSpacing: "0.05em",
                }}
              >
                OF INCOME SPENT
              </span>
            </div>
          </div>
          {/* Bar track */}
          <div
            style={{
              background: "#2A2A2A",
              border: "2px solid #444",
              borderRadius: 2,
              height: 18,
              overflow: "hidden",
            }}
          >
            <div
              className="bb-meter-fill"
              style={{
                height: "100%",
                width: `${spentPct}%`,
                background: meterColor,
                minWidth: spentPct > 0 ? 6 : 0,
                borderRight: spentPct < 99 ? "2px solid " + BLACK : "none",
              }}
            />
          </div>
          {/* Tick labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            {["0%", "25%", "50%", "75%", "100%"].map(l => (
              <span
                key={l}
                style={{ color: "#666", fontSize: 9, fontWeight: 700, letterSpacing: "0.04em" }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── Section divider ─────────────────────────────────────────────── */}
        <SectionLabel label="ADD TRANSACTION" />

        {/* ── Form ───────────────────────────────────────────────────────── */}
        <div className="bb-form" style={{ marginBottom: error ? 10 : 18 }}>
          <div className="bb-form-desc">
            <label
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: "0.1em",
                marginBottom: 6,
                color: BLACK,
              }}
            >
              DESCRIPTION
            </label>
            <BrutalInput
              value={desc}
              onChange={setDesc}
              placeholder="What was it for?"
              onEnter={addTx}
              style={{ fontFamily: F }}
            />
          </div>
          <div className="bb-form-amt">
            <label
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: "0.1em",
                marginBottom: 6,
                color: BLACK,
              }}
            >
              AMOUNT ($)
            </label>
            <BrutalInput
              value={amt}
              onChange={setAmt}
              placeholder="0.00"
              type="number"
              onEnter={addTx}
            />
          </div>
          <div className="bb-form-cat">
            <label
              style={{
                display: "block",
                fontWeight: 800,
                fontSize: 10,
                letterSpacing: "0.1em",
                marginBottom: 6,
                color: BLACK,
              }}
            >
              CATEGORY
            </label>
            <BrutalSelect
              value={cat}
              onChange={setCat}
              options={Object.keys(CATS)}
            />
          </div>
          <div className="bb-form-add" style={{ paddingTop: 22 }}>
            <BrutalBtn onClick={addTx} full bg={BLACK} fg={YELLOW}>
              <IconPlus style={{ width: 16, height: 16 }} />
              ADD
            </BrutalBtn>
          </div>
        </div>

        {/* ── Inline error ────────────────────────────────────────────────── */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              background: RED,
              border: BD,
              borderRadius: R,
              padding: "9px 14px",
              marginBottom: 16,
              boxShadow: SHS,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconAlertTriangle style={{ width: 15, height: 15, color: OFF_W, flexShrink: 0 }} />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: OFF_W,
                  letterSpacing: "0.03em",
                }}
              >
                {error}
              </span>
            </div>
            <button
              onClick={() => setError("")}
              style={{
                background: "none",
                border: "none",
                color: OFF_W,
                cursor: "pointer",
                padding: "2px 4px",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Transactions section ────────────────────────────────────────── */}
        <SectionLabel label="TRANSACTIONS" />

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {catNames.map((c) => {
            const active = filter === c
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`bb-filter ${active ? "bb-filter-active" : ""}`}
                style={{
                  border: BD,
                  borderRadius: R,
                  padding: "5px 12px",
                  background: active ? BLACK : OFF_W,
                  color: active ? YELLOW : BLACK,
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: "0.07em",
                  cursor: "pointer",
                  fontFamily: F,
                  boxShadow: active ? SHS : SHS,
                  transition: "box-shadow 100ms, transform 100ms, background 80ms",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  userSelect: "none",
                }}
              >
                {c !== "All" && <span>{CATS[c]?.emoji}</span>}
                {c.toUpperCase()}
                {c !== "All" && (
                  <span
                    style={{
                      background: active ? YELLOW : "#DDD",
                      color: BLACK,
                      borderRadius: 2,
                      padding: "0 4px",
                      fontSize: 9,
                      fontWeight: 900,
                      minWidth: 16,
                      textAlign: "center",
                    }}
                  >
                    {txs.filter(t => t.category === c).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Transaction list */}
        {visible.length === 0 ? (
          <div
            style={{
              border: "3px dashed #BBBBBB",
              borderRadius: R,
              padding: "36px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 13,
              color: BLACK,
              opacity: 0.35,
              letterSpacing: "0.08em",
            }}
          >
            NO TRANSACTIONS — ADD ONE ABOVE ↑
          </div>
        ) : (
          <div>
            {visible.map((tx) => {
              const catInfo = CATS[tx.category]
              return (
                <TxRow key={tx.id} tx={tx} catInfo={catInfo} onDelete={delTx} />
              )
            })}
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: BD,
            marginTop: 20,
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: "0.1em",
              opacity: 0.35,
            }}
          >
            {txs.length} TOTAL RECORDS
          </span>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {["FOOD", "TRANS", "ENT", "SHOP", "HEALTH", "BILLS"].map((label, i) => {
              const colorMap = [ORANGE, BLUE, PINK, YELLOW, RED, PURPLE]
              return (
                <div
                  key={label}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 1,
                    background: colorMap[i],
                    border: "1.5px solid " + BLACK,
                  }}
                />
              )
            })}
            <span
              style={{
                fontWeight: 700,
                fontSize: 9,
                letterSpacing: "0.08em",
                opacity: 0.35,
                marginLeft: 4,
              }}
            >
              CATEGORY LEGEND
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Transaction row (separate component to allow press animation per-row) ────
function TxRow({
  tx,
  catInfo,
  onDelete,
}: {
  tx: Tx
  catInfo: { emoji: string; color: string; type: TxType }
  onDelete: (id: string) => void
}) {
  const [delDown, setDelDown] = useState(false)

  return (
    <div className="bb-tx" style={{ transition: "box-shadow 100ms, transform 100ms" }}>
      {/* Emoji icon */}
      <div
        style={{
          width: 36,
          height: 36,
          border: BD,
          borderRadius: 4,
          background: catInfo?.color ?? "#EEE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          boxShadow: SHS,
        }}
      >
        {catInfo?.emoji ?? "💸"}
      </div>

      {/* Description + badge */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: BLACK,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tx.description}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 5,
            background: catInfo?.color ?? "#CCC",
            border: "1.5px solid " + BLACK,
            borderRadius: 2,
            padding: "1px 6px",
            fontWeight: 800,
            fontSize: 9,
            letterSpacing: "0.1em",
            color: BLACK,
            whiteSpace: "nowrap",
          }}
        >
          {tx.category.toUpperCase()}
        </div>
      </div>

      {/* Amount */}
      <div
        className="bb-tx-amount"
        style={{
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: "-0.02em",
          color: tx.type === "income" ? "#15803D" : RED,
          whiteSpace: "nowrap",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {tx.type === "income" ? "+" : "−"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Delete button */}
      <button
        className="bb-del"
        onClick={() => onDelete(tx.id)}
        onMouseDown={() => setDelDown(true)}
        onMouseUp={() => setDelDown(false)}
        onMouseLeave={() => setDelDown(false)}
        onTouchStart={() => setDelDown(true)}
        onTouchEnd={() => onDelete(tx.id)}
        aria-label={`Delete ${tx.description}`}
        style={{
          background: RED,
          border: BD,
          borderRadius: 3,
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: delDown ? "0 0 0 #0D0D0D" : SHS,
          transform: delDown ? "translate(2px, 2px)" : "translate(0, 0)",
          transition: "box-shadow 80ms, transform 80ms",
          flexShrink: 0,
        }}
      >
        <IconTrash style={{ width: 13, height: 13, color: OFF_W }} />
      </button>
    </div>
  )
}

// ─── Section divider with floating label ──────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        borderTop: BD,
        marginBottom: 18,
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -10,
          left: 12,
          background: PAPER,
          padding: "0 8px",
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: "0.12em",
          color: BLACK,
        }}
      >
        {label}
      </span>
    </div>
  )
}

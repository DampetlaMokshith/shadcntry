"use client"

import { useState } from "react"
import { IconX } from "@tabler/icons-react"

// ─── Scene Components ─────────────────────────────────────────────────────────

function LandscapeScene() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Sky */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #79C8E4 0%, #AAD9EE 55%)" }} />
      {/* Main hill */}
      <div style={{
        position: "absolute", bottom: -30, left: -40, right: -40, height: "66%",
        background: "linear-gradient(180deg, #52A728 0%, #2A6510 100%)",
        borderRadius: "55% 65% 0 0",
      }} />
      {/* Lighter green foreground path */}
      <div style={{
        position: "absolute", bottom: 0, left: -10, width: "58%", height: "47%",
        background: "linear-gradient(145deg, #8EC841 0%, #A4D84E 100%)",
        borderRadius: "0 80% 0 0",
      }} />
      {/* The bright neon-green arc stripe */}
      <div style={{
        position: "absolute", bottom: "28%", left: -20, width: "38%", height: "9%",
        background: "linear-gradient(90deg, #B0F060, #A4E840)",
        borderRadius: "0 50% 50% 0",
        transform: "rotate(-6deg)",
      }} />
      {/* Stones */}
      <div style={{ position: "absolute", bottom: "43%", right: "27%", width: 24, height: 15, background: "#E6E6DE", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", bottom: "45%", right: "42%", width: 15, height: 10, background: "#D8D8CE", borderRadius: "50%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
    </div>
  )
}

function FrogScene() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, #3ACC3A 0%, #28B028 100%)",
    }}>
      <svg viewBox="0 0 200 230" style={{ width: "85%", height: "85%" }}>
        {/* Body shadow */}
        <ellipse cx="100" cy="222" rx="56" ry="10" fill="rgba(0,0,0,0.18)" />
        {/* Body */}
        <ellipse cx="100" cy="165" rx="62" ry="55" fill="#5EDB40" />
        {/* Belly highlight */}
        <ellipse cx="100" cy="168" rx="38" ry="33" fill="#7CEE58" opacity="0.42" />
        {/* Head */}
        <circle cx="100" cy="105" r="54" fill="#5EDB40" />
        {/* Eye mounds */}
        <ellipse cx="71" cy="75" rx="28" ry="24" fill="#6EEA4C" />
        <ellipse cx="129" cy="75" rx="28" ry="24" fill="#6EEA4C" />
        {/* Eyes */}
        <circle cx="71" cy="74" r="20" fill="#111" />
        <circle cx="129" cy="74" r="20" fill="#111" />
        {/* Eye highlights */}
        <circle cx="63" cy="66" r="7" fill="white" />
        <circle cx="121" cy="66" r="7" fill="white" />
        <circle cx="69" cy="75" r="3" fill="white" opacity="0.45" />
        {/* Nostrils */}
        <ellipse cx="91" cy="113" rx="5" ry="4" fill="#38981A" />
        <ellipse cx="109" cy="113" rx="5" ry="4" fill="#38981A" />
        {/* Smile */}
        <path d="M 79 130 Q 100 150 121 130" stroke="#38981A" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <path d="M 44 184 Q 24 202 16 218" stroke="#5EDB40" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M 156 184 Q 176 202 184 218" stroke="#5EDB40" strokeWidth="20" strokeLinecap="round" fill="none" />
        {/* Body spots */}
        <circle cx="82" cy="155" r="9" fill="#46C028" opacity="0.52" />
        <circle cx="118" cy="172" r="7" fill="#46C028" opacity="0.52" />
      </svg>
    </div>
  )
}

function MottoScene() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Sky */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #79C8E4 0%, #A8DAED 100%)" }} />
      {/* Green stripe */}
      <div style={{ position: "absolute", top: "44%", left: 0, right: 0, height: "19%", background: "#7DC33A" }} />
      {/* Text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "8px 10px",
      }}>
        <div style={{
          fontFamily: 'Impact, "Arial Black", sans-serif',
          fontWeight: 900,
          lineHeight: 1.0,
          color: "#1A2744",
          fontSize: 28,
          textTransform: "uppercase",
          letterSpacing: "-0.5px",
        }}>
          <div>DESIGNS</div>
          <div>THAT</div>
          <div>MAKE</div>
          <div style={{ color: "#7DC33A" }}>SENSE</div>
        </div>
      </div>
      {/* QR Code (simulated) */}
      <div style={{
        position: "absolute", bottom: 8, right: 8,
        width: 40, height: 40, background: "white", padding: 3, borderRadius: 3,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
        gap: 0.5,
      }}>
        {[1,1,1,0,1,0,1, 1,0,1,0,0,1,0, 1,1,1,0,1,0,1, 0,0,0,1,0,1,0, 1,0,1,0,1,1,1, 0,1,0,1,0,0,1, 1,0,1,0,1,0,1].map((v, i) => (
          <div key={i} style={{ background: v ? "#111" : "transparent" }} />
        ))}
      </div>
    </div>
  )
}

function BrandFeelScene() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "space-evenly",
      padding: "0 16px",
      background: "linear-gradient(135deg, #4DA6CC 0%, #66C2DC 45%, #7CC842 100%)",
    }}>
      {["↺", "☀", "〜"].map((symbol, i) => (
        <div key={i} style={{
          width: 54, height: 54,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          border: "2px solid rgba(255,255,255,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          color: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.3)",
          backdropFilter: "blur(4px)",
        }}>
          {symbol}
        </div>
      ))}
    </div>
  )
}

function PostersScene() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, #9FBECE 0%, #B2C8D6 100%)",
    }}>
      <div style={{ width: "86%" }}>
        {/* Billboard face */}
        <div style={{
          background: "linear-gradient(180deg, #C2D4DE 0%, #CCDAE4 100%)",
          border: "2.5px solid #8AAABA",
          borderRadius: 3,
          padding: "8px 12px",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 3px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)",
          position: "relative", overflow: "hidden",
        }}>
          {[33, 66].map(p => (
            <div key={p} style={{
              position: "absolute", top: 0, bottom: 0, left: `${p}%`,
              width: 1.5, background: "rgba(0,0,0,0.09)",
            }} />
          ))}
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "#2D5A1B",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0, position: "relative", zIndex: 1,
          }}>🦎</div>
          <span style={{
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontWeight: 900, fontSize: 17, color: "#2C3E50",
            letterSpacing: 0.5, position: "relative", zIndex: 1,
          }}>KREE8.STUDIO.</span>
        </div>
        {/* Poles */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20%" }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 7, height: 16,
              background: "linear-gradient(180deg, #8A9AA2 0%, #5A6A72 100%)",
              borderRadius: "0 0 1px 1px",
            }} />
          ))}
        </div>
        {/* Base */}
        <div style={{ height: 5, background: "linear-gradient(180deg, #5A6A72, #3A4A52)", borderRadius: "0 0 3px 3px" }} />
      </div>
    </div>
  )
}

function NumberScene() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Sky */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #87CEEB 0%, #9DD8E8 65%)" }} />
      {/* Grass */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, #52A728 0%, #2A6010 100%)" }} />
      {/* Number 8 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{
          fontFamily: 'Impact, "Arial Black", sans-serif',
          fontSize: 100, fontWeight: 900,
          background: "linear-gradient(180deg, #5CB85C 0%, #3A8A3A 45%, #1F5C1F 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(3px 5px 8px rgba(0,0,0,0.38))",
          lineHeight: 1, display: "block",
        }}>8</span>
      </div>
      {/* Flowers */}
      <div style={{ position: "absolute", bottom: "29%", left: "18%", fontSize: 13 }}>🌸</div>
      <div style={{ position: "absolute", bottom: "27%", right: "21%", fontSize: 10 }}>✿</div>
    </div>
  )
}

// ─── Attachment Components ─────────────────────────────────────────────────────

// ─── 3D Push Pin (Thumbtack) ─────────────────────────────────────────────────
// Realistic mushroom-dome thumbtack with specular highlight and card cast shadow.
// Gradient IDs are color-scoped so red and green are independent.
function PushPin({ color }: { color: "red" | "green" }) {
  const gId   = `pinDome_${color}`   // radial gradient for dome
  const fId   = `pinBlur_${color}`   // gaussian blur filter for cast shadow

  const c = color === "red"
    ? { bright: "#FF7777", mid: "#E53935", dark: "#8B0000", rim: "#C62828" }
    : { bright: "#92EE60", mid: "#43A047", dark: "#1B5E20", rim: "#388E3C" }

  return (
    // SVG is 58 wide × 76 tall.
    // Dome center at (22, 26). Shadow ellipse at bottom (y≈68) bleeds
    // onto the card face when the container is offset top:-46px.
    <svg
      width="58" height="76"
      viewBox="0 0 58 76"
      style={{ overflow: "visible", display: "block", pointerEvents: "none" }}
    >
      <defs>
        {/* Radial gradient: bright top-left highlight → main color → dark shadow side */}
        <radialGradient id={gId} cx="33%" cy="27%" r="70%" fx="28%" fy="22%">
          <stop offset="0%"   stopColor={c.bright} />
          <stop offset="38%" stopColor={c.mid}    />
          <stop offset="88%" stopColor={c.dark}   />
        </radialGradient>
        {/* Blur filter for soft cast shadow on card surface */}
        <filter id={fId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      {/* ── Cast shadow on card surface ─────────────────────────────────── */}
      {/* Offset right to simulate top-left light source */}
      <ellipse cx="36" cy="70" rx="17" ry="8"
        fill="rgba(0,0,0,0.22)" filter={`url(#${fId})`} />

      {/* ── Needle ───────────────────────────────────────────────────────── */}
      <line x1="22" y1="50" x2="28" y2="66"
        stroke="#888" strokeWidth="2.5" strokeLinecap="round" />

      {/* ── Neck / flange ring ────────────────────────────────────────────── */}
      <ellipse cx="20" cy="50" rx="11" ry="5.5"
        fill={c.rim} transform="rotate(-10, 20, 50)" />
      {/* Flange rim highlight edge */}
      <ellipse cx="20" cy="50" rx="11" ry="5.5"
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"
        transform="rotate(-10, 20, 50)" />

      {/* ── Dome body (sphere viewed from slight above-front angle) ──────── */}
      <ellipse cx="20" cy="26" rx="22" ry="20" fill={`url(#${gId})`} />

      {/* Under-dome shadow band (separates dome from flange) */}
      <ellipse cx="20" cy="46" rx="16" ry="4.5"
        fill="rgba(0,0,0,0.22)" />

      {/* ── Primary specular highlight — upper left ───────────────────────── */}
      <ellipse cx="11" cy="16" rx="8.5" ry="6"
        fill="rgba(255,255,255,0.62)"
        transform="rotate(-22, 11, 16)"
        style={{ filter: "blur(1.5px)" }} />

      {/* ── Secondary specular dot ────────────────────────────────────────── */}
      <ellipse cx="30" cy="32" rx="4" ry="3"
        fill="rgba(255,255,255,0.22)"
        transform="rotate(12, 30, 32)" />
    </svg>
  )
}

// ─── 3D Paper Clip ────────────────────────────────────────────────────────────
// Dual-wire clip with layered strokes to simulate cylindrical metallic wire.
// The outer arc is slightly darker (back of card), inner wire is lighter (front).
// "top" variant clips over the card's top edge.
// "side-right" variant clips over the right edge (horizontal SVG).
function PaperClip({ variant = "top" }: { variant?: "top" | "side-right" }) {
  // Stroke helpers for cylindrical metal appearance:
  //   layer 1 = dark base (shadow side of wire, full width)
  //   layer 2 = mid-gray body
  //   layer 3 = specular highlight on top-facing surface (narrower)
  const DARK = "#6A6A6A"
  const MID  = "#ABABAB"
  const LO   = "#D8D8D8"  // lighter front-facing wire
  const HI   = "rgba(255,255,255,0.76)"  // specular arch highlight

  if (variant === "top") {
    // Outer back wire: taller arch, behind the card
    const outer = "M 7 54 L 7 25 Q 7 4 16 4 Q 25 4 25 25 L 25 54"
    // Inner front wire: shorter, on card face
    const inner = "M 11 54 L 11 29 Q 11 17 16 17 Q 21 17 21 29 L 21 54"
    // Arch-only highlight
    const arch  = "M 10 24 Q 10 7 16 7 Q 22 7 22 24"
    return (
      <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <svg width="32" height="54" viewBox="0 0 32 54">
          {/* Outer arc – dark base then mid */}
          <path d={outer} stroke={DARK} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d={outer} stroke={MID}  strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Inner wire – dark base then lighter (front-facing) */}
          <path d={inner} stroke={DARK} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d={inner} stroke={LO}   strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Top-arch specular highlight */}
          <path d={arch}  stroke={HI}   strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // side-right: horizontal clip hooked over the card's right border
  const outerH = "M 0 7 L 27 7 Q 50 7 50 16 Q 50 25 27 25 L 0 25"
  const innerH = "M 0 11 L 24 11 Q 38 11 38 16 Q 38 21 24 21 L 0 21"
  const archH  = "M 26 9 Q 48 9 48 16"
  return (
    <div style={{ position: "absolute", right: -26, top: "28%", zIndex: 10 }}>
      <svg width="54" height="32" viewBox="0 0 54 32">
        <path d={outerH} stroke={DARK} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d={outerH} stroke={MID}  strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d={innerH} stroke={DARK} strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d={innerH} stroke={LO}   strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d={archH}  stroke={HI}   strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function TapeStrip() {
  return (
    <div style={{
      width: 64, height: 22,
      background: "rgba(215, 198, 128, 0.6)",
      position: "relative",
      borderLeft: "1px solid rgba(160,135,50,0.2)",
      borderRight: "1px solid rgba(160,135,50,0.2)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 9px)",
      }} />
    </div>
  )
}

// ─── Card Config Type ─────────────────────────────────────────────────────────

type CardConfig = {
  id: string
  caption: string
  attachment: "pin-red" | "pin-green" | "paperclip-top" | "paperclip-side-right" | "none"
  rotation: number
  width: number
  height: number
  tapeBottom?: boolean
  scene: React.ReactNode
}

// ─── Polaroid Card ─────────────────────────────────────────────────────────────

function PolaroidCard({ card, onClick }: { card: CardConfig; onClick: (c: CardConfig) => void }) {
  const [hovered, setHovered] = useState(false)
  const PAD = 10
  const CAPTION_H = 40

  return (
    <div
      style={{
        position: "relative",
        width: card.width,
        flexShrink: 0,
        cursor: "pointer",
        transform: `rotate(${card.rotation}deg) translateY(${hovered ? -10 : 0}px) scale(${hovered ? 1.04 : 1})`,
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: hovered ? 30 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(card)}
    >
      {/* ── Pin attachments (top: -46 so dome hovers above card, shadow bleeds onto card face) */}
      {card.attachment === "pin-red" && (
        <div style={{ position: "absolute", top: -46, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <PushPin color="red" />
        </div>
      )}
      {card.attachment === "pin-green" && (
        <div style={{ position: "absolute", top: -46, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <PushPin color="green" />
        </div>
      )}
      {/* ── Paper clip attachments (self-positioned absolutely) */}
      {card.attachment === "paperclip-top" && <PaperClip variant="top" />}
      {card.attachment === "paperclip-side-right" && <PaperClip variant="side-right" />}

      {/* Polaroid frame — richer multi-layer shadow for realism */}
      <div style={{
        background: "#FDFDF8",
        padding: `${PAD}px ${PAD}px 0`,
        boxShadow: hovered
          ? "0 28px 70px rgba(0,0,0,0.30), 0 10px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)"
          : "0 8px 28px rgba(0,0,0,0.18), 0 3px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.3s ease",
        borderRadius: 2,
      }}>
        {/* Image area */}
        <div style={{ width: card.width - PAD * 2, height: card.height, overflow: "hidden" }}>
          {card.scene}
        </div>
        {/* Caption */}
        <div style={{ height: CAPTION_H, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{
            fontFamily: '"Caveat", "Segoe Script", cursive',
            fontSize: 15, fontWeight: 500,
            color: "#5A5A5A", letterSpacing: 0.3,
          }}>
            {card.caption}
          </span>
        </div>
      </div>

      {/* Tape bottom */}
      {card.tapeBottom && (
        <div style={{
          position: "absolute", bottom: -8, left: "50%",
          transform: "translateX(-50%) rotate(-1deg)", zIndex: 10,
        }}>
          <TapeStrip />
        </div>
      )}
    </div>
  )
}

// ─── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ card, onClose }: { card: CardConfig; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "zoom-out",
        animation: "lbFadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lbScaleIn { from { transform: scale(0.82) rotate(${card.rotation}deg); opacity: 0 } to { transform: scale(1) rotate(0deg); opacity: 1 } }
      `}</style>

      <div
        style={{
          background: "#FDFDF8",
          padding: 14, paddingBottom: 0,
          borderRadius: 3,
          cursor: "default",
          boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
          animation: "lbScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxWidth: 460,
          width: "90vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "100%", height: 320, overflow: "hidden" }}>
          {card.scene}
        </div>
        <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 22, color: "#5A5A5A" }}>
            {card.caption}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        style={{
          position: "absolute", top: 20, right: 20,
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <IconX size={20} />
      </button>
    </div>
  )
}

// ─── Main Gallery ──────────────────────────────────────────────────────────────

export default function PolaroidGallery() {
  const [selected, setSelected] = useState<CardConfig | null>(null)

  const cards: CardConfig[] = [
    // Column 1
    {
      id: "feels-fresh",
      caption: "Feels fresh......",
      attachment: "pin-red",
      rotation: -5,
      width: 246,
      height: 198,
      tapeBottom: true,
      scene: <LandscapeScene />,
    },
    {
      id: "brand-feel",
      caption: "Brand feel",
      attachment: "none",
      rotation: -2,
      width: 222,
      height: 112,
      scene: <BrandFeelScene />,
    },
    // Column 2
    {
      id: "icon-face",
      caption: "Icon/Facee",
      attachment: "paperclip-top",
      rotation: 3,
      width: 198,
      height: 178,
      scene: <FrogScene />,
    },
    {
      id: "posters",
      caption: "Posters",
      attachment: "none",
      rotation: 5,
      width: 212,
      height: 148,
      scene: <PostersScene />,
    },
    // Column 3
    {
      id: "our-motto",
      caption: "Our Motto",
      attachment: "pin-green",
      rotation: -1,
      width: 208,
      height: 178,
      scene: <MottoScene />,
    },
    {
      id: "just-a-number",
      caption: "Just a number :)",
      attachment: "paperclip-side-right",
      rotation: -4,
      width: 172,
      height: 168,
      scene: <NumberScene />,
    },
  ]

  // 3-column layout matching reference image
  const columns: CardConfig[][] = [
    [cards[0], cards[1]],
    [cards[2], cards[3]],
    [cards[4], cards[5]],
  ]

  const columnOffsets = [0, 24, 10] // staggered vertical offsets

  return (
    <>
      <div style={{
        background: "#E8E8E4",
        borderRadius: 20,
        padding: "58px 36px 44px",  // extra top padding so pins don't clip
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: 500,
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {columns.map((col, colIdx) => (
            <div key={colIdx} style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              alignItems: "center",
              marginTop: columnOffsets[colIdx],
            }}>
              {col.map((card) => (
                <PolaroidCard key={card.id} card={card} onClick={setSelected} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <Lightbox card={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

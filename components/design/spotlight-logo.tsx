"use client"

// ─── SpotlightLogo ────────────────────────────────────────────────────────────
// Replica of the "Spotlight®" hero word-mark with floating social chips
// scattered over the letterforms.
//
// Chips:
//   1. AM logo      — top-left,  circular white chip, "AM" in red/black italic
//   2. @cluely      — top-right, pill chip, handle + blue verified badge
//   3. @mafia       — bottom-left, pill chip, handle + blue verified badge
//   4. Aperture icon— center,    dark circle chip, camera-aperture SVG
//   5. Person avatar— bottom-right, circular photo chip (SVG person silhouette)
// ─────────────────────────────────────────────────────────────────────────────

// ── Blue Twitter/X verified checkmark ─────────────────────────────────────────
function VerifiedBadge() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="12" fill="#1D9BF0" />
      <path
        d="M9.5 16.5L5.5 12.5L6.91 11.09L9.5 13.67L17.09 6.08L18.5 7.5L9.5 16.5Z"
        fill="white"
      />
    </svg>
  )
}

// ── Aperture / Peace icon chip ─────────────────────────────────────────────────
function ApertureChip() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "#0F0F1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 12px rgba(0,0,0,0.28), 0 1px 3px rgba(0,0,0,0.18)",
        flexShrink: 0,
      }}
    >
      {/* Peace / aperture SVG */}
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        {/* Outer ring */}
        <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="2.4" fill="none" />
        {/* Vertical line top */}
        <line x1="16" y1="3" x2="16" y2="16" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        {/* Bottom-left diagonal */}
        <line x1="16" y1="16" x2="4.7" y2="23" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        {/* Bottom-right diagonal */}
        <line x1="16" y1="16" x2="27.3" y2="23" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ── AM Logo chip ───────────────────────────────────────────────────────────────
function AMLogoChip() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)",
        border: "1.5px solid rgba(0,0,0,0.07)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* AM logotype — "A" red italic, "M" dark */}
      <span
        style={{
          fontFamily: '"Arial Black", "Impact", sans-serif',
          fontWeight: 900,
          fontSize: 13,
          letterSpacing: "-0.5px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#E8190A",
            fontStyle: "italic",
            marginRight: -1,
          }}
        >
          A
        </span>
        <span style={{ color: "#111111" }}>M</span>
      </span>
    </div>
  )
}

// ── Handle pill chip (@cluely / @mafia) ──────────────────────────────────────
function HandlePill({ handle }: { handle: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: "white",
        border: "1px solid rgba(0,0,0,0.09)",
        borderRadius: 999,
        padding: "3px 7px 3px 6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.13), 0 1px 2px rgba(0,0,0,0.08)",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontWeight: 500,
          fontSize: 10,
          color: "#111",
          letterSpacing: "-0.1px",
        }}
      >
        {handle}
      </span>
      <VerifiedBadge />
    </div>
  )
}

// ── Person avatar chip ────────────────────────────────────────────────────────
function PersonAvatarChip() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "white",
        border: "2px solid white",
        boxShadow: "0 3px 12px rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.12)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Realistic human silhouette / avatar illustration */}
      <svg width="38" height="38" viewBox="0 0 54 54" fill="none">
        {/* Background skin tone */}
        <rect width="54" height="54" fill="#C8956C" />
        {/* Shirt / body */}
        <rect x="0" y="36" width="54" height="18" fill="#2D2D2D" />
        {/* Neck */}
        <rect x="21" y="30" width="12" height="10" fill="#B5784A" />
        {/* Head */}
        <ellipse cx="27" cy="22" rx="13" ry="14" fill="#C8956C" />
        {/* Beard shadow area lower face */}
        <ellipse cx="27" cy="30" rx="10" ry="6" fill="#A06535" opacity="0.6" />
        {/* Hair on top (dark) */}
        <ellipse cx="27" cy="10" rx="13" ry="8" fill="#1A1008" />
        {/* Beard detail */}
        <ellipse cx="27" cy="29" rx="8" ry="5" fill="#7A4A20" opacity="0.8" />
        {/* Eyes */}
        <ellipse cx="22" cy="22" rx="2" ry="2.2" fill="#1A1008" />
        <ellipse cx="32" cy="22" rx="2" ry="2.2" fill="#1A1008" />
        {/* Nose */}
        <ellipse cx="27" cy="26" rx="1.5" ry="1" fill="#A06535" />
      </svg>
    </div>
  )
}

// ── Main SpotlightLogo component ──────────────────────────────────────────────

export default function SpotlightLogo() {
  return (
    <>
      {/*
        Font: Nunito Black (900)
        - Near-monolinear strokes
        - Rounded terminals on all letterforms (S, p, l, h, n…)
        - Double-story "g" with very open circular lower bowl
        - These are the exact distinguishing features in the reference image
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');

        .spotlight-word {
          /* Inter 700 — sharp bold grotesque, slimmer than ultra-black */
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 650;
          font-size: clamp(80px, 12vw, 148px);
          letter-spacing: -0.04em;
          line-height: 1;
          color: #0A0A0A;
          user-select: none;
          white-space: nowrap;
        }

        .spotlight-chip {
          position: absolute;
          z-index: 10;
        }

        /* Each chip floats at its own pace + rotation to feel organic */
        @keyframes floatA {
          0%, 100% { transform: translateY(0px)  rotate(-6deg); }
          50%       { transform: translateY(-5px) rotate(-6deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px)  rotate(3deg); }
          50%       { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px)  rotate(-2deg); }
          50%       { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes floatD {
          0%, 100% { transform: translateY(0px)  rotate(0deg); }
          50%       { transform: translateY(-5px) rotate(0deg); }
        }
        @keyframes floatE {
          0%, 100% { transform: translateY(0px)  rotate(4deg); }
          50%       { transform: translateY(-7px) rotate(4deg); }
        }
      `}</style>

      <div
        style={{
          background: "#EAEAE6",
          borderRadius: 20,
          width: "100%",
          minHeight: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 48px",
          overflow: "visible",
        }}
      >
        {/* Word-mark wrapper — chips positioned relative to this block */}
        <div style={{ position: "relative", display: "inline-block" }}>

          {/* ── THE WORDMARK ──────────────────────────────────────── */}
          <span className="spotlight-word">
            Spotlight
            <sup
              style={{
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.38em",
                letterSpacing: 0,
                verticalAlign: "super",
                lineHeight: 0,
                marginLeft: "0.03em",
              }}
            >
              ®
            </sup>
          </span>

          {/* ── CHIP 1: AM Logo — top-left, over "Sp" ─────────── */}
          <div
            className="spotlight-chip"
            style={{
              top: "-22px",
              left: "3%",
              animation: "floatA 3.2s ease-in-out infinite",
            }}
          >
            <AMLogoChip />
          </div>

          {/* ── CHIP 2: @cluely pill — top-right, over "igh" ──── */}
          <div
            className="spotlight-chip"
            style={{
              top: "-14px",
              right: "11%",
              animation: "floatB 3.8s ease-in-out infinite 0.4s",
            }}
          >
            <HandlePill handle="@cluely" />
          </div>

          {/* ── CHIP 3: @mafia pill — bottom-left, under "tl" ─── */}
          <div
            className="spotlight-chip"
            style={{
              bottom: "-14px",
              left: "17%",
              animation: "floatC 4.1s ease-in-out infinite 0.8s",
            }}
          >
            <HandlePill handle="@mafia" />
          </div>

          {/* ── CHIP 4: Aperture — center, sits on "o" ──────────  */}
          <div
            className="spotlight-chip"
            style={{
              bottom: "-18px",
              left: "51%",
              transform: "translateX(-50%)",
              animation: "floatD 3.5s ease-in-out infinite 0.2s",
            }}
          >
            <ApertureChip />
          </div>

          {/* ── CHIP 5: Person avatar — bottom-right, over "t" ── */}
          <div
            className="spotlight-chip"
            style={{
              bottom: "-14px",
              right: "3%",
              animation: "floatE 3.9s ease-in-out infinite 0.6s",
            }}
          >
            <PersonAvatarChip />
          </div>
        </div>
      </div>
    </>
  )
}

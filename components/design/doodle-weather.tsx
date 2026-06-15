"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DOODLE WEATHER — Sketchbook-Style Weather Widget (Live Data)
//
// Data flow:
//   1. On mount → request browser geolocation
//   2. lat/lon → fetch /api/weather (server proxy, key never on client)
//   3. Map API response to local state, render live data
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react"

// ─── Design tokens ────────────────────────────────────────────────────────────
const PAPER     = "#F8F4EE"
const INK       = "#1C1A17"
const INK_FADE  = "#1C1A1740"
const INK_MID   = "#1C1A1799"
const PENCIL    = "#8B7355"
const SKY_DAY   = "#D4E8F7"
const SKY_CLOUD = "#E8E4DE"
const SKY_RAIN  = "#C8D4DC"
const SKY_SNOW  = "#E4EEF4"
const SKY_STORM = "#B8C0C8"
const SUN_YEL   = "#F5C842"
const RAIN_BLU  = "#7AAED6"
const F         = "'Inter', system-ui, sans-serif"

// ─── Types ────────────────────────────────────────────────────────────────────
type WeatherState =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "stormy"
  | "partly-cloudy"

type DayForecast = {
  day: string
  state: WeatherState
  hi: number
  lo: number
  date: string
}

type WeatherData = {
  location: string
  state: WeatherState
  temp: number
  feels: number
  humidity: number
  windKph: number
  description: string
  updatedAt: string
  forecast: DayForecast[]
}

type LoadPhase =
  | "idle"
  | "locating"
  | "fetching"
  | "done"
  | "geo-denied"
  | "geo-unavailable"
  | "error"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toF(c: number) {
  return Math.round((c * 9) / 5 + 32)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function relativeTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return "Updated just now"
  if (diff < 120)  return "Updated 1 min ago"
  if (diff < 3600) return `Updated ${Math.floor(diff / 60)} min ago`
  return `Updated ${Math.floor(diff / 3600)}h ago`
}

// ─── Sky colour / label maps ──────────────────────────────────────────────────
const SKY_MAP: Record<WeatherState, string> = {
  sunny:           SKY_DAY,
  "partly-cloudy": SKY_DAY,
  cloudy:          SKY_CLOUD,
  rainy:           SKY_RAIN,
  snowy:           SKY_SNOW,
  stormy:          SKY_STORM,
}

const LABEL_MAP: Record<WeatherState, string> = {
  sunny:           "Sunny",
  "partly-cloudy": "Partly Cloudy",
  cloudy:          "Overcast",
  rainy:           "Rainy",
  snowy:           "Snowy",
  stormy:          "Thunderstorm",
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ILLUSTRATIONS
// ─────────────────────────────────────────────────────────────────────────────

function SunDoodle({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }} aria-hidden>
      <g style={{ transformOrigin: "50px 50px", animation: "dw-sun-spin 20s linear infinite" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line key={i}
            x1={50 + 24 * Math.cos((deg * Math.PI) / 180)}
            y1={50 + 24 * Math.sin((deg * Math.PI) / 180)}
            x2={50 + 37 * Math.cos((deg * Math.PI) / 180)}
            y2={50 + 37 * Math.sin((deg * Math.PI) / 180)}
            stroke={INK} strokeWidth="2.5" strokeLinecap="round"
          />
        ))}
      </g>
      <path d="M50 28 C58 27,73 34,74 44 C75 54,69 70,56 72 C44 74,28 67,27 55 C26 43,32 29,50 28 Z"
        fill={SUN_YEL} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M42 47 C44 50,48 52,53 49" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="44" r="1.5" fill={INK} />
      <circle cx="54" cy="43" r="1.5" fill={INK} />
    </svg>
  )
}

function CloudDoodle({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 65" width={size} height={(size * 65) / 100} aria-hidden>
      <path d="M18 52 C10 52,4 46,5 38 C6 31,12 27,20 28 C20 18,29 10,40 11 C47 11,53 15,56 22 C59 16,66 13,73 15 C82 18,87 27,84 37 C88 38,92 43,90 49 C88 55,82 58,76 57 L22 57 Z"
        fill="white" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M25 45 Q35 42 45 45 Q55 48 65 44 Q72 41 78 46" stroke={INK_FADE} strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M30 50 Q42 47 55 50 Q64 52 70 49" stroke={INK_FADE} strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function RainDoodle({ size = 80 }: { size?: number }) {
  const drops = [
    { x: 20, delay: "0s",    dur: "1.2s" },
    { x: 35, delay: "0.3s",  dur: "1.4s" },
    { x: 50, delay: "0.15s", dur: "1.1s" },
    { x: 65, delay: "0.45s", dur: "1.3s" },
    { x: 80, delay: "0.6s",  dur: "1.5s" },
  ]
  return (
    <svg viewBox="0 0 100 70" width={size} height={(size * 70) / 100} aria-hidden style={{ overflow: "visible" }}>
      <path d="M8 28 C2 28,-2 23,-1 17 C0 11,6 8,13 9 C14 2,22 -4,32 -3 C38 -3,43 0,46 6 C49 1,55 -1,61 1 C69 4,73 11,70 18 C74 19,77 23,75 27 C73 31,68 33,63 32 L12 32 Z"
        fill="white" stroke={INK} strokeWidth="2" strokeLinejoin="round" transform="translate(12 4)" />
      {drops.map((d, i) => (
        <path key={i}
          d={`M${d.x} 42 L${d.x - 2} 55 Q${d.x} 62 ${d.x + 2} 55 Z`}
          fill={RAIN_BLU} stroke={INK} strokeWidth="1"
          style={{ animation: `dw-rain-fall ${d.dur} ${d.delay} ease-in infinite`, transformOrigin: `${d.x}px 42px` }}
        />
      ))}
    </svg>
  )
}

function SnowDoodle({ size = 80 }: { size?: number }) {
  const flakes = [
    { cx: 20, cy: 48, r: 3,   delay: "0s"   },
    { cx: 38, cy: 55, r: 2.5, delay: "0.4s" },
    { cx: 55, cy: 46, r: 3.5, delay: "0.2s" },
    { cx: 70, cy: 53, r: 2,   delay: "0.6s" },
    { cx: 82, cy: 45, r: 3,   delay: "0.1s" },
  ]
  return (
    <svg viewBox="0 0 100 70" width={size} height={(size * 70) / 100} aria-hidden style={{ overflow: "visible" }}>
      <path d="M8 28 C2 28,-2 23,-1 17 C0 11,6 8,13 9 C14 2,22 -4,32 -3 C38 -3,43 0,46 6 C49 1,55 -1,61 1 C69 4,73 11,70 18 C74 19,77 23,75 27 C73 31,68 33,63 32 L12 32 Z"
        fill={SKY_SNOW} stroke={INK} strokeWidth="2" strokeLinejoin="round" transform="translate(12 4)" />
      {flakes.map((f, i) => (
        <g key={i} style={{ animation: `dw-snow-fall 2s ${f.delay} ease-in infinite`, transformOrigin: `${f.cx}px 42px` }}>
          {[0, 60, 120, 180, 240, 300].map((deg, j) => (
            <line key={j}
              x1={f.cx} y1={f.cy}
              x2={f.cx + f.r * 2.5 * Math.cos((deg * Math.PI) / 180)}
              y2={f.cy + f.r * 2.5 * Math.sin((deg * Math.PI) / 180)}
              stroke={RAIN_BLU} strokeWidth="1.2" strokeLinecap="round"
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

function StormDoodle({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 80" width={size} height={(size * 80) / 100} aria-hidden style={{ overflow: "visible" }}>
      <path d="M8 32 C2 32,-2 26,-1 20 C0 14,6 10,13 11 C14 4,22 -2,32 -1 C38 -1,43 2,46 8 C49 3,55 1,61 3 C69 6,73 14,70 21 C74 22,77 27,75 32 C73 37,68 39,63 38 L12 38 Z"
        fill={SKY_STORM} stroke={INK} strokeWidth="2" strokeLinejoin="round" transform="translate(12 4)" />
      <path d="M55 42 L44 60 L52 60 L40 78 L59 56 L50 56 Z"
        fill={SUN_YEL} stroke={INK} strokeWidth="1.5" strokeLinejoin="round"
        style={{ animation: "dw-lightning-flash 2.5s 0.8s ease-in-out infinite" }} />
      <line x1="22" y1="44" x2="18" y2="56" stroke={RAIN_BLU} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.7 }} />
      <line x1="30" y1="46" x2="26" y2="58" stroke={RAIN_BLU} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.7 }} />
      <line x1="38" y1="44" x2="34" y2="56" stroke={RAIN_BLU} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.7 }} />
      <line x1="72" y1="44" x2="68" y2="56" stroke={RAIN_BLU} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.7 }} />
    </svg>
  )
}

function PartlyCloudyDoodle({ size = 100 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 80" width={size} height={(size * 80) / 100} aria-hidden style={{ overflow: "visible" }}>
      <g opacity="0.8">
        {[315, 0, 45].map((deg, i) => (
          <line key={i}
            x1={28 + 20 * Math.cos((deg * Math.PI) / 180)}
            y1={38 + 20 * Math.sin((deg * Math.PI) / 180)}
            x2={28 + 30 * Math.cos((deg * Math.PI) / 180)}
            y2={38 + 30 * Math.sin((deg * Math.PI) / 180)}
            stroke={INK} strokeWidth="2.5" strokeLinecap="round"
          />
        ))}
        <path d="M28 20 C34 19,44 24,44 33 C44 42,36 49,28 49 C20 49,12 42,12 33 C12 24,22 21,28 20 Z"
          fill={SUN_YEL} stroke={INK} strokeWidth="2" />
      </g>
      <path d="M30 56 C22 56,16 50,17 42 C18 35,24 31,32 32 C32 22,41 15,52 16 C59 16,65 20,68 27 C71 21,78 18,85 20 C93 23,97 33,94 42 C97 43,99 48,97 54 C95 60,90 63,84 62 L34 62 Z"
        fill="white" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M38 50 Q50 47 62 50 Q72 53 82 49" stroke={INK_FADE} strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function WeatherIllustration({ state, size = 120 }: { state: WeatherState; size?: number }) {
  switch (state) {
    case "sunny":          return <SunDoodle size={size} />
    case "partly-cloudy":  return <PartlyCloudyDoodle size={size} />
    case "cloudy":         return <CloudDoodle size={size} />
    case "rainy":          return <RainDoodle size={size} />
    case "snowy":          return <SnowDoodle size={size} />
    case "stormy":         return <StormDoodle size={size} />
  }
}

// ─── Tiny forecast icons ──────────────────────────────────────────────────────
function TinyIcon({ state }: { state: WeatherState }) {
  const s = 26
  switch (state) {
    case "sunny":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line key={i}
              x1={12 + 6 * Math.cos((deg * Math.PI) / 180)} y1={12 + 6 * Math.sin((deg * Math.PI) / 180)}
              x2={12 + 9 * Math.cos((deg * Math.PI) / 180)} y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
              stroke={INK} strokeWidth="1.5" strokeLinecap="round"
            />
          ))}
          <circle cx="12" cy="12" r="4.5" fill={SUN_YEL} stroke={INK} strokeWidth="1.5" />
        </svg>
      )
    case "partly-cloudy":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          <circle cx="9" cy="10" r="4" fill={SUN_YEL} stroke={INK} strokeWidth="1.2" />
          <path d="M9 17 C5 17,2 15,3 11 C4 8,7 7,10 8 C11 4,15 2,19 4 C22 5,23 9,21 13 C22 14,23 17,21 18 C20 19,17 20,15 19 L9 19 Z"
            fill="white" stroke={INK} strokeWidth="1.2" />
        </svg>
      )
    case "cloudy":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          <path d="M4 18 C1 18,-1 15,0 12 C1 10,3 9,6 9 C6 5,10 2,14 4 C17 5,18 8,17 11 C19 11,21 13,20 16 C19 18,17 19,15 19 L4 19 Z"
            fill="white" stroke={INK} strokeWidth="1.2" />
        </svg>
      )
    case "rainy":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          <path d="M4 14 C1 14,-1 12,0 9 C1 6,4 5,7 6 C8 2,12 0,16 2 C19 3,20 7,19 10 C21 11,22 13,20 15 C19 17,17 17,15 17 L4 14 Z"
            fill={SKY_RAIN} stroke={INK} strokeWidth="1.2" />
          {[8, 13, 18].map((x, i) => (
            <path key={i} d={`M${x} 18 L${x - 1} 22 Q${x} 24 ${x + 1} 22 Z`} fill={RAIN_BLU} stroke={INK} strokeWidth="0.8" />
          ))}
        </svg>
      )
    case "snowy":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          <path d="M4 14 C1 14,-1 12,0 9 C1 6,4 5,7 6 C8 2,12 0,16 2 C19 3,20 7,19 10 C21 11,22 13,20 15 C19 17,17 17,15 17 L4 14 Z"
            fill={SKY_SNOW} stroke={INK} strokeWidth="1.2" />
          {[8, 13, 18].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="19" x2={x} y2="23" stroke={RAIN_BLU} strokeWidth="1" strokeLinecap="round" />
              <line x1={x - 2} y1="21" x2={x + 2} y2="21" stroke={RAIN_BLU} strokeWidth="1" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )
    case "stormy":
      return (
        <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
          <path d="M4 14 C1 14,-1 12,0 9 C1 6,4 5,7 6 C8 2,12 0,16 2 C19 3,20 7,19 10 C21 11,22 13,20 15 C19 17,17 17,15 17 L4 14 Z"
            fill={SKY_STORM} stroke={INK} strokeWidth="1.2" />
          <path d="M13 15 L10 20 L13 20 L9 25 L15 18 L12 18 Z" fill={SUN_YEL} stroke={INK} strokeWidth="0.8" />
        </svg>
      )
  }
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "10px 16px",
      background: "rgba(255,255,255,0.6)",
      border: `1.5px solid ${INK}22`,
      borderRadius: 10, minWidth: 72,
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: "'DM Mono','Fira Mono',monospace", fontWeight: 600, fontSize: 14, color: INK, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: F, fontSize: 9, color: PENCIL, letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  )
}

// ─── Forecast row — H:/L: labelled, proportional range bar ───────────────────
function ForecastRow({ day, state, hi, lo, isCelsius, isToday, rangeMin, rangeMax }: {
  day: string; state: WeatherState; hi: number; lo: number
  isCelsius: boolean; isToday: boolean; rangeMin: number; rangeMax: number
}) {
  const hiTemp = isCelsius ? hi : toF(hi)
  const loTemp = isCelsius ? lo : toF(lo)
  const rMin   = isCelsius ? rangeMin : toF(rangeMin)
  const rMax   = isCelsius ? rangeMax : toF(rangeMax)
  const span   = Math.max(rMax - rMin, 1)
  const barL   = `${Math.max(0, Math.round(((loTemp - rMin) / span) * 100))}%`
  const barR   = `${Math.max(0, Math.round(((rMax - hiTemp) / span) * 100))}%`

  return (
    <div className="dw-forecast-row" style={{
      display: "grid",
      gridTemplateColumns: "52px 30px 1fr 90px",
      alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8,
      background: isToday ? `${SUN_YEL}30` : "transparent",
      border: isToday ? `1.5px solid ${SUN_YEL}80` : "1.5px solid transparent",
    }}>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? INK : INK_MID }}>
        {isToday ? "Today" : day}
      </span>
      <TinyIcon state={state} />
      {/* Proportional temperature range bar */}
      <div style={{ position: "relative", height: 5, background: `${INK}12`, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: barL, right: barR, top: 0, bottom: 0,
          background: `linear-gradient(90deg, ${RAIN_BLU}99, ${SUN_YEL}dd)`,
          borderRadius: 3, minWidth: 4,
        }} />
      </div>
      {/* H: and L: labelled temps */}
      <div style={{ display: "flex", gap: 3, justifyContent: "flex-end", alignItems: "baseline" }}>
        <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, color: PENCIL }}>H</span>
        <span style={{ fontFamily: "'DM Mono','Fira Mono',monospace", fontSize: 13, fontWeight: 700, color: INK }}>
          {hiTemp}&deg;
        </span>
        <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, color: INK_MID, marginLeft: 3 }}>L</span>
        <span style={{ fontFamily: "'DM Mono','Fira Mono',monospace", fontSize: 11, color: INK_MID }}>
          {loTemp}&deg;
        </span>
      </div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 16, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: `${INK}0E`,
      animation: "dw-pulse 1.5s ease-in-out infinite",
    }} />
  )
}

// ─── State screens ────────────────────────────────────────────────────────────
function StateScreen({ icon, title, subtitle, action, actionLabel }: {
  icon: string; title: string; subtitle: string; action?: () => void; actionLabel?: string
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 10, padding: "48px 28px", textAlign: "center",
    }}>
      <span style={{ fontSize: 44, lineHeight: 1, marginBottom: 4 }}>{icon}</span>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: INK }}>{title}</div>
      <div style={{ fontFamily: F, fontSize: 12, color: INK_MID, maxWidth: 280, lineHeight: 1.6 }}>{subtitle}</div>
      {action && actionLabel && (
        <button
          onClick={action}
          style={{
            marginTop: 8, cursor: "pointer",
            border: `1.5px solid ${INK}`,
            background: INK, color: PAPER, borderRadius: 8,
            padding: "8px 18px", fontFamily: F, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoodleWeather() {
  const [celsius, setCelsius] = useState(true)
  const [phase, setPhase]     = useState<LoadPhase>("idle")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [errorMsg, setError]  = useState("")
  const [updatedLabel, setUpdatedLabel] = useState("Updated just now")
  const hasFetched = useRef(false)

  // ── Keep "updated X min ago" fresh ──────────────────────────────────────
  useEffect(() => {
    if (!weather?.updatedAt) return
    const tick = () => setUpdatedLabel(relativeTime(weather.updatedAt))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [weather?.updatedAt])

  // ── Fetch weather data given coords ─────────────────────────────────────
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setPhase("fetching")
    try {
      const res = await fetch(`/api/weather?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      const data: WeatherData = await res.json()
      setWeather(data)
      setPhase("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setPhase("error")
    }
  }, [])

  // ── Request geolocation, then fetch ─────────────────────────────────────
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPhase("geo-unavailable")
      return
    }
    setPhase("locating")
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPhase("geo-denied")
        } else {
          setError("Could not determine location.")
          setPhase("error")
        }
      },
      { timeout: 10_000, maximumAge: 300_000 }
    )
  }, [fetchWeather])

  // ── Auto-trigger on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    requestLocation()
  }, [requestLocation])

  const toggleUnit = useCallback(() => setCelsius((c) => !c), [])

  // ── Derived ──────────────────────────────────────────────────────────────
  const curTemp   = weather ? (celsius ? weather.temp  : toF(weather.temp))  : null
  const feelsTemp = weather ? (celsius ? weather.feels : toF(weather.feels)) : null
  const skyBg     = weather ? SKY_MAP[weather.state] : SKY_CLOUD
  const todayDate = new Date().toDateString()
  const todayIdx  = weather
    ? weather.forecast.findIndex((d) => new Date(d.date + "T12:00:00Z").toDateString() === todayDate)
    : -1
  const rangeMin  = weather ? Math.min(...weather.forecast.map((d) => d.lo)) : 0
  const rangeMax  = weather ? Math.max(...weather.forecast.map((d) => d.hi)) : 40

  // ── Render ───────────────────────────────────────────────────────────────
  // Single root div (no fragment) so the card's flex justify-center
  // correctly centers this one element.
  return (
    <div
      className="dw-root"
      style={{ width: "min(420px, 100%)", fontFamily: F, padding: "20px 16px" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .dw-root { animation: dw-enter 400ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes dw-enter {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dw-sun-spin {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        @keyframes dw-rain-fall {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(18px); opacity: 0.4; }
          100% { transform: translateY(22px); opacity: 0; }
        }
        @keyframes dw-snow-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(20px) rotate(60deg); opacity: 0; }
        }
        @keyframes dw-lightning-flash {
          0%,70%,100% { opacity: 1; } 75% { opacity: 0.1; }
          80% { opacity: 1; } 85% { opacity: 0.2; } 90% { opacity: 1; }
        }
        @keyframes dw-pulse {
          0%,100% { opacity: 0.5; } 50% { opacity: 1; }
        }
        .dw-unit-btn {
          cursor: pointer; border: none; background: none;
          padding: 4px 10px; border-radius: 6px;
          font-family: 'DM Mono','Fira Mono',monospace;
          font-size: 12px; font-weight: 700; color: ${INK_MID};
          transition: background 150ms ease-out, color 150ms ease-out;
          letter-spacing: 0.04em;
        }
        .dw-unit-btn.active { background: ${INK}; color: ${PAPER}; }
        @media (hover: hover) and (pointer: fine) {
          .dw-unit-btn:not(.active):hover { background: ${INK}18; color: ${INK}; }
          .dw-forecast-row:hover { background: ${INK}08 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dw-root { animation: none; }
          @keyframes dw-sun-spin    { from { transform: none; } to { transform: none; } }
          @keyframes dw-rain-fall   { 0%,100% { opacity: 1; transform: none; } }
          @keyframes dw-snow-fall   { 0%,100% { opacity: 1; transform: none; } }
          @keyframes dw-lightning-flash { 0%,100% { opacity: 1; } }
          @keyframes dw-pulse       { 0%,100% { opacity: 0.6; } }
        }
      `}</style>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      <div style={{
        background: PAPER, borderRadius: 20, overflow: "hidden",
        border: `1.8px solid ${INK}`,
        boxShadow: `4px 4px 0 ${INK}22, 8px 8px 0 ${INK}0A`,
      }}>

        {/* ── Sky hero ────────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(160deg, ${skyBg} 0%, ${PAPER} 100%)`,
          padding: "28px 28px 20px", position: "relative", overflow: "hidden",
          transition: "background 600ms ease",
        }}>
          {/* Dot-grid texture */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }} aria-hidden>
            <defs>
              <pattern id="dw-dotgrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill={PENCIL} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dw-dotgrid)" />
          </svg>

          {/* Top bar: location + unit toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, position: "relative" }}>
            <div>
              {phase === "done" && weather ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: PENCIL, textTransform: "uppercase" }}>
                    {"📍 "}{weather.location}
                  </div>
                  <div style={{ fontSize: 9, color: INK_MID, marginTop: 2, fontWeight: 500 }}>
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Skeleton w={110} h={10} />
                  <Skeleton w={80} h={8} />
                </div>
              )}
            </div>

            {/* Unit toggle */}
            <div style={{
              display: "inline-flex", background: `${INK}0A`,
              border: `1.5px solid ${INK}20`, borderRadius: 8, padding: 2, gap: 2,
            }}>
              <button id="dw-celsius-btn"
                className={`dw-unit-btn${celsius ? " active" : ""}`}
                onClick={toggleUnit} aria-pressed={celsius} aria-label="Celsius">
                &deg;C
              </button>
              <button id="dw-fahrenheit-btn"
                className={`dw-unit-btn${!celsius ? " active" : ""}`}
                onClick={toggleUnit} aria-pressed={!celsius} aria-label="Fahrenheit">
                &deg;F
              </button>
            </div>
          </div>

          {/* Hero: illustration + temp */}
          {phase === "done" && weather ? (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <WeatherIllustration state={weather.state} size={120} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'DM Mono','Fira Mono',monospace",
                  fontSize: "clamp(52px,10vw,68px)",
                  fontWeight: 800, lineHeight: 0.9, color: INK, letterSpacing: "-0.04em",
                }}>
                  {curTemp}<span style={{ fontSize: "0.45em", verticalAlign: "super", letterSpacing: 0 }}>&deg;</span>
                </div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: PENCIL, marginTop: 8 }}>
                  {LABEL_MAP[weather.state]}
                </div>
                <div style={{ fontSize: 10, color: INK_MID, marginTop: 3, fontWeight: 500 }}>
                  {capitalize(weather.description)}&nbsp;&middot;&nbsp;Feels {feelsTemp}&deg;
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, paddingBottom: 8 }}>
              <Skeleton w={110} h={100} r={12} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <Skeleton w={90} h={52} r={8} />
                <Skeleton w={70} h={14} r={4} />
                <Skeleton w={110} h={10} r={4} />
              </div>
            </div>
          )}
        </div>

        {/* ── Error / denied states ────────────────────────────────────────── */}
        {(phase === "geo-denied" || phase === "geo-unavailable" || phase === "error") ? (
          <StateScreen
            icon={phase === "geo-denied" ? "🔒" : phase === "geo-unavailable" ? "📡" : "⚡"}
            title={
              phase === "geo-denied"        ? "Location access denied"
              : phase === "geo-unavailable" ? "Geolocation unavailable"
              : "Couldn't load weather"
            }
            subtitle={
              phase === "geo-denied"
                ? "Allow location access in your browser to see live weather."
                : phase === "geo-unavailable"
                ? "Your browser doesn't support geolocation."
                : errorMsg || "Something went wrong. Check your connection and try again."
            }
            action={phase !== "geo-unavailable" ? requestLocation : undefined}
            actionLabel={phase === "geo-denied" ? "Try again" : "Retry"}
          />
        ) : (
          <>
            {/* Wavy divider */}
            <svg viewBox="0 0 420 12" width="100%" height="12" aria-hidden style={{ display: "block", marginTop: -1 }}>
              <path d="M0 6 C28 3,57 9,85 6 C113 3,141 9,169 6 C197 3,225 9,253 6 C281 3,309 9,337 6 C365 3,393 9,420 6"
                stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" />
            </svg>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "14px 20px 16px", flexWrap: "wrap" }}>
              {phase === "done" && weather ? (
                <>
                  <StatPill icon="💧" label="Humidity" value={`${weather.humidity}%`} />
                  <StatPill icon="💨" label="Wind"     value={`${weather.windKph} km/h`} />
                  <StatPill icon="🌡️" label="Feels"    value={`${feelsTemp}\u00b0`} />
                </>
              ) : (
                [72, 72, 72].map((w, i) => <Skeleton key={i} w={w} h={82} r={10} />)
              )}
            </div>

            {/* Dotted divider */}
            <div style={{
              margin: "0 20px", height: 1,
              background: `repeating-linear-gradient(90deg, ${INK}20 0, ${INK}20 4px, transparent 4px, transparent 10px)`,
            }} />

            {/* Forecast */}
            <div style={{ padding: "14px 14px 20px" }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                color: PENCIL, textTransform: "uppercase", marginBottom: 8, paddingLeft: 12,
              }}>
                {phase === "done" && weather ? `${weather.forecast.length}-Day Forecast` : "Forecast"}
              </div>

              {phase === "done" && weather ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {weather.forecast.map((day, i) => (
                    <ForecastRow
                      key={day.date}
                      day={day.day}
                      state={day.state as WeatherState}
                      hi={day.hi}
                      lo={day.lo}
                      isCelsius={celsius}
                      isToday={i === (todayIdx >= 0 ? todayIdx : 0)}
                      rangeMin={rangeMin}
                      rangeMax={rangeMax}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 12px" }}>
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={32} r={8} />)}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{
          borderTop: `1px dashed ${INK}20`, padding: "10px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden>
              <path d="M3 15 L6 9 L13 4 L16 7 L9 14 Z" fill={SUN_YEL} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M13 4 L16 7 L14 9 L11 6 Z" fill={PENCIL} stroke={INK} strokeWidth="1.2" />
              <path d="M3 15 L6 9 L5 16 Z" fill={INK} opacity="0.4" />
              <line x1="3" y1="15" x2="1" y2="18" stroke={INK} strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 9, color: INK_MID, fontStyle: "italic", letterSpacing: "0.03em" }}>
              doodle weather
            </span>
          </div>
          <span style={{ fontSize: 9, color: PENCIL, fontWeight: 600 }}>
            {phase === "done"
              ? updatedLabel
              : phase === "locating"
              ? "Locating..."
              : phase === "fetching"
              ? "Fetching..."
              : "\u2014"}
          </span>
        </div>
      </div>

      {/* Paper shadow */}
      <div style={{ height: 6, marginTop: -2, background: `linear-gradient(${INK}08, transparent)`, borderRadius: "0 0 12px 12px" }} />
    </div>
  )
}

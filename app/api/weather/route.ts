import { NextRequest, NextResponse } from "next/server"

// ─── Types mirrored from OWM API responses ────────────────────────────────────
interface OWMWeather {
  id: number
  main: string
  description: string
  icon: string
}

interface OWMCurrent {
  coord: { lat: number; lon: number }
  weather: OWMWeather[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  wind: { speed: number }
  name: string
  sys: { country: string }
  dt: number
}

interface OWMForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
  }
  weather: OWMWeather[]
  dt_txt: string
}

interface OWMForecast {
  list: OWMForecastItem[]
  city: { name: string; country: string }
}

// ─── Map OWM weather condition codes → our WeatherState ──────────────────────
// https://openweathermap.org/weather-conditions
function mapConditionCode(id: number): string {
  if (id >= 200 && id < 300) return "stormy"       // Thunderstorm
  if (id >= 300 && id < 600) return "rainy"         // Drizzle + Rain
  if (id >= 600 && id < 700) return "snowy"         // Snow
  if (id === 800)             return "sunny"         // Clear sky
  if (id === 801)             return "partly-cloudy" // Few clouds
  if (id >= 802 && id <= 804) return "cloudy"        // Broken/overcast
  return "cloudy"                                    // Fog / haze / dust → fallback
}

// ─── Extract one representative entry per day from 3h forecast list ───────────
// Prefers the 12:00 UTC slot; falls back to whatever's available for that date.
function buildDailyForecast(list: OWMForecastItem[]) {
  const byDate = new Map<string, OWMForecastItem[]>()
  for (const item of list) {
    const date = item.dt_txt.slice(0, 10) // "YYYY-MM-DD"
    if (!byDate.has(date)) byDate.set(date, [])
    byDate.get(date)!.push(item)
  }

  const days: {
    day: string
    state: string
    hi: number
    lo: number
    date: string
  }[] = []

  for (const [date, items] of byDate) {
    // Pick noon slot or first available
    const noon = items.find((i) => i.dt_txt.includes("12:00:00")) ?? items[0]
    const hi = Math.round(Math.max(...items.map((i) => i.main.temp_max)))
    const lo = Math.round(Math.min(...items.map((i) => i.main.temp_min)))
    // Use the most severe weather condition of the day
    const worstId = items
      .map((i) => i.weather[0]?.id ?? 800)
      .reduce((a, b) => {
        // thunderstorm > rain > snow > cloudy > clear
        const rank = (id: number) => {
          if (id >= 200 && id < 300) return 5
          if (id >= 300 && id < 600) return 4
          if (id >= 600 && id < 700) return 3
          if (id >= 802)             return 2
          if (id === 801)            return 1
          return 0
        }
        return rank(a) >= rank(b) ? a : b
      })
    days.push({
      day: new Date(date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short" }),
      state: mapConditionCode(worstId),
      hi,
      lo,
      date,
    })
  }

  // Return up to 7 days (OWM free gives 5 days / 3h = 40 slots ≈ 5-6 days)
  return days.slice(0, 7)
}

// ─── GET /api/weather?lat=...&lon=... ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon query params are required" },
      { status: 400 }
    )
  }

  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Weather service is not configured" },
      { status: 503 }
    )
  }

  const base = "https://api.openweathermap.org/data/2.5"
  const params = `lat=${lat}&lon=${lon}&appid=${key}&units=metric`

  try {
    // Parallel fetch: current + forecast
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${base}/weather?${params}`, { next: { revalidate: 60 } }), // 1 min cache
      fetch(`${base}/forecast?${params}`, { next: { revalidate: 60 } }),
    ])

    if (!currentRes.ok || !forecastRes.ok) {
      const status = !currentRes.ok ? currentRes.status : forecastRes.status
      return NextResponse.json(
        { error: `OpenWeatherMap API error (${status})` },
        { status: 502 }
      )
    }

    const [current, forecast]: [OWMCurrent, OWMForecast] = await Promise.all([
      currentRes.json(),
      forecastRes.json(),
    ])

    // ── Shape the response payload ────────────────────────────────────────────
    const payload = {
      location: `${current.name}, ${current.sys.country}`,
      state: mapConditionCode(current.weather[0]?.id ?? 800),
      temp: Math.round(current.main.temp),
      feels: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      windKph: Math.round(current.wind.speed * 3.6), // m/s → km/h
      description: current.weather[0]?.description ?? "",
      updatedAt: new Date(current.dt * 1000).toISOString(),
      forecast: buildDailyForecast(forecast.list),
    }

    return NextResponse.json(payload, {
      headers: {
        // cache at CDN level for 1 min; stale-while-revalidate 60 s
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
      },
    })
  } catch (err) {
    console.error("[/api/weather]", err)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}

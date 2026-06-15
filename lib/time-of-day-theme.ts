export type TimeOfDayThemeId = "morning" | "afternoon" | "evening" | "night";

export interface TimeOfDayTheme {
  id: TimeOfDayThemeId;
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
  hero: {
    colorBottom: string;
    colorMid: string;
    colorTop: string;
    speed: number;
    text: string;
    mutedText: string;
    veil: string;
    atmosphere: string;
  };
  page: {
    surface: string;
    surfaceTo: string;
    accent: string;
    text: string;
    mutedText: string;
    panel: string;
    border: string;
  };
}

const IST_TIME_ZONE = "Asia/Kolkata";

export const timeOfDayThemes: Record<TimeOfDayThemeId, TimeOfDayTheme> = {
  morning: {
    id: "morning",
    label: "Morning",
    eyebrow: "Morning sky",
    headline: "A clear first light for your page.",
    description:
      "Soft blue, quiet white, and enough air around the hero to make the canvas feel calm instead of decorative.",
    hero: {
      colorBottom: "#7cc8ec",
      colorMid: "#eef8ff",
      colorTop: "#fffaf1",
      speed: 0.78,
      text: "oklch(0.22 0.035 245)",
      mutedText: "oklch(0.42 0.055 235 / 0.78)",
      veil:
        "linear-gradient(180deg, oklch(0.99 0.02 210 / 0.08), oklch(0.96 0.045 85 / 0.48))",
      atmosphere:
        "radial-gradient(ellipse at 22% 18%, oklch(0.99 0.035 90 / 0.42), transparent 42%)",
    },
    page: {
      surface: "oklch(0.985 0.018 220)",
      surfaceTo: "oklch(0.955 0.034 205)",
      accent: "oklch(0.7 0.11 215)",
      text: "oklch(0.22 0.032 245)",
      mutedText: "oklch(0.44 0.042 235)",
      panel: "oklch(0.995 0.012 210 / 0.72)",
      border: "oklch(0.82 0.045 215 / 0.52)",
    },
  },
  afternoon: {
    id: "afternoon",
    label: "Afternoon",
    eyebrow: "High noon brightness",
    headline: "A brighter sky with room to breathe.",
    description:
      "The afternoon variant leans luminous, with a hotter upper glow and clearer contrast below the fold.",
    hero: {
      colorBottom: "#45b3f5",
      colorMid: "#d6f0ff",
      colorTop: "#e8f6ff",
      speed: 0.92,
      text: "oklch(0.2 0.032 248)",
      mutedText: "oklch(0.39 0.048 238 / 0.76)",
      veil:
        "linear-gradient(180deg, oklch(0.97 0.035 215 / 0.12), oklch(0.98 0.038 205 / 0.32))",
      atmosphere:
        "radial-gradient(ellipse at 72% 20%, oklch(0.97 0.055 215 / 0.52), transparent 46%)",
    },
    page: {
      surface: "oklch(0.985 0.022 215)",
      surfaceTo: "oklch(0.962 0.030 210)",
      accent: "oklch(0.62 0.14 222)",
      text: "oklch(0.2 0.032 248)",
      mutedText: "oklch(0.42 0.04 235)",
      panel: "oklch(0.995 0.016 215 / 0.76)",
      border: "oklch(0.82 0.048 215 / 0.46)",
    },
  },
  evening: {
    id: "evening",
    label: "Evening",
    eyebrow: "Sunset tilt",
    headline: "A warm horizon for the close of day.",
    description:
      "Peach, amber, and softened blue keep the sunset emotional without making the page feel heavy.",
    hero: {
      colorBottom: "#2c1850",
      colorMid: "#9e6695",
      colorTop: "#2c1850",
      speed: 0.7,
      text: "oklch(0.18 0.04 30)",
      mutedText: "oklch(0.36 0.055 35 / 0.80)",
      veil:
        "linear-gradient(180deg, oklch(0.18 0.12 285 / 0.28), oklch(0.86 0.14 55 / 0.34))",
      atmosphere:
        "radial-gradient(ellipse at 50% 94%, oklch(0.90 0.16 56 / 0.68), transparent 44%)",
    },
    page: {
      surface: "oklch(0.960 0.036 50)",
      surfaceTo: "oklch(0.925 0.058 44)",
      accent: "oklch(0.65 0.15 44)",
      text: "oklch(0.20 0.042 30)",
      mutedText: "oklch(0.42 0.055 42)",
      panel: "oklch(0.988 0.028 55 / 0.72)",
      border: "oklch(0.78 0.078 48 / 0.46)",
    },
  },
  night: {
    id: "night",
    label: "Night",
    eyebrow: "Night sky",
    headline: "A darker sky with a real night mood.",
    description:
      "The night variant drops into deep blue-black clouds, low glare, and a quieter surface below the hero.",
    hero: {
      colorBottom: "#071426",
      colorMid: "#10213b",
      colorTop: "#020713",
      speed: 0.52,
      text: "oklch(0.94 0.018 230)",
      mutedText: "oklch(0.78 0.034 235 / 0.78)",
      veil:
        "linear-gradient(180deg, oklch(0.1 0.04 250 / 0.16), oklch(0.08 0.035 250 / 0.72))",
      atmosphere:
        "radial-gradient(circle at 18% 22%, oklch(0.94 0.04 245 / 0.72) 0 1px, transparent 2px), radial-gradient(circle at 64% 18%, oklch(0.9 0.05 235 / 0.52) 0 1px, transparent 2px), radial-gradient(circle at 78% 44%, oklch(0.86 0.055 240 / 0.46) 0 1px, transparent 2px)",
    },
    page: {
      surface: "oklch(0.115 0.035 250)",
      surfaceTo: "oklch(0.175 0.045 272)",
      accent: "oklch(0.66 0.12 250)",
      text: "oklch(0.94 0.018 230)",
      mutedText: "oklch(0.72 0.036 238)",
      panel: "oklch(0.2 0.04 252 / 0.62)",
      border: "oklch(0.42 0.075 248 / 0.38)",
    },
  },
};

export function getIstHour(date: Date) {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIME_ZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(date);

  return Number.parseInt(hour, 10);
}

export function getTimeOfDayThemeIdFromHour(hour: number): TimeOfDayThemeId {
  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 20) {
    return "evening";
  }

  return "night";
}

export function getTimeOfDayTheme(date: Date) {
  return timeOfDayThemes[getTimeOfDayThemeIdFromHour(getIstHour(date))];
}

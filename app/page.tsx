import { TimeAwareCloudscapeHome } from "@/components/time-aware-cloudscape-home";
import {
  getTimeOfDayTheme,
  timeOfDayThemes,
  type TimeOfDayThemeId,
} from "@/lib/time-of-day-theme";

const VALID_THEME_IDS: TimeOfDayThemeId[] = [
  "morning",
  "afternoon",
  "evening",
  "night",
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawTheme = typeof params.theme === "string" ? params.theme : undefined;
  const forceId =
    rawTheme && VALID_THEME_IDS.includes(rawTheme as TimeOfDayThemeId)
      ? (rawTheme as TimeOfDayThemeId)
      : null;

  const initialTheme = forceId
    ? timeOfDayThemes[forceId]
    : getTimeOfDayTheme(new Date());

  return <TimeAwareCloudscapeHome initialTheme={initialTheme} />;
}

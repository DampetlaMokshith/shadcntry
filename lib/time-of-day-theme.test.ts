import assert from "node:assert/strict";
import test from "node:test";
import {
  getTimeOfDayTheme,
  getTimeOfDayThemeIdFromHour,
} from "./time-of-day-theme";

test("selects morning from 5:00 through 11:59 IST", () => {
  assert.equal(getTimeOfDayThemeIdFromHour(5), "morning");
  assert.equal(getTimeOfDayThemeIdFromHour(11), "morning");
});

test("selects afternoon from 12:00 through 16:59 IST", () => {
  assert.equal(getTimeOfDayThemeIdFromHour(12), "afternoon");
  assert.equal(getTimeOfDayThemeIdFromHour(16), "afternoon");
});

test("selects evening from 17:00 through 19:59 IST", () => {
  assert.equal(getTimeOfDayThemeIdFromHour(17), "evening");
  assert.equal(getTimeOfDayThemeIdFromHour(19), "evening");
});

test("selects night from 20:00 through 4:59 IST", () => {
  assert.equal(getTimeOfDayThemeIdFromHour(20), "night");
  assert.equal(getTimeOfDayThemeIdFromHour(23), "night");
  assert.equal(getTimeOfDayThemeIdFromHour(0), "night");
  assert.equal(getTimeOfDayThemeIdFromHour(4), "night");
});

test("returns the same theme object as the selected time band", () => {
  const evening = getTimeOfDayTheme(new Date("2026-06-07T13:00:00.000Z"));

  assert.equal(evening.id, "evening");
  assert.equal(evening.label, "Evening");
  assert.match(evening.hero.colorBottom, /^#[0-9a-f]{6}$/i);
  assert.match(evening.page.surface, /^oklch\(/);
});

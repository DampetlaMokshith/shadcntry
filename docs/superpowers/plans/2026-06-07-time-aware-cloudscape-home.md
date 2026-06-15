# Time-Aware Cloudscape Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage with a time-aware Cloudscape hero and matching page background system.

**Architecture:** Keep the WebGL Cloudscape component unchanged. Add a pure theme utility for IST time bands, then use it from a dynamic homepage route and a focused client component to select hero sky colors and OKLCH page gradients.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, existing Cloudscape WebGL component.

---

### Task 1: Time Theme Utility

**Files:**
- Create: `lib/time-of-day-theme.ts`
- Test: `lib/time-of-day-theme.test.ts`

- [ ] **Step 1: Write the failing test**

Create a Node test that verifies the four IST time bands and their theme IDs.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsc lib/time-of-day-theme.test.ts --module commonjs --target es2022 --moduleResolution node --esModuleInterop --outDir .tmp-time-theme-tests`

Expected: fail because `lib/time-of-day-theme.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `lib/time-of-day-theme.ts` with `getIstHour`, `getTimeOfDayThemeIdFromHour`, `getTimeOfDayTheme`, and the four theme definitions.

- [ ] **Step 4: Run test to verify it passes**

Run compile and Node test:

```bash
npx tsc lib/time-of-day-theme.ts lib/time-of-day-theme.test.ts --module commonjs --target es2022 --moduleResolution node --esModuleInterop --outDir .tmp-time-theme-tests
node --test .tmp-time-theme-tests/lib/time-of-day-theme.test.js
```

Expected: pass.

### Task 2: Homepage Replacement

**Files:**
- Modify: `app/page.tsx`
- Create: `components/time-aware-cloudscape-home.tsx`

- [ ] **Step 1: Replace card placeholder page**

Keep `app/page.tsx` as a Server Component, call `await connection()`, pass `getTimeOfDayTheme(new Date())` into `TimeAwareCloudscapeHome`, and render the full-height hero with `Cloudscape`.

- [ ] **Step 2: Add page section gradient**

Use CSS custom properties from the active theme and Tailwind arbitrary values for OKLCH background gradients.

- [ ] **Step 3: Verify TypeScript and production build**

Run: `npm run build`

Expected: exit code 0.

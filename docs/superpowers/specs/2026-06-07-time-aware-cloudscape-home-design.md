# Time-Aware Cloudscape Home Design

**Goal:** Replace the homepage with a time-aware hero whose Cloudscape sky changes by IST, with the page below inheriting a matching seasonal surface.

**Context:** The project uses Next.js 16.2.6, React 19.2.4, TypeScript, Tailwind CSS, and shadcn/ui. The existing `components/forgeui/cloudscape.tsx` component is a client WebGL canvas that accepts hex sky colors, speed, height, and class names.

## Design Direction

The homepage is primarily a background template. Content is secondary and should be minimal enough to judge the atmosphere. The hero fills the first viewport and uses `Cloudscape` only inside that hero. The section below starts after the hero and receives a matching OKLCH-based gradient surface.

## Time Bands

All time checks use `Asia/Kolkata`.

- Morning, 5:00 to 11:59 IST: airy blue and soft white cloudscape. Below: clean light surface with a cool OKLCH gradient.
- Afternoon, 12:00 to 16:59 IST: brighter and higher-energy sky. Below: luminous light surface with a slightly warm OKLCH gradient.
- Evening, 17:00 to 19:59 IST: peach, amber, and soft orange sunset tilt. Below: cream-orange OKLCH gradient.
- Night, 20:00 to 4:59 IST: deep navy cloudscape with a real night feel. Below: dark blue-violet OKLCH gradient.

## Architecture

- `lib/time-of-day-theme.ts` owns the time band logic and theme tokens.
- `app/page.tsx` remains the homepage route, waits for the request with Next's `connection()` API, and passes the current IST theme into the client surface.
- `components/time-aware-cloudscape-home.tsx` renders the Cloudscape hero and keeps the theme fresh after hydration.
- `components/forgeui/cloudscape.tsx` stays unchanged. It already accepts the required sky colors.

## Visual Rules

- Use OKLCH for page surfaces and overlays.
- Use hex values only when passing colors into `Cloudscape`, because that is the current component API.
- Keep the hero background full-bleed and unframed.
- Do not put the hero in a card.
- Keep section content light and simple so the background system remains the focus.
- Avoid one-note palettes by giving each time band a distinct color temperature and surface contrast.

## Accessibility And Performance

- The Cloudscape canvas remains `aria-hidden`.
- Hero text contrast changes per time band.
- Runtime updates should be low frequency. Render the first theme at request time, recompute on mount, then update periodically, not every animation frame.
- The homepage keeps most styling in Tailwind classes and inline CSS custom properties for theme values.

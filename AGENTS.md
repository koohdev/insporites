<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Component & Theme Rules

## 1. Explicit Tailwind Theme Utilities (No Undefined CSS Variables)
- Always use explicit Tailwind utility classes for light and dark modes (e.g., `bg-neutral-900 text-white dark:bg-white dark:text-neutral-900`, `border-neutral-200 dark:border-neutral-800`, `bg-white dark:bg-neutral-900`).
- Do NOT use generic theme CSS variables (`bg-primary`, `bg-muted`, `border-border`, `bg-card`) unless `--primary` / `--border` CSS variables are explicitly bound in `globals.css`.

## 2. High-Contrast Text in Dark Mode
- When `isDark` is true or inside `dark:` mode, titles, text descriptions, and interactive icons MUST use crisp high-contrast pure white (`text-white` or `text-white/90`), never dim grey (`text-neutral-400`/`text-neutral-500`).

## 3. Preview Component Fidelity & Frameless Layouts
- Component previews MUST render all documented usage examples from `docs/*.md` frameless within `ComponentCard`.
- Do NOT add duplicate outer headers, redundant titles/subtitles, or nested card borders inside the preview component — `ComponentCard` already provides outer borders, titles, categories, and theme toggles.

## 4. Card Theme Context Adaptability
- Preview components rendered inside `ComponentCard` MUST consume `useCardTheme()` from `@/components/component-card` (e.g. `const isDark = useCardTheme() === "dark"`).
- Do NOT add standalone duplicate theme toggle buttons inside the preview component. The preview must react seamlessly when the user clicks the theme toggle in the `ComponentCard` header. Ensure text, icons, and switch controls use high-contrast white text (`text-white`) when rendered inside a dark card `#151515`.

## 5. Dropdown & Popover Scroll Safety
- Never apply hardcoded inline `style={{ overflow: "hidden" }}` to animated popovers or select panels (`SelectContent`) containing scrollable item lists. Inline styles override CSS classes like `overflow-y-auto` and block scrolling. Use `overflowY: open ? "auto" : "hidden"`.

## 6. Popover Subpixel Trigger Width Matching
- Do NOT pass hardcoded Tailwind width classes (e.g., `w-72`) to popover or combobox content containers if they override calculated trigger widths. Use inline `width: triggerWidth, minWidth: triggerWidth` to guarantee exact pixel alignment.

## 7. Next.js Layout Hydration Guard
- Always include `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx` to handle browser extension attribute injections safely.

## 8. Pre-Calculated Grid Heights & Zero Component Truncation
- Before assigning card spans (`2x2`, `4x2`) or wrapper constraints in `app/page.tsx`, ALWAYS calculate the total vertical height required by the rendered component (including dropzones, item rows, status indicators, and outer card wrappers like `Upload package`).
- For multi-pattern or tall components (e.g. `file-upload`), assign an expanded card span min-height (e.g. `4x2 min-h-[720px]`) and inner wrapper bounds (`min-h-[580px]`).
- NEVER use restrictive fixed heights (`h-[540px]`) that clip, truncate, or hide bottom rows, progress bars, or outer card wrappers from the user's view.
- Enforce `h-full flex flex-col flex-1` on outer grid card containers (`Frame`, `FramePanel`) so grid cards stretch to occupy 100% of the available vertical grid cell height.

## 9. Sound Opportunity Auditing & Web Audio Integration
- When building or refactoring components, ALWAYS evaluate sound interaction opportunities (hover, click, drag, snap, step, open, collapse).
- Choose appropriate audio mode:
  1. **Standard Tick Sound** (`createTickPlayer().play()`): for step scrolling, wheel pickers, rail item hovers, sliders, notch snapping.
  2. **Customized Tick / Tone** (`createTickPlayer().playHover()`, `createTickPlayer().playClick()`): for card hover entries, button clicks, popovers, notification stacks.
  3. **Custom Synthesized Web Audio Tone** (e.g., sine/triangle ramp tones): for state chimes (check, uncheck, open, collapse, message send).
- Always expose an optional `sound?: boolean` prop (default `true`) for user toggles and accessible control.

## 10. Responsive Sub-Element Stacking for Metric Displays
- When designing metric cards or panels with gauges, avatars, and text, ensure sub-elements do not collide on narrow column widths (`<640px` or 1-column layouts).
- Use responsive flex/grid direction (`flex flex-col sm:grid sm:grid-cols-[1fr_auto]`) to stack text/avatars on top and place the gauge centered at the bottom on small screens.


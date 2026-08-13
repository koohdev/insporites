---
title: "404 Bouncy Accordion"
description: "Interactive onboarding checklist featuring weighted spring layout physics, zero-latency Web Audio sound feedback, icon-click next card auto-opening, 100% width step navigation, and smooth auto-collapse on onboarding completion."
category: "Components"
source: "Paper Design (Get started with 404)"
publishedAt: "2026-08-12"
updatedAt: "2026-08-12"
license: "MIT"
---

# 404 Bouncy Accordion

> Single-open onboarding checklist accordion sourced from Paper Design ("Get started with 404"). Built with weighted Framer Motion spring physics, Web Audio API sound feedback, smooth layout projection, icon-click next card auto-opening, 100% width step navigation, and automated card collapse upon 100% completion.

## Key Features

1. **🔘 Icon Click Auto-Opens Next Card**:
   - Clicking the checkmark/circle icon on ANY step (e.g. Step 1 or Step 2) marks that step as completed with a bright audio chime tone (`540Hz → 1080Hz`) AND automatically expands and opens the next card in sequence.
   - Clicking the checkmark on the final step marks it complete and automatically collapses the active card smoothly with a close sound tone (`520Hz → 220Hz`).

2. **100% Width Step Navigation ("Continue")**:
   - Includes a sleek, full-width (`100%`) solid black **"Continue"** button inside each step container.
   - Clicking **"Continue"** marks the step complete and advances to the next step seamlessly.

3. **Weighted Spring Layout Motion**:
   - Custom spring transitions for item position shifting (`0.75s` open, `0.70s` close) and outer card resizing (`<motion.div layout>`) eliminating visual scale distortion and snapping.

4. **Zero-Dependency Web Audio API Feedback**:
   - Synthesised audio tones for item toggling (`open`, `close`), step completion (`check chime`), and step un-checking (`uncheck tap`).

5. **Dynamic Group Radii Morphing**:
   - Corners morph smoothly between `0px` and `10px` based on neighboring row states (`startsGroup` & `endsGroup`).

6. **Auto-Close Onboarding Finish & Celebration**:
   - When all steps are finished (`6 / 6 completed`), the active card auto-closes as the **🎉 All set! Onboarding Complete** celebration banner appears at the bottom.

---

## Component Architecture

```
BouncyAccordion Container (448px, 10px radius, #FFFFFF card)
├── Header Row ("Get started with 404" | SVG Progress Ring | Options)
├── Bouncy Rows List
│   ├── Step 1: Complete your profile (Icon Click → Complete & Auto-Open Step 2)
│   ├── Step 2: Set up your workspace (Icon Click → Complete & Auto-Open Step 3)
│   ├── Step 3: Invite your team (Icon Click → Complete & Auto-Open Step 4)
│   ├── Step 4: Connect integrations (Icon Click → Complete & Auto-Open Step 5)
│   ├── Step 5: Create your first workflow (Icon Click → Complete & Auto-Open Step 6)
│   └── Step 6: Set up notifications (Icon Click → Complete & Auto-Close Card)
└── 100% Onboarding Celebration Banner (Visible when 6/6 completed)
```

---

## Usage Example

```tsx
import { BouncyAccordion } from "@/components/bouncy-accordion";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <BouncyAccordion />
    </div>
  );
}
```

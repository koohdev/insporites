---
# ── Identity ──────────────────────────────────────────────────────────────────
id: "portfolio-allocation"
slug: "portfolio-allocation"
title: "Portfolio Allocation"
description: >
  A dark card showing portfolio allocation with a segmented progress bar,
  period tabs (Week / Month / Year), equities exposure, and an avatar group.
  Data-driven and dependency-free.

# ── Taxonomy ──────────────────────────────────────────────────────────────────
category: "Components"
subcategory: "Finance"
tags:
  - finance
  - card
  - progress-bar
  - dark-mode
  - data-driven
  - tailwind

# ── Authorship & Lifecycle ─────────────────────────────────────────────────────
author: "beui"
status: "published"           # draft | review | published | deprecated
publishedAt: "2026-08-12"
updatedAt: "2026-08-12"
license: "MIT"
version: "1.0.0"

# ── URLs ──────────────────────────────────────────────────────────────────────
documentation: "https://beui.dev/components/finance/portfolio-allocation"
markdown: "https://beui.dev/components/finance/portfolio-allocation.md"
thumbnail: "https://beui.dev/thumbnails/portfolio-allocation.png"
previewVideo: ""

# ── Tech Stack ────────────────────────────────────────────────────────────────
framework:
  - "React"
  - "HTML"
  - "Vanilla JS"
  - "Tailwind CSS"
dependencies: []              # no runtime dependencies
peerDependencies:
  - "tailwindcss>=3.0.0"
  - "Inter (Google Fonts)"

# ── Tailwind Tokens (DB-storable config snapshot) ─────────────────────────────
tailwindTokens:
  colors:
    card-bg:        "oklch(0.205 0 0)"
    muted-bg:       "oklch(0.269 0 0)"
    success:        "oklch(0.795 0.184 151.71)"
    danger:         "oklch(0.705 0.191 22.216)"
    text-primary:   "oklch(0.985 0 0)"
    text-muted:     "oklch(0.708 0 0)"
    border-primary: "oklch(1 0 0 / 0.1)"
  fontFamily:
    primary: ["Inter", "sans-serif"]
  borderRadius:
    card:  "14px"
    inner: "10px"
    btn:   "8px"
  boxShadow:
    card: "0 0 0 1px oklab(0.985 0 0 / 0.1), 0 1px 2px 0 rgba(0,0,0,0.05)"

# ── Component Data Schema ─────────────────────────────────────────────────────
# Describes the shape of `portfolioData` so APIs / DBs can store live values.
dataSchema:
  periodKeys:
    - "week"
    - "month"
    - "year"
  fields:
    percentage:
      type: "number"
      range: "0–100"
      description: "Fill level shown in the stat and progress bar."
    change:
      type: "string"
      example: "+3.4%"
      description: "Delta label shown next to the percentage."
    isPositive:
      type: "boolean"
      description: "true → green (success), false → red (danger)."
    exposure:
      type: "string"
      example: "$4.7M"
      description: "Formatted currency string for equities exposure."
  sampleData:
    week:  { percentage: 46, change: "+3.4%", isPositive: true,  exposure: "$4.7M"  }
    month: { percentage: 68, change: "+8.2%", isPositive: true,  exposure: "$9.4M"  }
    year:  { percentage: 85, change: "-1.5%", isPositive: false, exposure: "$18.2M" }

# ── UI Constants ──────────────────────────────────────────────────────────────
uiConstants:
  totalSegments: 40           # number of dots in the progress bar

# ── Avatar / Members ──────────────────────────────────────────────────────────
avatars:
  - name: "Maya Stone"
    src:  "https://images.pexels.com/photos/30272165/pexels-photo-30272165.jpeg?w=96&h=96&fit=crop"
  - name: "Ivan Brooks"
    src:  "https://images.pexels.com/photos/16983301/pexels-photo-16983301.jpeg?w=96&h=96&fit=crop"
  - name: "K"
    src:  ""                  # initials-only avatar
  - name: "Noah Reed"
    src:  "https://images.pexels.com/photos/5643423/pexels-photo-5643423.jpeg?w=96&h=96&fit=crop"
memberCount: 6

# ── Relations ─────────────────────────────────────────────────────────────────
relatedComponents:
  - "number-ticker"
  - "animated-badge"
  - "notification-stack"
---

# Portfolio Allocation

> A dark card showing portfolio allocation with a dynamic segmented progress bar, period tabs (Week / Month / Year), equities exposure, and an avatar group. Data-driven and dependency-free.

## React Component

```tsx
"use client";

import React, { useState } from "react";

export interface PeriodData {
  percentage: number;
  change: string;
  isPositive: boolean;
  exposure: string;
}

export type PeriodKey = "week" | "month" | "year";

const defaultData: Record<PeriodKey, PeriodData> = {
  week:  { percentage: 46, change: "+3.4%", isPositive: true,  exposure: "$4.7M"  },
  month: { percentage: 68, change: "+8.2%", isPositive: true,  exposure: "$9.4M"  },
  year:  { percentage: 85, change: "-1.5%", isPositive: false, exposure: "$18.2M" },
};

export function PortfolioAllocationCard({
  data = defaultData,
  totalSegments = 40,
}: {
  data?: Record<PeriodKey, PeriodData>;
  totalSegments?: number;
}) {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("week");
  const current = data[activePeriod];
  const activeCount = Math.round((current.percentage / 100) * totalSegments);

  return (
    <div className="w-full max-w-md bg-card-bg text-text-primary rounded-card shadow-card overflow-hidden font-primary">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">Portfolio Allocation</span>
          <button
            type="button"
            className="text-text-muted/70 hover:text-text-primary transition-colors p-0.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </button>
        </div>

        {/* Period Tabs */}
        <div className="inline-flex h-8 bg-muted-bg p-[3px] rounded-inner">
          {(["week", "month", "year"] as PeriodKey[]).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1 text-sm font-medium transition-all capitalize ${
                activePeriod === period
                  ? "rounded-btn bg-white/10 text-text-primary shadow-sm border border-white/15"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 px-5 pt-5 pb-5">
        {/* Stats */}
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-medium leading-none">{current.percentage}%</span>
          <span className={`text-xs font-medium ${current.isPositive ? "text-success" : "text-danger"}`}>
            {current.change}
          </span>
          <span className="text-text-muted/70 text-xs">vs prior period</span>
        </div>

        {/* Dynamic Segmented Progress Bar */}
        <div className="flex h-7 w-full items-stretch justify-between gap-[2px]" role="img" aria-label="Progress bar">
          {Array.from({ length: totalSegments }, (_, i) => (
            <span
              key={i}
              className={`h-full w-1 shrink-0 rounded-full transition-colors duration-300 ${
                i < activeCount ? "bg-success" : "bg-muted-bg"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <span className="text-text-muted/70 text-xs">Equities Exposure:</span>
            <span className="font-medium ml-1">{current.exposure}</span>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="relative flex shrink-0 size-6 rounded-full ring-2 ring-card-bg">
                <img alt="Maya Stone" class="aspect-square size-full object-cover rounded-full" src="https://images.pexels.com/photos/30272165/pexels-photo-30272165.jpeg?w=96&h=96&fit=crop" />
              </span>
              <span className="relative flex shrink-0 size-6 rounded-full ring-2 ring-card-bg">
                <img alt="Ivan Brooks" class="aspect-square size-full object-cover rounded-full" src="https://images.pexels.com/photos/16983301/pexels-photo-16983301.jpeg?w=96&h=96&fit=crop" />
              </span>
              <span className="relative flex shrink-0 size-6 rounded-full ring-2 ring-card-bg bg-muted-bg flex items-center justify-center text-[10px] font-medium text-text-muted">
                K
              </span>
              <span className="relative flex shrink-0 size-6 rounded-full ring-2 ring-card-bg">
                <img alt="Noah Reed" class="aspect-square size-full object-cover rounded-full" src="https://images.pexels.com/photos/5643423/pexels-photo-5643423.jpeg?w=96&h=96&fit=crop" />
              </span>
            </div>
            <span className="text-text-muted text-xs whitespace-nowrap">6 Members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Tailwind Config

```js
theme: {
  extend: {
    colors: {
      'card-bg':        'oklch(0.205 0 0)',
      'muted-bg':       'oklch(0.269 0 0)',
      'success':        'oklch(0.795 0.184 151.71)',
      'danger':         'oklch(0.705 0.191 22.216)',
      'text-primary':   'oklch(0.985 0 0)',
      'text-muted':     'oklch(0.708 0 0)',
      'border-primary': 'oklch(1 0 0 / 0.1)',
    },
    fontFamily: {
      primary: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      card:  '14px',
      inner: '10px',
      btn:   '8px',
    },
    boxShadow: {
      card: '0 0 0 1px oklab(0.985 0 0 / 0.1), 0 1px 2px 0 rgba(0,0,0,0.05)',
    },
  },
},
```

## Customisation

| What | How |
| --- | --- |
| Segment count | Pass `totalSegments` prop (default `40`) |
| Period data | Pass custom `data` object matching `Record<PeriodKey, PeriodData>` |
| Active segment color | Swap `bg-success` with any Tailwind color class |

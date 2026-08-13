---
title: "Metrics Card"
description: "A 2-column dark metric card layout sourced from Paper Design. Each panel features a status label, sub-metric, overlapping avatar group, and a dynamic trigonometric radial gauge SVG."
category: "Components"
source: "https://app.paper.design/file/01KZNFK643K41CYWRYAKKDEEE6/1-0/8JM-0"
publishedAt: "2026-08-12"
updatedAt: "2026-08-12"
license: "MIT"
---

# Metrics Card

> A 2-column dark metric card layout exported from [Paper Design](https://app.paper.design/file/01KZNFK643K41CYWRYAKKDEEE6/1-0/8JM-0). Each panel features a status label, sub-metric, overlapping avatar group, and a **dynamic trigonometric radial gauge SVG**.

## Structure

```
Outer wrapper  (dark glass shell, max-w-[944px], 14px radius, 1px border)
└── 2-col grid (gap-1)
    ├── Panel A — Performance Metrics
    │   ├── Header row  (title + "Details" badge)
    │   ├── Content row (status + sub-metric, avatar group | <RadialGauge value={85} />)
    │   └── Dynamic Radial Gauge (Green fill)
    └── Panel B — Quality Metrics
        ├── Header row  (title + "Details" badge)
        ├── Content row (status + sub-metric, avatar group | <RadialGauge value={48} />)
        └── Dynamic Radial Gauge (Amber fill)
```

## 1. Radial Gauge Component (`radial-gauge.tsx`)

This component calculates all line tick positions dynamically over a 180° semi-circle using trigonometry (`Math.cos` & `Math.sin`), eliminating the need for hardcoded SVG lines.

```tsx
"use client";

import React from "react";

export interface RadialGaugeProps {
  /** Percentage value (0 - 100) */
  value: number;
  /** Total radial segments (default: 40) */
  totalSegments?: number;
  /** Active stroke color */
  activeColor?: string;
  /** Inactive segment color */
  inactiveColor?: string;
  /** Line stroke width (default: 2.5) */
  strokeWidth?: number;
  className?: string;
}

export function RadialGauge({
  value,
  totalSegments = 40,
  activeColor = "oklch(69.6% 0.170 162.5)",
  inactiveColor = "oklch(26.5% 0 0)",
  strokeWidth = 2.5,
  className,
}: RadialGaugeProps) {
  const cx = 122;
  const cy = 126;
  const innerRadius = 80;
  const outerRadius = 103;

  const activeCount = Math.round(
    (Math.min(100, Math.max(0, value)) / 100) * totalSegments
  );

  const segments = Array.from({ length: totalSegments }, (_, i) => {
    const angleDeg = 180 - (i / (totalSegments - 1)) * 180;
    const rad = (angleDeg * Math.PI) / 180;

    const x1 = cx + innerRadius * Math.cos(rad);
    const y1 = cy - innerRadius * Math.sin(rad);
    const x2 = cx + outerRadius * Math.cos(rad);
    const y2 = cy - outerRadius * Math.sin(rad);

    return {
      id: i,
      x1: Number(x1.toFixed(3)),
      y1: Number(y1.toFixed(3)),
      x2: Number(x2.toFixed(3)),
      y2: Number(y2.toFixed(3)),
      isActive: i < activeCount,
    };
  });

  return (
    <div className={className || "w-[216px] h-[113px] overflow-hidden"}>
      <svg
        aria-hidden="true"
        viewBox="14 18 216 113"
        className="w-full h-full overflow-hidden"
      >
        {/* Ambient Glow / Shadow Layer (40% opacity) */}
        <g opacity="0.4">
          {segments.map((seg) => (
            <line
              key={`shadow-${seg.id}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.isActive ? activeColor : inactiveColor}
              strokeWidth={strokeWidth + 0.5}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Foreground Ticks Layer */}
        {segments.map((seg) => (
          <line
            key={`fg-${seg.id}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={seg.isActive ? activeColor : inactiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
```

## 2. Metrics Card Component (`metrics-card.tsx`)

```tsx
"use client";

import React from "react";
import { RadialGauge } from "./radial-gauge";

export interface MetricPanelItem {
  id: string;
  title: string;
  badgeLabel?: string;
  statusLabel: string;
  subMetricText: string;
  gaugeValue: number; // 0 - 100
  gaugeColor: string; // oklch or hex
  avatars: { name: string; src?: string }[];
  peopleCountLabel: string;
}

const defaultPanels: MetricPanelItem[] = [
  {
    id: "perf",
    title: "Performance Metrics",
    badgeLabel: "Details",
    statusLabel: "Stable",
    subMetricText: "Server Uptime: 99.7%",
    gaugeValue: 85,
    gaugeColor: "oklch(69.6% 0.170 162.5)", // Green
    avatars: [
      { name: "User 1", src: "https://images.pexels.com/photos/30272165/pexels-photo-30272165.jpeg?w=96&h=96&fit=crop" },
      { name: "User 2", src: "https://images.pexels.com/photos/16983301/pexels-photo-16983301.jpeg?w=96&h=96&fit=crop" },
      { name: "K" },
      { name: "User 3", src: "https://images.pexels.com/photos/5643423/pexels-photo-5643423.jpeg?w=96&h=96&fit=crop" },
    ],
    peopleCountLabel: "6 reviewers",
  },
  {
    id: "qual",
    title: "Quality Metrics",
    badgeLabel: "Details",
    statusLabel: "In Review",
    subMetricText: "Code Coverage: 48.2%",
    gaugeValue: 48,
    gaugeColor: "oklch(79.5% 0.184 86.1)", // Amber
    avatars: [
      { name: "User 4", src: "https://images.pexels.com/photos/30272165/pexels-photo-30272165.jpeg?w=96&h=96&fit=crop" },
      { name: "User 5", src: "https://images.pexels.com/photos/16983301/pexels-photo-16983301.jpeg?w=96&h=96&fit=crop" },
      { name: "K" },
      { name: "User 6", src: "https://images.pexels.com/photos/5643423/pexels-photo-5643423.jpeg?w=96&h=96&fit=crop" },
    ],
    peopleCountLabel: "9 testers",
  },
];

export function MetricsCard({
  panels = defaultPanels,
}: {
  panels?: MetricPanelItem[];
}) {
  return (
    <div className="flex flex-col gap-1 p-[3px] bg-[#26262680] border border-white/10 rounded-[14px] w-full max-w-[944px] shadow-2xl font-sans antialiased text-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-[#171717] border border-white/10 rounded-[10px] shadow-sm min-h-[204px] overflow-hidden flex flex-col justify-between"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-4 h-[56px] border-b border-white/[0.06]">
              <span className="text-sm font-medium text-neutral-100">
                {panel.title}
              </span>
              {panel.badgeLabel && (
                <button
                  type="button"
                  className="px-2 h-6 flex items-center justify-center bg-white/[0.04] border border-white/15 rounded-md text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors"
                >
                  {panel.badgeLabel}
                </button>
              )}
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-[1fr_auto] items-end p-5 gap-3 min-h-[144px]">
              {/* Left Column: Status info + Avatar group */}
              <div className="flex flex-col justify-between gap-7 min-w-0">
                <div>
                  <h4 className="text-sm font-medium text-neutral-100 mb-1">
                    {panel.statusLabel}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {panel.subMetricText}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Overlapping Avatar Group */}
                  <div className="flex -space-x-2">
                    {panel.avatars.map((avatar, idx) => (
                      <div
                        key={idx}
                        className="relative flex shrink-0 size-6 rounded-full ring-2 ring-[#0A0A0A] bg-neutral-900 overflow-hidden items-center justify-center text-[10px] font-medium text-neutral-400"
                      >
                        {avatar.src ? (
                          <img
                            src={avatar.src}
                            alt={avatar.name}
                            className="aspect-square size-full object-cover rounded-full"
                          />
                        ) : (
                          avatar.name.slice(0, 1)
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                    {panel.peopleCountLabel}
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Radial Gauge */}
              <RadialGauge
                value={panel.gaugeValue}
                activeColor={panel.gaugeColor}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API Reference

### `<RadialGauge />` Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Fill percentage between `0` and `100` |
| `totalSegments` | `number` | `40` | Total number of radial line ticks |
| `activeColor` | `string` | `"oklch(69.6% 0.170 162.5)"` | Stroke color for active/filled tick lines |
| `inactiveColor` | `string` | `"oklch(26.5% 0 0)"` | Stroke color for empty tick lines |
| `strokeWidth` | `number` | `2.5` | Thickness of tick lines |

### `<MetricsCard />` Props

| Prop | Type | Description |
| --- | --- | --- |
| `panels` | `MetricPanelItem[]` | Array of panel configurations to render in the grid |

## Source

- **Paper Design file**: [01KZNFK643K41CYWRYAKKDEEE6](https://app.paper.design/file/01KZNFK643K41CYWRYAKKDEEE6/1-0/8JM-0)
- **Exported**: 2026-08-12

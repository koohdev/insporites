---
title: "Number Animation"
description: "Animated number primitives for count-up values and rolling digit tickers."
category: "Components"
publishedAt: "2026-05-17"
updatedAt: "2026-06-28"
documentation: "https://beui.dev/components/motion/number"
markdown: "https://beui.dev/components/motion/number.md"
license: "MIT"
---

# Number Animation

> Animated number primitives for count-up values and rolling digit tickers.

## Install

### Number Ticker

Slot-machine rolling digits with staggered entry.

```bash
npx shadcn@latest add @beui/number-ticker
```

### Animated Number

Spring-driven count-up triggered when in view.

```bash
npx shadcn@latest add @beui/animated-number
```

## Dependencies

- `clsx`
- `motion`
- `react`
- `tailwind-merge`

## Usage

### Number Ticker usage

Slot-machine rolling digits with staggered entry.

```tsx
"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";

export function NumberTickerPreview() {
  const [value, setValue] = useState(48273);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + Math.floor(Math.random() * 50)), 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground">Active users</p>
      <NumberTicker
        value={value}
        prefix=""
        className="text-4xl font-semibold tracking-tight text-foreground tabular-nums"
        format={(n) => n.toLocaleString()}
      />
      <p className="text-xs text-muted-foreground">live · updates every 2.5s</p>
    </div>
  );
}
```

### Animated Number usage

Spring-driven count-up triggered when in view.

```tsx
"use client";

import { AnimatedNumber } from "@/components/motion/animated-number";

export function AnimatedNumberPreview() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
      <div className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
        <AnimatedNumber value={129480} format={(n) => `$${Math.round(n).toLocaleString()}`} />
      </div>
      <p className="text-xs text-(--color-success)">+12.4% vs last month</p>
    </div>
  );
}
```

## API Reference

### NumberTicker

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | Yes | — |
| `pad` | `number` | — | No | Digits to pad to (left). |
| `duration` | `number` | `0.9` | No | Per-digit roll duration in seconds. |
| `stagger` | `number` | `0.04` | No | Stagger between digits. |
| `startOnView` | `boolean` | `true` | No | Render only after the element enters the viewport. |
| `prefix` | `string` | — | No | — |
| `suffix` | `string` | — | No | — |
| `blur` | `boolean` | `false` | No | Add a small blur during digit rolls. |
| `className` | `string` | — | No | — |
| `digitClassName` | `string` | — | No | — |
| `locale` | `boolean` | — | No | Insert locale group separators (commas). Server-component safe. |
| `format` | `((value: number) => string)` | — | No | Custom formatter. Client-only — server components must use `locale` instead. |

### AnimatedNumber

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | Yes | — |
| `duration` | `number` | `1.2` | No | — |
| `format` | `((n: number) => string)` | `(n) => Math.round(n).toLocaleString()` | No | — |
| `className` | `string` | — | No | — |
| `startOnView` | `boolean` | `true` | No | — |

## Source

- Registry detail: https://beui.dev/r/number
- Raw source: https://beui.dev/r/number/raw
- GitHub: https://github.com/starc007/ui-components

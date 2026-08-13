---
title: "Range Slider"
description: "Slider with tick dots and a vertical-bar thumb that bounces as it lands on each step. Drag or keyboard, reduced-motion safe."
category: "Components"
publishedAt: "2026-06-24"
updatedAt: "2026-07-31"
documentation: "https://beui.dev/components/motion/range-slider"
markdown: "https://beui.dev/components/motion/range-slider.md"
license: "MIT"
---

# Range Slider

> Slider with tick dots and a vertical-bar thumb that bounces as it lands on each step. Drag or keyboard, reduced-motion safe.

## Install

### Range Slider

Tick dots, and a vertical-bar thumb that bounces as it lands on each step.

```bash
npx shadcn@latest add @beui/range-slider
```

### Fluid Slider

No thumb. The fill slides behind a rounded liquid cap, and the label flips color wherever the fill covers it.

```bash
npx shadcn@latest add @beui/range-slider-fluid
```

### Wave Slider

Equalizer bars peak around the handle and drop back once it passes, so the value moves down the track as a wave.

```bash
npx shadcn@latest add @beui/range-slider-wave
```

### Bubble Slider

Grab the thumb and a value bubble pops out of it. The bubble tilts and squashes with how fast you drag, then settles upright.

```bash
npx shadcn@latest add @beui/range-slider-bubble
```

### Ruler Slider

The needle stays put and the scale scrolls under it. A flick keeps going and settles on the nearest tick. Fractional steps read at the step's own precision.

```bash
npx shadcn@latest add @beui/range-slider-ruler
```

## Dependencies

- `clsx`
- `motion`
- `react`
- `tailwind-merge`

## Usage

### Range Slider usage

Tick dots, and a vertical-bar thumb that bounces as it lands on each step.

```tsx
"use client";

import { useState } from "react";

import { RangeSlider } from "@/components/motion/range-slider";

export function RangeSliderPreview() {
  const [value, setValue] = useState(40);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Drag the handle</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <RangeSlider value={value} onValueChange={setValue} step={5} aria-label="Value" />
    </div>
  );
}
```

### Fluid Slider usage

No thumb. The fill slides behind a rounded liquid cap, and the label flips color wherever the fill covers it.

```tsx
"use client";

import { useState } from "react";

import { FluidSlider } from "@/components/motion/range-slider-fluid";

export function RangeSliderFluidPreview() {
  const [value, setValue] = useState(35);

  return (
    <div className="w-full max-w-sm">
      <FluidSlider
        value={value}
        onValueChange={setValue}
        label="Brightness"
        aria-label="Brightness"
      />
    </div>
  );
}
```

### Wave Slider usage

Equalizer bars peak around the handle and drop back once it passes, so the value moves down the track as a wave.

```tsx
"use client";

import { useState } from "react";

import { WaveSlider } from "@/components/motion/range-slider-wave";

export function RangeSliderWavePreview() {
  const [value, setValue] = useState(45);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Gain</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <WaveSlider value={value} onValueChange={setValue} aria-label="Gain" />
    </div>
  );
}
```

### Bubble Slider usage

Grab the thumb and a value bubble pops out of it. The bubble tilts and squashes with how fast you drag, then settles upright.

```tsx
"use client";

import { useState } from "react";

import { BubbleSlider } from "@/components/motion/range-slider-bubble";

export function RangeSliderBubblePreview() {
  const [value, setValue] = useState(28);

  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <span className="text-sm text-muted-foreground">Drag fast and the bubble leans</span>
      <BubbleSlider value={value} onValueChange={setValue} aria-label="Value" />
    </div>
  );
}
```

### Ruler Slider usage

The needle stays put and the scale scrolls under it. A flick keeps going and settles on the nearest tick. Fractional steps read at the step's own precision.

```tsx
"use client";

import { useState } from "react";

import { RulerSlider } from "@/components/motion/range-slider-ruler";

export function RangeSliderRulerPreview() {
  const [value, setValue] = useState(72.5);

  return (
    <div className="w-full max-w-sm">
      <RulerSlider
        value={value}
        onValueChange={setValue}
        min={40}
        max={120}
        step={0.5}
        gap={12}
        majorEvery={10}
        unit="kg"
        aria-label="Weight"
      />
    </div>
  );
}
```

code; "use client";
// beui.dev/components/motion/range-slider

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

import { SPRING_GLIDE } from "@/lib/ease";
import { type SliderOptions, useSlider } from "@/lib/hooks/use-slider";
import { cn } from "@/lib/utils";

// Bouncy grab feedback for the thumb scale only.
const SPRING_BOUNCY = { type: "spring", stiffness: 500, damping: 14, mass: 0.7 } as const;

export interface RangeSliderProps extends SliderOptions {
  /** Render a tick dot at each step. */
  showTicks?: boolean;
  className?: string;
}

export function RangeSlider({ showTicks = true, className, ...options }: RangeSliderProps) {
  const reduce = useReducedMotion();
  const { percent, dragging, min, max, step, trackProps, sliderProps } = useSlider(options);

  // Spring-smoothed position drives both the thumb and the fill.
  const target = useMotionValue(percent);
  useEffect(() => {
    target.set(percent);
  }, [percent, target]);
  const smooth = useSpring(target, SPRING_GLIDE);
  const pos = reduce ? target : smooth;
  const left = useMotionTemplate`${pos}%`;
  // Self-offset the thumb from 0% (flush left) to -100% (flush right) of its
  // own width so it stays fully inside the track at both ends — no clip, no gap.
  const thumbX = useTransform(pos, (p) => `${-p}%`);

  // Floor rather than round, so a range the step does not divide (0 to 10 by 4)
  // stops its dots at the last whole step instead of drawing one past max.
  // toFixed comes first because 0.3/0.1 is 2.9999999999999996, which would
  // floor to 2 and drop the last dot.
  const steps = Math.floor(Number(((max - min) / step).toFixed(6)));
  const ticks =
    showTicks && steps > 0 && steps <= 50
      ? Array.from({ length: steps + 1 }, (_, i) => Number((min + i * step).toFixed(6)))
      : [];

  return (
    <div
      {...trackProps}
      className={cn(
        "relative flex h-10 w-full touch-none select-none items-center overflow-hidden rounded-lg bg-muted",
        options.disabled
          ? "pointer-events-none opacity-50"
          : "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {/* fill — runs from the left edge to the thumb, consistent tone */}
      <motion.div className="absolute inset-y-0 left-0 bg-foreground/15" style={{ width: left }} />

      {/* Ticks, inset by half the thumb's width. That inset is the span the
          thumb's own centre travels, so a dot sits where the thumb lands. */}
      <div className="pointer-events-none absolute inset-x-[3px] inset-y-0">
        {ticks.map((t) => {
          const tp = ((t - min) / (max - min)) * 100;
          return (
            <span
              key={t}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
              style={{ left: `${tp}%` }}
            />
          );
        })}
      </div>

      {/* vertical bar thumb — contained at both ends via thumbX */}
      <motion.div
        {...sliderProps}
        animate={reduce ? undefined : { scaleY: dragging ? 1.35 : 1 }}
        transition={SPRING_BOUNCY}
        className="absolute top-1/2 h-5 w-1.5 rounded-sm bg-foreground shadow-sm outline-none ring-inset ring-foreground/30 focus-visible:ring-4"
        style={{ left, x: thumbX, y: "-50%" }}
      />
    </div>
  );
}


## API Reference

### RangeSlider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `showTicks` | `boolean` | `true` | No | Render a tick dot at each step. |
| `className` | `string` | — | No | — |
| `value` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `onValueChange` | `((value: number) => void)` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `aria-label` | `string` | — | No | — |
| `formatValueText` | `((value: number) => string)` | — | No | Announced instead of the raw number — pass one when the value carries a unit or a suffix ("72.5 kg", "35%"); a bare number needs no valueText. |

### FluidSlider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | — | No | Text shown on the left of the track. |
| `format` | `((value: number) => string)` | `(v) => `${v}%`` | No | Formats the value shown on the right. |
| `className` | `string` | — | No | — |
| `value` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `onValueChange` | `((value: number) => void)` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `aria-label` | `string` | — | No | — |
| `formatValueText` | `((value: number) => string)` | — | No | Announced instead of the raw number — pass one when the value carries a unit or a suffix ("72.5 kg", "35%"); a bare number needs no valueText. |

### WaveSlider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `bars` | `number` | `32` | No | Number of bars drawn across the track. |
| `className` | `string` | — | No | — |
| `value` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `onValueChange` | `((value: number) => void)` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `aria-label` | `string` | — | No | — |
| `formatValueText` | `((value: number) => string)` | — | No | Announced instead of the raw number — pass one when the value carries a unit or a suffix ("72.5 kg", "35%"); a bare number needs no valueText. |

### BubbleSlider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `format` | `((value: number) => string)` | — | No | Formats the value shown in the bubble. |
| `className` | `string` | — | No | — |
| `value` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `onValueChange` | `((value: number) => void)` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `aria-label` | `string` | — | No | — |
| `formatValueText` | `((value: number) => string)` | — | No | Announced instead of the raw number — pass one when the value carries a unit or a suffix ("72.5 kg", "35%"); a bare number needs no valueText. |

### RulerSlider

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `gap` | `number` | `14` | No | Pixels between two steps. |
| `majorEvery` | `number` | `5` | No | Label every Nth step; those ticks are drawn tall. |
| `unit` | `string` | — | No | Unit shown next to the value. |
| `className` | `string` | — | No | — |
| `value` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `onValueChange` | `((value: number) => void)` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `aria-label` | `string` | — | No | — |
| `formatValueText` | `((value: number) => string)` | — | No | Announced instead of the raw number — pass one when the value carries a unit or a suffix ("72.5 kg", "35%"); a bare number needs no valueText. |

## Source

- Registry detail: https://beui.dev/r/range-slider
- Raw source: https://beui.dev/r/range-slider/raw
- GitHub: https://github.com/starc007/ui-components

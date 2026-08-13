---
title: "Button"
description: "Spring-pressed Button plus StatefulButton (idle → loading → success / error) and MagneticButton."
category: "Components"
publishedAt: "2026-05-17"
updatedAt: "2026-07-13"
documentation: "https://beui.dev/components/motion/button"
markdown: "https://beui.dev/components/motion/button.md"
license: "MIT"
---

# Button

> Spring-pressed Button plus StatefulButton (idle → loading → success / error) and MagneticButton.

## Install

### Button

Press scale, hover lift, variants and sizes.

```bash
npx shadcn@latest add @beui/button-base
```

### Stateful Button

Idle → loading → success / error with blur-swap slots and morphing width.

```bash
npx shadcn@latest add @beui/button-stateful
```

### Magnetic Button

Button composed with the Magnetic wrapper for cursor-attracted pull.

```bash
npx shadcn@latest add @beui/button-magnetic
```

## Dependencies

- `clsx`
- `lucide-react`
- `motion`
- `react`
- `tailwind-merge`

## Usage

### Button usage

Press scale, hover lift, variants and sizes.

```tsx
"use client";

import { ArrowRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/motion/button";

export function ButtonBasePreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="md">
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="md">Outline</Button>
        <Button variant="ghost" size="md">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
        <Button variant="secondary" size="icon" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md" ripple>Ripple</Button>
        <Button variant="outline" size="md" ripple>Tap me</Button>
      </div>
    </div>
  );
}
```

### Stateful Button usage

Idle → loading → success / error with blur-swap slots and morphing width.

```tsx
"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { type ButtonState, StatefulButton } from "@/components/motion/button";

export function ButtonStatefulPreview() {
  const [okState, setOkState] = useState<ButtonState>("idle");
  const [errState, setErrState] = useState<ButtonState>("idle");

  const run = (target: "ok" | "err") => {
    const setter = target === "ok" ? setOkState : setErrState;
    setter("loading");
    setTimeout(() => {
      setter(target === "ok" ? "success" : "error");
      setTimeout(() => setter("idle"), 1800);
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <StatefulButton
        state={okState}
        variant="primary"
        size="md"
        onClick={() => run("ok")}
        loadingText="Saving"
        successText="Saved"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Save changes
      </StatefulButton>
      <StatefulButton
        state={errState}
        variant="secondary"
        size="md"
        onClick={() => run("err")}
        loadingText="Submitting"
        errorText="Failed"
      >
        Submit
      </StatefulButton>
    </div>
  );
}
```

### Magnetic Button usage

Button composed with the Magnetic wrapper for cursor-attracted pull.

```tsx
"use client";

import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/motion/button";

export function ButtonMagneticPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MagneticButton variant="primary" size="md" strength={0.35}>
        Hover me
        <ArrowRight className="h-4 w-4" />
      </MagneticButton>
      <MagneticButton variant="secondary" size="md" strength={0.25}>
        Subtle pull
      </MagneticButton>
      <MagneticButton variant="outline" size="md" strength={0.5}>
        Strong pull
      </MagneticButton>
    </div>
  );
}
```

## API Reference

### Button

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `primary` | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `md` | No | — |
| `pressScale` | `number` | `0.93` | No | — |
| `ripple` | `boolean` | `false` | No | Spawn a Material-style ripple from the press point. Off by default. |

### ButtonLink

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | `primary` | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `md` | No | — |
| `pressScale` | `number` | `0.93` | No | — |

### StatefulButton

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |
| `pressScale` | `number` | — | No | — |
| `ripple` | `boolean` | — | No | Spawn a Material-style ripple from the press point. Off by default. |
| `icon` | `ReactNode` | — | No | — |
| `state` | `"idle" \| "loading" \| "success" \| "error"` | `idle` | No | — |
| `loadingText` | `ReactNode` | `Loading` | No | — |
| `successText` | `ReactNode` | `Done` | No | — |
| `errorText` | `ReactNode` | `Try again` | No | — |

### MagneticButton

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline"` | — | No | — |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | — | No | — |
| `pressScale` | `number` | — | No | — |
| `ripple` | `boolean` | — | No | Spawn a Material-style ripple from the press point. Off by default. |
| `strength` | `number` | `0.25` | No | Magnetic pull strength. Default 0.25. |
| `magneticClassName` | `string` | — | No | Class applied to the magnetic wrapper. |

## Source

- Registry detail: https://beui.dev/r/button
- Raw source: https://beui.dev/r/button/raw
- GitHub: https://github.com/starc007/ui-components

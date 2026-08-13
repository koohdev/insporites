---
title: "Frame"
description: "A composable card-frame system with panels, header, title, description, and footer sub-components. Supports default and ghost variants, stacked or spaced layouts, and density control via React Context."
category: "Components"
publishedAt: "2026-08-12"
updatedAt: "2026-08-12"
license: "MIT"
---

# Frame

> A composable card-frame system built from `Frame`, `FramePanel`, `FrameHeader`, `FrameTitle`, `FrameDescription`, and `FrameFooter`. Supports `default` / `ghost` variants, stacked or spaced panel layouts, and density control passed automatically through React Context.

## Dependencies

- `clsx` / `tailwind-merge` (via `cn` utility)

## Usage

### Default — spaced panels

```tsx
import {
  Frame,
  FramePanel,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FrameFooter,
} from "@/components/frame";

export function Example() {
  return (
    <Frame>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Panel Title</FrameTitle>
          <FrameDescription>Supporting description text.</FrameDescription>
        </FrameHeader>
        <p className="text-sm text-muted-foreground">Panel body content.</p>
        <FrameFooter>
          <button>Action</button>
        </FrameFooter>
      </FramePanel>
    </Frame>
  );
}
```

### Stacked panels

```tsx
<Frame stacked>
  <FramePanel>
    <FrameTitle>First</FrameTitle>
  </FramePanel>
  <FramePanel>
    <FrameTitle>Second</FrameTitle>
  </FramePanel>
  <FramePanel>
    <FrameTitle>Third</FrameTitle>
  </FramePanel>
</Frame>
```

### Ghost variant

```tsx
<Frame variant="ghost" spacing="lg">
  <FramePanel>
    <FrameTitle>Ghost Panel</FrameTitle>
  </FramePanel>
</Frame>
```

### Dense panel (no internal padding)

```tsx
<Frame>
  <FramePanel dense>
    {/* custom content fills edge-to-edge */}
    <img src="..." className="w-full rounded-[calc(var(--frame-radius)-4px)]" />
  </FramePanel>
</Frame>
```

## Component

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FrameContextType = {
  variant: "default" | "ghost";
  spacing: "sm" | "default" | "lg";
  stacked: boolean;
  dense: boolean;
};

const FrameContext = React.createContext<FrameContextType>({
  variant: "default",
  spacing: "default",
  stacked: false,
  dense: false,
});

export interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost";
  spacing?: "sm" | "default" | "lg";
  stacked?: boolean;
  dense?: boolean;
}

export function Frame({
  variant = "default",
  spacing = "default",
  stacked = false,
  dense = false,
  className,
  children,
  ...props
}: FrameProps) {
  return (
    <FrameContext.Provider value={{ variant, spacing, stacked, dense }}>
      <div
        className={cn(
          "flex flex-col [--frame-radius:var(--radius-xl)] w-full",
          variant === "default" && [
            "rounded-(--frame-radius) border border-border bg-card text-card-foreground shadow-xs",
            stacked ? "overflow-hidden" : "",
          ],
          !stacked && {
            "gap-2": spacing === "sm",
            "gap-4": spacing === "default",
            "gap-6": spacing === "lg",
          },
          variant === "default" &&
            !stacked && {
              "p-0.75": spacing === "sm",
              "p-1.25": spacing === "default",
              "p-2": spacing === "lg",
            },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FrameContext.Provider>
  );
}

export interface FramePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  dense?: boolean;
}

export function FramePanel({
  className,
  children,
  dense: localDense,
  ...props
}: FramePanelProps) {
  const { variant, spacing, stacked, dense: contextDense } = React.useContext(FrameContext);
  const dense = localDense ?? contextDense;

  return (
    <div
      className={cn(
        "flex flex-col relative w-full flex-1",
        stacked
          ? "border-b last:border-b-0 border-border bg-card first:rounded-t-[calc(var(--frame-radius)-1px)] last:rounded-b-[calc(var(--frame-radius)-1px)]"
          : variant === "ghost"
            ? "border border-border bg-card text-card-foreground shadow-xs rounded-(--frame-radius)"
            : "border border-border/40 bg-muted/20 dark:bg-muted/10 rounded-[calc(var(--frame-radius)-4px)]",
        !dense
          ? {
              "p-3": spacing === "sm",
              "p-5": spacing === "default",
              "p-7": spacing === "lg",
            }
          : "p-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type FrameHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function FrameHeader({ className, children, ...props }: FrameHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export type FrameTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function FrameTitle({ className, children, ...props }: FrameTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export type FrameDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FrameDescription({ className, children, ...props }: FrameDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export type FrameFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function FrameFooter({ className, children, ...props }: FrameFooterProps) {
  return (
    <div className={cn("flex items-center mt-auto", className)} {...props}>
      {children}
    </div>
  );
}
```

## API Reference

### Frame

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "ghost"` | `"default"` | `default` — bordered card shell. `ghost` — invisible wrapper; panels become the cards. |
| `spacing` | `"sm" \| "default" \| "lg"` | `"default"` | Controls gap between panels and padding inside the frame. |
| `stacked` | `boolean` | `false` | Panels are flush and share divider borders instead of floating. |
| `dense` | `boolean` | `false` | Removes internal padding from all panels (can be overridden per-panel). |
| `className` | `string` | — | Extra Tailwind classes merged onto the outer `<div>`. |

### FramePanel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dense` | `boolean` | inherits from `Frame` | Overrides the context-level `dense` for this panel only. Set to `true` for edge-to-edge content. |
| `className` | `string` | — | Extra classes merged onto the panel `<div>`. |

### FrameHeader

Thin wrapper that stacks its children with `gap-1.5`. Accepts all `div` HTML attributes.

### FrameTitle

Renders an `<h3>` with semibold heading styles. Accepts all heading HTML attributes.

### FrameDescription

Renders a `<p>` with `text-sm text-muted-foreground`. Accepts all paragraph HTML attributes.

### FrameFooter

Renders a `<div>` that `flex`es its children in a row and pushes itself to the bottom of the panel via `mt-auto`.

## Spacing Reference

| `spacing` | Frame gap | Frame padding | Panel padding |
| --- | --- | --- | --- |
| `"sm"` | `gap-2` | `p-0.75` | `p-3` |
| `"default"` | `gap-4` | `p-1.25` | `p-5` |
| `"lg"` | `gap-6` | `p-2` | `p-7` |

> Frame padding only applies when `variant="default"` and `stacked=false`.

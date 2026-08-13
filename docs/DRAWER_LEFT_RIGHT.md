---
title: "Drawer"
description: "Side panel that slides in from the left or right with a spring, backdrop blur, body scroll lock and esc-to-close."
category: "Components"
publishedAt: "2026-06-22"
updatedAt: "2026-06-22"
documentation: "https://beui.dev/components/motion/drawer"
markdown: "https://beui.dev/components/motion/drawer.md"
license: "MIT"
---

# Drawer

> Side panel that slides in from the left or right with a spring, backdrop blur, body scroll lock and esc-to-close.

## Install

```bash
npx shadcn@latest add @beui/drawer
```

## Dependencies

- `clsx`
- `motion`
- `react`
- `tailwind-merge`

## Usage

```tsx
"use client";

import { useState } from "react";
import { Drawer } from "@/components/motion/drawer";

export function DrawerPreview() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");

  const openWith = (s: "left" | "right") => {
    setSide(s);
    setOpen(true);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => openWith("left")}
        className="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70"
      >
        Open left
      </button>
      <button
        type="button"
        onClick={() => openWith("right")}
        className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Open right
      </button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        ariaLabel="Demo drawer"
        className="gap-4 p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">Drawer</h2>
        <p className="text-sm text-muted-foreground">
          Slides in from the {side}. Press Esc or click outside to close.
        </p>
      </Drawer>
    </div>
  );
}
```

code: "use client";
// beui.dev/components/motion/drawer

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  children: ReactNode;
  /** Class for the panel surface. */
  className?: string;
  /** Class for the backdrop. */
  backdropClassName?: string;
  ariaLabel?: string;
  /** Close when the backdrop is clicked. Default true. */
  dismissable?: boolean;
}

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  children,
  className,
  backdropClassName,
  ariaLabel,
  dismissable = true,
}: DrawerProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  const offscreen = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close"
            tabIndex={dismissable ? 0 : -1}
            onClick={() => dismissable && onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={cn(
              "absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-sm",
              backdropClassName,
            )}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={reduce ? { opacity: 0 } : { x: offscreen }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: offscreen }}
            transition={reduce ? { duration: 0.2, ease: EASE_OUT } : SPRING_PANEL}
            className={cn(
              "absolute inset-y-0 flex w-80 max-w-[85vw] flex-col bg-background shadow-2xl",
              side === "right"
                ? "right-0 border-l border-border"
                : "left-0 border-r border-border",
              className,
            )}
          >
            {children}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}


## API Reference

### Drawer

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | — | Yes | — |
| `onOpenChange` | `(open: boolean) => void` | — | Yes | — |
| `side` | `"right" \| "left"` | `right` | No | — |
| `className` | `string` | — | No | Class for the panel surface. |
| `backdropClassName` | `string` | — | No | Class for the backdrop. |
| `ariaLabel` | `string` | — | No | — |
| `dismissable` | `boolean` | `true` | No | Close when the backdrop is clicked. Default true. |

## Source

- Registry detail: https://beui.dev/r/drawer
- Raw source: https://beui.dev/r/drawer/raw
- GitHub: https://github.com/starc007/ui-components

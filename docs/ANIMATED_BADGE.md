---
title: "Animated Badge"
description: "Status badge with animated state icons, pulse feedback and compact size variants."
category: "Components"
publishedAt: "2026-06-05"
updatedAt: "2026-06-10"
documentation: "https://beui.dev/components/motion/animated-badge"
markdown: "https://beui.dev/components/motion/animated-badge.md"
license: "MIT"
---

# Animated Badge

> Status badge with animated state icons, pulse feedback and compact size variants.

## Install

```bash
npx shadcn@latest add @beui/animated-badge
```

## Dependencies

- `clsx`
- `lucide-react`
- `motion`
- `react`
- `tailwind-merge`

## Usage

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";

const STATES: Array<{ status: AnimatedBadgeStatus; label: string }> = [
  { status: "loading", label: "Syncing" },
  { status: "success", label: "Synced" },
  { status: "warning", label: "Review" },
  { status: "danger", label: "Failed" },
];

export function AnimatedBadgePreview() {
  const [active, setActive] = useState(0);
  const state = STATES[active];

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % STATES.length);
    }, 1600);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-16 items-center justify-center">
        <AnimatedBadge status={state.status} size="md" aria-live="polite">
          {state.label}
        </AnimatedBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <AnimatedBadge status="neutral" size="sm">Queued</AnimatedBadge>
        <AnimatedBadge status="info" size="sm">Live</AnimatedBadge>
        <AnimatedBadge status="loading" size="sm">Indexing</AnimatedBadge>
        <AnimatedBadge status="success" size="sm">Verified</AnimatedBadge>
        <AnimatedBadge status="warning" size="sm">Pending</AnimatedBadge>
        <AnimatedBadge status="danger" size="sm">Blocked</AnimatedBadge>
      </div>
    </div>
  );
}
```

code: "use client";
// beui.dev/components/motion/animated-badge

import {
  AlertTriangle,
  Check,
  Circle,
  Info,
  LoaderCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type AnimatedBadgeStatus =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "loading";

export type AnimatedBadgeSize = "sm" | "md";

export interface AnimatedBadgeProps extends Omit<
  HTMLMotionProps<"span">,
  "children"
> {
  status?: AnimatedBadgeStatus;
  size?: AnimatedBadgeSize;
  children?: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  pulse?: boolean;
  contentKey?: string | number;
}

const STATUS_CLASS: Record<AnimatedBadgeStatus, string> = {
  neutral: "border-border bg-card text-muted-foreground",
  info: "border-primary/30 bg-primary/10 text-primary",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  loading: "border-primary/30 bg-primary/10 text-primary",
};

const SIZE_CLASS: Record<AnimatedBadgeSize, string> = {
  sm: "h-6 gap-1.5 px-2 text-[11px]",
  md: "h-8 gap-2 px-3 text-xs",
};

const ICON_CLASS: Record<AnimatedBadgeSize, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
};

const ICONS: Record<AnimatedBadgeStatus, LucideIcon> = {
  neutral: Circle,
  info: Info,
  success: Check,
  warning: AlertTriangle,
  danger: X,
  loading: LoaderCircle,
};

const ICON_ROLL_VARIANTS: Variants = {
  initial: {
    opacity: 0.72,
    y: "80%",
    scale: 0.92,
    rotate: -8,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: "0%",
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      y: { type: "spring", stiffness: 210, damping: 24, mass: 0.85 },
      scale: { type: "spring", stiffness: 250, damping: 24, mass: 0.75 },
      rotate: { duration: 0.28, ease: EASE_OUT },
      opacity: { duration: 0.28, ease: EASE_OUT },
      filter: { duration: 0.42, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0.5,
    y: "-80%",
    scale: 0.96,
    rotate: 8,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: EASE_OUT },
  },
};

const TEXT_ROLL_VARIANTS: Variants = {
  initial: { opacity: 0.76, y: "85%", filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: {
      y: { type: "spring", stiffness: 210, damping: 24, mass: 0.85 },
      opacity: { duration: 0.3, ease: EASE_OUT },
      filter: { duration: 0.42, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0.5,
    y: "-85%",
    filter: "blur(6px)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

export function AnimatedBadge({
  status = "neutral",
  size = "md",
  children,
  icon,
  showIcon = true,
  pulse = status === "loading",
  contentKey,
  className,
  ...rest
}: AnimatedBadgeProps) {
  const reduce = useReducedMotion();
  const Icon = ICONS[status];
  const resolvedContentKey =
    contentKey ??
    (typeof children === "string" || typeof children === "number"
      ? children
      : status);

  return (
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
      className={cn(
        "relative inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full border font-medium tabular-nums",
        "transition-colors duration-300",
        STATUS_CLASS[status],
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {pulse && !reduce ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-current opacity-10"
          animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      {showIcon ? (
        <span className="relative z-10 inline-flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              aria-hidden
              data-badge-icon
              variants={ICON_ROLL_VARIANTS}
              initial={reduce ? false : "initial"}
              animate={reduce ? { opacity: 1 } : "animate"}
              exit={reduce ? undefined : "exit"}
              className="inline-flex will-change-transform"
            >
              {status === "loading" && !reduce && !icon ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-flex"
                >
                  <Icon className={ICON_CLASS[size]} />
                </motion.span>
              ) : (
                (icon ?? <Icon className={ICON_CLASS[size]} />)
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}
      {children != null ? (
        <span className="relative z-10 inline-flex overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={resolvedContentKey}
              data-badge-label
              variants={TEXT_ROLL_VARIANTS}
              initial={reduce ? false : "initial"}
              animate={reduce ? { opacity: 1 } : "animate"}
              exit={reduce ? undefined : "exit"}
              className="inline-block will-change-transform"
            >
              {children}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}
    </motion.span>
  );
}


## API Reference

### AnimatedBadge

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `"success" \| "neutral" \| "info" \| "warning" \| "danger" \| "loading"` | `neutral` | No | — |
| `size` | `"sm" \| "md"` | `md` | No | — |
| `icon` | `ReactNode` | — | No | — |
| `showIcon` | `boolean` | `true` | No | — |
| `pulse` | `boolean` | `status === "loading"` | No | — |
| `contentKey` | `string \| number` | — | No | — |
| `className` | `string` | — | No | — |

## Source

- Registry detail: https://beui.dev/r/animated-badge
- Raw source: https://beui.dev/r/animated-badge/raw
- GitHub: https://github.com/starc007/ui-components

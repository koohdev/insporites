---
title: "Notification Stack"
description: "Compact notification cards that spring from a stacked summary into a readable list on hover, focus or tap."
category: "Blocks"
publishedAt: "2026-07-14"
updatedAt: "2026-07-14"
documentation: "https://beui.dev/components/blocks/notification-stack"
markdown: "https://beui.dev/components/blocks/notification-stack.md"
license: "MIT"
---

# Notification Stack

> Compact notification cards that spring from a stacked summary into a readable list on hover, focus or tap.

## Install

```bash
npx shadcn@latest add @beui/notification-stack
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

import { RotateCw } from "lucide-react";
import {
  NotificationStack,
  type NotificationStackItem,
} from "@/components/motion/notification-stack";

const notifications: NotificationStackItem[] = [
  {
    id: "import-failed",
    title: "Orders import failed",
    description: "42s · TimeoutError at Step 2",
    trailing: (
      <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400">
        <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
        2
      </span>
    ),
  },
  {
    id: "sla-breach",
    title: "SLA breach",
    description: "2m 11s · Data enrichment",
  },
  {
    id: "sync-fixed",
    title: "Product sync auto-fixed",
    description: "5m · 404 on GET /products",
  },
];

export function NotificationStackPreview() {
  return (
    <div className="flex w-full items-center justify-center pt-52 pb-6">
      <NotificationStack items={notifications} />
    </div>
  );
}
```

## API Reference

### NotificationStack

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `NotificationStackItem[]` | — | Yes | — |
| `expanded` | `boolean` | — | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `onExpandedChange` | `((expanded: boolean) => void)` | — | No | — |
| `onViewAll` | `(() => void)` | — | No | — |
| `maxVisible` | `number` | `3` | No | — |
| `collapsedLabel` | `string` | `Notifications` | No | — |
| `expandedLabel` | `string` | `View all` | No | — |
| `emptyLabel` | `string` | `All caught up` | No | — |
| `sound` | `boolean` | `true` | No | Zero-dependency Web Audio API feedback on card hover and click. |
| `className` | `string` | — | No | — |
| `classNames` | `NotificationStackClassNames` | — | No | — |

## Source

- Registry detail: https://beui.dev/r/notification-stack
- Raw source: https://beui.dev/r/notification-stack/raw
- GitHub: https://github.com/starc007/ui-components

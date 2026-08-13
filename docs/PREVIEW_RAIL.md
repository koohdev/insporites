---
title: "Preview Rail"
description: "Codex app-inspired navigation rail with compact ticks that form a hover pyramid and reveal a floating destination preview."
category: "Components"
publishedAt: "2026-07-11"
updatedAt: "2026-07-11"
documentation: "https://beui.dev/components/motion/preview-rail"
markdown: "https://beui.dev/components/motion/preview-rail.md"
license: "MIT"
---

# Preview Rail

> Codex app-inspired navigation rail with compact ticks that form a hover pyramid and reveal a floating destination preview.

## Install

```bash
npx shadcn@latest add @beui/preview-rail
```

## Dependencies

- `clsx`
- `motion`
- `react`
- `tailwind-merge`

## Usage

```tsx
"use client";

import { PreviewRail } from "@/components/motion/preview-rail";

export const previewRailItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Return to your workspace overview and recent activity.",
    href: "#dashboard",
  },
  {
    id: "components",
    label: "Components",
    description: "Browse motion primitives for React and Next.js.",
    href: "#components",
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Explore composed, product-ready interface blocks.",
    href: "#blocks",
  },
  {
    id: "playground",
    label: "Playground",
    description: "Tune motion values and preview behavior live.",
    href: "#playground",
  },
  {
    id: "docs",
    label: "Documentation",
    description: "Read installation, usage, and API reference notes.",
    href: "#docs",
  },
  {
    id: "changelog",
    label: "Changelog",
    description: "Review newly launched components and improvements.",
    href: "#changelog",
  },
  {
    id: "sponsors",
    label: "Sponsors",
    description: "Support continued development of the open-source library.",
    href: "#sponsors",
  },
  {
    id: "pro",
    label: "beUI Pro",
    description: "Get premium components and lifetime access.",
    href: "#pro",
  },
  {
    id: "examples",
    label: "Examples",
    description: "See components composed in practical interface patterns.",
    href: "#examples",
  },
  {
    id: "templates",
    label: "Templates",
    description: "Start from polished layouts built with beUI components.",
    href: "#templates",
  },
  {
    id: "guides",
    label: "Guides",
    description: "Learn how to combine motion primitives effectively.",
    href: "#guides",
  },
  {
    id: "community",
    label: "Community",
    description: "Discover what other builders are creating with beUI.",
    href: "#community",
  },
  {
    id: "github",
    label: "GitHub",
    description: "View the source, report issues, and contribute improvements.",
    href: "#github",
  },
  {
    id: "about",
    label: "About",
    description: "Learn more about the ideas and people behind beUI.",
    href: "#about",
  },
];

export function PreviewRailPreview() {
  return (
    <div className="flex w-full flex-col gap-8">
      <PreviewRail
        items={previewRailItems}
        defaultActiveId="docs"
        className="mx-auto h-[360px] w-full max-w-2xl"
      />
      <PreviewRail
        items={previewRailItems}
        orientation="horizontal"
        defaultActiveId="docs"
        className="mx-auto h-[280px] w-full max-w-2xl"
      />
    </div>
  );
}
```

code: "use client";
// beui.dev/components/motion/preview-rail

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface PreviewRailItem {
  id: string;
  label: string;
  ariaLabel?: string;
  description?: ReactNode;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

export interface PreviewRailProps {
  items: PreviewRailItem[];
  label?: string;
  orientation?: "vertical" | "horizontal";
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  onItemSelect?: (item: PreviewRailItem) => void;
  renderPreview?: (item: PreviewRailItem) => ReactNode;
  showPreview?: boolean;
  previewSide?: "before" | "after";
  highlightActive?: boolean;
  itemSize?: number;
  children?: ReactNode;
  className?: string;
  railClassName?: string;
  previewContainerClassName?: string;
  previewClassName?: string;
}

function DefaultPreview({ item }: { item: PreviewRailItem }) {
  return (
    <div
      data-slot="preview-rail-card"
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <p
        data-slot="preview-rail-title"
        className="font-medium text-card-foreground"
      >
        {item.label}
      </p>
      {item.description ? (
        <div
          data-slot="preview-rail-description"
          className="mt-1 text-sm leading-6 text-muted-foreground"
        >
          {item.description}
        </div>
      ) : null}
    </div>
  );
}

export function PreviewRail({
  items,
  label = "Section navigation",
  orientation = "vertical",
  activeId,
  defaultActiveId,
  onActiveChange,
  onItemSelect,
  renderPreview,
  showPreview = true,
  previewSide = "after",
  highlightActive = false,
  itemSize = 24,
  children,
  className,
  railClassName,
  previewContainerClassName,
  previewClassName,
}: PreviewRailProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? items[0]?.id ?? "",
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const requestedActiveId = activeId ?? internalActiveId;
  const selectedId = items.some((item) => item.id === requestedActiveId)
    ? requestedActiveId
    : (items[0]?.id ?? "");
  const displayedId = hoveredId ?? focusedId ?? "";
  const highlightedId = displayedId || (highlightActive ? selectedId : "");
  const displayedIndex = items.findIndex((item) => item.id === highlightedId);
  const rowTemplate = items.length
    ? `repeat(${items.length}, ${itemSize}px)`
    : undefined;
  const isHorizontal = orientation === "horizontal";

  const selectItem = (id: string) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  return (
    <motion.div
      layoutRoot
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedId(null);
        }
      }}
      className={cn(
        "isolate relative flex w-full overflow-visible",
        isHorizontal
          ? "min-h-64 flex-col items-center justify-center"
          : "min-h-80",
        className,
      )}
    >
      <nav
        aria-label={label}
        onPointerLeave={() => setHoveredId(null)}
        style={
          isHorizontal
            ? { gridTemplateColumns: rowTemplate }
            : { gridTemplateRows: rowTemplate }
        }
        className={cn(
          "relative z-10 grid shrink-0",
          isHorizontal
            ? "h-12 w-fit max-w-full self-center justify-center"
            : "w-12 content-center",
          railClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          const highlighted = item.id === highlightedId;
          const distance =
            displayedIndex < 0 ? Number.POSITIVE_INFINITY : Math.abs(index - displayedIndex);
          const scale = highlighted
            ? 1
            : distance === 1
              ? 0.68
              : distance === 2
                ? 0.44
                : 0.25;

          const itemContent = (
            <>
              <motion.span
                data-slot="preview-rail-tick"
                aria-hidden="true"
                animate={isHorizontal ? { scaleY: scale } : { scaleX: scale }}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className={cn(
                  "block bg-current",
                  isHorizontal
                    ? "h-12 w-0.5 origin-bottom"
                    : "h-0.5 w-12 origin-left",
                  highlighted ? "text-foreground" : undefined,
                )}
              />
            </>
          );

          const sharedClassName = cn(
            "relative flex text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isHorizontal
              ? "h-12 w-6 items-end justify-center"
              : "h-6 w-12 items-center",
          );
          const sharedStyle = isHorizontal
            ? { width: itemSize }
            : { height: itemSize };
          const handlePointerEnter = () => {
            if (canHover) setHoveredId(item.id);
          };
          const handleFocus = (currentTarget: HTMLElement) => {
            if (currentTarget.matches(":focus-visible")) {
              setFocusedId(item.id);
            }
          };
          const handleSelect = () => {
            selectItem(item.id);
            onItemSelect?.(item);
          };

          return item.href ? (
            <a
              key={item.id}
              data-slot="preview-rail-item"
              href={item.href}
              target={item.target}
              rel={
                item.rel ??
                (item.target === "_blank" ? "noreferrer noopener" : undefined)
              }
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "page" : undefined}
              onPointerEnter={handlePointerEnter}
              onMouseEnter={handlePointerEnter}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </a>
          ) : (
            <button
              key={item.id}
              data-slot="preview-rail-item"
              type="button"
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "location" : undefined}
              onPointerEnter={handlePointerEnter}
              onMouseEnter={handlePointerEnter}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>

      {showPreview ? (
        <div
          aria-hidden="true"
          style={
            isHorizontal
              ? { gridTemplateColumns: rowTemplate }
              : { gridTemplateRows: rowTemplate }
          }
          className={cn(
            "pointer-events-none absolute z-50 grid",
            isHorizontal
              ? "top-1/2 left-1/2 h-5 w-fit max-w-full -translate-x-1/2 -translate-y-1/2 justify-center"
              : previewSide === "before"
                ? "inset-y-0 right-16 left-4 content-center"
                : "inset-y-0 right-4 left-16 content-center",
            previewContainerClassName,
          )}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={
                isHorizontal ? { width: itemSize } : { height: itemSize }
              }
              className={cn(
                "relative flex items-center",
                isHorizontal ? "justify-center" : undefined,
              )}
            >
              {item.id === displayedId ? (
                <div
                  className={cn(
                    isHorizontal
                      ? "absolute bottom-12 left-1/2 w-72 -translate-x-1/2"
                      : cn(
                          "w-full max-w-sm",
                          previewSide === "before" && "ml-auto",
                        ),
                    previewClassName,
                  )}
                >
                  <motion.div
                    layoutId={`preview-rail-card-${uid}`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={item.id}
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: 4, filter: "blur(6px)" }
                        }
                        animate={
                          reduce
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                y: -2,
                                filter: "blur(4px)",
                                transition: {
                                  duration: 0.12,
                                  ease: EASE_OUT,
                                },
                              }
                        }
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: EASE_OUT,
                        }}
                      >
                        {renderPreview ? (
                          renderPreview(item)
                        ) : (
                          <DefaultPreview item={item} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {children ? (
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      ) : null}
    </motion.div>
  );
}


## API Reference

### PreviewRail

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `PreviewRailItem[]` | — | Yes | — |
| `label` | `string` | `Section navigation` | No | — |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | No | — |
| `activeId` | `string` | — | No | — |
| `defaultActiveId` | `string` | — | No | — |
| `onActiveChange` | `((id: string) => void)` | — | No | — |
| `onItemSelect` | `((item: PreviewRailItem) => void)` | — | No | — |
| `renderPreview` | `((item: PreviewRailItem) => ReactNode)` | — | No | — |
| `showPreview` | `boolean` | `true` | No | — |
| `previewSide` | `"before" \| "after"` | `after` | No | — |
| `highlightActive` | `boolean` | `false` | No | — |
| `itemSize` | `number` | `24` | No | — |
| `sound` | `boolean` | `true` | No | Web Audio tick sound feedback per hover of individual rail item. |
| `className` | `string` | — | No | — |
| `railClassName` | `string` | — | No | — |
| `previewContainerClassName` | `string` | — | No | — |
| `previewClassName` | `string` | — | No | — |

## Source

- Registry detail: https://beui.dev/r/preview-rail
- Raw source: https://beui.dev/r/preview-rail/raw
- GitHub: https://github.com/starc007/ui-components

---
title: "Popover"
description: "Gooey popover whose panel oozes out of the trigger through an SVG goo filter — a liquid neck that stretches and pinches — with crisp content fading in on top, plus a Morph variant that clip-morphs open from the trigger corner. Click or hover trigger, controlled or uncontrolled."
category: "Components"
publishedAt: "2026-07-07"
updatedAt: "2026-07-27"
documentation: "https://beui.dev/components/motion/popover"
markdown: "https://beui.dev/components/motion/popover.md"
license: "MIT"
---

# Popover

> Gooey popover whose panel oozes out of the trigger through an SVG goo filter — a liquid neck that stretches and pinches — with crisp content fading in on top, plus a Morph variant that clip-morphs open from the trigger corner. Click or hover trigger, controlled or uncontrolled.

## Install

### Gooey Popover

Composable Popover, PopoverTrigger, PopoverContent; the panel oozes out of the trigger through an SVG goo filter with a liquid neck, crisp content fading in on top. Click or hover, controlled or uncontrolled.

```bash
npx shadcn@latest add @beui/popover
```

### Morph Popover

Composable MorphPopover, MorphPopoverTrigger, MorphPopoverContent; the panel is laid out full size but clipped to the corner nearest the trigger, then unclips as one piece — a single-surface morph with a drop-shadow that hugs the shape. Side/align aware, controlled or uncontrolled.

```bash
npx shadcn@latest add @beui/popover-morph
```

## Dependencies

- `clsx`
- `lucide-react`
- `motion`
- `react`
- `react-dom`
- `tailwind-merge`

## Usage

### Gooey Popover usage

Composable Popover, PopoverTrigger, PopoverContent; the panel oozes out of the trigger through an SVG goo filter with a liquid neck, crisp content fading in on top. Click or hover, controlled or uncontrolled.

```tsx
"use client";

import { Button } from "@/components/motion/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/motion/popover";

export function PopoverPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Popover side="bottom" align="start">
        <PopoverTrigger>
          <Button variant="secondary">Edit profile</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <p className="text-sm font-medium text-foreground">Dimensions</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set the width and height for the layer.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Width</span>
              <input
                defaultValue="100%"
                className="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Height</span>
              <input
                defaultValue="auto"
                className="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              />
            </label>
          </div>
        </PopoverContent>
      </Popover>

      <Popover trigger="hover" side="top">
        <PopoverTrigger>
          <Button variant="outline">Hover me</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <p className="text-sm text-foreground">
            Opens on hover, with a grace window so you can move into the panel.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### Morph Popover usage

Composable MorphPopover, MorphPopoverTrigger, MorphPopoverContent; the panel is laid out full size but clipped to the corner nearest the trigger, then unclips as one piece — a single-surface morph with a drop-shadow that hugs the shape. Side/align aware, controlled or uncontrolled.

```tsx
"use client";

import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  MorphPopover,
  MorphPopoverContent,
  MorphPopoverTrigger,
} from "@/components/motion/popover-morph";

const ACTIONS = [
  { icon: Pencil, label: "Edit" },
  { icon: Copy, label: "Duplicate" },
  { icon: Share2, label: "Share" },
  { icon: Trash2, label: "Delete" },
];

export function MorphPopoverPreview() {
  const [open, setOpen] = useState(false);

  return (
    <MorphPopover open={open} onOpenChange={setOpen}>
      <MorphPopoverTrigger>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
        >
          Options
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </MorphPopoverTrigger>

      <MorphPopoverContent align="start" className="w-48 p-1.5">
        {ACTIONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
          </button>
        ))}
      </MorphPopoverContent>
    </MorphPopover>
  );
}
```

"use client";
// beui.dev/components/motion/popover

import {
  animate,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopoverPortalPosition } from "@/components/motion/popover-position";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";
type TriggerMode = "click" | "hover";

// This morph needs less bounce than layout motion: too much overshoot makes
// the liquid neck balloon past the final panel edges.
const GOO_OPEN_SPRING = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0.15,
} as const;
const GOO_CLOSE_SPRING = {
  type: "spring",
  visualDuration: 0.21,
  bounce: 0.15,
} as const;
const HOVER_CLOSE_DELAY = 120;
const CIRCLE_KAPPA = 0.5523;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}
interface Geo {
  layerW: number;
  layerH: number;
  left: number;
  top: number;
  trigger: Rect;
  panel: Rect;
}

// Trigger rect and panel rect in a shared local coordinate box.
function buildGeo(
  tW: number,
  tH: number,
  cW: number,
  cH: number,
  side: Side,
  align: Align,
  gap: number,
  panelRadius: number,
): Geo {
  const py = side === "bottom" ? tH + gap : -(gap + cH);
  const px = align === "start" ? 0 : align === "end" ? tW - cW : (tW - cW) / 2;

  const left = Math.min(0, px);
  const top = Math.min(0, py);
  const layerW = Math.max(tW, px + cW) - left;
  const layerH = Math.max(tH, py + cH) - top;

  const triggerRadius = Math.min(tH / 2, panelRadius);

  return {
    layerW,
    layerH,
    left,
    top,
    trigger: { x: -left, y: -top, w: tW, h: tH, r: triggerRadius },
    panel: { x: px - left, y: py - top, w: cW, h: cH, r: panelRadius },
  };
}

function rectAtProgress(geo: Geo, progress: number): Rect {
  const trigger = geo.trigger;
  const panel = geo.panel;

  return {
    x: lerp(trigger.x, panel.x, progress),
    y: lerp(trigger.y, panel.y, progress),
    w: lerp(trigger.w, panel.w, progress),
    h: lerp(trigger.h, panel.h, progress),
    r: lerp(trigger.r, panel.r, progress),
  };
}

function insetFor(rect: Rect, layerW: number, layerH: number) {
  const top = rect.y;
  const right = layerW - (rect.x + rect.w);
  const bottom = layerH - (rect.y + rect.h);
  const left = rect.x;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${rect.r}px)`;
}

function roundedRectShape(rect: Rect) {
  const radius = Math.max(0, Math.min(rect.r, rect.w / 2, rect.h / 2));
  const control = radius * CIRCLE_KAPPA;
  const x1 = rect.x;
  const y1 = rect.y;
  const x2 = rect.x + rect.w;
  const y2 = rect.y + rect.h;
  const px = (value: number) => `${value.toFixed(3)}px`;

  return (
    `shape(from ${px(x1 + radius)} ${px(y1)}, ` +
    `line to ${px(x2 - radius)} ${px(y1)}, ` +
    `curve to ${px(x2)} ${px(y1 + radius)} with ${px(x2 - radius + control)} ${px(y1)} / ${px(x2)} ${px(y1 + radius - control)}, ` +
    `line to ${px(x2)} ${px(y2 - radius)}, ` +
    `curve to ${px(x2 - radius)} ${px(y2)} with ${px(x2)} ${px(y2 - radius + control)} / ${px(x2 - radius + control)} ${px(y2)}, ` +
    `line to ${px(x1 + radius)} ${px(y2)}, ` +
    `curve to ${px(x1)} ${px(y2 - radius)} with ${px(x1 + radius - control)} ${px(y2)} / ${px(x1)} ${px(y2 - radius + control)}, ` +
    `line to ${px(x1)} ${px(y1 + radius)}, ` +
    `curve to ${px(x1 + radius)} ${px(y1)} with ${px(x1)} ${px(y1 + radius - control)} / ${px(x1 + radius - control)} ${px(y1)}, ` +
    "close)"
  );
}

function clipForProgress(geo: Geo, progress: number, supportsShape: boolean) {
  const rect = rectAtProgress(geo, progress);
  return supportsShape
    ? roundedRectShape(rect)
    : insetFor(rect, geo.layerW, geo.layerH);
}

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  openHover: () => void;
  scheduleClose: () => void;
  triggerMode: TriggerMode;
  side: Side;
  align: Align;
  gap: number;
  panelRadius: number;
  gooStrength: number;
  reduce: boolean;
  gooId: string;
  contentId: string;
  progress: MotionValue<number>;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error(`${component} must be used within <Popover>`);
  return ctx;
}

export interface PopoverProps {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** How the popover is summoned. Default "click". */
  trigger?: TriggerMode;
  /** Which side of the trigger the panel oozes out of. Default "bottom". */
  side?: Side;
  /** Alignment along the trigger's edge. Default "center". */
  align?: Align;
  /** Gap between trigger and panel, in px — the length of the gooey neck. Default 14. */
  sideOffset?: number;
  /** Corner radius of the open panel, in px. Default 16. */
  panelRadius?: number;
  /** Blur radius feeding the goo filter — higher melts more. Default 8. */
  gooStrength?: number;
  className?: string;
}

export function Popover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger = "click",
  side = "bottom",
  align = "center",
  sideOffset = 14,
  panelRadius = 16,
  gooStrength = 8,
  className,
}: PopoverProps) {
  const reduce = useReducedMotion() ?? false;
  const gooId = useId().replace(/:/g, "");
  const contentId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useMotionValue(defaultOpen ? 1 : 0);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = controlledOpen !== undefined;
  const open = controlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openHover = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose, setOpen]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  }, [cancelClose, setOpen]);

  const toggle = useCallback(() => setOpen(!open), [setOpen, open]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    const animation = animate(
      progress,
      open ? 1 : 0,
      reduce
        ? { duration: 0 }
        : open
          ? GOO_OPEN_SPRING
          : GOO_CLOSE_SPRING,
    );
    return () => animation.stop();
  }, [open, progress, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // The panel is portalled, so both trees participate in outside detection.
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        !contentRef.current?.contains(target)
      )
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    if (trigger === "click") window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen, trigger]);

  const ctx = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      toggle,
      openHover,
      scheduleClose,
      triggerMode: trigger,
      side,
      align,
      gap: sideOffset,
      panelRadius,
      gooStrength,
      reduce,
      gooId,
      contentId,
      progress,
      triggerRef,
      contentRef,
    }),
    [
      open,
      setOpen,
      toggle,
      openHover,
      scheduleClose,
      trigger,
      side,
      align,
      sideOffset,
      panelRadius,
      gooStrength,
      reduce,
      gooId,
      contentId,
      progress,
    ],
  );

  const hoverHandlers =
    trigger === "hover"
      ? { onMouseEnter: openHover, onMouseLeave: scheduleClose }
      : {};

  return (
    <PopoverContext.Provider value={ctx}>
      <div
        ref={rootRef}
        className={cn("relative inline-flex isolate", className)}
        {...hoverHandlers}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object")
        (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export interface PopoverTriggerProps {
  /** A single focusable element (e.g. a Button) that opens the popover. */
  children: ReactElement;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const ctx = usePopoverContext("PopoverTrigger");

  if (!isValidElement(children)) return children;

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = child.props;
  const childRef = (childProps as { ref?: Ref<HTMLElement> }).ref;

  const compose =
    (name: string, handler: () => void) =>
    (event: { defaultPrevented?: boolean }) => {
      (childProps[name] as ((e: unknown) => void) | undefined)?.(event);
      if (!event.defaultPrevented) handler();
    };

  const handlers: Record<string, unknown> =
    ctx.triggerMode === "hover"
      ? {
          onFocus: compose("onFocus", ctx.openHover),
          onBlur: compose("onBlur", ctx.scheduleClose),
        }
      : { onClick: compose("onClick", ctx.toggle) };

  return cloneElement(child, {
    ...handlers,
    ref: mergeRefs(childRef, (node: HTMLElement | null) => {
      ctx.triggerRef.current = node;
    }),
    // Above the goo layer (z-[-1]) so the neck reads behind it.
    className: cn("relative z-0", childProps.className as string | undefined),
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.open,
    "aria-controls": ctx.open ? ctx.contentId : undefined,
    "data-state": ctx.open ? "open" : "closed",
  });
}

const ALIGN_ORIGIN: Record<Align, string> = {
  start: "left",
  center: "center",
  end: "right",
};

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

export function PopoverContent({ children, className }: PopoverContentProps) {
  const ctx = usePopoverContext("PopoverContent");
  const [portalReady, setPortalReady] = useState(false);
  const {
    side,
    align,
    gap,
    panelRadius,
    gooStrength,
    reduce,
    gooId,
    contentId,
    progress,
    triggerRef,
    contentRef,
    open,
    triggerMode,
    openHover,
    scheduleClose,
  } = ctx;

  const measureRef = contentRef;
  const blobRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const supportsShapeRef = useRef(false);
  const layout = usePopoverPortalPosition(
    triggerRef,
    measureRef,
    portalReady,
  );

  useEffect(() => setPortalReady(true), []);

  const geo = useMemo(
    () =>
      buildGeo(
        layout?.trigger.width ?? 0,
        layout?.trigger.height ?? 0,
        layout?.content.width ?? 0,
        layout?.content.height ?? 0,
        side,
        align,
        gap,
        panelRadius,
      ),
    [layout, side, align, gap, panelRadius],
  );

  // Morph the same clip on the goo body and the content, so the whole popover
  // oozes as one and the text reveals with it.
  const render = useCallback((g: Geo | null, p: number) => {
    if (!g || g.layerW === 0) return;
    const clip = clipForProgress(g, p, supportsShapeRef.current);
    if (blobRef.current) blobRef.current.style.clipPath = clip;
    if (clipRef.current) clipRef.current.style.clipPath = clip;
  }, []);

  useLayoutEffect(() => {
    supportsShapeRef.current =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports(
        "clip-path",
        "shape(from 0px 0px, line to 1px 1px, close)",
      );
    geoRef.current = geo;
    render(geo, progress.get());
  }, [geo, progress, render]);

  useMotionValueEvent(progress, "change", (p) => render(geoRef.current, p));

  const hoverHandlers =
    triggerMode === "hover"
      ? { onMouseEnter: openHover, onMouseLeave: scheduleClose }
      : {};
  const maskId = `${gooId}-trigger-cutout`;

  // Match the server and first client render, then attach the portal after
  // hydration. This preserves SSR without regenerating the page on the client.
  if (!portalReady) return null;

  return createPortal(
    <div
      data-popover-portal=""
      className="pointer-events-none fixed left-0 top-0 z-[9999] isolate size-0"
      style={{
        visibility: layout ? "visible" : "hidden",
        transform: `translate3d(${layout?.trigger.left ?? 0}px, ${layout?.trigger.top ?? 0}px, 0)`,
      }}
    >
      {/* Goo filter: blur, sharpen the alpha back into solid shapes, then lay
          the crisp original on top so blobs merge with liquid edges. The mask
          removes the real trigger area so this top-layer copy never covers its
          label or focus ring. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <title>Popover visual effects</title>
        <defs>
          <filter id={gooId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={gooStrength}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={geo.layerW}
            height={geo.layerH}
          >
            <rect width={geo.layerW} height={geo.layerH} fill="white" />
            <rect
              x={geo.trigger.x}
              y={geo.trigger.y}
              width={geo.trigger.w}
              height={geo.trigger.h}
              rx={geo.trigger.r}
              fill="black"
            />
          </mask>
        </defs>
      </svg>

      {/* Goo body: static trigger pill + morphing blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[-1]"
        style={{
          left: geo.left,
          top: geo.top,
          width: geo.layerW,
          height: geo.layerH,
          filter: reduce ? undefined : `url(#${gooId})`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      >
        <div
          className="absolute bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          style={{
            left: geo.trigger.x,
            top: geo.trigger.y,
            width: geo.trigger.w,
            height: geo.trigger.h,
            borderRadius: geo.trigger.r,
          }}
        />
        <div
          ref={blobRef}
          className="absolute inset-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          style={{
            clipPath: clipForProgress(geo, progress.get(), false),
          }}
        />
      </div>

      {/* Content is clipped by the same morph. The portal wrapper stays
          pointer-transparent; only the fully open panel accepts interaction. */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          left: geo.left,
          top: geo.top,
          width: geo.layerW,
          height: geo.layerH,
        }}
      >
        <div
          ref={clipRef}
          inert={!open}
          className="absolute inset-0"
          style={{
            clipPath: clipForProgress(geo, progress.get(), false),
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div
            ref={measureRef}
            id={contentId}
            role="dialog"
            {...hoverHandlers}
            style={{
              position: "absolute",
              left: geo.panel.x,
              top: geo.panel.y,
              transformOrigin: `${ALIGN_ORIGIN[align]} ${side === "bottom" ? "top" : "bottom"}`,
            }}
            className={cn(
              "w-max max-w-[min(92vw,20rem)] p-4 text-neutral-900 dark:text-neutral-100 outline-none rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl",
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}


## API Reference

### Popover

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | — | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial open state. |
| `onOpenChange` | `((open: boolean) => void)` | — | No | — |
| `trigger` | `"click" \| "hover"` | `click` | No | How the popover is summoned. Default "click". |
| `side` | `"top" \| "bottom"` | `bottom` | No | Which side of the trigger the panel oozes out of. Default "bottom". |
| `align` | `"start" \| "center" \| "end"` | `center` | No | Alignment along the trigger's edge. Default "center". |
| `sideOffset` | `number` | `14` | No | Gap between trigger and panel, in px — the length of the gooey neck. Default 14. |
| `panelRadius` | `number` | `16` | No | Corner radius of the open panel, in px. Default 16. |
| `gooStrength` | `number` | `8` | No | Blur radius feeding the goo filter — higher melts more. Default 8. |
| `className` | `string` | — | No | — |

### PopoverTrigger

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Yes | A single focusable element (e.g. a Button) that opens the popover. |

### PopoverContent

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

### MorphPopover

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | — | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial open state. |
| `onOpenChange` | `((open: boolean) => void)` | — | No | — |
| `className` | `string` | — | No | — |

### MorphPopoverContent

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `bottom` | No | — |
| `align` | `"start" \| "end"` | `end` | No | — |
| `sideOffset` | `number` | `8` | No | Gap between trigger and panel, in px. Default 8. |
| `radius` | `number` | `16` | No | Panel corner radius, in px. Default 16. |
| `className` | `string` | — | No | — |

## Source

- Registry detail: https://beui.dev/r/popover
- Raw source: https://beui.dev/r/popover/raw
- GitHub: https://github.com/starc007/ui-components

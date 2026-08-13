"use client";

import { motion, type Transition } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePopoverPortalPosition } from "@/components/motion/popover-position";
import { cn } from "@/lib/utils";
import { useComboboxContext } from "./context";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";

const COMBOBOX_MORPH: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.15,
};

export interface ComboboxContentProps {
  children: ReactNode;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  avoidCollisions?: boolean;
  className?: string;
}

export function ComboboxContent({
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  avoidCollisions = false,
  className,
}: ComboboxContentProps) {
  const context = useComboboxContext("ComboboxContent");
  const measureRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [morphReady, setMorphReady] = useState(false);
  const layout = usePopoverPortalPosition(
    context.triggerRef,
    measureRef,
    portalReady,
  );

  useEffect(() => setPortalReady(true), []);
  useLayoutEffect(() => {
    if (!portalReady) return;
    const readyFrame = requestAnimationFrame(() => setMorphReady(true));
    return () => cancelAnimationFrame(readyFrame);
  }, [portalReady]);

  if (!portalReady) return null;

  const triggerLeft = layout?.trigger.left ?? 0;
  const triggerWidth = layout?.trigger.width ?? 0;
  const surfaceHeight = layout?.content.height ?? 0;

  return createPortal(
    <motion.div
      ref={context.contentRef}
      data-combobox-content=""
      data-side="bottom"
      aria-hidden={!context.open}
      inert={!context.open}
      initial={false}
      animate={{
        height: context.open ? surfaceHeight : 0,
        opacity: context.open ? 1 : 0,
        y: context.open ? sideOffset : 0,
      }}
      transition={
        context.reduce || !morphReady ? { duration: 0 } : COMBOBOX_MORPH
      }
      style={
        {
          left: triggerLeft,
          top: layout ? layout.trigger.top + layout.trigger.height : undefined,
          width: triggerWidth > 0 ? triggerWidth : undefined,
          minWidth: triggerWidth > 0 ? triggerWidth : undefined,
          maxWidth: triggerWidth > 0 ? triggerWidth : undefined,
          pointerEvents: context.open ? "auto" : "none",
          transformOrigin: "top",
          visibility: layout ? "visible" : "hidden",
        } as CSSProperties
      }
      className={cn(
        "fixed z-[9999] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl outline-none will-change-[height,transform]",
        className,
      )}
    >
      <motion.div
        ref={measureRef}
        initial={false}
        animate={{ opacity: context.open ? 1 : 0 }}
        transition={
          context.reduce || !morphReady ? { duration: 0 } : COMBOBOX_MORPH
        }
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

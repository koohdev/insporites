"use client";
// beui.dev/components/motion/drawer

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createTickPlayer } from "@/lib/tick-sound";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  sound?: boolean;
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
  sound = true,
  children,
  className,
  backdropClassName,
  ariaLabel,
  dismissable = true,
}: DrawerProps) {
  const reduce = useReducedMotion();

  const soundPlayer = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayer.current) soundPlayer.current = createTickPlayer();
    return soundPlayer.current;
  }, []);

  useEffect(() => {
    return () => {
      soundPlayer.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (sound && open) {
      getSoundPlayer().prepare();
      getSoundPlayer().playClick();
    }
  }, [open, sound, getSoundPlayer]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (sound) {
          getSoundPlayer().prepare();
          getSoundPlayer().playClick();
        }
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange, sound, getSoundPlayer]);

  const offscreen = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close"
            tabIndex={dismissable ? 0 : -1}
            onClick={() => {
              if (dismissable) {
                if (sound) {
                  getSoundPlayer().prepare();
                  getSoundPlayer().playClick();
                }
                onOpenChange(false);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={cn(
              "absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-xs",
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
              "absolute inset-y-0 flex w-80 max-w-[85vw] flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-2xl",
              side === "right"
                ? "right-0 border-l border-neutral-200 dark:border-neutral-800"
                : "left-0 border-r border-neutral-200 dark:border-neutral-800",
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

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface FadeTransitionProps {
  viewKey: string | number;
  children: ReactNode;
  className?: string;
}

export function FadeTransition({ viewKey, children, className }: FadeTransitionProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={reduce ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)", scale: 0.98 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)", scale: 0.98 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className={cn("w-full h-full text-neutral-900 dark:text-white", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

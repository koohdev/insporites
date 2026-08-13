"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ParallaxTransitionProps {
  className?: string;
}

export function ParallaxTransition({ className }: ParallaxTransitionProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const CARDS = [
    { title: "Layer 01 — Depth Overview", bg: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900", depth: "01" },
    { title: "Layer 02 — Parallax Stagger", bg: "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900", depth: "02" },
    { title: "Layer 03 — Reveal Surface", bg: "bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900", depth: "03" },
  ];

  return (
    <div className={cn("w-full flex flex-col items-center gap-4", className)}>
      <div className="flex gap-2">
        {CARDS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shadow-xs",
              index === i
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Layer {i + 1}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm h-36 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-4">
        {CARDS.map((card, i) => {
          const active = i === index;
          const offset = (i - index) * 40;
          return (
            <motion.div
              key={card.title}
              initial={false}
              animate={
                reduce
                  ? { opacity: active ? 1 : 0 }
                  : {
                      y: active ? 0 : offset,
                      scale: active ? 1 : 0.92,
                      opacity: active ? 1 : 0.4,
                      zIndex: CARDS.length - i,
                    }
              }
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className={cn(
                "absolute inset-x-4 top-4 bottom-4 rounded-xl p-4 flex flex-col justify-between shadow-lg",
                card.bg
              )}
            >
              <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider opacity-70">
                <span>Parallax Multi-Depth</span>
                <span>{card.depth}</span>
              </div>
              <h4 className="font-semibold text-sm">{card.title}</h4>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

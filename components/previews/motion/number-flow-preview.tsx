"use client";

import { useState } from "react";
import { Minus, Plus, RefreshCw } from "lucide-react";
import { useCardTheme } from "@/components/component-card";
import { MotionNumberFlow } from "@/components/motion/number-flow";
import { cn } from "@/lib/utils";

export function NumberFlowPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [value, setValue] = useState(148250);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col items-center gap-6 w-full max-w-xs text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Revenue
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            <MotionNumberFlow
              value={value}
              format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setValue((prev) => Math.max(0, prev - 1250))}
            className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Decrease value"
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setValue(148250)}
            className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Reset value"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setValue((prev) => prev + 2450)}
            className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Increase value"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

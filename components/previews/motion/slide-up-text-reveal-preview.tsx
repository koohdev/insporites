"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useCardTheme } from "@/components/component-card";
import { SlideUpTextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

export function SlideUpTextRevealPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [count, setCount] = useState(0);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col items-center justify-center gap-4 text-center max-w-sm">
        <SlideUpTextReveal
          key={count}
          text="Elevate your web UI with masked line slide reveal animations."
          className="text-lg sm:text-xl text-center justify-center"
        />

        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Replay Slide
        </button>
      </div>
    </div>
  );
}

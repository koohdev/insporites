"use client";

import { useState } from "react";
import { RangeSlider } from "@/components/motion/range-slider";
import { useCardTheme } from "@/components/component-card";
import { cn } from "@/lib/utils";

export function RangeSliderPreview() {
  const [value, setValue] = useState(40);
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 p-4 select-none">
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-medium", isDark ? "text-neutral-400" : "text-neutral-600")}>
          Drag handle
        </span>
        <span className={cn("tabular-nums font-semibold", isDark ? "text-white" : "text-neutral-900")}>
          {value}%
        </span>
      </div>
      <RangeSlider
        value={value}
        onValueChange={setValue}
        step={5}
        aria-label="Value"
      />
    </div>
  );
}

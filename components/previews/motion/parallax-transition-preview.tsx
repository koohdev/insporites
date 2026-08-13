"use client";

import { useCardTheme } from "@/components/component-card";
import { ParallaxTransition } from "@/components/motion/parallax-transition";
import { cn } from "@/lib/utils";

export function ParallaxTransitionPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4", isDark ? "dark" : "")}>
      <ParallaxTransition />
    </div>
  );
}

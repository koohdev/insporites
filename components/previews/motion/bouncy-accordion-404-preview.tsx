"use client";

import { BouncyAccordion } from "@/components/bouncy-accordion";
import { useCardTheme } from "@/components/component-card";
import { cn } from "@/lib/utils";

export function BouncyAccordion404Preview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4", isDark ? "dark" : "")}>
      <div className="w-full max-w-[448px]">
        <BouncyAccordion />
      </div>
    </div>
  );
}

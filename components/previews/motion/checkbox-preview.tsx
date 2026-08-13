"use client";

import { useState } from "react";
import { useCardTheme } from "@/components/component-card";
import { Checkbox } from "@/components/motion/checkbox";
import { cn } from "@/lib/utils";

export function CheckboxPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [terms, setTerms] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col gap-3.5 w-full max-w-xs">
        <Checkbox
          checked={terms}
          onCheckedChange={setTerms}
          label="Accept terms and conditions"
        />
        <Checkbox
          checked={updates}
          onCheckedChange={setUpdates}
          label="Email me product updates"
        />
        <Checkbox checked indeterminate onCheckedChange={() => {}} label="Select all (partial)" />
        <Checkbox checked disabled onCheckedChange={() => {}} label="Disabled state" />
      </div>
    </div>
  );
}

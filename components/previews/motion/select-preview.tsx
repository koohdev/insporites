"use client";

import { useState } from "react";
import { useCardTheme } from "@/components/component-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import {
  MorphSelect,
  MorphSelectContent,
  MorphSelectItem,
  MorphSelectTrigger,
  MorphSelectValue,
} from "@/components/motion/select-morph";
import { cn } from "@/lib/utils";

export function SelectPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [selectVal, setSelectVal] = useState("next");
  const [morphVal, setMorphVal] = useState("react");

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-lg min-h-[220px]">
        {/* Standard Pinch Select */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Standard Pinch Select
          </span>
          <Select value={selectVal} onValueChange={setSelectVal}>
            <SelectTrigger>
              <SelectValue placeholder="Pick framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Morphing Select */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Morphing Surface Select
          </span>
          <MorphSelect value={morphVal} onValueChange={setMorphVal}>
            <MorphSelectTrigger>
              <MorphSelectValue placeholder="Pick library" />
            </MorphSelectTrigger>
            <MorphSelectContent>
              <MorphSelectItem value="react">React</MorphSelectItem>
              <MorphSelectItem value="vue">Vue.js</MorphSelectItem>
              <MorphSelectItem value="svelte">Svelte</MorphSelectItem>
              <MorphSelectItem value="solid">Solid.js</MorphSelectItem>
            </MorphSelectContent>
          </MorphSelect>
        </div>
      </div>
    </div>
  );
}

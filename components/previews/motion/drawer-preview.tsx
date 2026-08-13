"use client";

import { useState } from "react";
import { Drawer } from "@/components/motion/drawer";
import { useCardTheme } from "@/components/component-card";
import { X, PanelLeft, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DrawerPreview() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const openWith = (s: "left" | "right") => {
    setSide(s);
    setOpen(true);
  };

  return (
    <div className="flex items-center justify-center gap-3 p-4 w-full">
      <button
        type="button"
        onClick={() => openWith("left")}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors cursor-pointer",
          isDark
            ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800"
            : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100",
        )}
      >
        <PanelLeft className="h-4 w-4" />
        Open left
      </button>
      <button
        type="button"
        onClick={() => openWith("right")}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-opacity cursor-pointer shadow-xs",
          isDark
            ? "bg-white text-neutral-900 hover:opacity-90 font-semibold"
            : "bg-neutral-900 text-white hover:opacity-90 font-semibold",
        )}
      >
        <PanelRight className="h-4 w-4" />
        Open right
      </button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        ariaLabel="Demo drawer"
        className="gap-4 p-6 justify-between"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Navigation Drawer
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Slides in smoothly from the <strong className="text-neutral-900 dark:text-white">{side}</strong>.
            Features spring physics, body scroll locking, and Esc-to-close keyboard support.
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/80 p-3 text-xs font-medium text-neutral-900 dark:text-neutral-100 transition-colors">
              ⚡ Smooth Framer Motion spring physics
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/80 p-3 text-xs font-medium text-neutral-900 dark:text-neutral-100 transition-colors">
              🔒 Automatic body scroll lock
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/80 p-3 text-xs font-medium text-neutral-900 dark:text-neutral-100 transition-colors">
              ⌨️ Keyboard accessible (Esc key)
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Close Drawer
        </button>
      </Drawer>
    </div>
  );
}

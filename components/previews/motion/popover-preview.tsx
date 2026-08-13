"use client";

import { useCardTheme } from "@/components/component-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/motion/popover";
import { cn } from "@/lib/utils";

export function PopoverPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-lg min-h-[220px]">
        {/* Click Trigger Popover */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Click Trigger
          </span>
          <Popover side="top" trigger="click">
            <PopoverTrigger>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium text-sm transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer shadow-xs"
              >
                Click Popover
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2 w-56">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Click Ooze Surface</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Smooth liquid neck opens on click and closes when clicking outside or pressing Escape.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Hover Trigger Popover */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Hover Trigger
          </span>
          <Popover side="top" trigger="hover">
            <PopoverTrigger>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium text-sm transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer shadow-xs"
              >
                Hover Popover
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2 w-56">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Hover Ooze Surface</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Instant liquid morph on hover focus with smooth exit delay when leaving trigger.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

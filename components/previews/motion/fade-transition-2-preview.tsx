"use client";

import { useState } from "react";
import { useCardTheme } from "@/components/component-card";
import { FadeTransition } from "@/components/motion/fade-transition";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "overview", title: "Overview Panel", content: "Cross-fade container view with blur & scale spring transitions." },
  { id: "analytics", title: "Analytics Metrics", content: "Realtime tracking metrics with zero layout shift during navigation." },
  { id: "settings", title: "User Preferences", content: "Security keys, notification preferences, and workspace settings." },
];

export function FadeTransition2Preview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-4", isDark ? "dark" : "")}>
      <div className="flex gap-2">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shadow-xs",
              activeTab === i
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            {v.title.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm min-h-[120px] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-4 flex items-center justify-center text-center">
        <FadeTransition viewKey={VIEWS[activeTab].id}>
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{VIEWS[activeTab].title}</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{VIEWS[activeTab].content}</p>
          </div>
        </FadeTransition>
      </div>
    </div>
  );
}

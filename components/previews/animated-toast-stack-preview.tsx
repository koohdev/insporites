"use client";

import React, { useState } from "react";
import { Check, LoaderCircle, X, AlertTriangle } from "lucide-react";
import {
  AnimatedToastStack,
  type ToastInput,
  type ToastPosition,
  useAnimatedToastStack,
} from "@/components/animated-toast-stack";
import { cn } from "@/lib/utils";

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const EXAMPLES: Array<ToastInput & { label: string }> = [
  {
    label: "Promise / Loading",
    status: "loading",
    title: "Deploying changes to edge",
    description: "Bundling component registry metadata and assets...",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component Published",
    description: "Registry endpoint and raw source are live.",
  },
  {
    label: "Warning",
    status: "warning",
    title: "High Memory Usage",
    description: "Heap allocation reached 82% threshold.",
  },
  {
    label: "Error",
    status: "error",
    title: "Build Failed",
    description: "Syntax error detected in bundle manifest.",
  },
];

export function AnimatedToastStackPreview() {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({
      defaultDuration: 4200,
      limit: 5,
    });

  const openToast = (example: ToastInput & { label: string }) => {
    const id = showToast(example);
    if (example.status === "loading") {
      setTimeout(() => {
        updateToast(id, {
          status: "success",
          title: "Deployment Complete",
          description: "Toast updated in-place from loading to success!",
          duration: 3500,
        });
      }, 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-2 relative">
      <AnimatedToastStack
        toasts={toasts}
        onDismiss={dismissToast}
        position={position}
        placement="fixed"
        maxVisible={4}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => openToast(ex)}
            className="h-8 px-3.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            {ex.status === "loading" ? (
              <LoaderCircle className="h-3.5 w-3.5 text-blue-500 animate-spin" />
            ) : ex.status === "success" ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : ex.status === "warning" ? (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-rose-500" />
            )}
            <span>{ex.label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={clearToasts}
          className="h-8 px-3.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Clear Stack
        </button>
      </div>

      {/* Position selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => setPosition(pos)}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-full transition-all cursor-pointer",
              position === pos
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs"
                : "bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300/70 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            )}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}

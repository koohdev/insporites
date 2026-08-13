"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastStatus = "info" | "success" | "warning" | "error" | "loading" | "neutral";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastInput {
  id?: string;
  status?: ToastStatus;
  title: string;
  description?: React.ReactNode;
  duration?: number; // 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AnimatedToast extends ToastInput {
  id: string;
  createdAt: number;
}

export interface UseAnimatedToastStackOptions {
  initialToasts?: ToastInput[];
  defaultDuration?: number;
  limit?: number;
}

export function useAnimatedToastStack(options: UseAnimatedToastStackOptions = {}) {
  const { defaultDuration = 4200, limit = 5 } = options;
  const [toasts, setToasts] = useState<AnimatedToast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (input: ToastInput) => {
      const id = input.id || `toast-${Math.random().toString(36).substring(2, 9)}`;
      const duration = input.duration !== undefined ? input.duration : defaultDuration;
      const newToast: AnimatedToast = {
        ...input,
        id,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        const next = [newToast, ...filtered];
        return limit ? next.slice(0, limit) : next;
      });

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [defaultDuration, limit, dismissToast]
  );

  const updateToast = useCallback((id: string, patch: Partial<ToastInput>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  return {
    toasts,
    showToast,
    updateToast,
    dismissToast,
    clearToasts,
  };
}

export interface AnimatedToastStackProps {
  toasts: AnimatedToast[];
  onDismiss?: (id: string) => void;
  position?: ToastPosition;
  placement?: "static" | "fixed" | "absolute";
  maxVisible?: number;
  className?: string;
  classNames?: {
    surface?: string;
    title?: string;
    description?: string;
  };
  icons?: Partial<Record<ToastStatus, React.ReactNode>>;
}

const defaultIcons: Record<ToastStatus, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />,
  loading: <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />,
  neutral: <Sparkles className="h-4 w-4 text-neutral-400 shrink-0" />,
};

const positionStyles: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

export function AnimatedToastStack({
  toasts,
  onDismiss,
  position = "bottom-right",
  placement = "fixed",
  maxVisible = 4,
  className,
  classNames,
  icons = {},
}: AnimatedToastStackProps) {
  const reduce = useReducedMotion();
  const isTop = position.startsWith("top");

  const visibleToasts = toasts.slice(0, maxVisible);

  return (
    <div
      className={cn(
        "z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm sm:w-80",
        placement === "fixed" && "fixed",
        placement === "absolute" && "absolute",
        positionStyles[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleToasts.map((toast, index) => {
          const statusIcon = icons[toast.status || "info"] || defaultIcons[toast.status || "info"];

          return (
            <motion.div
              key={toast.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                  onDismiss?.(toast.id);
                }
              }}
              initial={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: isTop ? -24 : 24,
                      scale: 0.9,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1 - index * 0.04,
                zIndex: visibleToasts.length - index,
              }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.85,
                      transition: { duration: 0.15 },
                    }
              }
              transition={{
                type: "spring",
                duration: 0.45,
                bounce: 0.15,
              }}
              className={cn(
                "pointer-events-auto relative flex w-full items-center gap-3 rounded-full border bg-[#151515] p-3 px-4 shadow-xl backdrop-blur-md dark:bg-[#151515] dark:border-neutral-800 border-neutral-800 text-white transition-colors selection:bg-blue-500/20",
                classNames?.surface
              )}
            >
              <div className="shrink-0">{statusIcon}</div>
              <div className="flex-1 min-w-0 pr-1">
                <div
                  className={cn(
                    "text-xs font-semibold text-white truncate",
                    classNames?.title
                  )}
                >
                  {toast.title}
                </div>
                {toast.description && (
                  <div
                    className={cn(
                      "mt-0.5 text-[11px] leading-snug text-white/85 break-words font-normal",
                      classNames?.description
                    )}
                  >
                    {toast.description}
                  </div>
                )}
                {toast.action && (
                  <button
                    type="button"
                    onClick={toast.action.onClick}
                    className="mt-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDismiss?.(toast.id)}
                className="shrink-0 p-1 text-white/70 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

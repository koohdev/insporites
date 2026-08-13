"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ActionSwapItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export type ActionSwapVariant = "primary" | "secondary" | "outline" | "ghost";
export type ActionSwapSize = "sm" | "md" | "lg" | "icon";

export interface ActionSwapButtonProps {
  items: ActionSwapItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, item: ActionSwapItem) => void;
  variant?: ActionSwapVariant;
  size?: ActionSwapSize;
  iconOnly?: boolean;
  cycle?: boolean;
  className?: string;
}

const variantStyles: Record<ActionSwapVariant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-xs",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700/80 border border-neutral-200 dark:border-neutral-700/80",
  outline:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
};

const sizeStyles: Record<ActionSwapSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg font-medium",
  md: "h-9 px-4 text-sm gap-2 rounded-lg font-medium",
  lg: "h-10 px-5 text-base gap-2.5 rounded-xl font-semibold",
  icon: "h-9 w-9 p-0 justify-center rounded-lg",
};

// ==========================================
// 1. BLUR SWAP BUTTON
// ==========================================

export function ActionSwapBlurButton({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "primary",
  size = "md",
  iconOnly = false,
  cycle = true,
  className,
}: ActionSwapButtonProps) {
  const initialValue = defaultValue || items[0]?.id || "";
  const [internalValue, setInternalValue] = useState(initialValue);
  const activeId = controlledValue !== undefined ? controlledValue : internalValue;

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem = items[activeIndex] || items[0];

  const handleClick = () => {
    if (!cycle && activeIndex === items.length - 1) return;
    const nextIndex = (activeIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    if (controlledValue === undefined) setInternalValue(nextItem.id);
    onValueChange?.(nextItem.id, nextItem);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={activeItem?.ariaLabel || activeItem?.label}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        iconOnly && "w-9 h-9 p-0 justify-center",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeItem?.id}
          initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(4px)" }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          {activeItem?.icon && <span className="shrink-0">{activeItem.icon}</span>}
          {!iconOnly && activeItem?.label && <span>{activeItem.label}</span>}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

// ==========================================
// 2. CASCADE SWAP BUTTON (Slot letter drop)
// ==========================================

export function ActionSwapCascadeButton({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "primary",
  size = "md",
  iconOnly = false,
  cycle = true,
  className,
}: ActionSwapButtonProps) {
  const initialValue = defaultValue || items[0]?.id || "";
  const [internalValue, setInternalValue] = useState(initialValue);
  const activeId = controlledValue !== undefined ? controlledValue : internalValue;

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem = items[activeIndex] || items[0];

  const handleClick = () => {
    if (!cycle && activeIndex === items.length - 1) return;
    const nextIndex = (activeIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    if (controlledValue === undefined) setInternalValue(nextItem.id);
    onValueChange?.(nextItem.id, nextItem);
  };

  const letters = activeItem?.label.split("") || [];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={activeItem?.ariaLabel || activeItem?.label}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        iconOnly && "w-9 h-9 p-0 justify-center",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          {activeItem?.icon && (
            <motion.span
              key={`icon-${activeItem.id}`}
              initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              {activeItem.icon}
            </motion.span>
          )}
        </AnimatePresence>

        {!iconOnly && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`label-${activeItem?.id}`}
              className="flex items-center"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: -10, filter: "blur(2px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                    exit: { opacity: 0, y: 10, filter: "blur(2px)" },
                  }}
                  transition={{
                    duration: 0.15,
                    delay: index * 0.025,
                    ease: "easeOut",
                  }}
                  className="inline-block whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </button>
  );
}

// ==========================================
// 3. ROLL SWAP BUTTON (Vertical slot roll)
// ==========================================

export function ActionSwapRollButton({
  items,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "primary",
  size = "md",
  iconOnly = false,
  cycle = true,
  className,
}: ActionSwapButtonProps) {
  const initialValue = defaultValue || items[0]?.id || "";
  const [internalValue, setInternalValue] = useState(initialValue);
  const activeId = controlledValue !== undefined ? controlledValue : internalValue;

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem = items[activeIndex] || items[0];

  const handleClick = () => {
    if (!cycle && activeIndex === items.length - 1) return;
    const nextIndex = (activeIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    if (controlledValue === undefined) setInternalValue(nextItem.id);
    onValueChange?.(nextItem.id, nextItem);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={activeItem?.ariaLabel || activeItem?.label}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        iconOnly && "w-9 h-9 p-0 justify-center",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeItem?.id}
          initial={{ y: 16, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          {activeItem?.icon && <span className="shrink-0">{activeItem.icon}</span>}
          {!iconOnly && activeItem?.label && <span>{activeItem.label}</span>}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

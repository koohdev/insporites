"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  ariaLabel,
  className,
}: SwitchProps) {
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <motion.button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        whileTap={reduce || disabled ? undefined : { scale: 0.94 }}
        transition={SPRING_PRESS}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent p-0.5 outline-none transition-colors duration-200 cursor-pointer shadow-xs",
          checked
            ? "bg-neutral-900 dark:bg-white"
            : "bg-neutral-200 dark:bg-neutral-800",
        )}
      >
        <motion.span
          layout
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 30 }
          }
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full shadow-md transition-colors",
            checked
              ? "translate-x-5 bg-white dark:bg-neutral-900"
              : "translate-x-0 bg-white dark:bg-neutral-400",
          )}
        />
      </motion.button>

      {label ? (
        <span className="select-none text-sm font-medium text-neutral-900 dark:text-white">
          {label}
        </span>
      ) : null}
    </label>
  );
}

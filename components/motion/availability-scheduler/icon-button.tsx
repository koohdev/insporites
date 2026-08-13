"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export function IconButton({
  onClick,
  label,
  disabled,
  expanded,
  reduce,
  children,
  className,
  // Rest props let a wrapping Tooltip inject its hover/focus handlers.
  ...rest
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  expanded?: boolean;
  reduce: boolean;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <motion.button
      {...rest}
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduce || disabled ? undefined : { scale: 0.86 }}
      transition={SPRING_PRESS}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 outline-none transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400/50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

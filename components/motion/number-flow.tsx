"use client";

import NumberFlow, { type NumberFlowProps } from "@number-flow/react";
import { cn } from "@/lib/utils";

export interface MotionNumberFlowProps extends NumberFlowProps {
  className?: string;
}

export function MotionNumberFlow({ className, ...props }: MotionNumberFlowProps) {
  return (
    <span className={cn("font-mono tracking-tight text-neutral-900 dark:text-white font-semibold", className)}>
      <NumberFlow {...props} />
    </span>
  );
}

export { NumberFlow };

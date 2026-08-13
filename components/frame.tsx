"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FrameContextType = {
  variant: "default" | "ghost";
  spacing: "sm" | "default" | "lg";
  stacked: boolean;
  dense: boolean;
};

const FrameContext = React.createContext<FrameContextType>({
  variant: "default",
  spacing: "default",
  stacked: false,
  dense: false,
});

export interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost";
  spacing?: "sm" | "default" | "lg";
  stacked?: boolean;
  dense?: boolean;
}

export function Frame({
  variant = "default",
  spacing = "default",
  stacked = false,
  dense = false,
  className,
  children,
  ...props
}: FrameProps) {
  return (
    <FrameContext.Provider value={{ variant, spacing, stacked, dense }}>
      <div
        className={cn(
          "flex flex-col [--frame-radius:24px] w-full",
          // Outer container styles for frame
          variant === "default" && [
            "rounded-[24px] border border-neutral-200 bg-white text-neutral-900 shadow-xs",
            stacked ? "overflow-hidden" : "",
          ],
          // If not stacked, add gaps between panels
          !stacked && {
            "gap-2": spacing === "sm",
            "gap-4": spacing === "default",
            "gap-6": spacing === "lg",
          },
          // Padding inside the frame container
          variant === "default" &&
            !stacked && {
              "p-1": spacing === "sm",
              "p-1.5": spacing === "default",
              "p-2": spacing === "lg",
            },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FrameContext.Provider>
  );
}

export interface FramePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  dense?: boolean;
}

export function FramePanel({
  className,
  children,
  dense: localDense,
  ...props
}: FramePanelProps) {
  const {
    variant,
    spacing,
    stacked,
    dense: contextDense,
  } = React.useContext(FrameContext);
  const dense = localDense ?? contextDense;

  return (
    <div
      className={cn(
        "flex flex-col relative w-full flex-1",
        // Stacked styling vs non-stacked
        stacked
          ? "border-b last:border-b-0 border-neutral-200 bg-white first:rounded-t-[20px] last:rounded-b-[20px]"
          : variant === "ghost"
            ? "border border-neutral-200 bg-white text-neutral-900 shadow-xs rounded-[20px]"
            : "border border-neutral-200/80 bg-white rounded-[18px]",
        // Padding for the panel itself unless dense is true
        !dense
          ? {
              "p-3": spacing === "sm",
              "p-5": spacing === "default",
              "p-7": spacing === "lg",
            }
          : "p-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type FrameHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function FrameHeader({
  className,
  children,
  ...props
}: FrameHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export type FrameTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function FrameTitle({ className, children, ...props }: FrameTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export type FrameDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FrameDescription({
  className,
  children,
  ...props
}: FrameDescriptionProps) {
  return (
    <p className={cn("text-sm text-neutral-500", className)} {...props}>
      {children}
    </p>
  );
}

export type FrameFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function FrameFooter({
  className,
  children,
  ...props
}: FrameFooterProps) {
  return (
    <div className={cn("flex items-center mt-auto", className)} {...props}>
      {children}
    </div>
  );
}

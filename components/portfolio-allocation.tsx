"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface PeriodData {
  percentage: number;
  change: string;
  isPositive: boolean;
  exposure: string;
}

export type PeriodKey = "week" | "month" | "year";

export interface PortfolioAllocationCardProps {
  data?: Record<PeriodKey, PeriodData>;
  totalSegments?: number;
  className?: string;
}

const defaultData: Record<PeriodKey, PeriodData> = {
  week: { percentage: 46, change: "+3.4%", isPositive: true, exposure: "$4.7M" },
  month: { percentage: 68, change: "+8.2%", isPositive: true, exposure: "$9.4M" },
  year: { percentage: 85, change: "-1.5%", isPositive: false, exposure: "$18.2M" },
};

const avatars = [
  {
    name: "Maya Stone",
    src: "https://images.pexels.com/photos/30272165/pexels-photo-30272165.jpeg?w=96&h=96&fit=crop",
  },
  {
    name: "Ivan Brooks",
    src: "https://images.pexels.com/photos/16983301/pexels-photo-16983301.jpeg?w=96&h=96&fit=crop",
  },
  {
    name: "K",
    src: "",
  },
  {
    name: "Noah Reed",
    src: "https://images.pexels.com/photos/5643423/pexels-photo-5643423.jpeg?w=96&h=96&fit=crop",
  },
];

export function PortfolioAllocationCard({
  data = defaultData,
  totalSegments = 40,
  className,
}: PortfolioAllocationCardProps) {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("week");
  const current = data[activePeriod] || defaultData.week;
  const activeCount = Math.round((current.percentage / 100) * totalSegments);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-[#18181b] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-sans p-5 flex flex-col gap-5 select-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold tracking-tight text-white">
            Portfolio Allocation
          </span>
          <button
            type="button"
            title="Portfolio allocation details"
            className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Period Tabs */}
        <div className="inline-flex h-8 bg-neutral-800/80 p-0.5 rounded-xl border border-white/5">
          {(["week", "month", "year"] as PeriodKey[]).map((period) => {
            const isActive = activePeriod === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "relative px-3 py-1 text-xs font-medium transition-colors capitalize cursor-pointer rounded-lg",
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePeriodTab"
                    className="absolute inset-0 rounded-lg bg-white/15 border border-white/20 shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{period}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {/* Stats */}
        <div className="flex items-baseline gap-2.5">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.percentage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold tracking-tight text-white leading-none tabular-nums"
            >
              {current.percentage}%
            </motion.span>
          </AnimatePresence>

          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded-md tabular-nums",
              current.isPositive
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
            )}
          >
            {current.change}
          </span>
          <span className="text-neutral-400 text-xs">vs prior period</span>
        </div>

        {/* Dynamic Segmented Progress Bar */}
        <div
          className="flex h-7 w-full items-stretch justify-between gap-[2px]"
          role="img"
          aria-label={`Progress bar: ${current.percentage}%`}
        >
          {Array.from({ length: totalSegments }, (_, i) => {
            const isActive = i < activeCount;
            return (
              <span
                key={i}
                className={cn(
                  "h-full w-1 shrink-0 rounded-full transition-colors duration-300",
                  isActive
                    ? current.isPositive
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                    : "bg-neutral-800"
                )}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
          <p className="text-xs text-neutral-400">
            <span>Equities Exposure:</span>
            <span className="font-semibold text-white ml-1.5">
              {current.exposure}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {avatars.map((avatar, idx) => (
                <span
                  key={idx}
                  className="relative flex shrink-0 size-6 rounded-full ring-2 ring-[#18181b] overflow-hidden bg-neutral-800 items-center justify-center text-[10px] font-bold text-neutral-200"
                >
                  {avatar.src ? (
                    <img
                      alt={avatar.name}
                      className="aspect-square size-full object-cover rounded-full"
                      src={avatar.src}
                    />
                  ) : (
                    <span>{avatar.name}</span>
                  )}
                </span>
              ))}
            </div>
            <span className="text-neutral-400 text-xs whitespace-nowrap font-medium">
              6 Members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

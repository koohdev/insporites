"use client";
// beui.dev/components/motion/range-slider

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { createTickPlayer } from "@/lib/tick-sound";
import { SPRING_GLIDE } from "@/lib/ease";
import { type SliderOptions, useSlider } from "@/lib/hooks/use-slider";
import { cn } from "@/lib/utils";

// Bouncy grab feedback for the thumb scale only.
const SPRING_BOUNCY = { type: "spring", stiffness: 500, damping: 14, mass: 0.7 } as const;

export interface RangeSliderProps extends SliderOptions {
  /** Render a tick dot at each step. */
  showTicks?: boolean;
  sound?: boolean;
  className?: string;
}

export function RangeSlider({ showTicks = true, sound = true, className, ...options }: RangeSliderProps) {
  const reduce = useReducedMotion();
  const { percent, dragging, min, max, step, trackProps, sliderProps } = useSlider(options);

  const soundPlayer = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayer.current) soundPlayer.current = createTickPlayer();
    return soundPlayer.current;
  }, []);

  const prevPercent = useRef(percent);

  useEffect(() => {
    return () => {
      soundPlayer.current?.dispose();
    };
  }, []);

  // Spring-smoothed position drives both the thumb and the fill.
  const target = useMotionValue(percent);
  useEffect(() => {
    target.set(percent);
    if (sound && prevPercent.current !== percent) {
      getSoundPlayer().prepare();
      getSoundPlayer().play();
      prevPercent.current = percent;
    }
  }, [percent, target, sound, getSoundPlayer]);
  const smooth = useSpring(target, SPRING_GLIDE);
  const pos = reduce ? target : smooth;
  const left = useMotionTemplate`${pos}%`;
  // Self-offset the thumb from 0% (flush left) to -100% (flush right) of its
  // own width so it stays fully inside the track at both ends — no clip, no gap.
  const thumbX = useTransform(pos, (p) => `${-p}%`);

  // Floor rather than round, so a range the step does not divide (0 to 10 by 4)
  // stops its dots at the last whole step instead of drawing one past max.
  const steps = Math.floor(Number(((max - min) / step).toFixed(6)));
  const ticks =
    showTicks && steps > 0 && steps <= 50
      ? Array.from({ length: steps + 1 }, (_, i) => Number((min + i * step).toFixed(6)))
      : [];

  return (
    <div
      {...trackProps}
      onPointerDown={(e) => {
        if (sound) getSoundPlayer().prepare();
        trackProps.onPointerDown?.(e);
      }}
      className={cn(
        "relative flex h-10 w-full touch-none select-none items-center overflow-hidden rounded-xl bg-neutral-200/90 dark:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700/80",
        options.disabled
          ? "pointer-events-none opacity-50"
          : "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {/* fill — runs from the left edge to the thumb */}
      <motion.div className="absolute inset-y-0 left-0 bg-neutral-900 dark:bg-white" style={{ width: left }} />

      {/* Ticks */}
      <div className="pointer-events-none absolute inset-x-[3px] inset-y-0">
        {ticks.map((t) => {
          const tp = ((t - min) / (max - min)) * 100;
          return (
            <span
              key={t}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 dark:bg-neutral-500"
              style={{ left: `${tp}%` }}
            />
          );
        })}
      </div>

      {/* vertical bar thumb */}
      <motion.div
        {...sliderProps}
        animate={reduce ? undefined : { scaleY: dragging ? 1.35 : 1 }}
        transition={SPRING_BOUNCY}
        className="absolute top-1/2 h-5 w-1.5 rounded-sm bg-neutral-900 dark:bg-white shadow-md outline-none ring-neutral-400/50 focus-visible:ring-4 cursor-pointer"
        style={{ left, x: thumbX, y: "-50%" }}
      />
    </div>
  );
}

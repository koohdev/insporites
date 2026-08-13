"use client";
// beui.dev/components/motion/tabs

import { motion, MotionConfig, useReducedMotion, type Transition } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EASE_OUT } from "@/lib/ease";
import { createTickPlayer } from "@/lib/tick-sound";
import { cn } from "@/lib/utils";

type Variant = "pill" | "underline" | "segment";

type Ctx = {
  value: string;
  setValue: (v: string) => void;
  layoutId: string;
  variant: Variant;
  sound: boolean;
};

const TabsCtx = createContext<Ctx | null>(null);

function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.* must be used inside <Tabs>");
  return ctx;
}

const transition: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 1.2,
};

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = "pill",
  sound = true,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  variant?: Variant;
  sound?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const layoutId = useId();
  const reduce = useReducedMotion();
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const setValue = useCallback(
    (v: string) => {
      if (!controlled) setInternal(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ value: current, setValue, layoutId, variant, sound }),
    [current, layoutId, setValue, variant, sound],
  );

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : transition}>
      <TabsCtx.Provider value={contextValue}>
        <motion.div layoutRoot className={className}>
          {children}
        </motion.div>
      </TabsCtx.Provider>
    </MotionConfig>
  );
}

const listClasses: Record<Variant, string> = {
  pill: "inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 p-1 border border-neutral-200/50 dark:border-neutral-700/50",
  underline: "inline-flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800",
  segment: "inline-flex items-center gap-0 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 p-0.5 border border-neutral-200/50 dark:border-neutral-700/50",
};

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  const { variant } = useTabs();
  return (
    <div role="tablist" className={cn(listClasses[variant], className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  indicatorClassName,
}: {
  value: string;
  children: ReactNode;
  className?: string;
  indicatorClassName?: string;
}) {
  const { value: current, setValue, layoutId, variant, sound } = useTabs();
  const active = current === value;

  const soundPlayerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayerRef.current) soundPlayerRef.current = createTickPlayer();
    return soundPlayerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      soundPlayerRef.current?.dispose();
    };
  }, []);

  const handleClick = () => {
    if (sound && !active) {
      const player = getSoundPlayer();
      player.prepare();
      player.play();
    }
    setValue(value);
  };

  const handlePointerEnter = () => {
    if (sound && !active) {
      getSoundPlayer().playHover();
    }
  };

  if (variant === "underline") {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onPointerEnter={handlePointerEnter}
        onClick={handleClick}
        className={cn(
          "relative isolate px-3 pb-2.5 pt-1 -mb-px text-sm font-medium transition-colors min-h-[44px] inline-flex items-center cursor-pointer",
          active
            ? "text-neutral-900 dark:text-white"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
          className,
        )}
      >
        {children}
        {active ? (
          <motion.span
            layoutId={layoutId}
            className={cn(
              "absolute -bottom-px left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white",
              indicatorClassName,
            )}
          />
        ) : null}
      </button>
    );
  }

  const radius = variant === "pill" ? "rounded-full" : "rounded-md";

  return (
    <div className="relative">
      {active ? (
        <motion.span
          layoutId={layoutId}
          style={{ borderRadius: variant === "pill" ? 9999 : 8 }}
          className={cn(
            "absolute inset-0 bg-neutral-900 dark:bg-white shadow-xs",
            radius,
            indicatorClassName,
          )}
        />
      ) : null}
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onPointerEnter={handlePointerEnter}
        onClick={handleClick}
        className={cn(
          "relative z-10 inline-flex items-center justify-center whitespace-nowrap bg-transparent px-3.5 py-1.5 text-sm font-medium outline-none cursor-pointer",
          "transition-colors",
          active
            ? "text-white dark:text-neutral-900"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
          radius,
          className,
        )}
      >
        {children}
      </button>
    </div>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: current } = useTabs();
  const reduce = useReducedMotion();
  const active = current === value;

  if (!active) {
    return (
      <div hidden className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: reduce ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}

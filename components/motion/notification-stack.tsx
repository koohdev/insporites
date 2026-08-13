"use client";
// beui.dev/components/blocks/notification-stack

import { ArrowUpRight, BellOff } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ActionSwapText } from "@/components/motion/action-swap";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import { useCardTheme, CardTheme } from "@/components/component-card";
import { createTickPlayer } from "@/lib/tick-sound";

export type NotificationStackItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
};

export type NotificationStackClassNames = {
  stack?: string;
  card?: string;
  content?: string;
  title?: string;
  description?: string;
  trailing?: string;
  footer?: string;
  count?: string;
};

export interface NotificationStackProps {
  items: NotificationStackItem[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onViewAll?: () => void;
  maxVisible?: number;
  collapsedLabel?: string;
  expandedLabel?: string;
  emptyLabel?: string;
  sound?: boolean;
  className?: string;
  classNames?: NotificationStackClassNames;
  theme?: CardTheme;
}

const STACK_PEEK = 8;
const STACK_INSET = 12;

function useControllableExpanded({
  expanded,
  defaultExpanded,
  onExpandedChange,
}: {
  expanded?: boolean;
  defaultExpanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const value = expanded ?? internalExpanded;

  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange],
  );

  return [value, setValue] as const;
}

function NotificationCardContent({
  item,
  classNames,
  isDark = true,
}: {
  item: NotificationStackItem;
  classNames?: NotificationStackClassNames;
  isDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-col gap-1 py-3",
        isDark ? "text-white" : "text-neutral-900",
        classNames?.content,
      )}
    >
      <span className="flex min-w-0 items-start justify-between gap-3">
        <span
          className={cn(
            "min-w-0 text-sm font-semibold leading-snug",
            isDark ? "text-white" : "text-neutral-900",
            classNames?.title,
          )}
        >
          {item.title}
        </span>
        {item.trailing ? (
          <span
            className={cn(
              "shrink-0 text-xs font-medium",
              isDark ? "text-white" : "text-neutral-700",
              classNames?.trailing,
            )}
          >
            {item.trailing}
          </span>
        ) : null}
      </span>
      {item.description ? (
        <span
          className={cn(
            "text-xs leading-relaxed font-normal",
            isDark ? "text-white/90" : "text-neutral-600",
            classNames?.description,
          )}
        >
          {item.description}
        </span>
      ) : null}
    </span>
  );
}

export function NotificationStack({
  items,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  onViewAll,
  maxVisible = 3,
  collapsedLabel = "Notifications",
  expandedLabel = "View all",
  emptyLabel = "All caught up",
  sound = true,
  className,
  classNames,
  theme = "dark",
}: NotificationStackProps) {
  const cardTheme = useCardTheme();
  const activeTheme = theme ?? cardTheme ?? "dark";
  const isDark = activeTheme === "dark";

  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const hasFocus = useRef(false);
  const [isExpanded, setIsExpanded] = useControllableExpanded({
    expanded,
    defaultExpanded,
    onExpandedChange,
  });

  const soundPlayer = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayer.current) soundPlayer.current = createTickPlayer();
    return soundPlayer.current;
  }, []);

  useEffect(() => {
    return () => {
      soundPlayer.current?.dispose();
    };
  }, []);

  const visibleItems = items.slice(0, Math.max(1, maxVisible));
  const primaryItem = visibleItems[0];
  const transition: Transition = reduce ? { duration: 0 } : SPRING_LAYOUT;
  const cardTransition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE_OUT };
  const backgroundTransition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.26, ease: EASE_OUT };

  if (!primaryItem) {
    return (
      <div
        className={cn(
          "flex w-full max-w-[22rem] items-center justify-center gap-2 rounded-3xl px-5 py-8 text-sm font-medium transition-colors",
          isDark
            ? "bg-[#151515] border border-neutral-800 text-white"
            : "bg-neutral-100 border border-neutral-200 text-neutral-500",
          className,
        )}
      >
        <BellOff className="h-4 w-4" aria-hidden="true" />
        {emptyLabel}
      </div>
    );
  }

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    hasFocus.current = false;
    setIsExpanded(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    setIsExpanded(false);
    event.currentTarget.blur();
  };

  const handleClick = () => {
    if (sound) {
      getSoundPlayer().prepare();
      getSoundPlayer().playClick();
    }

    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if (onViewAll) {
      onViewAll();
      return;
    }

    setIsExpanded(false);
  };

  return (
    <motion.button
      type="button"
      initial={false}
      aria-expanded={isExpanded}
      aria-label={
        isExpanded
          ? `${items.length} notifications. ${expandedLabel}.`
          : `${items.length} notifications. Expand notifications.`
      }
      onPointerEnter={() => {
        if (sound) {
          getSoundPlayer().prepare();
          getSoundPlayer().playHover();
        }
        if (canHover) setIsExpanded(true);
      }}
      onPointerLeave={() => {
        if (canHover && !hasFocus.current) setIsExpanded(false);
      }}
      onFocus={() => {
        if (sound) {
          getSoundPlayer().prepare();
          getSoundPlayer().playHover();
        }
        hasFocus.current = true;
        setIsExpanded(true);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className={cn(
        "relative z-10 block w-full max-w-[22rem] cursor-pointer rounded-3xl text-left outline-none transition-colors",
        isDark ? "text-white" : "text-neutral-900",
        "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Invisible spacer giving button intrinsic size */}
      <span aria-hidden="true" className="invisible block p-3">
        <span className="block">
          <span
            className={cn(
              "block rounded-2xl border border-transparent px-4",
              classNames?.card,
            )}
          >
            <NotificationCardContent
              item={primaryItem}
              classNames={classNames}
              isDark={isDark}
            />
          </span>
        </span>
        <span className="mt-2 block h-9" />
      </span>

      <span className="absolute inset-x-0 bottom-0 block p-3">
        <motion.span
          aria-hidden="true"
          layout
          initial={false}
          transition={backgroundTransition}
          className={cn(
            "absolute inset-0 rounded-3xl border shadow-xs transition-colors",
            isDark
              ? "bg-[#1c1c1c] border-neutral-800"
              : "bg-neutral-100/90 border-neutral-200/80",
          )}
        />
        <span
          className={cn(
            "relative z-10 grid gap-1",
            !isExpanded && "pb-2",
            classNames?.stack,
          )}
        >
          {visibleItems.map((item, index) => {
            const isPrimary = index === 0;

            return (
              <motion.span
                key={item.id}
                layout="position"
                initial={false}
                onPointerEnter={(e) => {
                  if (sound && isExpanded) {
                    e.stopPropagation();
                    getSoundPlayer().prepare();
                    getSoundPlayer().playHover();
                  }
                }}
                animate={{
                  y: isExpanded ? 0 : index * STACK_PEEK,
                  clipPath: isExpanded
                    ? "inset(0px 0px round 16px)"
                    : `inset(0px ${index * STACK_INSET}px round 16px)`,
                }}
                transition={cardTransition}
                className={cn(
                  "block rounded-2xl border px-4 shadow-xs transition-colors",
                  isDark
                    ? "border-neutral-800 bg-[#151515] text-white"
                    : "border-neutral-200 bg-white text-neutral-900",
                  classNames?.card,
                )}
                style={{
                  zIndex: visibleItems.length - index,
                  gridColumn: 1,
                  gridRow: isExpanded ? index + 1 : 1,
                }}
              >
                <span
                  className={cn(
                    "block",
                    !isPrimary && !isExpanded && "invisible",
                  )}
                >
                  <NotificationCardContent
                    item={item}
                    classNames={classNames}
                    isDark={isDark}
                  />
                </span>
              </motion.span>
            );
          })}
        </span>


        <motion.span
          layout="position"
          transition={transition}
          className={cn(
            "relative z-10 mt-2 flex min-h-9 items-center gap-2 px-1 transition-colors",
            isDark ? "text-white" : "text-neutral-800",
            classNames?.footer,
          )}
        >
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-xs transition-colors",
              isDark ? "bg-orange-500" : "bg-orange-600",
              classNames?.count,
            )}
          >
            {items.length}
          </span>
          <span
            className={cn(
              "flex items-center text-sm font-semibold",
              isDark ? "text-white" : "text-neutral-800",
            )}
          >
            <ActionSwapText
              value={isExpanded ? "expanded" : "collapsed"}
              animation="roll"
              className={isDark ? "text-white" : "text-neutral-800"}
            >
              {isExpanded ? (
                <span className="inline-flex items-center gap-1 text-white">
                  {expandedLabel}
                  <ArrowUpRight className="size-4 text-white" aria-hidden="true" />
                </span>
              ) : (
                <span className={isDark ? "text-white" : "text-neutral-800"}>
                  {collapsedLabel}
                </span>
              )}
            </ActionSwapText>
          </span>
        </motion.span>
      </span>
    </motion.button>
  );
}

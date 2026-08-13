"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { createTickPlayer } from "@/lib/tick-sound";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { ComboboxGroupContext, useComboboxContext } from "./context";

export interface ComboboxListProps {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function ComboboxList({
  children,
  ariaLabel = "Options",
  className,
}: ComboboxListProps) {
  const context = useComboboxContext("ComboboxList");
  return (
    <div
      id={context.listId}
      role="listbox"
      aria-label={ariaLabel}
      className={cn(
        "max-h-64 overflow-y-auto overscroll-contain p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ComboboxGroupProps {
  children: ReactNode;
  className?: string;
}

export function ComboboxGroup({ children, className }: ComboboxGroupProps) {
  const context = useComboboxContext("ComboboxGroup");
  const groupId = useId();
  return (
    <ComboboxGroupContext.Provider value={groupId}>
      <fieldset
        hidden={!context.hasVisibleItems(groupId)}
        className={cn("m-0 min-w-0 border-0 p-0 py-0.5", className)}
      >
        {children}
      </fieldset>
    </ComboboxGroupContext.Provider>
  );
}

export interface ComboboxLabelProps {
  children: ReactNode;
  className?: string;
}

export function ComboboxLabel({ children, className }: ComboboxLabelProps) {
  const groupId = useContext(ComboboxGroupContext);
  const labelClassName = cn(
    "w-full px-2 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400",
    className,
  );
  return groupId ? (
    <legend className={labelClassName}>{children}</legend>
  ) : (
    <div className={labelClassName}>{children}</div>
  );
}

export interface ComboboxItemProps {
  value: string;
  children: ReactNode;
  textValue?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
}

export function ComboboxItem({
  value,
  children,
  textValue,
  keywords = [],
  disabled = false,
  onSelect,
  className,
}: ComboboxItemProps) {
  const context = useComboboxContext("ComboboxItem");
  const groupId = useContext(ComboboxGroupContext);
  const id = useId();
  const itemRef = useRef<HTMLButtonElement>(null);
  const label = textValue ?? (typeof children === "string" ? children : value);
  const visible = context.isVisible(value);
  const active = context.activeValue === value;
  const selected = context.value === value;
  const keywordKey = keywords.join("\u0000");
  const normalizedKeywords = useMemo(
    () => (keywordKey ? keywordKey.split("\u0000") : []),
    [keywordKey],
  );
  const { registerItem, unregisterItem } = context;

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

  useLayoutEffect(() => {
    registerItem({
      value,
      label,
      keywords: normalizedKeywords,
      disabled,
      groupId,
      id,
      ref: itemRef,
    });
    return () => unregisterItem(value);
  }, [
    disabled,
    groupId,
    id,
    label,
    normalizedKeywords,
    registerItem,
    unregisterItem,
    value,
  ]);

  if (!visible) return null;

  return (
    <button
      ref={itemRef}
      id={id}
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      tabIndex={-1}
      data-combobox-item=""
      data-active={active || undefined}
      data-selected={selected || undefined}
      onPointerMove={() => {
        if (!disabled) {
          if (!active) {
            getSoundPlayer().prepare();
            getSoundPlayer().playHover();
          }
          context.setActiveValue(value);
        }
      }}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => {
        if (disabled) return;
        getSoundPlayer().prepare();
        getSoundPlayer().playClick();
        onSelect?.(value);
        context.select(value);
      }}
      className={cn(
        "relative isolate flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors duration-150 cursor-pointer",
        active ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-700 dark:text-neutral-300",
        "disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
    >
      {active ? (
        <motion.span
          aria-hidden
          layoutId={context.activeLayoutId}
          className="absolute inset-0 -z-10 rounded-lg bg-neutral-100 dark:bg-neutral-800"
          transition={context.reduce ? { duration: 0 } : SPRING_LAYOUT}
        />
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          opacity: selected ? 1 : 0,
          transform: selected ? "scale(1)" : "scale(0.82)",
        }}
        transition={
          context.reduce
            ? { duration: 0 }
            : { duration: 0.14, ease: EASE_OUT }
        }
        className="grid size-5 shrink-0 place-items-center text-neutral-900 dark:text-white"
      >
        <Check className="size-4" />
      </motion.span>
    </button>
  );
}

export interface ComboboxEmptyProps {
  children?: ReactNode;
  className?: string;
}

export function ComboboxEmpty({
  children = "No options found.",
  className,
}: ComboboxEmptyProps) {
  const context = useComboboxContext("ComboboxEmpty");
  if (context.visibleCount > 0) return null;
  return (
    <div
      role="status"
      className={cn(
        "px-3 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ComboboxSeparatorProps {
  className?: string;
}

export function ComboboxSeparator({ className }: ComboboxSeparatorProps) {
  return (
    <div
      aria-hidden
      className={cn("-mx-1 my-1 h-px bg-neutral-200 dark:bg-neutral-800", className)}
    />
  );
}

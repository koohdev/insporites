"use client";
// beui.dev/components/motion/select

import { Check, ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createTickPlayer } from "@/lib/tick-sound";
import { cn } from "@/lib/utils";

// Shared-layout morph: trigger box grows into the panel and back, one surface.
const MORPH: Transition = { type: "spring", duration: 0.5, bounce: 0.22 };
// Trigger and panel header share this row so the morph stays seamless.
const ROW = "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-sm";

const LIST: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

interface MorphContextValue {
  value: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  select: (value: string) => void;
  register: (value: string, label: string) => void;
  unregister: (value: string) => void;
  labelFor: (value: string | undefined) => string | undefined;
  placeholder: string;
  setPlaceholder: (p: string) => void;
  reduce: boolean;
  layoutId: string;
  triggerId: string;
  listId: string;
  disabled: boolean;
  sound: boolean;
}

const MorphContext = createContext<MorphContextValue | null>(null);

function useMorphContext(component: string) {
  const ctx = useContext(MorphContext);
  if (!ctx) throw new Error(`${component} must be used within <MorphSelect>`);
  return ctx;
}

export interface MorphSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Enable Web Audio hover/click sound feedback. Default: true */
  sound?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Select whose trigger morphs into the panel via a shared layoutId — instead of
 * a separate dropdown opening, the trigger itself grows into the menu and
 * shrinks back, never detaching. Composable like `Select` (the gooey variant).
 */
export function MorphSelect({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  sound = true,
  className,
  children,
}: MorphSelectProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  // ref-counted: items render twice (hidden registrar + open panel), so a
  // label is only dropped once every copy with that value has unmounted.
  const [labels, setLabels] = useState<
    Map<string, { label: string; count: number }>
  >(new Map());
  const [placeholder, setPlaceholder] = useState("Select");

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const select = useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
      setOpen(false);
    },
    [controlled, onValueChange],
  );

  const register = useCallback((v: string, label: string) => {
    setLabels((m) => {
      const next = new Map(m);
      next.set(v, { label, count: (m.get(v)?.count ?? 0) + 1 });
      return next;
    });
  }, []);
  const unregister = useCallback((v: string) => {
    setLabels((m) => {
      const entry = m.get(v);
      if (!entry) return m;
      const next = new Map(m);
      if (entry.count <= 1) next.delete(v);
      else next.set(v, { label: entry.label, count: entry.count - 1 });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const ctx = useMemo<MorphContextValue>(
    () => ({
      value: current,
      open,
      setOpen,
      select,
      register,
      unregister,
      labelFor: (v) => (v === undefined ? undefined : labels.get(v)?.label),
      placeholder,
      setPlaceholder,
      reduce,
      layoutId: `${baseId}-surface`,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      disabled,
      sound,
    }),
    [
      current,
      open,
      select,
      register,
      unregister,
      labels,
      placeholder,
      reduce,
      baseId,
      disabled,
      sound,
    ],
  );

  return (
    <MorphContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    </MorphContext.Provider>
  );
}

export interface MorphSelectValueProps {
  placeholder?: string;
  className?: string;
}

export function MorphSelectValue({
  placeholder,
  className,
}: MorphSelectValueProps) {
  const ctx = useMorphContext("MorphSelectValue");
  // surface the placeholder so the morph header (rendered by content) matches
  useEffect(() => {
    if (placeholder) ctx.setPlaceholder(placeholder);
  }, [placeholder, ctx.setPlaceholder]);
  const label = ctx.labelFor(ctx.value);
  return (
    <span
      className={cn(label ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400", className)}
    >
      {label ?? placeholder ?? "Select"}
    </span>
  );
}

export interface MorphSelectTriggerProps {
  className?: string;
  children: ReactNode;
}

export function MorphSelectTrigger({
  className,
  children,
}: MorphSelectTriggerProps) {
  const ctx = useMorphContext("MorphSelectTrigger");
  const soundPlayerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayerRef.current) soundPlayerRef.current = createTickPlayer();
    return soundPlayerRef.current;
  }, []);
  useEffect(() => () => { soundPlayerRef.current?.dispose(); }, []);

  return (
    <>
      {/* invisible sizer reserves the closed height (the morph surface is
          absolute, so this keeps surrounding layout from shifting) */}
      <div
        aria-hidden
        inert
        className={cn(ROW, "invisible rounded-xl border border-neutral-200 dark:border-neutral-800")}
      >
        {children}
        <ChevronDown className="h-4 w-4" />
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {!ctx.open ? (
          <motion.button
            key="trigger"
            layoutId={ctx.layoutId}
            type="button"
            id={ctx.triggerId}
            disabled={ctx.disabled}
            aria-haspopup="listbox"
            aria-expanded={ctx.open}
            aria-controls={ctx.listId}
            onPointerEnter={() => ctx.sound && getSoundPlayer().playHover()}
            onClick={() => { ctx.sound && getSoundPlayer().playClick(); ctx.setOpen(true); }}
            transition={ctx.reduce ? { duration: 0 } : MORPH}
            style={{ borderRadius: 12 }}
            className={cn(
              ROW,
              "absolute inset-x-0 top-0 z-10 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none transition-colors cursor-pointer shadow-xs",
              "hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400/50",
              "disabled:pointer-events-none disabled:opacity-50",
              className,
            )}
          >
            <motion.span layout="position" className="min-w-0 truncate">
              {children}
            </motion.span>
            <motion.span layout="position" className="text-neutral-400">
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export interface MorphSelectContentProps {
  className?: string;
  children: ReactNode;
}

export function MorphSelectContent({
  className,
  children,
}: MorphSelectContentProps) {
  const ctx = useMorphContext("MorphSelectContent");
  const label = ctx.labelFor(ctx.value);
  return (
    <>
      {/* always-mounted, hidden — keeps item label registrations alive while
          closed so the trigger shows the selected value before first open */}
      <div className="hidden">{children}</div>

      <AnimatePresence initial={false} mode="popLayout">
        {ctx.open ? (
          <motion.div
            key="panel"
            layoutId={ctx.layoutId}
            id={ctx.listId}
            role="listbox"
            aria-labelledby={ctx.triggerId}
            transition={ctx.reduce ? { duration: 0 } : MORPH}
            style={{ borderRadius: 12 }}
            className={cn(
              "absolute inset-x-0 top-0 z-30 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xl",
              className,
            )}
          >
            {/* header mirrors the trigger (continuous morph) and collapses the
                panel back into the trigger when clicked */}
            <motion.button
              type="button"
              layout="position"
              aria-expanded
              onClick={() => ctx.setOpen(false)}
              className={cn(ROW, "outline-none cursor-pointer")}
            >
              <span
                className={cn(
                  "min-w-0 truncate",
                  label ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400",
                )}
              >
                {label ?? ctx.placeholder}
              </span>
              <motion.span
                animate={{ rotate: 180 }}
                transition={ctx.reduce ? { duration: 0 } : MORPH}
                className="text-neutral-400"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </motion.button>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            <motion.ul
              initial="hidden"
              animate="show"
              variants={ctx.reduce ? undefined : LIST}
              className="p-1"
            >
              {children}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export interface MorphSelectItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function MorphSelectItem({
  value,
  disabled = false,
  className,
  children,
}: MorphSelectItemProps) {
  const ctx = useMorphContext("MorphSelectItem");
  const selected = ctx.value === value;
  const label = typeof children === "string" ? children : value;
  const soundPlayerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null);
  const getSoundPlayer = useCallback(() => {
    if (!soundPlayerRef.current) soundPlayerRef.current = createTickPlayer();
    return soundPlayerRef.current;
  }, []);
  useEffect(() => () => { soundPlayerRef.current?.dispose(); }, []);

  useLayoutEffect(() => {
    ctx.register(value, label);
    return () => ctx.unregister(value);
  }, [ctx.register, ctx.unregister, value, label]);

  return (
    <motion.li variants={ctx.reduce ? undefined : ITEM}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        disabled={disabled}
        onPointerEnter={() => ctx.sound && getSoundPlayer().play()}
        onClick={() => { ctx.sound && getSoundPlayer().playClick(); ctx.select(value); }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors cursor-pointer",
          selected
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        {children}
        {selected ? <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-white" /> : null}
      </button>
    </motion.li>
  );
}

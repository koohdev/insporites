"use client";
// beui.dev/components/motion/preview-rail

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createTickPlayer } from "@/lib/tick-sound";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface PreviewRailItem {
  id: string;
  label: string;
  ariaLabel?: string;
  description?: ReactNode;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

export interface PreviewRailProps {
  items: PreviewRailItem[];
  label?: string;
  orientation?: "vertical" | "horizontal";
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  onItemSelect?: (item: PreviewRailItem) => void;
  renderPreview?: (item: PreviewRailItem) => ReactNode;
  showPreview?: boolean;
  previewSide?: "before" | "after";
  highlightActive?: boolean;
  itemSize?: number;
  sound?: boolean;
  children?: ReactNode;
  className?: string;
  railClassName?: string;
  previewContainerClassName?: string;
  previewClassName?: string;
}

function DefaultPreview({ item }: { item: PreviewRailItem }) {
  return (
    <div
      data-slot="preview-rail-card"
      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3.5 shadow-2xl text-neutral-900 dark:text-neutral-100"
    >
      <p
        data-slot="preview-rail-title"
        className="font-semibold text-neutral-900 dark:text-white text-xs tracking-tight"
      >
        {item.label}
      </p>
      {item.description ? (
        <div
          data-slot="preview-rail-description"
          className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400"
        >
          {item.description}
        </div>
      ) : null}
    </div>
  );
}

export function PreviewRail({
  items,
  label = "Section navigation",
  orientation = "vertical",
  activeId,
  defaultActiveId,
  onActiveChange,
  onItemSelect,
  renderPreview,
  showPreview = true,
  previewSide = "after",
  highlightActive = false,
  itemSize = 24,
  sound = true,
  children,
  className,
  railClassName,
  previewContainerClassName,
  previewClassName,
}: PreviewRailProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? items[0]?.id ?? "",
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

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

  const requestedActiveId = activeId ?? internalActiveId;
  const selectedId = items.some((item) => item.id === requestedActiveId)
    ? requestedActiveId
    : (items[0]?.id ?? "");
  const displayedId = hoveredId ?? focusedId ?? "";
  const highlightedId = displayedId || (highlightActive ? selectedId : "");
  const displayedIndex = items.findIndex((item) => item.id === highlightedId);
  const rowTemplate = items.length
    ? `repeat(${items.length}, ${itemSize}px)`
    : undefined;
  const isHorizontal = orientation === "horizontal";

  const selectItem = (id: string) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  return (
    <motion.div
      layoutRoot
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedId(null);
        }
      }}
      className={cn(
        "isolate relative flex w-full overflow-visible",
        isHorizontal
          ? "min-h-64 flex-col items-center justify-center"
          : "min-h-80 items-center justify-start pl-2 sm:pl-4",
        className,
      )}
    >
      <nav
        aria-label={label}
        onPointerLeave={() => setHoveredId(null)}
        style={
          isHorizontal
            ? { gridTemplateColumns: rowTemplate }
            : { gridTemplateRows: rowTemplate }
        }
        className={cn(
          "relative z-10 grid shrink-0",
          isHorizontal
            ? "h-12 w-fit max-w-full self-center justify-center"
            : "w-12 content-center justify-items-start pl-2",
          railClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          const highlighted = item.id === highlightedId;
          const distance =
            displayedIndex < 0
              ? Number.POSITIVE_INFINITY
              : Math.abs(index - displayedIndex);
          const scale = highlighted
            ? 1
            : distance === 1
              ? 0.68
              : distance === 2
                ? 0.44
                : 0.25;

          const itemContent = (
            <>
              <motion.span
                data-slot="preview-rail-tick"
                aria-hidden="true"
                animate={isHorizontal ? { scaleY: scale } : { scaleX: scale }}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className={cn(
                  "block transition-colors",
                  isHorizontal
                    ? "h-12 w-0.5 origin-bottom"
                    : "h-0.5 w-12 origin-left",
                  highlighted
                    ? "bg-neutral-900 dark:bg-white"
                    : "bg-neutral-400/40 dark:bg-neutral-600/40",
                )}
              />
            </>
          );

          const sharedClassName = cn(
            "relative flex text-neutral-500 dark:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 cursor-pointer",
            isHorizontal
              ? "h-12 w-6 items-end justify-center"
              : "h-6 w-12 items-center",
          );
          const sharedStyle = isHorizontal
            ? { width: itemSize }
            : { height: itemSize };
          const handlePointerEnter = () => {
            if (sound && hoveredId !== item.id) {
              getSoundPlayer().prepare();
              getSoundPlayer().play();
            }
            if (canHover) setHoveredId(item.id);
          };
          const handleFocus = (currentTarget: HTMLElement) => {
            if (currentTarget.matches(":focus-visible")) {
              if (sound && focusedId !== item.id) {
                getSoundPlayer().prepare();
                getSoundPlayer().play();
              }
              setFocusedId(item.id);
            }
          };
          const handleSelect = () => {
            if (sound) {
              getSoundPlayer().prepare();
              getSoundPlayer().playClick();
            }
            selectItem(item.id);
            onItemSelect?.(item);
          };

          return item.href ? (
            <a
              key={item.id}
              data-slot="preview-rail-item"
              href={item.href}
              target={item.target}
              rel={
                item.rel ??
                (item.target === "_blank" ? "noreferrer noopener" : undefined)
              }
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "page" : undefined}
              onPointerEnter={handlePointerEnter}
              onMouseEnter={handlePointerEnter}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </a>
          ) : (
            <button
              key={item.id}
              data-slot="preview-rail-item"
              type="button"
              aria-label={item.ariaLabel ?? item.label}
              aria-current={selected ? "location" : undefined}
              onPointerEnter={handlePointerEnter}
              onMouseEnter={handlePointerEnter}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => handleFocus(event.currentTarget)}
              onClick={handleSelect}
              style={sharedStyle}
              className={sharedClassName}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>

      {showPreview ? (
        <div
          aria-hidden="true"
          style={
            isHorizontal
              ? { gridTemplateColumns: rowTemplate }
              : { gridTemplateRows: rowTemplate }
          }
          className={cn(
            "pointer-events-none absolute z-50 grid",
            isHorizontal
              ? "top-1/2 left-1/2 h-5 w-fit max-w-full -translate-x-1/2 -translate-y-1/2 justify-center"
              : previewSide === "before"
                ? "inset-y-0 right-20 left-4 content-center"
                : "inset-y-0 right-4 left-24 content-center",
            previewContainerClassName,
          )}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={isHorizontal ? { width: itemSize } : { height: itemSize }}
              className={cn(
                "relative flex items-center",
                isHorizontal ? "justify-center" : undefined,
              )}
            >
              {item.id === displayedId ? (
                <div
                  className={cn(
                    isHorizontal
                      ? "absolute bottom-12 left-1/2 w-60 -translate-x-1/2"
                      : cn(
                          "w-70 max-w-[500px]",
                          previewSide === "before" && "ml-auto",
                        ),
                    previewClassName,
                  )}
                >
                  <motion.div
                    layoutId={`preview-rail-card-${uid}`}
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={item.id}
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: 4, filter: "blur(6px)" }
                        }
                        animate={
                          reduce
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        exit={
                          reduce
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                y: -2,
                                filter: "blur(4px)",
                                transition: {
                                  duration: 0.12,
                                  ease: EASE_OUT,
                                },
                              }
                        }
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: EASE_OUT,
                        }}
                      >
                        {renderPreview ? (
                          renderPreview(item)
                        ) : (
                          <DefaultPreview item={item} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {children ? (
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      ) : null}
    </motion.div>
  );
}

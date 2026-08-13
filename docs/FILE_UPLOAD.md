---
title: "File Upload"
description: "Two file upload patterns: an attachment workspace for mixed files, links, audio and media, plus a progress queue with retry and removal."
category: "Blocks"
publishedAt: "2026-06-18"
updatedAt: "2026-07-30"
documentation: "https://beui.dev/components/blocks/file-upload"
markdown: "https://beui.dev/components/blocks/file-upload.md"
license: "MIT"
---

# File Upload

> Two file upload patterns: an attachment workspace for mixed files, links, audio and media, plus a progress queue with retry and removal.

## Install

### Attachment Upload

A mixed attachment workspace with a dropzone, staggered file and image rows, animated upload, success, failure, retry and removal feedback, shared-layout image previews, and an audio waveform.

```bash
npx shadcn@latest add @beui/attachment-upload
```

### Upload Queue

A drag-and-drop upload queue with progress rows, upload states, retry, and removal.

```bash
npx shadcn@latest add @beui/file-upload
```

## Dependencies

- `clsx`
- `lucide-react`
- `motion`
- `react`
- `react-dom`
- `tailwind-merge`

## Usage

### Responsive 2-Grid Box Upload Patterns

Frameless 2-column grid layout featuring an attachment workspace dropzone and a file upload progress queue. Consumes `useCardTheme()` for instant light/dark mode switching and uses zero `globals.css` theme variables.

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { useCardTheme } from "@/components/component-card";
import {
  AttachmentUpload,
  type AttachmentUploadItem,
} from "@/components/motion/attachment-upload";
import {
  FileUpload,
  type FileUploadItem,
  type FileUploadVariant,
} from "@/components/motion/file-upload";
import { cn } from "@/lib/utils";

const INITIAL_ATTACHMENTS: AttachmentUploadItem[] = [
  {
    id: "brief",
    name: "launch-brief.pdf",
    kind: "file",
    size: 32_400_000,
    href: "data:application/pdf,beUI%20launch%20brief",
    status: "failed",
    error: "Upload failed",
  },
  {
    id: "flowers",
    name: "orange-flowers.jpg",
    kind: "image",
    size: 9_800_000,
    previewUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "voice-note",
    name: "launch-note.m4a",
    kind: "audio",
    currentTime: 12,
    duration: 48,
  },
];

const INITIAL_QUEUE: FileUploadItem[] = [
  {
    id: "brand-assets",
    name: "brand-assets.zip",
    size: 18_400_000,
    type: "application/zip",
    progress: 100,
    status: "success",
  },
  {
    id: "release-video",
    name: "release-cut.mov",
    size: 84_200_000,
    type: "video/quicktime",
    progress: 58,
    status: "uploading",
  },
  {
    id: "contracts",
    name: "vendor-contract.pdf",
    size: 2_800_000,
    type: "application/pdf",
    progress: 32,
    status: "error",
    error: "Connection lost",
  },
];

const VARIANTS: { id: FileUploadVariant; label: string }[] = [
  { id: "centered", label: "Centered" },
  { id: "default", label: "Row" },
];

export function FileUploadPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [attachments, setAttachments] = useState(INITIAL_ATTACHMENTS);
  const [playingId, setPlayingId] = useState<string>();
  const retryTimersRef = useRef<number[]>([]);

  const [queueItems, setQueueItems] = useState(INITIAL_QUEUE);
  const [queueVariant, setQueueVariant] = useState<FileUploadVariant>("centered");
  const timersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Audio timer handler
  useEffect(() => {
    if (!playingId) return;
    const timer = window.setInterval(() => {
      setAttachments((current) =>
        current.map((item) => {
          if (item.id !== playingId || !item.duration) return item;
          const nextTime = Math.min(item.duration, (item.currentTime ?? 0) + 1);
          return { ...item, currentTime: nextTime };
        }),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playingId]);

  useEffect(() => {
    if (!playingId) return;
    const playingItem = attachments.find((item) => item.id === playingId);
    if (playingItem?.duration && (playingItem.currentTime ?? 0) >= playingItem.duration) {
      setPlayingId(undefined);
    }
  }, [attachments, playingId]);

  // Queue upload timers handler
  const stopUpload = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (!timer) return;
    clearInterval(timer);
    timersRef.current.delete(id);
  }, []);

  const startUpload = useCallback(
    (id: string) => {
      stopUpload(id);
      const timer = setInterval(() => {
        setQueueItems((current) => {
          const target = current.find((item) => item.id === id);
          if (target?.status !== "uploading") {
            stopUpload(id);
            return current;
          }
          const nextProgress = Math.min(
            100,
            (target.progress ?? 0) + 7 + Math.random() * 12,
          );
          if (nextProgress >= 100) {
            stopUpload(id);
          }
          return current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  progress: nextProgress,
                  status: nextProgress >= 100 ? "success" : "uploading",
                }
              : item,
          );
        });
      }, 520);
      timersRef.current.set(id, timer);
    },
    [stopUpload],
  );

  useEffect(() => {
    startUpload("release-video");
    return () => {
      for (const timer of timersRef.current.values()) {
        clearInterval(timer);
      }
      timersRef.current.clear();
    };
  }, [startUpload]);

  return (
    <div className={cn("w-full h-full p-1 sm:p-2", isDark ? "dark" : "")}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
        {/* Pattern 01: Attachment Workspace */}
        <div className="w-full">
          <AttachmentUpload
            value={attachments}
            onValueChange={setAttachments}
            onRetry={(retryItem) => {
              setAttachments((current) =>
                current.map((item) =>
                  item.id === retryItem.id
                    ? { ...item, status: "uploading", error: undefined }
                    : item,
                ),
              );
              const completeTimer = window.setTimeout(() => {
                setAttachments((current) =>
                  current.map((item) =>
                    item.id === retryItem.id
                      ? { ...item, status: "complete" }
                      : item,
                  ),
                );
              }, 900);
              const readyTimer = window.setTimeout(() => {
                setAttachments((current) =>
                  current.map((item) =>
                    item.id === retryItem.id
                      ? { ...item, status: "idle" }
                      : item,
                  ),
                );
              }, 1900);
              retryTimersRef.current.push(completeTimer, readyTimer);
            }}
            playingId={playingId}
            onAudioToggle={(item) => {
              setPlayingId((current) =>
                current === item.id ? undefined : item.id,
              );
            }}
            attachmentsLabel="Attachments:"
          />
        </div>

        {/* Pattern 02: Upload Queue */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2 px-1">
            <div className="flex rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 p-1">
              {VARIANTS.map((entry) => {
                const selected = entry.id === queueVariant;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setQueueVariant(entry.id)}
                    data-selected={selected}
                    className="h-7 rounded-full px-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white data-[selected=true]:bg-white dark:data-[selected=true]:bg-neutral-900 data-[selected=true]:text-neutral-900 dark:data-[selected=true]:text-white shadow-xs"
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                for (const item of queueItems) {
                  stopUpload(item.id);
                }
                setQueueItems(INITIAL_QUEUE);
                startUpload("release-video");
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-95"
              aria-label="Reset upload queue"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <FileUpload
            value={queueItems}
            variant={queueVariant}
            onValueChange={setQueueItems}
            onFilesAdded={(added) => {
              for (const item of added) {
                startUpload(item.id);
              }
            }}
            onRetry={(item) => startUpload(item.id)}
            onRemove={(item) => stopUpload(item.id)}
            maxFiles={5}
            title={queueVariant === "centered" ? "Drop files to upload" : "Drop release files"}
            description="PDF, images, video or zipped assets"
          />
        </div>
      </div>
    </div>
  );
}
```

code: "use client";
// beui.dev/components/blocks/file-upload

import {
  AlertCircle,
  Check,
  ExternalLink,
  FileImage,
  Link as LinkIcon,
  LoaderCircle,
  Mic,
  Paperclip,
  Pause,
  Play,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "@/components/motion/tooltip";
import {
  EASE_OUT,
  SPRING_LAYOUT,
  SPRING_PRESS,
} from "@/lib/ease";
import { cn } from "@/lib/utils";

export type AttachmentUploadKind = "file" | "link" | "image" | "audio";
export type AttachmentRejectReason = "too-large" | "max-files";
export type AttachmentUploadStatus =
  | "idle"
  | "uploading"
  | "complete"
  | "failed";

export type AttachmentUploadItem = {
  id: string;
  name: string;
  kind: AttachmentUploadKind;
  size?: number;
  href?: string;
  previewUrl?: string;
  currentTime?: number;
  duration?: number;
  status?: AttachmentUploadStatus;
  error?: string;
  file?: File;
};

export type AttachmentUploadClassNames = {
  dropzone?: string;
  list?: string;
  row?: string;
};

export interface AttachmentUploadProps {
  value?: AttachmentUploadItem[];
  defaultValue?: AttachmentUploadItem[];
  onValueChange?: (items: AttachmentUploadItem[]) => void;
  onFilesAdded?: (items: AttachmentUploadItem[], files: File[]) => void;
  onFilesRejected?: (files: File[], reason: AttachmentRejectReason) => void;
  onRemove?: (item: AttachmentUploadItem) => void;
  onRetry?: (item: AttachmentUploadItem) => void;
  playingId?: string;
  onAudioToggle?: (item: AttachmentUploadItem) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
  title?: string;
  description?: string;
  attachmentsLabel?: string;
  className?: string;
  classNames?: AttachmentUploadClassNames;
}

const ITEM_TRANSITION = { duration: 0.2, ease: EASE_OUT } as const;
const DEFAULT_MAX_FILE_SIZE = 500 * 1024 * 1024;
const UPLOAD_PROGRESS_MS = 900;
const UPLOAD_COMPLETE_HOLD_MS = 1000;
const REMOVE_PENDING_MS = 420;

const WAVEFORM_BARS = [
  18, 31, 24, 39, 30, 43, 27, 18, 9, 29, 38, 24, 34, 18, 26, 37, 21, 14,
  7, 11, 22, 35, 18, 26, 41, 29, 17, 33,
].map((height, index) => ({ id: `wave-${index}-${height}`, height }));

function useControllableList<T>({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (items: T[]) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const controlled = value !== undefined;
  const items = value ?? internalValue;

  const setItems = useCallback(
    (next: T[]) => {
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  return [items, setItems] as const;
}

function formatBytes(bytes: number | undefined) {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}

function formatDuration(seconds: number | undefined) {
  const safeSeconds = Math.max(0, Math.round(seconds ?? 0));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function formatMaxSize(bytes: number) {
  const megabytes = bytes / (1024 * 1024);
  return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
}

function inferKind(file: File): AttachmentUploadKind {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  return "file";
}

function AttachmentIcon({ kind }: { kind: AttachmentUploadKind }) {
  if (kind === "link") return <LinkIcon className="size-4" />;
  if (kind === "image") return <FileImage className="size-4" />;
  if (kind === "audio") return <Mic className="size-4" />;
  return <Paperclip className="size-4" />;
}

function imageSource(item: AttachmentUploadItem) {
  if (item.kind !== "image") return undefined;
  return item.previewUrl ?? item.href;
}

type RowActionState =
  | "idle"
  | "uploading"
  | "complete"
  | "failed"
  | "removing";

function RowAction({
  label,
  onClick,
  state,
  retryable = false,
  reduce = false,
}: {
  label: string;
  onClick: () => void;
  state: RowActionState;
  retryable?: boolean;
  reduce?: boolean;
}) {
  if (state === "uploading") {
    return <span aria-hidden="true" className="size-9 shrink-0" />;
  }

  if (state === "complete") {
    return (
      <Tooltip content="Upload complete" side="top" delay={100}>
        <motion.span
          role="status"
          aria-label={`Upload complete for ${label}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={ITEM_TRANSITION}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-emerald-600 dark:text-emerald-400"
        >
          <Check className="size-4" />
        </motion.span>
      </Tooltip>
    );
  }

  if (state === "removing") {
    return (
      <Tooltip content="Removing attachment" side="top" delay={100}>
        <span
          role="status"
          aria-label={`Removing ${label}`}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground"
        >
          <motion.span
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{
              duration: 0.7,
              ease: "linear",
              repeat: Infinity,
            }}
            className="grid place-items-center"
          >
            <LoaderCircle className="size-4" />
          </motion.span>
        </span>
      </Tooltip>
    );
  }

  if (state === "failed") {
    if (!retryable) {
      return (
        <Tooltip content="Upload failed" side="top" delay={100}>
          <span
            role="status"
            aria-label={`Upload failed for ${label}`}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-destructive"
          >
            <AlertCircle className="size-4" />
          </span>
        </Tooltip>
      );
    }

    return (
      <Tooltip content="Retry upload" side="top" delay={100}>
        <motion.button
          type="button"
          aria-label={`Retry ${label}`}
          onClick={onClick}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          transition={SPRING_PRESS}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-destructive outline-none transition-colors hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="size-4" />
        </motion.button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Remove attachment" side="top" delay={100}>
      <motion.button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onClick}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        transition={SPRING_PRESS}
        className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-4" />
      </motion.button>
    </Tooltip>
  );
}

function ImageThumbnail({
  item,
  layoutId,
  onPreview,
  reduce,
}: {
  item: AttachmentUploadItem;
  layoutId?: string;
  onPreview: (item: AttachmentUploadItem) => void;
  reduce: boolean;
}) {
  const src = imageSource(item);

  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
      >
        <FileImage className="size-4" />
      </span>
    );
  }

  return (
    <Tooltip
      side="top"
      delay={160}
      wrapperClassName="shrink-0"
      className="rounded-xl p-1 shadow-xl"
      content={
        <span className="block w-32">
          {/* biome-ignore lint/performance/noImgElement: Blob and remote previews keep this registry component framework-agnostic. */}
          <img
            src={src}
            alt=""
            className="h-20 w-full rounded-lg object-cover"
          />
          <span className="block px-1 pb-0.5 pt-1 text-center text-[10px] font-medium text-muted-foreground">
            Click to preview
          </span>
        </span>
      }
    >
      <motion.button
        type="button"
        aria-label={`Preview ${item.name}`}
        onClick={(event) => {
          event.currentTarget.blur();
          onPreview(item);
        }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        transition={SPRING_PRESS}
        className="group/image relative size-9 shrink-0 overflow-hidden rounded-[10px] bg-muted outline-none ring-1 ring-border/70 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* biome-ignore lint/performance/noImgElement: Motion layout requires the image element and portable blob URLs. */}
        <motion.img
          layoutId={layoutId}
          src={src}
          alt=""
          className="size-full object-cover"
          transition={{ layout: SPRING_LAYOUT }}
        />
      </motion.button>
    </Tooltip>
  );
}

function ImagePreviewDialog({
  item,
  layoutId,
  onClose,
  reduce,
}: {
  item: AttachmentUploadItem | null;
  layoutId?: string;
  onClose: () => void;
  reduce: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [item, onClose]);

  if (typeof document === "undefined") return null;

  const src = item ? imageSource(item) : undefined;
  const content =
    item && src ? (
      <div className="pointer-events-none fixed inset-0 z-[10000]">
        <motion.button
          type="button"
          aria-label="Close image preview"
          tabIndex={-1}
          className="pointer-events-auto absolute inset-0 size-full cursor-default bg-black/45 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.2, ease: EASE_OUT }}
          onClick={onClose}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Preview of ${item.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={ITEM_TRANSITION}
            className="pointer-events-auto relative"
          >
            {/* biome-ignore lint/performance/noImgElement: Motion layout requires the image element and portable blob URLs. */}
            <motion.img
              layoutId={reduce ? undefined : layoutId}
              src={src}
              alt={item.name}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              transition={{ layout: SPRING_LAYOUT }}
            />
            <motion.button
              ref={closeRef}
              type="button"
              aria-label="Close image preview"
              onClick={onClose}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={
                reduce ? undefined : { opacity: 0, scale: 0.8 }
              }
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={SPRING_PRESS}
              className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-background text-foreground shadow-xl outline-none ring-1 ring-border/70 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    ) : null;

  return createPortal(
    reduce ? content : <AnimatePresence>{content}</AnimatePresence>,
    document.body,
  );
}

function AttachmentRow({
  item,
  playing,
  uploading,
  uploadComplete,
  failed,
  removing,
  arrivalIndex,
  imageLayoutId,
  onAudioToggle,
  onImagePreview,
  onRemove,
  onRetry,
  reduce,
  className,
}: {
  item: AttachmentUploadItem;
  playing: boolean;
  uploading: boolean;
  uploadComplete: boolean;
  failed: boolean;
  removing: boolean;
  arrivalIndex: number;
  imageLayoutId?: string;
  onAudioToggle?: (item: AttachmentUploadItem) => void;
  onImagePreview: (item: AttachmentUploadItem) => void;
  onRemove: (item: AttachmentUploadItem) => void;
  onRetry?: (item: AttachmentUploadItem) => void;
  reduce: boolean;
  className?: string;
}) {
  const size = formatBytes(item.size);
  const progress =
    item.duration && item.duration > 0
      ? Math.min(1, Math.max(0, (item.currentTime ?? 0) / item.duration))
      : 0;
  const actionState: RowActionState = removing
    ? "removing"
    : uploading
      ? "uploading"
      : uploadComplete
        ? "complete"
        : failed
          ? "failed"
          : "idle";
  const arrivalDelay = Math.min(Math.max(arrivalIndex, 0), 5) * 0.055;
  const rowTransition =
    !reduce && arrivalIndex >= 0
      ? {
          ...SPRING_LAYOUT,
          delay: arrivalDelay,
          opacity: {
            duration: 0.16,
            ease: EASE_OUT,
            delay: arrivalDelay,
          },
        }
      : ITEM_TRANSITION;
  const showUploadProgress = uploading || uploadComplete;
  const uploadProgress = (
    <motion.span
      role="progressbar"
      aria-label={`Uploading ${item.name}`}
      className="pointer-events-none absolute inset-0 -z-10 origin-left bg-emerald-400/25 dark:bg-emerald-500/20"
      initial={{ opacity: 1, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{
        duration: reduce ? 0.1 : UPLOAD_PROGRESS_MS / 1000,
        ease: EASE_OUT,
      }}
    />
  );

  return (
    <motion.li
      layout={!reduce}
      initial={
        reduce
          ? { opacity: 0 }
          : arrivalIndex >= 0
            ? { opacity: 0, y: -16, scale: 0.985 }
            : { opacity: 0, y: 6 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, y: -4 }}
      transition={rowTransition}
      className={cn(
        "flex min-h-14 items-center gap-1 rounded-2xl bg-muted/70 p-1",
        className,
      )}
    >
      <div className="relative isolate flex min-w-0 flex-1 items-center gap-3 self-stretch overflow-hidden rounded-xl bg-background px-2 py-1">
        {failed ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-destructive/10"
          />
        ) : null}

        {item.kind === "image" ? (
          <ImageThumbnail
            item={item}
            layoutId={imageLayoutId}
            onPreview={onImagePreview}
            reduce={reduce}
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center text-muted-foreground"
          >
            <AttachmentIcon kind={item.kind} />
          </span>
        )}

        {item.kind === "audio" ? (
          <>
            <span className="w-9 shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatDuration(item.currentTime)}
            </span>
            <span
              aria-hidden="true"
              className="flex h-11 min-w-0 flex-1 items-center gap-[3px] overflow-hidden"
            >
              {WAVEFORM_BARS.map((bar, index) => (
                <motion.span
                  key={bar.id}
                  className={cn(
                    "w-[3px] shrink-0 rounded-full",
                    index / WAVEFORM_BARS.length <= progress
                      ? "bg-foreground"
                      : "bg-muted-foreground/35",
                  )}
                  style={{ height: bar.height }}
                  animate={
                    reduce || !playing
                      ? undefined
                      : { scaleY: [0.72, 1, 0.78] }
                  }
                  transition={{
                    duration: 0.55,
                    ease: EASE_OUT,
                    repeat: Infinity,
                    delay: index * 0.018,
                  }}
                />
              ))}
            </span>
            <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {formatDuration(item.duration)}
            </span>
            <motion.button
              type="button"
              aria-label={`${playing ? "Pause" : "Play"} ${item.name}`}
              onClick={() => onAudioToggle?.(item)}
              whileTap={{ scale: 0.94 }}
              transition={SPRING_PRESS}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={playing ? "pause" : "play"}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={ITEM_TRANSITION}
                >
                  {playing ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 translate-x-px fill-current" />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {item.name}
              </span>
              {failed ? (
                <span className="block truncate text-[11px] text-destructive">
                  {item.error ?? "Upload failed"}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.kind === "link" ? "Web" : size}
            </span>
            {item.kind === "link" && item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open ${item.name}`}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </>
        )}

        {reduce ? (
          showUploadProgress ? (
            uploadProgress
          ) : null
        ) : (
          <AnimatePresence>
            {showUploadProgress ? uploadProgress : null}
          </AnimatePresence>
        )}
      </div>

      <RowAction
        label={item.name}
        onClick={() => {
          if (actionState === "failed") {
            onRetry?.(item);
            return;
          }
          onRemove(item);
        }}
        state={actionState}
        retryable={onRetry !== undefined}
        reduce={reduce}
      />
    </motion.li>
  );
}

export function AttachmentUpload({
  value,
  defaultValue,
  onValueChange,
  onFilesAdded,
  onFilesRejected,
  onRemove,
  onRetry,
  playingId,
  onAudioToggle,
  accept,
  multiple = true,
  maxFiles = 12,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  disabled = false,
  title = "Drag and drop or browse files",
  description,
  attachmentsLabel = "Attachments",
  className,
  classNames,
}: AttachmentUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const ownedUrlsRef = useRef(new Set<string>());
  const lifecycleTimersRef = useRef(
    new Set<ReturnType<typeof setTimeout>>(),
  );
  const reduce = useReducedMotion() ?? false;
  const [dragging, setDragging] = useState(false);
  const [previewItem, setPreviewItem] =
    useState<AttachmentUploadItem | null>(null);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [uploadCompleteIds, setUploadCompleteIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [removingIds, setRemovingIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [items, setItems] = useControllableList({
    value,
    defaultValue,
    onValueChange,
  });
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(
    () => () => {
      for (const url of ownedUrlsRef.current) URL.revokeObjectURL(url);
      ownedUrlsRef.current.clear();
      for (const timer of lifecycleTimersRef.current) {
        clearTimeout(timer);
      }
      lifecycleTimersRef.current.clear();
    },
    [],
  );

  const maxReached = items.length >= maxFiles;
  const scheduleLifecycle = useCallback(
    (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        lifecycleTimersRef.current.delete(timer);
        callback();
      }, delay);
      lifecycleTimersRef.current.add(timer);
    },
    [],
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (disabled || incomingFiles.length === 0) return;

      const availableSlots = Math.max(0, maxFiles - items.length);
      if (availableSlots === 0) {
        onFilesRejected?.(incomingFiles, "max-files");
        return;
      }

      const selectedFiles = incomingFiles.slice(
        0,
        multiple ? availableSlots : Math.min(1, availableSlots),
      );
      const oversized = selectedFiles.filter(
        (file) => file.size > maxFileSize,
      );
      const accepted = selectedFiles.filter(
        (file) => file.size <= maxFileSize,
      );

      if (oversized.length > 0) onFilesRejected?.(oversized, "too-large");
      if (incomingFiles.length > selectedFiles.length) {
        onFilesRejected?.(incomingFiles.slice(selectedFiles.length), "max-files");
      }

      const added = accepted.map((file, index) => {
        const kind = inferKind(file);
        const objectUrl = URL.createObjectURL(file);
        ownedUrlsRef.current.add(objectUrl);

        return {
          id: `${Date.now()}-${index}-${file.name}`,
          name: file.name,
          kind,
          size: file.size,
          previewUrl: kind === "image" ? objectUrl : undefined,
          href: objectUrl,
          currentTime: kind === "audio" ? 0 : undefined,
          duration: kind === "audio" ? 0 : undefined,
          file,
        };
      });

      if (added.length === 0) return;
      setItems([...items, ...added]);
      const addedIds = added.map((item) => item.id);
      setUploadingIds((current) => new Set([...current, ...addedIds]));
      scheduleLifecycle(
        () => {
          setUploadingIds((current) => {
            const next = new Set(current);
            for (const id of addedIds) next.delete(id);
            return next;
          });
          setUploadCompleteIds(
            (current) => new Set([...current, ...addedIds]),
          );
          scheduleLifecycle(() => {
            setUploadCompleteIds((current) => {
              const next = new Set(current);
              for (const id of addedIds) next.delete(id);
              return next;
            });
          }, UPLOAD_COMPLETE_HOLD_MS);
        },
        reduce ? 140 : UPLOAD_PROGRESS_MS,
      );
      onFilesAdded?.(added, accepted);
    },
    [
      disabled,
      items,
      maxFileSize,
      maxFiles,
      multiple,
      onFilesAdded,
      onFilesRejected,
      reduce,
      scheduleLifecycle,
      setItems,
    ],
  );

  const finalizeRemove = useCallback(
    (item: AttachmentUploadItem) => {
      const ownedUrl = [item.previewUrl, item.href].find(
        (url): url is string =>
          url !== undefined && ownedUrlsRef.current.has(url),
      );
      if (ownedUrl) {
        URL.revokeObjectURL(ownedUrl);
        ownedUrlsRef.current.delete(ownedUrl);
      }
      setPreviewItem((current) =>
        current?.id === item.id ? null : current,
      );
      setUploadingIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
      setUploadCompleteIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
      setItems(itemsRef.current.filter((entry) => entry.id !== item.id));
      onRemove?.(item);
    },
    [onRemove, setItems],
  );

  const requestRemove = useCallback(
    (item: AttachmentUploadItem) => {
      if (removingIds.has(item.id)) return;

      setRemovingIds((current) => new Set(current).add(item.id));
      scheduleLifecycle(
        () => {
          finalizeRemove(item);
          setRemovingIds((current) => {
            const next = new Set(current);
            next.delete(item.id);
            return next;
          });
        },
        reduce ? 140 : REMOVE_PENDING_MS,
      );
    },
    [
      finalizeRemove,
      reduce,
      removingIds,
      scheduleLifecycle,
    ],
  );

  const resetDrag = useCallback(() => {
    dragDepthRef.current = 0;
    setDragging(false);
  }, []);
  const closePreview = useCallback(() => setPreviewItem(null), []);

  useEffect(() => {
    if (
      previewItem &&
      !items.some((item) => item.id === previewItem.id)
    ) {
      setPreviewItem(null);
    }
  }, [items, previewItem]);

  const uploadOrder = Array.from(uploadingIds);
  const previewLayoutId = previewItem
    ? `attachment-image-${previewItem.id}`
    : undefined;

  return (
    <LayoutGroup id={inputId}>
      <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        aria-label="Upload attachments"
        accept={accept}
        multiple={multiple}
        disabled={disabled || maxReached}
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          addFiles(Array.from(event.currentTarget.files ?? []));
          event.currentTarget.value = "";
        }}
      />

      <motion.button
        type="button"
        disabled={disabled || maxReached}
        data-dragging={dragging}
        animate={
          reduce
            ? undefined
            : { scale: dragging ? 1.006 : 1 }
        }
        whileTap={reduce ? undefined : { scale: 0.995 }}
        transition={SPRING_PRESS}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          dragDepthRef.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
          if (dragDepthRef.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          resetDrag();
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "group relative isolate flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-muted/65 p-2 text-center outline-none",
          "transition-colors duration-200 hover:bg-muted/85",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[dragging=true]:bg-muted",
          "disabled:pointer-events-none disabled:opacity-55",
          classNames?.dropzone,
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-2 -z-10 rounded-[1.5rem] border border-dashed border-muted-foreground/25 bg-background transition-[border-color,background-color] duration-200 group-hover:border-muted-foreground/45 group-data-[dragging=true]:border-foreground/65 group-data-[dragging=true]:bg-muted/20"
        />
        <motion.span
          aria-hidden="true"
          animate={
            reduce
              ? undefined
              : {
                  y: dragging ? -4 : 0,
                  scale: dragging ? 1.08 : 1,
                }
          }
          transition={ITEM_TRANSITION}
          className="mb-3 grid size-11 place-items-center rounded-2xl bg-muted text-foreground transition-colors duration-200 group-hover:bg-muted/80 group-data-[dragging=true]:bg-foreground group-data-[dragging=true]:text-background"
        >
          <Upload className="size-[18px]" />
        </motion.span>
        <span className="text-sm font-semibold tracking-[-0.01em] text-foreground">
          {maxReached ? "Attachment limit reached" : title}
        </span>
        <span className="mt-1 text-xs leading-5 text-muted-foreground">
          {maxReached
            ? `${items.length} of ${maxFiles} attachments added`
            : description ?? `Maximum ${formatMaxSize(maxFileSize)} file size`}
        </span>
      </motion.button>

      {items.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${inputId}-attachments`}>
          <h3
            id={`${inputId}-attachments`}
            className="text-sm font-semibold text-foreground"
          >
            {attachmentsLabel}
          </h3>

          {items.length > 0 ? (
            <ul className={cn("mt-3 space-y-2", classNames?.list)}>
              <AnimatePresence initial={uploadOrder.length > 0}>
                {items.map((item) => (
                  <AttachmentRow
                    key={item.id}
                    item={item}
                    playing={playingId === item.id}
                    uploading={
                      uploadingIds.has(item.id) ||
                      item.status === "uploading"
                    }
                    uploadComplete={
                      uploadCompleteIds.has(item.id) ||
                      item.status === "complete"
                    }
                    failed={item.status === "failed"}
                    removing={removingIds.has(item.id)}
                    arrivalIndex={uploadOrder.indexOf(item.id)}
                    imageLayoutId={
                      reduce ? undefined : `attachment-image-${item.id}`
                    }
                    onAudioToggle={onAudioToggle}
                    onImagePreview={setPreviewItem}
                    onRemove={requestRemove}
                    onRetry={onRetry}
                    reduce={reduce}
                    className={classNames?.row}
                  />
                ))}
              </AnimatePresence>
            </ul>
          ) : null}
        </section>
      ) : null}

      <ImagePreviewDialog
        item={previewItem}
        layoutId={reduce ? undefined : previewLayoutId}
        onClose={closePreview}
        reduce={reduce}
      />
      </div>
    </LayoutGroup>
  );
}


2nd version: Upload Queue
npx shadcn add @beui/file-upload

"use client";
// beui.dev/components/blocks/file-upload

import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FileAudio,
  FileCode2,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type FileUploadStatus = "queued" | "uploading" | "success" | "error";
export type FileUploadVariant = "default" | "centered";

export type FileUploadItem = {
  id: string;
  name: string;
  size: number;
  type?: string;
  progress?: number;
  status?: FileUploadStatus;
  error?: string;
  file?: File;
};

export type FileUploadClassNames = {
  root?: string;
  dropzone?: string;
  queue?: string;
  item?: string;
  leading?: string;
  content?: string;
  name?: string;
  meta?: string;
  progress?: string;
  action?: string;
};

export interface FileUploadProps {
  value?: FileUploadItem[];
  defaultValue?: FileUploadItem[];
  onValueChange?: (items: FileUploadItem[]) => void;
  onFilesAdded?: (items: FileUploadItem[], files: File[]) => void;
  onRemove?: (item: FileUploadItem) => void;
  onRetry?: (item: FileUploadItem) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  variant?: FileUploadVariant;
  title?: string;
  description?: string;
  browseLabel?: string;
  className?: string;
  classNames?: FileUploadClassNames;
}

const ROW_TRANSITION = { duration: 0.22, ease: EASE_OUT } as const;
const FAST_TRANSITION = { duration: 0.16, ease: EASE_OUT } as const;

const STATUS_LABEL: Record<FileUploadStatus, string> = {
  queued: "Queued",
  uploading: "Uploading",
  success: "Uploaded",
  error: "Failed",
};

const STATUS_TONE: Record<FileUploadStatus, string> = {
  queued: "text-muted-foreground",
  uploading: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-destructive",
};

function useControllableUpload({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: FileUploadItem[];
  defaultValue?: FileUploadItem[];
  onValueChange?: (items: FileUploadItem[]) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const isControlled = value !== undefined;
  const items = value ?? internalValue;

  const setItems = useCallback(
    (next: FileUploadItem[]) => {
      if (!isControlled) {
        setInternalValue(next);
      }

      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return [items, setItems] as const;
}

function clampProgress(value: number | undefined, status: FileUploadStatus) {
  if (status === "success") return 100;
  if (value === undefined || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${
    units[exponent]
  }`;
}

function fileKind(item: FileUploadItem) {
  const extension = item.name.includes(".")
    ? item.name.split(".").pop()
    : undefined;

  if (extension) return extension.toUpperCase();
  if (item.type) return item.type.split("/").pop()?.toUpperCase();
  return "FILE";
}

function getFileIcon(item: FileUploadItem) {
  const extension = item.name.includes(".")
    ? item.name.split(".").pop()?.toLowerCase()
    : undefined;
  const type = item.type ?? "";

  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (
    type.includes("zip") ||
    type.includes("compressed") ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension ?? "")
  ) {
    return FileArchive;
  }
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    ["csv", "xls", "xlsx"].includes(extension ?? "")
  ) {
    return FileSpreadsheet;
  }
  if (
    type.includes("pdf") ||
    type.startsWith("text/") ||
    ["pdf", "doc", "docx", "md", "txt"].includes(extension ?? "")
  ) {
    return FileText;
  }
  if (
    [
      "css",
      "html",
      "js",
      "jsx",
      "json",
      "mdx",
      "ts",
      "tsx",
      "xml",
      "yaml",
      "yml",
    ].includes(extension ?? "")
  ) {
    return FileCode2;
  }

  return FileIcon;
}

export function createFileUploadItem(file: File, index = 0): FileUploadItem {
  return {
    id: `${Date.now()}-${index}-${file.name}`,
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: "uploading",
    file,
  };
}

function StatusIcon({
  status,
  reduce,
}: {
  status: FileUploadStatus;
  reduce: boolean;
}) {
  const iconClassName = "h-4 w-4";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, transform: "translateY(4px)" }
        }
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        exit={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, transform: "translateY(-4px)" }
        }
        transition={FAST_TRANSITION}
        className={cn("grid h-6 w-6 place-items-center", STATUS_TONE[status])}
      >
        {status === "success" ? (
          <CheckCircle2 className={iconClassName} />
        ) : status === "error" ? (
          <AlertCircle className={iconClassName} />
        ) : status === "uploading" ? (
          <Loader2
            className={cn(
              iconClassName,
              "animate-spin",
              reduce && "animate-none",
            )}
          />
        ) : (
          <FileIcon className={iconClassName} />
        )}
        <span className="sr-only">{STATUS_LABEL[status]}</span>
      </motion.span>
    </AnimatePresence>
  );
}

function FileUploadRow({
  item,
  onRemove,
  onRetry,
  classNames,
}: {
  item: FileUploadItem;
  onRemove: (item: FileUploadItem) => void;
  onRetry: (item: FileUploadItem) => void;
  classNames?: FileUploadClassNames;
}) {
  const reduce = useReducedMotion() ?? false;
  const status = item.status ?? "queued";
  const progress = clampProgress(item.progress, status);
  const progressRatio = progress / 100;
  const showProgress = status === "uploading" || status === "success";
  const LeadingIcon = getFileIcon(item);

  return (
    <motion.li
      layout={!reduce}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }
      }
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={
        reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px)" }
      }
      transition={ROW_TRANSITION}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-background p-3",
        classNames?.item,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground",
            classNames?.leading,
          )}
        >
          <LeadingIcon className="h-5 w-5" />
        </div>

        <div className={cn("min-w-0 flex-1", classNames?.content)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-sm font-medium text-foreground",
                  classNames?.name,
                )}
              >
                {item.name}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-xs text-muted-foreground",
                  classNames?.meta,
                )}
              >
                {fileKind(item)} · {formatBytes(item.size)}
                {status === "error" && item.error ? ` · ${item.error}` : null}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <StatusIcon status={status} reduce={reduce} />
              {status === "error" ? (
                <button
                  type="button"
                  onClick={() => onRetry(item)}
                  aria-label={`Retry ${item.name}`}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground active:scale-95",
                    classNames?.action,
                  )}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove ${item.name}`}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground active:scale-95",
                  classNames?.action,
                )}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showProgress ? (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label={`${item.name} upload progress`}
              className={cn(
                "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
                classNames?.progress,
              )}
            >
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  status === "success"
                    ? "bg-emerald-500"
                    : "bg-foreground",
                )}
                style={{
                  transformOrigin: "left",
                  transform: reduce ? `scaleX(${progressRatio})` : undefined,
                }}
                initial={false}
                animate={
                  reduce ? undefined : { transform: `scaleX(${progressRatio})` }
                }
                transition={{ duration: 0.28, ease: EASE_OUT }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}

export function FileUpload({
  value,
  defaultValue,
  onValueChange,
  onFilesAdded,
  onRemove,
  onRetry,
  accept,
  multiple = true,
  maxFiles,
  disabled = false,
  variant = "default",
  title = "Drop files here",
  description = "Add files to the upload queue",
  browseLabel = "Browse",
  className,
  classNames,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const reduce = useReducedMotion() ?? false;
  const [items, setItems] = useControllableUpload({
    value,
    defaultValue,
    onValueChange,
  });
  const [dragging, setDragging] = useState(false);

  const commit = useCallback(
    (next: FileUploadItem[]) => {
      setItems(next);
    },
    [setItems],
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (disabled || incomingFiles.length === 0) return;

      const remainingSlots =
        maxFiles === undefined ? incomingFiles.length : maxFiles - items.length;
      if (remainingSlots <= 0) return;

      const files = incomingFiles.slice(
        0,
        multiple ? remainingSlots : Math.min(1, remainingSlots),
      );
      const added = files.map((file, index) => createFileUploadItem(file, index));

      if (added.length === 0) return;

      commit([...items, ...added]);
      onFilesAdded?.(added, files);
    },
    [commit, disabled, items, maxFiles, multiple, onFilesAdded],
  );

  const removeItem = useCallback(
    (item: FileUploadItem) => {
      commit(items.filter((entry) => entry.id !== item.id));
      onRemove?.(item);
    },
    [commit, items, onRemove],
  );

  const retryItem = useCallback(
    (item: FileUploadItem) => {
      const retryingItem = {
        ...item,
        error: undefined,
        progress: 0,
        status: "uploading" as const,
      };

      commit(
        items.map((entry) => (entry.id === item.id ? retryingItem : entry)),
      );
      onRetry?.(retryingItem);
    },
    [commit, items, onRetry],
  );

  const resetDrag = useCallback(() => {
    dragDepthRef.current = 0;
    setDragging(false);
  }, []);

  const maxReached = maxFiles !== undefined && items.length >= maxFiles;
  const centered = variant === "centered";

  return (
    <div className={cn("w-full space-y-3", className, classNames?.root)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        aria-label="Upload files"
        accept={accept}
        multiple={multiple}
        disabled={disabled || maxReached}
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          addFiles(Array.from(event.currentTarget.files ?? []));
          event.currentTarget.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled || maxReached}
        data-dragging={dragging}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          dragDepthRef.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
          if (dragDepthRef.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          if (disabled || maxReached) return;
          event.preventDefault();
          resetDrag();
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "group relative flex w-full overflow-hidden rounded-3xl border border-dashed border-border bg-background outline-none",
          "transition-[border-color,transform] duration-200 active:scale-[0.99]",
          "hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[dragging=true]:border-foreground",
          "disabled:pointer-events-none disabled:opacity-55",
          centered
            ? "min-h-56 flex-col items-center justify-center gap-3 p-7 text-center"
            : "items-center gap-4 p-5 text-left",
          classNames?.dropzone,
        )}
      >
        <motion.span
          aria-hidden="true"
          className={cn(
            "grid shrink-0 place-items-center bg-muted text-foreground",
            centered
              ? "h-16 w-16 rounded-[1.35rem] border border-border"
              : "h-14 w-14 rounded-[1.25rem]",
          )}
          animate={
            reduce
              ? undefined
              : {
                  transform: dragging
                    ? "translateY(-2px)"
                    : "translateY(0px)",
                }
          }
          transition={FAST_TRANSITION}
        >
          <UploadCloud className={centered ? "h-7 w-7" : "h-6 w-6"} />
        </motion.span>

        <span className={cn("min-w-0", centered ? "max-w-xs" : "flex-1")}>
          <span
            className={cn(
              "block font-semibold text-foreground",
              centered ? "text-base" : "text-sm",
            )}
          >
            {maxReached ? "Upload limit reached" : title}
          </span>
          <span
            className={cn(
              "block text-xs text-muted-foreground",
              centered ? "mt-1 leading-5" : "mt-0.5",
            )}
          >
            {maxReached
              ? `${items.length} of ${maxFiles} files added`
              : description}
          </span>
        </span>

        <span
          className={cn(
            "shrink-0 rounded-full border border-border text-xs font-medium text-foreground transition-colors duration-150 group-hover:bg-muted",
            centered ? "mt-1 px-4 py-2" : "px-3.5 py-2",
          )}
        >
          {browseLabel}
        </span>
      </button>

      <ul className={cn("space-y-2", classNames?.queue)}>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <FileUploadRow
              key={item.id}
              item={item}
              onRemove={removeItem}
              onRetry={retryItem}
              classNames={classNames}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}


## API Reference

### AttachmentUpload

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `AttachmentUploadItem[]` | — | No | — |
| `defaultValue` | `AttachmentUploadItem[]` | — | No | — |
| `onValueChange` | `((items: AttachmentUploadItem[]) => void)` | — | No | — |
| `onFilesAdded` | `((items: AttachmentUploadItem[], files: File[]) => void)` | — | No | — |
| `onFilesRejected` | `((files: File[], reason: AttachmentRejectReason) => void)` | — | No | — |
| `onRemove` | `((item: AttachmentUploadItem) => void)` | — | No | — |
| `onRetry` | `((item: AttachmentUploadItem) => void)` | — | No | — |
| `playingId` | `string` | — | No | — |
| `onAudioToggle` | `((item: AttachmentUploadItem) => void)` | — | No | — |
| `accept` | `string` | — | No | — |
| `multiple` | `boolean` | `true` | No | — |
| `maxFiles` | `number` | `12` | No | — |
| `maxFileSize` | `number` | `500 * 1024 * 1024` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `title` | `string` | `Drag and drop or browse files` | No | — |
| `description` | `string` | — | No | — |
| `attachmentsLabel` | `string` | `Attachments` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `AttachmentUploadClassNames` | — | No | — |

### FileUpload

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `FileUploadItem[]` | — | No | — |
| `defaultValue` | `FileUploadItem[]` | — | No | — |
| `onValueChange` | `((items: FileUploadItem[]) => void)` | — | No | — |
| `onFilesAdded` | `((items: FileUploadItem[], files: File[]) => void)` | — | No | — |
| `onRemove` | `((item: FileUploadItem) => void)` | — | No | — |
| `onRetry` | `((item: FileUploadItem) => void)` | — | No | — |
| `accept` | `string` | — | No | — |
| `multiple` | `boolean` | `true` | No | — |
| `maxFiles` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `variant` | `"default" \| "centered"` | `default` | No | — |
| `title` | `string` | `Drop files here` | No | — |
| `description` | `string` | `Add files to the upload queue` | No | — |
| `browseLabel` | `string` | `Browse` | No | — |
| `className` | `string` | — | No | — |
| `classNames` | `FileUploadClassNames` | — | No | — |

## Source

- Registry detail: https://beui.dev/r/file-upload
- Raw source: https://beui.dev/r/file-upload/raw
- GitHub: https://github.com/starc007/ui-components

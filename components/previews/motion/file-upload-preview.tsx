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

  useEffect(
    () => () => {
      for (const timer of retryTimersRef.current) {
        window.clearTimeout(timer);
      }
    },
    [],
  );

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
    <div className={cn("w-full h-full flex items-center justify-center p-1 sm:p-2", isDark ? "dark" : "")}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-4xl justify-items-center items-start">
        {/* Pattern 01: Attachment Workspace */}
        <div className="w-full max-w-md">
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

        {/* Pattern 02: Upload Queue Card */}
        <div className="w-full max-w-md rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 sm:p-4 shadow-sm transition-colors duration-200">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Upload package
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {queueItems.filter((item) => item.status === "success").length} of{" "}
                {queueItems.length} files ready
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-1">
                {VARIANTS.map((entry) => {
                  const selected = entry.id === queueVariant;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setQueueVariant(entry.id)}
                      data-selected={selected}
                      className="h-7 rounded-full px-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white data-[selected=true]:bg-white dark:data-[selected=true]:bg-neutral-800 data-[selected=true]:text-neutral-900 dark:data-[selected=true]:text-white shadow-xs"
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

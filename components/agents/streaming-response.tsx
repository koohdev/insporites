"use client";

import React, { useState } from "react";
import { Check, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StreamingResponseProps {
  status?: "streaming" | "complete" | "error";
  showActions?: boolean;
  children: React.ReactNode;
}

export function StreamingResponse({
  status = "complete",
  showActions = true,
  children,
}: StreamingResponseProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>{children}</div>
      {status === "streaming" && (
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 animate-pulse font-mono">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Generating response…</span>
        </div>
      )}
      {showActions && status === "complete" && (
        <div className="flex items-center gap-1 pt-1.5 mt-1 border-t border-neutral-200/50 dark:border-neutral-700/50 text-neutral-500 dark:text-neutral-400">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setLiked(liked === true ? null : true)}
            className={cn(
              "p-1 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors",
              liked === true && "text-blue-500"
            )}
            title="Good response"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLiked(liked === false ? null : false)}
            className={cn(
              "p-1 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors",
              liked === false && "text-rose-500"
            )}
            title="Bad response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

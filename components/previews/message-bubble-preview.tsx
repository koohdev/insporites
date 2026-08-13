"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, User, RotateCcw } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCardTheme } from "@/components/component-card";
import {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
  MessageBubble,
  MessageBubbleContent,
  MessageBubbleGroup,
  MessageBubbleCollapsible,
  StreamingResponse,
} from "@/components/message-bubble";
import { cn } from "@/lib/utils";

/** 1. Animated Surfaces (Basic Bubble Group) */
export function MessageBubbleUsage() {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
        1. Animated Surfaces
      </span>
      <MessageBubbleGroup spacing="default" className="w-full max-w-sm">
        <MessageBubble align="end" variant="solid">
          <MessageBubbleContent>
            Can you summarize the release notes?
          </MessageBubbleContent>
        </MessageBubble>

        <MessageBubble align="start" variant="soft">
          <MessageBubbleContent>
            The release improves streaming, navigation, and recovery states.
          </MessageBubbleContent>
        </MessageBubble>
      </MessageBubbleGroup>
    </div>
  );
}

/** 2. With Avatars */
export function MessageBubbleAvatarsPreview() {
  const timer = useRef<number | undefined>(undefined);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  const replay = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setStep(0);
    setRun((v) => v + 1);
  }, []);

  useEffect(() => {
    if (step >= 2) return;
    timer.current = window.setTimeout(
      () => setStep((v) => v + 1),
      step === 0 ? 650 : 900
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [step]);

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <div className="flex items-center justify-between w-full max-w-sm mb-1">
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          2. With Avatars
        </span>
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Replay
        </button>
      </div>

      <MessageGroup key={run} spacing="compact" className="w-full max-w-sm">
        <Message from="user">
          <MessageAvatar className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <User className="h-3.5 w-3.5" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <span className="font-medium text-neutral-900 dark:text-white text-xs">You</span>
              <span className="text-[11px] text-neutral-400">Now</span>
            </MessageHeader>
            <MessageBubble variant="solid">
              <MessageBubbleContent>
                Can you turn these notes into a launch update?
              </MessageBubbleContent>
            </MessageBubble>
            <MessageFooter className="text-[10px] text-neutral-400">Delivered</MessageFooter>
          </MessageContent>
        </Message>

        <AnimatePresence mode="popLayout">
          {step >= 1 && (
            <Message key="draft" from="assistant">
              <MessageAvatar>
                <Bot className="h-3.5 w-3.5" />
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <span className="font-medium text-neutral-900 dark:text-white text-xs">Assistant</span>
                  <span className="text-[11px] text-neutral-400">Just now</span>
                </MessageHeader>
                <MessageBubble variant="soft">
                  <MessageBubbleContent>
                    <StreamingResponse status="complete" showActions={false}>
                      Absolutely. I’ll keep it concise and lead with what changed.
                    </StreamingResponse>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          )}

          {step >= 2 && (
            <Message key="follow-up" from="assistant">
              <MessageAvatar placeholder />
              <MessageContent>
                <MessageBubble variant="soft">
                  <MessageBubbleContent>
                    <StreamingResponse status="complete" showActions={false}>
                      Do you want the tone to feel more technical or customer-facing?
                    </StreamingResponse>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          )}
        </AnimatePresence>
      </MessageGroup>
    </div>
  );
}

/** 3. Show More (Collapsible Bubble) */
export function MessageBubbleCollapsiblePreview() {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
        3. Show More (Collapsible)
      </span>
      <div className="w-full max-w-sm">
        <Message from="assistant">
          <MessageAvatar>
            <Bot className="h-3.5 w-3.5" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>
              <span className="font-medium text-neutral-900 dark:text-white text-xs">Assistant</span>
              <span className="text-[11px] text-neutral-400">Summary</span>
            </MessageHeader>
            <MessageBubble variant="soft" animateIn={false}>
              <MessageBubbleContent className="max-w-[90%]">
                <StreamingResponse status="complete" showActions={false}>
                  <MessageBubbleCollapsible collapsedLines={3}>
                    <p className="mb-1 font-medium">
                      The release is ready for a focused rollout across all regions.
                    </p>
                    <p className="mb-1">
                      Keyboard navigation, error recovery, and reduced-motion states are fully verified.
                    </p>
                    <p>
                      Before publishing, run the accessibility audit once more to confirm stream focus.
                    </p>
                  </MessageBubbleCollapsible>
                </StreamingResponse>
              </MessageBubbleContent>
            </MessageBubble>
          </MessageContent>
        </Message>
      </div>
    </div>
  );
}

/** Root Combined Preview */
export function MessageBubblePreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <MessageBubbleUsage />
        <MessageBubbleAvatarsPreview />
        <MessageBubbleCollapsiblePreview />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { MessageSideContext, type MessageSide } from "@/components/agents/message-context";
import { cn } from "@/lib/utils";

export interface MessageGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "default" | "compact";
  children: React.ReactNode;
}

export function MessageGroup({
  spacing = "default",
  className,
  children,
  ...props
}: MessageGroupProps) {
  return (
    <div
      data-slot="message-group"
      className={cn(
        "flex flex-col w-full",
        spacing === "compact" ? "gap-2" : "gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type MessageFrom = "user" | "assistant" | "system";

export type MessageProps = HTMLMotionProps<"div"> & {
  from?: MessageFrom;
  children: React.ReactNode;
};

export function Message({ from = "assistant", className, children, ...props }: MessageProps) {
  const side: MessageSide = from === "user" ? "end" : "start";

  return (
    <MessageSideContext.Provider value={side}>
      <motion.div
        data-slot="message"
        data-from={from}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex w-full items-start gap-3 text-sm",
          from === "user" ? "flex-row-reverse" : "flex-row",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </MessageSideContext.Provider>
  );
}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: boolean;
}

export function MessageAvatar({
  placeholder = false,
  className,
  children,
  ...props
}: MessageAvatarProps) {
  const side = React.useContext(MessageSideContext);

  if (placeholder) {
    return <div className="w-8 h-8 flex-shrink-0" aria-hidden="true" />;
  }

  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold shadow-xs transition-transform duration-200 hover:scale-105",
        side === "end"
          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MessageContent({ className, children, ...props }: MessageContentProps) {
  const side = React.useContext(MessageSideContext);

  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex max-w-[85%] sm:max-w-[78%] flex-col gap-1.5",
        side === "end" ? "items-end" : "items-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MessageHeader({ className, children, ...props }: MessageHeaderProps) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex items-center gap-2 px-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MessageFooter({ className, children, ...props }: MessageFooterProps) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex items-center gap-2 px-1 text-[11px] text-neutral-400 dark:text-neutral-500 font-normal",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

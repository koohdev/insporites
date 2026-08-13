"use client";

import React, { useState } from "react";
import { Check, Copy, Moon, Sun, Send, Sparkles } from "lucide-react";
import {
  ActionSwapCascadeButton,
} from "@/components/motion/action-swap-cascade";
import {
  ActionSwapBlurButton,
} from "@/components/motion/action-swap-blur";
import {
  ActionSwapRollButton,
} from "@/components/motion/action-swap-roll";
import type { ActionSwapItem } from "@/components/motion/action-swap";

// Items definitions matching docs exactly
const CASCADE_CTA_ITEMS: ActionSwapItem[] = [
  { id: "copy", label: "Copy link", icon: <Copy className="h-4 w-4" />, ariaLabel: "Copy link" },
  { id: "copied", label: "Copied!", icon: <Check className="h-4 w-4" />, ariaLabel: "Copied" },
];

const BLUR_TEXT_ITEMS: ActionSwapItem[] = [
  { id: "copy", label: "Copy" },
  { id: "copied", label: "Copied" },
];

const THEME_ICON_ITEMS: ActionSwapItem[] = [
  { id: "light", label: "Light", icon: <Sun className="h-4 w-4" />, ariaLabel: "Use light theme" },
  { id: "dark", label: "Dark", icon: <Moon className="h-4 w-4" />, ariaLabel: "Use dark theme" },
];

const BLUR_CTA_ITEMS: ActionSwapItem[] = [
  { id: "copy", label: "Copy link", icon: <Copy className="h-4 w-4" />, ariaLabel: "Copy link" },
  { id: "copied", label: "Copied", icon: <Check className="h-4 w-4" />, ariaLabel: "Copied" },
];

const ROLL_SAVE_ITEMS: ActionSwapItem[] = [
  { id: "save", label: "Save" },
  { id: "saved", label: "Saved" },
];

const ROLL_CTA_ITEMS: ActionSwapItem[] = [
  { id: "send", label: "Send invite", icon: <Send className="h-4 w-4" />, ariaLabel: "Send invite" },
  { id: "sent", label: "Invite sent", icon: <Sparkles className="h-4 w-4" />, ariaLabel: "Invite sent" },
];

export function ActionSwapCascadePreview() {
  const [value, setValue] = useState(CASCADE_CTA_ITEMS[0]?.id);
  return (
    <div className="flex w-full justify-center">
      <ActionSwapCascadeButton
        items={CASCADE_CTA_ITEMS}
        value={value}
        onValueChange={setValue}
        variant="primary"
      />
    </div>
  );
}

export function ActionSwapBlurPreview() {
  const [textValue, setTextValue] = useState(BLUR_TEXT_ITEMS[0]?.id);
  const [iconValue, setIconValue] = useState(THEME_ICON_ITEMS[0]?.id);
  const [ctaValue, setCtaValue] = useState(BLUR_CTA_ITEMS[0]?.id);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Copy with no icon */}
      <ActionSwapBlurButton
        items={BLUR_TEXT_ITEMS}
        value={textValue}
        onValueChange={setTextValue}
        variant="secondary"
      />
      {/* Night mode icon */}
      <ActionSwapBlurButton
        items={THEME_ICON_ITEMS}
        value={iconValue}
        onValueChange={setIconValue}
        variant="outline"
        size="icon"
        iconOnly
      />
      {/* Copy link blurs */}
      <ActionSwapBlurButton
        items={BLUR_CTA_ITEMS}
        value={ctaValue}
        onValueChange={setCtaValue}
        variant="primary"
      />
    </div>
  );
}

export function ActionSwapRollPreview() {
  const [saveValue, setSaveValue] = useState(ROLL_SAVE_ITEMS[0]?.id);
  const [iconValue, setIconValue] = useState(THEME_ICON_ITEMS[0]?.id);
  const [ctaValue, setCtaValue] = useState(ROLL_CTA_ITEMS[0]?.id);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Save button */}
      <ActionSwapRollButton
        items={ROLL_SAVE_ITEMS}
        value={saveValue}
        onValueChange={setSaveValue}
        variant="secondary"
      />
      {/* Night mode icon */}
      <ActionSwapRollButton
        items={THEME_ICON_ITEMS}
        value={iconValue}
        onValueChange={setIconValue}
        variant="outline"
        size="icon"
        iconOnly
      />
      {/* Send invite button */}
      <ActionSwapRollButton
        items={ROLL_CTA_ITEMS}
        value={ctaValue}
        onValueChange={setCtaValue}
        variant="primary"
      />
    </div>
  );
}

export function ActionSwapPreview() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-4">
      {/* Cascade Section */}
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
          Cascade
        </span>
        <ActionSwapCascadePreview />
      </div>

      {/* Blur Section */}
      <div className="flex flex-col items-center gap-2 w-full pt-2">
        <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
          Blur (No Icon Copy • Night Mode Icon • Copy Link)
        </span>
        <ActionSwapBlurPreview />
      </div>

      {/* Roll Section */}
      <div className="flex flex-col items-center gap-2 w-full pt-2">
        <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400">
          Roll (Save Button • Night Mode Icon • Send Invite)
        </span>
        <ActionSwapRollPreview />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CommandPalette, type CommandItem } from "@/components/motion/command-palette";
import { Sparkles, FileText, Settings, User, Terminal, Code, Search } from "lucide-react";
import { useCardTheme } from "@/components/component-card";
import { cn } from "@/lib/utils";

export function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const sampleItems: CommandItem[] = [
    {
      id: "ai-prompt",
      label: "Ask AI Assistant...",
      group: "Suggestions",
      icon: Sparkles,
      hint: "⌘I",
      onSelect: () => console.log("AI prompt"),
    },
    {
      id: "search-docs",
      label: "Search documentation",
      group: "Navigation",
      icon: FileText,
      hint: "⌘D",
      onSelect: () => console.log("Search docs"),
    },
    {
      id: "open-terminal",
      label: "Open inline terminal",
      group: "Tools",
      icon: Terminal,
      hint: "⌘`",
      onSelect: () => console.log("Terminal"),
    },
    {
      id: "account-settings",
      label: "Manage account settings",
      group: "Settings",
      icon: Settings,
      hint: "⌘,",
      onSelect: () => console.log("Settings"),
    },
    {
      id: "profile",
      label: "View profile & usage",
      group: "Settings",
      icon: User,
      onSelect: () => console.log("Profile"),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer shadow-xs",
          isDark
            ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800"
            : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
        )}
      >
        <Search className="h-4 w-4 text-neutral-400" />
        <span>Type a command or search...</span>
        <kbd className={cn(
          "ml-4 rounded px-1.5 py-0.5 text-[10px] font-semibold border",
          isDark ? "border-neutral-800 bg-neutral-800 text-neutral-400" : "border-neutral-200 bg-neutral-100 text-neutral-500",
        )}>
          ⌘K
        </kbd>
      </button>

      <CommandPalette
        items={sampleItems}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

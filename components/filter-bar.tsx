"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Search, Sun, Moon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CardTheme } from "@/components/component-card";
import { createTickPlayer } from "@/lib/tick-sound";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  globalTheme: CardTheme | "custom";
  onToggleGlobalTheme: (theme: "light" | "dark") => void;
}

export function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
  globalTheme,
  onToggleGlobalTheme,
}: FilterBarProps) {
  const reduce = useReducedMotion();
  const isDark = globalTheme === "dark";

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

  const handleCategoryClick = (category: string) => {
    getSoundPlayer().prepare();
    getSoundPlayer().playClick();
    onSelectCategory(category);
  };

  const handleThemeClick = (theme: "light" | "dark") => {
    getSoundPlayer().prepare();
    getSoundPlayer().playClick();
    onToggleGlobalTheme(theme);
  };

  const allCategories = ["All", ...categories];

  return (
    <div
      className={`w-full flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b transition-colors duration-300 ${
        isDark ? "border-neutral-800" : "border-neutral-200"
      }`}
    >
      {/* Left: Search Input & Global Light/Dark All Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-start gap-3 w-full lg:w-auto">
        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
          <input
            type="text"
            aria-label="Search components, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              getSoundPlayer().prepare();
            }}
            placeholder="Search components, tags..."
            className={`w-full rounded-2xl border pl-10 pr-4 py-2 text-sm outline-none transition-all shadow-xs ${
              isDark
                ? "bg-[#151515] border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-600"
                : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400"
            }`}
          />
        </div>

        {/* Global Light / Dark All Mode Switcher */}
        <div
          className={`flex items-center justify-center sm:justify-start gap-1 p-1 rounded-2xl border w-full sm:w-auto shrink-0 transition-colors duration-300 ${
            isDark ? "bg-[#151515] border-neutral-800" : "bg-neutral-100 border-neutral-200"
          }`}
        >
          <button
            type="button"
            onClick={() => handleThemeClick("light")}
            title="Turn Light Mode ON for all component cards and page background"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              globalTheme === "light"
                ? "bg-white text-neutral-900 shadow-xs"
                : isDark
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>Light All</span>
          </button>
          <button
            type="button"
            onClick={() => handleThemeClick("dark")}
            title="Turn Dark Mode ON for all component cards and page background"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              globalTheme === "dark"
                ? "bg-neutral-900 text-white shadow-xs border border-neutral-700"
                : isDark
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span>Dark All</span>
          </button>
        </div>
      </div>

      {/* Right: Category Pills with Animated Layout Pill */}
      <div className="flex w-full lg:w-auto items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none justify-start lg:justify-end">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = cat === "All" ? `All (${totalCount})` : cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`relative whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none ${
                isSelected
                  ? isDark
                    ? "text-neutral-900"
                    : "text-white"
                  : isDark
                    ? "text-neutral-400 hover:bg-neutral-900 hover:text-white border border-neutral-800"
                    : "text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {isSelected ? (
                <motion.span
                  layoutId="activeCategoryPill"
                  className={`absolute inset-0 rounded-xl shadow-xs -z-0 ${
                    isDark ? "bg-white" : "bg-neutral-900"
                  }`}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                />
              ) : null}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

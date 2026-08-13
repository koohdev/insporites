"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { ComponentItem, GridSpan } from "@/config/components-registry";
import { Frame, FramePanel } from "@/components/frame";
import { Sparkles, Check, Copy, Maximize2, Minimize2, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type CardTheme = "light" | "dark";

export const CardThemeContext = createContext<CardTheme>("light");

export function useCardTheme() {
  return useContext(CardThemeContext);
}

interface ComponentCardProps {
  item: ComponentItem;
  overrideTheme?: CardTheme;
  children?: React.ReactNode;
}

const spanClassMap: Record<GridSpan, string> = {
  "1x1": "col-span-1 row-span-1 min-h-[320px] h-full flex flex-col",
  "2x1": "col-span-1 md:col-span-2 row-span-1 min-h-[320px] h-full flex flex-col",
  "1x2": "col-span-1 row-span-2 min-h-[640px] h-full flex flex-col",
  "2x2": "col-span-1 md:col-span-2 row-span-2 min-h-[640px] h-full flex flex-col",
  "4x2": "col-span-1 md:col-span-2 xl:col-span-4 row-span-2 min-h-[720px] h-full flex flex-col",
};

const DEFAULT_DARK_COMPONENTS = new Set([
  "404-bouncy-accordion",
  "action-swap-button",
  "animated-badge",
  "animated-toast-stack",
  "availability-schedule",
  "buttons",
  "check-box",
  "command-palette",
  "drawer-left-right",
  "fade-in-text-reveal",
  "fade-transition-2",
  "file-upload",
  "loaders",
  "metrics-card",
  "notification-stack",
  "number-flow",
  "parallax-transition",
  "pop-over",
  "portfolio-allocation",
  "preview-rail",
  "range-slider",
  "select-dropdown",
  "slide-up-text-reveal",
  "switch",
  "tabs",
  "wheel-picker-date",
]);

export function ComponentCard({ item, overrideTheme, children }: ComponentCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardTheme, setCardTheme] = useState<CardTheme>(() =>
    overrideTheme ?? (DEFAULT_DARK_COMPONENTS.has(item.id) ? "dark" : "light")
  );

  useEffect(() => {
    if (overrideTheme) {
      setCardTheme(overrideTheme);
    }
  }, [overrideTheme]);

  const isDark = cardTheme === "dark";

  const handleCopyPath = () => {
    navigator.clipboard.writeText(item.docPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setCardTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const spanClasses = spanClassMap[item.span] || spanClassMap["1x1"];

  return (
    <CardThemeContext.Provider value={cardTheme}>
      {/* Outer Frame - Entire clicked grid card flips to #151515 in dark mode */}
      <Frame
        className={`group relative w-full h-full flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-[#151515] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
        } ${spanClasses}`}
      >
        {/* Inner FramePanel */}
        <FramePanel
          className={`flex flex-col justify-between h-full flex-1 w-full p-6 overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-[#151515] border-neutral-800/80 text-white" : "bg-white border-neutral-200/80 text-neutral-900"
          }`}
        >
          {/* Card Top Header */}
          <div className="flex items-start justify-between gap-3 z-10 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-neutral-400"}`}>
                  {item.category}
                </span>
                <span className={`h-1 w-1 rounded-full ${isDark ? "bg-neutral-600" : "bg-neutral-300"}`} />
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-medium border ${
                    isDark
                      ? "bg-[#151515] text-neutral-300 border-neutral-700"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  {item.span}
                </span>
              </div>
              <h3 className={`text-lg font-semibold tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
                {item.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={toggleTheme}
                title={`Switch entire card to ${isDark ? "Light" : "Dark"} mode (#151515)`}
                className={`rounded-lg p-1.5 transition-colors ${
                  isDark
                    ? "bg-neutral-800 text-amber-400 hover:bg-neutral-700"
                    : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={handleCopyPath}
                title={`Copy path: ${item.docPath}`}
                className={`rounded-lg p-1.5 transition-colors ${
                  isDark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(true)}
                title="Expand view"
                className={`rounded-lg p-1.5 transition-colors ${
                  isDark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card Main Interactive Stage (#151515 background when dark) */}
          <div
            className={`relative w-full h-full flex-1 flex items-center justify-center py-4 overflow-hidden rounded-2xl transition-colors duration-300 ${
              isDark ? "bg-[#151515] text-white" : "bg-white text-neutral-900"
            }`}
          >
            {item.status === "live" && children ? (
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                {children}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed w-full h-full min-h-[160px] overflow-hidden ${
                  isDark
                    ? "border-neutral-800 bg-[#151515] text-white"
                    : "border-neutral-200 bg-white text-neutral-900"
                }`}
              >
                <div
                  className={`rounded-full border p-3 mb-3 shadow-xs shrink-0 ${
                    isDark
                      ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                      : "bg-white border-neutral-200 text-neutral-400"
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-xs text-neutral-400 max-w-[240px] leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center overflow-hidden">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                          : "bg-white border-neutral-200 text-neutral-500"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom Footer */}
          <div
            className={`flex items-center justify-between border-t pt-4 text-xs shrink-0 ${
              isDark ? "border-neutral-800/80 text-neutral-400" : "border-neutral-100 text-neutral-500"
            }`}
          >
            <p className="line-clamp-1 max-w-[75%] font-mono text-[11px] text-neutral-400">
              {item.docPath}
            </p>
            <span className="font-mono text-[11px] text-neutral-400">{item.span}</span>
          </div>
        </FramePanel>
      </Frame>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative flex flex-col w-full max-w-5xl h-[85vh] rounded-3xl border shadow-2xl overflow-hidden p-8 ${
                isDark ? "bg-[#151515] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-4 shrink-0 ${
                  isDark ? "border-neutral-800" : "border-neutral-100"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {item.category} • {item.span}
                  </span>
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {item.title}
                  </h2>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`rounded-full p-2 ${
                    isDark ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  }`}
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>

              <div
                className={`flex-1 overflow-auto py-8 flex justify-center items-center rounded-2xl transition-colors ${
                  isDark ? "bg-[#151515] text-white" : "bg-white text-neutral-900"
                }`}
              >
                {item.status === "live" && children ? (
                  <div className="w-full flex justify-center">{children}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
                    <Sparkles className="h-10 w-10 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{item.description}</p>
                    <div
                      className={`font-mono text-xs border px-3 py-1.5 rounded-lg ${
                        isDark ? "bg-neutral-800 border-neutral-700 text-neutral-300" : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      Doc Path: {item.docPath}
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`border-t pt-4 flex items-center justify-between text-xs shrink-0 ${
                  isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-100 text-neutral-500"
                }`}
              >
                <span>Category: {item.category}</span>
                <span>Default Span: {item.span}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardThemeContext.Provider>
  );
}

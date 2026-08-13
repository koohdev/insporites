"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { COMPONENTS_REGISTRY, GridSpan } from "@/config/components-registry";
import { ComponentCard, CardTheme } from "@/components/component-card";
import { FilterBar } from "@/components/filter-bar";
import { BouncyAccordion } from "@/components/bouncy-accordion";
import { MetricsCard } from "@/components/metrics-card";
import { NotificationStack, NotificationStackItem } from "@/components/motion/notification-stack";
import { LoaderPreview } from "@/components/motion/loader-preview";
import { MessageBubblePreview } from "@/components/previews/message-bubble-preview";
import { ActionSwapPreview } from "@/components/previews/action-swap-preview";
import { AnimatedToastStackPreview } from "@/components/previews/animated-toast-stack-preview";
import { PortfolioAllocationCard } from "@/components/portfolio-allocation";
import { AvailabilitySchedulerPreview } from "@/components/motion/availability-scheduler";
import { ComboboxPreview } from "@/components/previews/motion/combobox-preview";
import { WheelPickerPreview } from "@/components/previews/motion/wheel-picker-preview";
import { AnimatedBadgePreview } from "@/components/previews/motion/animated-badge-preview";
import { CommandPalettePreview } from "@/components/previews/motion/command-palette-preview";
import { DrawerPreview } from "@/components/previews/motion/drawer-preview";
import { PreviewRailPreview } from "@/components/previews/motion/preview-rail-preview";
import { RangeSliderPreview } from "@/components/previews/motion/range-slider-preview";
import { FileUploadPreview } from "@/components/previews/motion/file-upload-preview";
import { SelectPreview } from "@/components/previews/motion/select-preview";
import { TabsPreview } from "@/components/previews/motion/tabs-preview";
import { PopoverPreview } from "@/components/previews/motion/popover-preview";
import { NumberFlowPreview } from "@/components/previews/motion/number-flow-preview";
import { CustomVideoPlayerPreview } from "@/components/previews/motion/custom-video-player-preview";
import { ButtonsPreview } from "@/components/previews/motion/buttons-preview";
import { CheckboxPreview } from "@/components/previews/motion/checkbox-preview";
import { SwitchPreview } from "@/components/previews/motion/switch-preview";
import { Compass, RotateCw } from "lucide-react";
import { EASE_OUT } from "@/lib/ease";

const sampleNotifications: NotificationStackItem[] = [
  {
    id: "import-failed",
    title: "Orders import failed",
    description: "42s · TimeoutError at Step 2",
    trailing: (
      <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
        <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
        2
      </span>
    ),
  },
  {
    id: "sla-breach",
    title: "SLA breach",
    description: "2m 11s · Data enrichment",
  },
  {
    id: "sync-fixed",
    title: "Product sync auto-fixed",
    description: "5m · 404 on GET /products",
  },
];

const spanClassMap: Record<GridSpan, string> = {
  "1x1": "col-span-1 row-span-1 min-h-[320px]",
  "2x1": "col-span-1 md:col-span-2 row-span-1 min-h-[320px]",
  "1x2": "col-span-1 row-span-2 min-h-[640px]",
  "2x2": "col-span-1 md:col-span-2 row-span-2 min-h-[640px]",
  "4x2": "col-span-1 md:col-span-2 xl:col-span-4 row-span-2 min-h-[720px]",
};

export default function Home() {
  const reduce = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [globalTheme, setGlobalTheme] = useState<CardTheme | "custom">("custom");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(COMPONENTS_REGISTRY.map((c) => c.category));
    return Array.from(cats);
  }, []);

  // Filter components
  const filteredComponents = useMemo(() => {
    // ⚡ Bolt Optimization: Calculate query once outside the loop
    const query = searchQuery.toLowerCase().trim();

    return COMPONENTS_REGISTRY.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // ⚡ Bolt Optimization: Early return to avoid expensive string operations
      if (!matchesCategory) return false;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const isPageDark = globalTheme === "dark";

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-300 ${
        isPageDark
          ? "bg-[#0a0a0a] text-white selection:bg-white selection:text-neutral-900"
          : "bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white"
      }`}
    >
      {/* Title Section (py-[10rem], top-left aligned) */}
      <section
        className={`w-full py-[10rem] px-6 sm:px-10 lg:px-16 xl:px-20 text-left transition-colors duration-300 ${
          isPageDark ? "bg-[#0a0a0a]" : "bg-white"
        }`}
      >
        <h1
          className={`text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight transition-colors duration-300 ${
            isPageDark ? "text-white" : "text-neutral-900"
          }`}
        >
          Insporites
        </h1>
      </section>

      {/* Main Grid Container */}
      <main className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-28">
        {/* Filter and Search Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={COMPONENTS_REGISTRY.length}
          globalTheme={globalTheme}
          onToggleGlobalTheme={(theme) => setGlobalTheme(theme)}
        />

        {/* Bento Grid layout with smooth spring layout projections & card transitions */}
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredComponents.length > 0 ? (
            <motion.div
              layout
              key="components-grid"
              className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min grid-flow-dense"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredComponents.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: 0.9,
                            y: 8,
                            transition: { duration: 0.15, ease: EASE_OUT },
                          }
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                            mass: 0.8,
                          }
                    }
                    className={spanClassMap[item.span] || spanClassMap["1x1"]}
                  >
                    <ComponentCard
                      item={item}
                      overrideTheme={globalTheme === "custom" ? undefined : globalTheme}
                    >
                      {item.id === "bouncy-accordion" && (
                        <div className="w-full h-[520px] overflow-auto scrollbar-none p-1 flex items-center justify-center">
                          <BouncyAccordion />
                        </div>
                      )}
                      {item.id === "metrics-card" && <MetricsCard />}
                      {item.id === "message-bubble" && <MessageBubblePreview />}
                      {item.id === "action-swap-button" && <ActionSwapPreview />}
                      {item.id === "animated-toast-stack" && <AnimatedToastStackPreview />}
                      {item.id === "notification-stack" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <NotificationStack items={sampleNotifications} />
                        </div>
                      )}
                      {item.id === "portfolio-allocation" && <PortfolioAllocationCard />}
                      {item.id === "availability-schedule" && (
                        <div className="w-full h-[560px] overflow-y-auto p-2 flex justify-center items-start">
                          <AvailabilitySchedulerPreview />
                        </div>
                      )}
                      {item.id === "combobox-search" && (
                        <div className="w-full h-[460px] flex items-center justify-center p-2">
                          <ComboboxPreview />
                        </div>
                      )}
                      {item.id === "animated-badge" && <AnimatedBadgePreview />}
                      {item.id === "command-palette" && <CommandPalettePreview />}
                      {item.id === "drawer-left-right" && <DrawerPreview />}
                      {item.id === "preview-rail" && <PreviewRailPreview />}
                      {item.id === "range-slider" && <RangeSliderPreview />}
                      {item.id === "file-upload" && (
                        <div className="w-full h-full min-h-[580px] p-2 flex justify-center items-center">
                          <FileUploadPreview />
                        </div>
                      )}
                      {item.id === "buttons" && <ButtonsPreview />}
                      {item.id === "check-box" && <CheckboxPreview />}
                      {item.id === "switch" && <SwitchPreview />}
                      {item.id === "select-dropdown" && <SelectPreview />}
                      {item.id === "tabs" && <TabsPreview />}
                      {item.id === "pop-over" && <PopoverPreview />}
                      {item.id === "number-flow" && <NumberFlowPreview />}
                      {item.id === "wheel-picker-date" && (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <WheelPickerPreview />
                        </div>
                      )}
                      {item.id === "loaders" && <LoaderPreview />}
                      {item.id === "custom-video-player" && (
                        <div className="w-full h-full min-h-[540px] flex items-center justify-center">
                          <CustomVideoPlayerPreview />
                        </div>
                      )}
                    </ComponentCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Compass className="h-10 w-10 text-neutral-400 mb-3" />
              <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                No components found
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Try adjusting your search query or category filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCardTheme } from "@/components/component-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { cn } from "@/lib/utils";

export function TabsPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [pillTab, setPillTab] = useState("overview");
  const [segmentTab, setSegmentTab] = useState("daily");
  const [underlineTab, setUnderlineTab] = useState("all");

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* Pill Variant */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Pill Variant
          </span>
          <Tabs value={pillTab} onValueChange={setPillTab} variant="pill">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Segment Variant */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Segment Variant
          </span>
          <Tabs value={segmentTab} onValueChange={setSegmentTab} variant="segment">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Underline Variant */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Underline Variant
          </span>
          <Tabs value={underlineTab} onValueChange={setUnderlineTab} variant="underline">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

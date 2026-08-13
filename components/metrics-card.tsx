"use client";

import React from "react";
import { RadialGauge } from "./radial-gauge";

export interface MetricPanelItem {
  id: string;
  title: string;
  badgeLabel?: string;
  statusLabel: string;
  subMetricText: string;
  gaugeValue: number; // 0 - 100
  gaugeColor: string; // oklch or hex
  avatars: { name: string; src?: string }[];
  peopleCountLabel: string;
}

const defaultPanels: MetricPanelItem[] = [
  {
    id: "perf",
    title: "Performance Metrics",
    badgeLabel: "Details",
    statusLabel: "Stable",
    subMetricText: "Server Uptime: 99.7%",
    gaugeValue: 85,
    gaugeColor: "oklch(79.2% 0.209 151.71)", // Emerald
    avatars: [
      {
        name: "User 1",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/248FZBBT37TBWZS6SPSPG9ZTKH.jpg",
      },
      {
        name: "User 2",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/7P8QT47JKSZ1VMX7DC7EHF347F.jpg",
      },
      {
        name: "User 3",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/0GVWK4VB6BTBCGGXZY8MJ46ANH.jpg",
      },
    ],
    peopleCountLabel: "6 reviewers",
  },
  {
    id: "qual",
    title: "Quality Metrics",
    badgeLabel: "Details",
    statusLabel: "In Review",
    subMetricText: "Code Coverage: 48.2%",
    gaugeValue: 48,
    gaugeColor: "oklch(79.5% 0.184 86.1)", // Amber
    avatars: [
      {
        name: "User 4",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/0GVWK4VB6BTBCGGXZY8MJ46ANH.jpg",
      },
      {
        name: "User 5",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/7P8QT47JKSZ1VMX7DC7EHF347F.jpg",
      },
      { name: "K" },
      {
        name: "User 6",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/248FZBBT37TBWZS6SPSPG9ZTKH.jpg",
      },
    ],
    peopleCountLabel: "9 testers",
  },
  {
    id: "sec",
    title: "Security Metrics",
    badgeLabel: "Details",
    statusLabel: "Protected",
    subMetricText: "Vulnerability Score: 94%",
    gaugeValue: 94,
    gaugeColor: "oklch(72% 0.22 260)", // Blue/Violet
    avatars: [
      {
        name: "User 7",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/248FZBBT37TBWZS6SPSPG9ZTKH.jpg",
      },
      {
        name: "User 8",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/7P8QT47JKSZ1VMX7DC7EHF347F.jpg",
      },
    ],
    peopleCountLabel: "4 auditors",
  },
  {
    id: "infra",
    title: "Infrastructure Load",
    badgeLabel: "Details",
    statusLabel: "Optimal",
    subMetricText: "CPU Utilization: 72%",
    gaugeValue: 72,
    gaugeColor: "oklch(80% 0.18 190)", // Cyan
    avatars: [
      {
        name: "User 9",
        src: "https://app.paper.design/file-assets/01KZNFK643K41CYWRYAKKDEEE6/0GVWK4VB6BTBCGGXZY8MJ46ANH.jpg",
      },
      { name: "S" },
    ],
    peopleCountLabel: "3 engineers",
  },
];

export function MetricsCard({
  panels = defaultPanels,
}: {
  panels?: MetricPanelItem[];
}) {
  return (
    <div className="flex flex-col gap-1 p-1 bg-[#26262680] border border-white/10 rounded-[14px] w-full shadow-2xl font-sans antialiased text-neutral-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 w-full">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="bg-[#171717] border border-white/10 rounded-[10px] shadow-xs min-h-[204px] overflow-hidden flex flex-col justify-between"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-3.5 h-[52px] border-b border-white/[0.06]">
              <span className="text-xs sm:text-sm font-semibold text-neutral-100 truncate">
                {panel.title}
              </span>
              {panel.badgeLabel && (
                <button
                  type="button"
                  className="px-2 h-5.5 flex items-center justify-center bg-white/[0.04] border border-white/15 rounded-md text-[11px] font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors shrink-0"
                >
                  {panel.badgeLabel}
                </button>
              )}
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-[1fr_auto] items-end p-3.5 gap-2 min-h-[140px]">
              {/* Left Column: Status info + Avatar group */}
              <div className="flex flex-col justify-between gap-5 min-w-0">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-100 mb-0.5">
                    {panel.statusLabel}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {panel.subMetricText}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Overlapping Avatar Group */}
                  <div className="flex -space-x-2 shrink-0">
                    {panel.avatars.map((avatar, idx) => (
                      <div
                        key={idx}
                        className="relative flex shrink-0 size-5.5 rounded-full ring-2 ring-[#0A0A0A] bg-neutral-900 overflow-hidden items-center justify-center text-[9px] font-medium text-neutral-400"
                      >
                        {avatar.src ? (
                          <img
                            src={avatar.src}
                            alt={avatar.name}
                            className="aspect-square size-full object-cover rounded-full"
                          />
                        ) : (
                          avatar.name.slice(0, 1)
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                    {panel.peopleCountLabel}
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Radial Gauge */}
              <RadialGauge
                value={panel.gaugeValue}
                activeColor={panel.gaugeColor}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

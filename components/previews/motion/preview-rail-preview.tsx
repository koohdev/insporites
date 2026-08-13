"use client";

import { PreviewRail, type PreviewRailItem } from "@/components/motion/preview-rail";

export const previewRailItems: PreviewRailItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Return to your workspace overview and recent activity.",
    href: "#dashboard",
  },
  {
    id: "components",
    label: "Components",
    description: "Browse motion primitives for React and Next.js.",
    href: "#components",
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Explore composed, product-ready interface blocks.",
    href: "#blocks",
  },
  {
    id: "playground",
    label: "Playground",
    description: "Tune motion values and preview behavior live.",
    href: "#playground",
  },
  {
    id: "docs",
    label: "Documentation",
    description: "Read installation, usage, and API reference notes.",
    href: "#docs",
  },
  {
    id: "changelog",
    label: "Changelog",
    description: "Review newly launched components and improvements.",
    href: "#changelog",
  },
];

export function PreviewRailPreview() {
  return (
    <div className="flex h-full w-full items-center justify-start pl-4 sm:pl-8 p-4">
      <PreviewRail
        items={previewRailItems}
        defaultActiveId="docs"
        className="h-[280px] w-full max-w-lg items-center justify-start"
      />
    </div>
  );
}

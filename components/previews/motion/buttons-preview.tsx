"use client";

import { ArrowRight, Download, Trash2 } from "lucide-react";
import { useCardTheme } from "@/components/component-card";
import { Button } from "@/components/motion/button/base";
import { cn } from "@/lib/utils";

export function ButtonsPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="md">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="md">Outline</Button>
          <Button variant="ghost" size="md">Ghost</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="secondary" size="icon" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

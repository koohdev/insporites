"use client";

import React from "react";
import { Loader, LoaderVariant } from "./loader";

const VARIANTS: { variant: LoaderVariant; label: string }[] = [
  { variant: "spinner", label: "Spinner" },
  { variant: "dots", label: "Dots" },
  { variant: "bars", label: "Bars" },
  { variant: "dot-matrix", label: "Dot Matrix" },
  { variant: "dither", label: "Dither" },
  { variant: "morph", label: "Morph" },
  { variant: "comet", label: "Comet" },
  { variant: "metaballs", label: "Metaballs" },
  { variant: "newton", label: "Newton" },
  { variant: "helix", label: "Helix" },
  { variant: "scramble", label: "Scramble" },
  { variant: "percent", label: "Percent" },
  { variant: "ascii", label: "ASCII" },
  { variant: "ascii-line", label: "ASCII Line" },
  { variant: "ascii-braille", label: "Braille" },
  { variant: "ascii-blocks", label: "Blocks" },
  { variant: "ascii-bounce", label: "Bounce" },
];

export function LoaderPreview() {
  return (
    <div className="w-full h-full p-4 overflow-auto scrollbar-none flex items-center justify-center">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 w-full max-w-full items-center justify-items-center">
        {VARIANTS.map(({ variant, label }) => (
          <div
            key={variant}
            className="flex flex-col items-center justify-center gap-2 p-2 w-full text-neutral-800 dark:text-neutral-200 transition-transform hover:scale-105"
          >
            <Loader variant={variant} size={28} />
            <span className="text-[10px] font-mono font-medium text-neutral-500 dark:text-neutral-400 text-center truncate max-w-full">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

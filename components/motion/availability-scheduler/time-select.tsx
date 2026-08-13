"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import type { TimeOption } from "./types";

// Time field: the library Select, with option panel capped so it scrolls smoothly.
export function TimeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: TimeOption[];
}) {
  return (
    <Select value={value} onValueChange={onChange} className="w-full">
      <SelectTrigger className="tabular-nums">
        <SelectValue className="whitespace-nowrap" />
      </SelectTrigger>
      <SelectContent className="max-h-52 overflow-y-auto overscroll-contain">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="tabular-nums">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

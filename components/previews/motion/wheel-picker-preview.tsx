"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/motion/switch";
import { WheelPicker } from "@/components/motion/wheel-picker";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from({ length: 60 }, (_, i) => String(1980 + i));

function daysIn(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function WheelPickerPreview() {
  const [month, setMonth] = useState("June");
  const [year, setYear] = useState("2004");
  const [day, setDay] = useState("9");
  const [sound, setSound] = useState(false);

  const monthIndex = MONTHS.indexOf(month);
  const dayCount = daysIn(monthIndex, Number(year));
  const days = Array.from({ length: dayCount }, (_, i) => String(i + 1));

  useEffect(() => {
    if (Number(day) > dayCount) setDay(String(dayCount));
  }, [day, dayCount]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-2 w-full max-w-sm select-none">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        Born{" "}
        <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
          {month} {day}, {year}
        </span>
      </span>
      <div className="flex items-stretch gap-1 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1a1a] p-2 shadow-xs">
        <WheelPicker
          options={MONTHS}
          value={month}
          onValueChange={setMonth}
          className="w-28 border-0 bg-transparent"
          visibleCount={7}
          itemHeight={40}
          sound={sound}
          aria-label="Month"
        />
        <WheelPicker
          options={days}
          value={day}
          onValueChange={setDay}
          className="w-14 border-0 bg-transparent"
          visibleCount={7}
          itemHeight={40}
          sound={sound}
          aria-label="Day"
        />
        <WheelPicker
          options={YEARS}
          value={year}
          onValueChange={setYear}
          className="w-20 border-0 bg-transparent"
          visibleCount={7}
          itemHeight={40}
          sound={sound}
          aria-label="Year"
        />
      </div>
      <Switch
        checked={sound}
        onCheckedChange={setSound}
        label="Tick sound"
        className="origin-left scale-[0.85] [&_label]:text-sm [&_label]:font-medium [&_label]:text-neutral-700 dark:[&_label]:text-neutral-200"
      />
    </div>
  );
}

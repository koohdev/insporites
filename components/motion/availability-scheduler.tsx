"use client";

import React from "react";
import { AvailabilityScheduler } from "./availability-scheduler/index";

export * from "./availability-scheduler/index";

export function AvailabilitySchedulerPreview() {
  return (
    <div className="w-full h-full max-h-[560px] overflow-y-auto p-4 flex justify-center items-start">
      <AvailabilityScheduler />
    </div>
  );
}

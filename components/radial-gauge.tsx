"use client";

import React from "react";

export interface RadialGaugeProps {
  /** Percentage value (0 - 100) */
  value: number;
  /** Total radial segments (default: 40) */
  totalSegments?: number;
  /** Active stroke color */
  activeColor?: string;
  /** Inactive segment color */
  inactiveColor?: string;
  /** Line stroke width (default: 2.5) */
  strokeWidth?: number;
  className?: string;
}

export function RadialGauge({
  value,
  totalSegments = 40,
  activeColor = "oklch(69.6% 0.170 162.5)",
  inactiveColor = "oklch(26.5% 0 0)",
  strokeWidth = 2.5,
  className,
}: RadialGaugeProps) {
  const cx = 122;
  const cy = 126;
  const innerRadius = 80;
  const outerRadius = 103;

  const activeCount = Math.round(
    (Math.min(100, Math.max(0, value)) / 100) * totalSegments
  );

  const segments = Array.from({ length: totalSegments }, (_, i) => {
    const angleDeg = 180 - (i / (totalSegments - 1)) * 180;
    const rad = (angleDeg * Math.PI) / 180;

    const x1 = cx + innerRadius * Math.cos(rad);
    const y1 = cy - innerRadius * Math.sin(rad);
    const x2 = cx + outerRadius * Math.cos(rad);
    const y2 = cy - outerRadius * Math.sin(rad);

    return {
      id: i,
      x1: Number(x1.toFixed(3)),
      y1: Number(y1.toFixed(3)),
      x2: Number(x2.toFixed(3)),
      y2: Number(y2.toFixed(3)),
      isActive: i < activeCount,
    };
  });

  return (
    <div className={className || "w-[216px] h-[113px] overflow-hidden"}>
      <svg
        aria-hidden="true"
        viewBox="14 18 216 113"
        className="w-full h-full overflow-hidden"
      >
        {/* Layer 1: Ambient Shadow (40% opacity) */}
        <g opacity="0.4">
          {segments.map((seg) => (
            <line
              key={`shadow-${seg.id}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.isActive ? activeColor : inactiveColor}
              strokeWidth={strokeWidth + 0.5}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Layer 2: Foreground Ticks */}
        {segments.map((seg) => (
          <line
            key={`fg-${seg.id}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={seg.isActive ? activeColor : inactiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

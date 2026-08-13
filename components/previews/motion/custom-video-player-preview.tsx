"use client";

import { useCardTheme } from "@/components/component-card";
import { CustomVideoPlayer } from "@/components/motion/custom-video-player";

const VIDEO_SRC =
  "https://inspo-sec-9072.b-cdn.net/private/vidfinal-ios-optimized.mp4";

const CHAPTERS = [
  { start: 0, title: "Intro" },
  { start: 9, title: "Why Details" },
  { start: 45, title: "Filtering" },
  { start: 72, title: "Combining filters" },
  { start: 102, title: "Saving inspo" },
  { start: 117, title: "The vault" },
  { start: 161, title: "Outro" },
];

export function CustomVideoPlayerPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  return (
    <div
      className="w-full h-full min-h-[540px] flex items-center justify-center"
      style={{
        background: isDark
          ? "radial-gradient(ellipse at 50% 80%, rgba(60,60,80,0.45) 0%, transparent 70%)"
          : "radial-gradient(ellipse at 50% 80%, rgba(200,200,220,0.35) 0%, transparent 70%)",
      }}
    >
      <CustomVideoPlayer
        videoSrc={VIDEO_SRC}
        chapters={CHAPTERS}
        defaultSpeed={1.5}
        playerId="demo-player"
      />
    </div>
  );
}

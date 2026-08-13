"use client";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VideoChapter {
  start: number;
  title: string;
}

export interface CustomVideoPlayerProps {
  videoSrc: string;
  videoIosSrc?: string;
  chapters?: VideoChapter[];
  defaultSpeed?: number;
  playerId?: string;
}

// ---------------------------------------------------------------------------
// Default demo chapters (from the doc)
// ---------------------------------------------------------------------------

const DEFAULT_CHAPTERS: VideoChapter[] = [
  { start: 0, title: "Intro" },
  { start: 9, title: "Why Details" },
  { start: 45, title: "Filtering" },
  { start: 72, title: "Combining filters" },
  { start: 102, title: "Saving inspo" },
  { start: 117, title: "The vault" },
  { start: 161, title: "Outro" },
];

// ---------------------------------------------------------------------------
// CSS — SCSS flattened to plain CSS
// ---------------------------------------------------------------------------

const MEDIA_CSS = `
[data-media-01-open],
.media-01 button {
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

[data-media-01-open],
[data-media-01-open] *,
.media-01,
.media-01 *,
.media-01 *::before,
.media-01 *::after {
  box-sizing: border-box;
}

[data-media-01-open] {
  --corner-shape: superellipse(1.2);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --media-01-open-text: #ffffff;
  position: relative;
  height: 48px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: rgba(53, 53, 53, 0.498);
  backdrop-filter: blur(10px);
  color: var(--media-01-open-text);
  font-size: 14px;
  font-weight: 450;
  transition:
    background 180ms ease-out,
    scale 260ms var(--ease-out-quart);
}

[data-media-01-open]:hover {
  background: rgba(53, 53, 53, 0.598);
}

[data-media-01-open]:active {
  scale: 0.96;
}

[data-media-01-open] svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.media-01 {
  --corner-shape: superellipse(1.2);
  --box-shadow: 0px 4px 4px 0px hsla(0, 0%, 0%, 0.039), 0px 0px 1px 0px hsla(0, 0%, 0%, 0.62);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --white: #ffffff;
  --black: #050505;
  --control: 26px;
  --icon: 20px;
  --icon-stroke: 2;
  --gap: 12px;
  --inset: 22px;
  --bottom: 16px;
  --timeline-bottom: 50px;
  --time-size: 14px;
  --time-width: 88px;
  --volume-open: calc(var(--control) + var(--volume-range) + var(--gap));
  --volume-range: 54px;
  --track-height: 4px;
  --track-gap: 3px;
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  color: var(--white);
  -webkit-user-select: none;
  user-select: none;
}

.media-01[hidden] {
  display: none;
}

.media-01.is-player-open .backdrop {
  opacity: 1;
}

.media-01.is-player-open .shell {
  opacity: 1;
  transform: translateY(0) scale(1);
  clip-path: inset(0 round 12px);
}

.media-01.has-preview .seek .preview,
.media-01.is-scrubbing .seek .preview {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.media-01.is-scrubbing .video {
  filter: blur(3px) brightness(0.72);
  transform: scale(1);
}

.media-01:not(.is-scrubbing) .timeline:hover .scrubber,
.media-01:not(.is-scrubbing) .timeline:focus-visible .scrubber {
  width: 14px;
  height: 14px;
}

.media-01.is-preview-fallback .seek .preview {
  width: 190px;
}

.media-01.is-preview-fallback .seek .preview .thumb {
  display: none;
}

.media-01.is-muted .controls .volume-icon {
  display: none;
}

.media-01.is-muted .controls .muted {
  display: block;
}

.media-01.is-volume-low .controls .volume-icon {
  display: none;
}

.media-01.is-volume-low .controls .volume-low {
  display: block;
}

.media-01.is-volume-mid .controls .volume-icon {
  display: none;
}

.media-01.is-volume-mid .controls .volume-mid {
  display: block;
}

.media-01.is-volume-high .controls .volume-icon {
  display: none;
}

.media-01.is-volume-high .controls .volume-high {
  display: block;
}

.media-01.is-fullscreen {
  --bottom: 24px;
  --timeline-bottom: 58px;
}

.media-01.is-fullscreen .controls .enter {
  display: none;
}

.media-01.is-fullscreen .controls .exit {
  display: block;
}

.media-01:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) .shade,
.media-01:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) .seek,
.media-01:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) .controls {
  opacity: 0;
  pointer-events: none;
}

.media-01:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) .seek,
.media-01:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) .controls {
  transform: translateY(6px);
}

.media-01.is-loading .video {
  opacity: 0;
}

.media-01.is-loading .loader {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.media-01.is-loading .shade,
.media-01.is-loading .seek,
.media-01.is-loading .controls {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

.media-01 .backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: opacity 360ms var(--ease-out-quart);
  cursor: default;
}

.media-01 .frame {
  position: relative;
  z-index: 1;
  width: min(940px, 100%, calc((100dvh - 48px) * var(--video-ratio-number, 1.7778)));
  aspect-ratio: var(--video-ratio, 16 / 9);
  max-height: calc(100dvh - 48px);
  transition:
    width 520ms var(--ease-out-expo),
    aspect-ratio 520ms var(--ease-out-expo);
}

.media-01 .shell {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(119, 119, 119, 0.31);
  box-shadow: var(--box-shadow);
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  clip-path: inset(8% round 12px);
  transition:
    opacity 420ms var(--ease-out-quart),
    transform 520ms var(--ease-out-expo),
    clip-path 520ms var(--ease-out-expo);
}

.media-01 .shell:fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  border-radius: 0;
  corner-shape: var(--corner-shape);
  aspect-ratio: auto;
}

.media-01 .shell:fullscreen .stage {
  height: 100vh;
}

.media-01 .shell:fullscreen .video {
  object-fit: contain;
}

.media-01 .stage,
.media-01 .video {
  width: 100%;
  height: 100%;
}

.media-01 .stage {
  position: relative;
  background: var(--black);
}

.media-01 .video {
  object-fit: cover;
  opacity: 1;
  filter: blur(0) brightness(1);
  transform: scale(1);
  transition:
    opacity 280ms ease,
    filter 180ms ease,
    transform 180ms ease;
}

.media-01 .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.82);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
  pointer-events: none;
  transition:
    opacity 220ms ease,
    transform 260ms var(--ease-out-quart);
}

.media-01 .loader svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  animation: media-01-spin 900ms linear infinite;
}

.media-01 .shade {
  position: absolute;
  inset: auto 0 0;
  height: 52%;
  opacity: 1;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.36) 28%, rgba(0, 0, 0, 0.88) 100%);
  transition: opacity 260ms ease;
}

.media-01 .pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: rgba(86, 86, 86, 0.28);
  color: var(--white);
  opacity: 0;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transform: translate(-50%, -50%) scale(0.72);
  pointer-events: none;
}

.media-01 .pulse svg {
  width: 42px;
  height: 42px;
  fill: currentColor;
}

.media-01 .pulse .pulse-play {
  transform: translateX(2px);
}

.media-01 .pulse .pulse-pause {
  display: none;
}

.media-01 .pulse.show-play,
.media-01 .pulse.show-pause {
  animation: media-01-pulse 1500ms var(--ease-out-expo) both;
}

.media-01 .pulse.show-pause .pulse-play {
  display: none;
}

.media-01 .pulse.show-pause .pulse-pause {
  display: block;
}

.media-01 .center-toggle {
  display: none;
}

.media-01 .center-pause {
  display: none;
}

.media-01.is-playing .center-play {
  display: none;
}

.media-01.is-playing .center-pause {
  display: block;
}

@keyframes media-01-pulse {
  0% { opacity: 0; filter: blur(10px); transform: translate(-50%, -50%) scale(0.72); }
  32% { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }
  72% { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; filter: blur(0); transform: translate(-50%, -50%) scale(1.08); }
}

@keyframes media-01-spin {
  to { transform: rotate(360deg); }
}

.media-01 .close {
  position: absolute;
  top: -58px;
  left: 50%;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: rgba(53, 53, 53, 0.498);
  color: var(--white);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 54px);
  transition:
    opacity 500ms ease-out,
    transform 360ms var(--ease-out-expo),
    background 180ms ease,
    scale 180ms ease;
}

.media-01 .close:hover {
  background: rgba(37, 37, 37, 0.598);
}

.media-01 .close:active {
  scale: 0.94;
}

.media-01 .close svg {
  width: 18px;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.media-01.is-player-open.is-close-ready .close {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}

.media-01.is-closing .shade,
.media-01.is-closing .seek,
.media-01.is-closing .controls {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: none;
}

.media-01.is-closing .close {
  transition:
    background 180ms ease,
    scale 180ms ease;
}

.media-01 .seek {
  position: absolute;
  left: var(--inset);
  right: var(--inset);
  bottom: var(--timeline-bottom);
  z-index: 3;
  height: 34px;
  display: flex;
  align-items: flex-end;
  opacity: 1;
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.media-01 .seek .timeline {
  position: relative;
  width: 100%;
  height: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  touch-action: none;
}

.media-01 .seek .timeline .track {
  position: relative;
  width: 100%;
  height: var(--track-height);
  display: flex;
  align-items: center;
  border-radius: 999px;
  gap: var(--track-gap);
  corner-shape: var(--corner-shape);
  transform-origin: center;
  transition: transform 180ms var(--ease-out-quart);
}

.media-01 .seek .timeline .track .chapter {
  position: relative;
  min-width: 10px;
  height: 100%;
  flex-basis: 0;
  flex-grow: var(--chapter-grow, 1);
  overflow: hidden;
  corner-shape: var(--corner-shape);
  background: rgba(255, 255, 255, 0.22);
  transform-origin: center;
  transition: transform 180ms var(--ease-out-quart);
}

.media-01 .seek .timeline .track .chapter .fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--chapter-progress, 0%);
  border-radius: inherit;
  corner-shape: inherit;
  background: rgba(255, 255, 255, 0.76);
}

.media-01 .seek .timeline:hover .track,
.media-01 .seek .timeline:focus-visible .track {
  transform: scaleY(1.5);
}

.media-01 .seek .timeline:hover .chapter:hover,
.media-01 .seek .timeline:hover .chapter.is-hovered,
.media-01 .seek .timeline:focus-visible .chapter:hover,
.media-01 .seek .timeline:focus-visible .chapter.is-hovered {
  transform: scaleY(1.34);
}

.media-01 .seek .timeline .scrubber {
  position: absolute;
  top: 50%;
  left: var(--scrubber-left, 0%);
  width: 10px;
  height: 10px;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: var(--white);
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition:
    width 180ms var(--ease-out-quart),
    height 180ms var(--ease-out-quart);
}

.media-01 .seek .preview {
  position: absolute;
  left: 50%;
  bottom: 84px;
  width: clamp(150px, 22vw, 230px);
  opacity: 0;
  transform: translateX(-50%) translateY(8px) scale(0.96);
  pointer-events: none;
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.media-01 .seek .preview .thumb {
  display: block;
  width: 100%;
  aspect-ratio: var(--video-ratio, 16 / 9);
  border: 0;
  border-radius: 10px;
  corner-shape: var(--corner-shape);
  object-fit: cover;
  background: #111;
  box-shadow: var(--box-shadow);
}

.media-01 .seek .preview .meta {
  position: absolute;
  top: calc(100% + 7px);
  left: 50%;
  max-width: min(100%, 240px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 12px 8px;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: rgba(86, 86, 86, 0.28);
  backdrop-filter: blur(10px);
  box-shadow: none;
  color: rgba(255, 255, 255, 0.96);
  font-size: 14px;
  font-weight: 450;
  line-height: 1;
  filter: drop-shadow(0 1px 8px rgba(0, 0, 0, 0.72));
  white-space: nowrap;
  transform: translateX(-50%);
}

.media-01 .seek .preview .meta span:first-child {
  flex: 0 0 auto;
}

.media-01 .seek .preview .meta span:last-child {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.9);
}

.media-01 .seek .preview:not(.has-title) .meta {
  min-width: 0;
}

.media-01 .seek .preview:not(.has-title) [data-media-preview-title] {
  display: none;
}

.media-01.is-scrubbing .seek .timeline .scrubber {
  width: 17px;
  height: 17px;
}

.media-01 .controls {
  position: absolute;
  left: var(--inset);
  right: var(--inset);
  bottom: var(--bottom);
  z-index: 4;
  display: flex;
  align-items: center;
  gap: var(--gap);
  pointer-events: none;
  opacity: 1;
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.media-01 .controls .control,
.media-01 .controls .time,
.media-01 .controls .volume,
.media-01 .controls .speed {
  pointer-events: auto;
  background: transparent;
  box-shadow: none;
}

.media-01 .controls .control {
  width: var(--control);
  height: var(--control);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 8px;
  corner-shape: var(--corner-shape);
  color: var(--white);
  opacity: 0.96;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  transition:
    opacity 180ms ease,
    scale 180ms ease;
}

.media-01 .controls .control svg {
  width: var(--icon);
  height: var(--icon);
  fill: currentColor;
}

.media-01 .controls .control:hover {
  opacity: 1;
}

.media-01 .controls .control:active {
  scale: 0.95;
}

.media-01 .controls .control:disabled {
  opacity: 0.38;
  pointer-events: none;
}

.media-01 .controls .play {
  position: relative;
  width: 30px;
  overflow: visible;
}

.media-01 .controls .play svg {
  position: absolute;
  inset: 0;
  width: 31px;
  height: 31px;
  margin: auto;
}

.media-01 .controls .morph {
  fill: currentColor;
  overflow: visible;
  transform: translateX(1px);
}

.media-01 .controls .volume-icon,
.media-01 .controls .exit {
  display: none;
}

.media-01 .controls .volume-high {
  display: block;
}

.media-01 .controls .volume {
  width: var(--control);
  height: var(--control);
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 8px;
  corner-shape: var(--corner-shape);
  transition: width 260ms var(--ease-out-quart);
}

.media-01 .controls .volume:hover,
.media-01 .controls .volume:focus-within {
  width: var(--volume-open);
}

.media-01 .controls .volume .control {
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}

.media-01 .controls .volume .range {
  width: var(--volume-range);
  height: 20px;
  margin: 0 0 0 var(--gap);
  opacity: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 180ms ease;
}

.media-01 .controls .volume .range::-webkit-slider-runnable-track {
  height: 3px;
  border: 0;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: linear-gradient(90deg, var(--white) 0 var(--volume-percent, 100%), rgba(255, 255, 255, 0.42) var(--volume-percent, 100%) 100%);
}

.media-01 .controls .volume .range::-webkit-slider-thumb {
  width: 10px;
  height: 10px;
  margin-top: -3.5px;
  appearance: none;
  border: 0;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: var(--white);
}

.media-01 .controls .volume .range::-moz-range-track {
  height: 3px;
  border: 0;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: linear-gradient(90deg, var(--white) 0 var(--volume-percent, 100%), rgba(255, 255, 255, 0.42) var(--volume-percent, 100%) 100%);
}

.media-01 .controls .volume .range::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border: 0;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: var(--white);
}

.media-01 .controls .volume:hover .range,
.media-01 .controls .volume:focus-within .range {
  opacity: 1;
}

.media-01 .controls .time {
  height: var(--control);
  min-width: var(--time-width);
  margin-left: -2px;
  padding: 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 0 0 auto;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  font-size: var(--time-size);
  font-weight: 450;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--white);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
}

.media-01 .controls .speed {
  position: relative;
  margin-left: auto;
}

.media-01 .controls .pip {
  margin-right: 2px;
}

.media-01 .controls .speed-toggle {
  width: auto;
  min-width: 42px;
  padding: 0 4px;
  font-size: var(--time-size);
  font-weight: 450;
  font-variant-numeric: tabular-nums;
}

.media-01 .controls .speed-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 10px);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  overflow: hidden;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  background: rgba(86, 86, 86, 0.28);
  -webkit-backdrop-filter: blur(24px) saturate(1.35);
  backdrop-filter: blur(24px) saturate(1.35);
}

.media-01 .controls .speed-menu[hidden] {
  display: none;
}

.media-01 .controls .speed-menu button {
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  corner-shape: var(--corner-shape);
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--time-size);
  font-weight: 450;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition:
    background 160ms ease,
    color 160ms ease;
}

.media-01 .controls .speed-menu button:hover,
.media-01 .controls .speed-menu button.is-active {
  background: rgba(255, 255, 255, 0.16);
  color: var(--white);
}

.media-01 .controls .mute svg,
.media-01 .controls .pip svg,
.media-01 .controls .full svg {
  fill: none;
  stroke: currentColor;
  stroke-width: var(--icon-stroke);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.media-01 .controls .pip svg {
  width: calc(var(--icon) - 1px);
  height: calc(var(--icon) - 1px);
  stroke-width: 1.85;
}

.media-01 .controls .full svg {
  width: calc(var(--icon) - 2px);
  height: calc(var(--icon) - 2px);
}

@media (max-width: 760px) {
  .media-01 {
    --control: 30px;
    --gap: 8px;
    --icon: 20px;
    --time-size: 14px;
    --time-width: 98px;
    --inset: 16px;
    --bottom: 14px;
    --timeline-bottom: 48px;
    padding: 14px;
  }

  .media-01 .frame {
    width: min(100%, calc((100dvh - 28px) * var(--video-ratio-number, 1.7778)));
    max-height: calc(100dvh - 28px);
    aspect-ratio: var(--video-ratio, 16 / 9);
  }

  .media-01 .seek {
    height: 30px;
  }
}

@media (hover: none) and (pointer: coarse) {
  .media-01.is-chrome-visible:not(.is-loading):not(.has-preview):not(.is-scrubbing) .center-toggle {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .media-01 .pulse {
    width: 58px;
    height: 58px;
  }

  .media-01 .pulse svg {
    width: 30px;
    height: 30px;
  }

  .media-01 .center-toggle {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 4;
    width: 58px;
    height: 58px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    corner-shape: var(--corner-shape);
    isolation: isolate;
    overflow: hidden;
    background: transparent;
    color: var(--white);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translate(-50%, calc(-50% - 18px)) scale(1);
  }

  .media-01 .center-toggle::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    background: rgba(86, 86, 86, 0.42);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
  }

  .media-01 .center-toggle svg {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 30px;
    height: 30px;
    margin: auto;
    fill: currentColor;
  }

  .media-01 .center-toggle .center-play {
    transform: translateX(2px);
  }

  .media-01 .seek .preview {
    left: 50% !important;
    bottom: clamp(74px, 18vh, 132px);
    width: max-content;
    max-width: min(560px, calc(100vw - 48px));
  }

  .media-01 .seek .preview .thumb {
    display: none;
  }

  .media-01 .seek .preview .meta {
    position: static;
    max-width: 100%;
    padding: 10px 16px 11px;
    gap: 10px;
    background: rgba(86, 86, 86, 0.28);
    -webkit-backdrop-filter: blur(18px);
    backdrop-filter: blur(18px);
    transform: none;
  }

  .media-01 .controls .play,
  .media-01 .controls .volume,
  .media-01 .controls .pip {
    display: none;
  }

  .media-01 .controls .full {
    margin-left: 4px;
  }

  .media-01 .controls .range {
    display: none;
  }

  .media-01 .controls .volume:hover,
  .media-01 .controls .volume:focus-within {
    width: var(--control);
  }
}
`;

// ---------------------------------------------------------------------------
// Verbatim media01() function — do not modify
// ---------------------------------------------------------------------------

const MEDIA_JS = `
function media01(scope) {
    if (scope === undefined) scope = document;
    var roots = scope.matches && scope.matches("[data-media-01-player]")
        ? [scope]
        : Array.from(scope.querySelectorAll("[data-media-01-player]"));
    var cleanups = media01.cleanups || (media01.cleanups = new WeakMap());
    var triggerScope = scope === document ? document : (scope.ownerDocument || document);

    roots.forEach(function(root, rootIndex) {
        var existingCleanup = cleanups.get(root);
        if (existingCleanup) existingCleanup();

        var playerId = root.getAttribute("data-media-01-player") || "";
        var openButtons = Array.from(triggerScope.querySelectorAll("[data-media-01-open]")).filter(function(button) {
            return button.getAttribute("data-media-01-open") === playerId;
        });
        var modal = root.matches("[data-media-modal]") ? root : root.querySelector("[data-media-modal]");
        var shell = root.querySelector("[data-media-shell]");
        var stage = root.querySelector("[data-media-stage]");
        var video = root.querySelector("[data-media-video]");
        var previewVideo = root.querySelector("[data-media-preview-video]");
        var playButton = root.querySelector("[data-media-play]");
        var muteButton = root.querySelector("[data-media-mute]");
        var volumeInput = root.querySelector("[data-media-volume]");
        var speedRoot = root.querySelector("[data-media-speed]");
        var speedButton = root.querySelector("[data-media-speed-toggle]");
        var speedMenu = root.querySelector("[data-media-speed-menu]");
        var speedLabel = root.querySelector("[data-media-speed-label]");
        var speedOptions = Array.from(root.querySelectorAll("[data-media-speed-option]"));
        var pipButton = root.querySelector("[data-media-pip]");
        var fullscreenButton = root.querySelector("[data-media-fullscreen]");
        var centerButton = root.querySelector("[data-media-center-toggle]");
        var currentTimeNode = root.querySelector("[data-media-current]");
        var durationNode = root.querySelector("[data-media-duration]");
        var timeline = root.querySelector("[data-media-timeline]");
        var chapterTrack = root.querySelector("[data-media-chapter-track]");
        var scrubber = root.querySelector("[data-media-scrubber]");
        var previewCard = root.querySelector("[data-media-preview-card]");
        var previewTimeNode = root.querySelector("[data-media-preview-time]");
        var previewTitleNode = root.querySelector("[data-media-preview-title]");
        var closeButtons = Array.from(root.querySelectorAll("[data-media-close]"));
        var playPath = root.querySelector("[data-media-play-path]");
        var roundFilter = root.querySelector("[data-media-round-filter]");
        var pulse = root.querySelector("[data-media-pulse]");

        if (!modal || !shell || !stage || !video || !previewVideo || !playButton || !muteButton || !volumeInput || !speedRoot || !speedButton || !speedMenu || !speedLabel || !speedOptions.length || !pipButton || !fullscreenButton || !centerButton || !timeline || !chapterTrack || !scrubber || !pulse) {
            return;
        }

        var controller = new AbortController();
        var signal = controller.signal;
        var activeBeforeOpen = null;
        var closeTimer = 0;
        var closeRevealTimer = 0;
        var chromeTimer = 0;
        var previewFrame = 0;
        var isPointerOverStage = false;
        var isDragging = false;
        var activePointerId = null;
        var pendingScrubTime = null;
        var resumeAfterScrub = false;
        var lastPointerWasTouch = false;
        var touchStageHadChrome = false;
        var lastCenterTouchToggle = 0;
        var lastVolume = Number(volumeInput.value) || 1;
        var chapters = [];
        var segmentParts = [];
        var playIconFrame = 0;
        var playIconProgress = 0;
        var playIconTarget = null;
        var isMediaLoaded = false;
        var currentSpeed = parseSpeed(video.getAttribute("data-default-speed")) || 1;
        var volumeClasses = ["is-volume-low", "is-volume-mid", "is-volume-high"];

        var playIconShapes = {
            play: [
                [[11, 10], [18, 13.74], [18, 22.28], [11, 26]],
                [[18, 13.74], [26, 18], [26, 18], [18, 22.28]],
            ],
            pause: [
                [[11, 10], [17, 10], [17, 26], [11, 26]],
                [[20, 10], [26, 10], [26, 26], [20, 26]],
            ],
        };

        if (roundFilter && playPath) {
            var safeId = (playerId || ("player-" + rootIndex)).replace(/[^a-zA-Z0-9_-]/g, "-");
            var filterId = "media-01-round-icon-" + safeId;
            roundFilter.id = filterId;
            playPath.setAttribute("filter", "url(#" + filterId + ")");
        }

        previewVideo.muted = true;
        previewVideo.playsInline = true;

        function shouldUseIosSource() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        }

        function getMediaSource(media) {
            var source = media.getAttribute("data-src");
            var iosSource = media.getAttribute("data-ios-src");
            return shouldUseIosSource() && iosSource ? iosSource : source;
        }

        function loadMedia() {
            if (isMediaLoaded) return;
            isMediaLoaded = true;
            [[video, "auto"], [previewVideo, "metadata"]].forEach(function(pair) {
                var media = pair[0];
                var preload = pair[1];
                var source = getMediaSource(media);
                if (source && !media.getAttribute("src")) {
                    media.setAttribute("src", source);
                }
                media.preload = preload;
                if (source || media.getAttribute("src")) {
                    media.load();
                }
            });
            setPlaybackSpeed(currentSpeed, { includeDefault: true });
        }

        function getDuration() {
            return Number.isFinite(video.duration) ? video.duration : 0;
        }

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function formatTime(value) {
            if (!Number.isFinite(value)) return "0:00";
            var total = Math.max(0, Math.floor(value));
            var hours = Math.floor(total / 3600);
            var minutes = Math.floor((total % 3600) / 60);
            var seconds = total % 60;
            var paddedSeconds = String(seconds).padStart(2, "0");
            if (hours > 0) return hours + ":" + String(minutes).padStart(2, "0") + ":" + paddedSeconds;
            return minutes + ":" + paddedSeconds;
        }

        function parseSpeed(value) {
            var speed = Number(value);
            return Number.isFinite(speed) && speed > 0 ? speed : null;
        }

        function formatSpeed(value) {
            return Number(value.toFixed(2)) + "x";
        }

        function setPlaybackSpeed(speed, opts) {
            opts = opts || {};
            try {
                if (opts.includeDefault) video.defaultPlaybackRate = speed;
                video.preservesPitch = true;
                video.webkitPreservesPitch = true;
            } catch (e) {}
            video.playbackRate = speed;
        }

        function isVideoPlaying() {
            return !video.paused && !video.ended;
        }

        function isTouchInteraction(event) {
            return (event && event.pointerType === "touch") || lastPointerWasTouch;
        }

        function hideChrome(opts) {
            opts = opts || {};
            if (opts.clearPreview) root.classList.remove("has-preview");
            if (isDragging || (!opts.allowInside && isPointerOverStage) || !speedMenu.hidden || root.classList.contains("has-preview")) return;
            root.classList.remove("is-chrome-visible");
        }

        function scheduleChromeHide(delay, opts) {
            clearTimeout(chromeTimer);
            if (!delay || delay <= 0) { hideChrome(opts); return; }
            chromeTimer = setTimeout(function() { hideChrome(opts); }, delay);
        }

        function showChrome(shouldAutoHide) {
            clearTimeout(chromeTimer);
            if (modal.hidden || root.classList.contains("is-closing")) return;
            root.classList.add("is-chrome-visible");
            if (shouldAutoHide && isVideoPlaying()) {
                scheduleChromeHide(4000, { allowInside: true, clearPreview: true });
            }
        }

        function showTouchChrome() {
            showChrome(false);
            scheduleChromeHide(3000, { allowInside: true, clearPreview: true });
        }

        function hideTouchChrome() {
            clearTimeout(chromeTimer);
            closeSpeedMenu();
            root.classList.remove("is-chrome-visible", "has-preview");
            clearHoveredChapter();
        }

        function beginClosingVisualState() {
            clearTimeout(chromeTimer);
            root.classList.add("is-closing");
            root.classList.remove("is-chrome-visible", "has-preview");
            clearHoveredChapter();
        }

        function easeOutQuart(progress) {
            return 1 - Math.pow(1 - progress, 4);
        }

        function getSubpath(points) {
            var lines = points.map(function(point, index) {
                return (index === 0 ? "M" : "L") + " " + point[0].toFixed(2) + " " + point[1].toFixed(2);
            }).join(" ");
            return lines + " Z";
        }

        function renderPlayIcon(progress) {
            if (!playPath) return;
            var subpaths = playIconShapes.play.map(function(playPoints, pathIndex) {
                var pausePoints = playIconShapes.pause[pathIndex];
                var points = playPoints.map(function(point, pointIndex) {
                    var pausePoint = pausePoints[pointIndex];
                    return [point[0] + (pausePoint[0] - point[0]) * progress, point[1] + (pausePoint[1] - point[1]) * progress];
                });
                return getSubpath(points);
            });
            playPath.setAttribute("d", subpaths.join(" "));
        }

        function morphPlayIcon(isPlaying) {
            var target = isPlaying ? 1 : 0;
            if (playIconTarget === target) return;
            playIconTarget = target;
            cancelAnimationFrame(playIconFrame);
            var startProgress = playIconProgress;
            var distance = target - startProgress;
            var startTime = performance.now();
            var duration = 240;
            function tick(now) {
                var elapsed = Math.min((now - startTime) / duration, 1);
                var eased = easeOutQuart(elapsed);
                playIconProgress = startProgress + distance * eased;
                renderPlayIcon(playIconProgress);
                if (elapsed < 1) {
                    playIconFrame = requestAnimationFrame(tick);
                } else {
                    playIconProgress = target;
                    renderPlayIcon(playIconProgress);
                }
            }
            playIconFrame = requestAnimationFrame(tick);
        }

        function readChapters() {
            var duration = getDuration();
            var data = Array.from(root.querySelectorAll("[data-media-chapter]")).map(function(item) {
                return { start: Number(item.getAttribute("data-start")), title: item.getAttribute("data-title") || "" };
            }).filter(function(item) {
                return Number.isFinite(item.start) && item.start >= 0;
            }).sort(function(a, b) { return a.start - b.start; });
            if (!data.length || data[0].start > 0) data.unshift({ start: 0, title: "" });
            var deduped = data.filter(function(item, index, list) {
                return index === 0 || item.start !== list[index - 1].start;
            });
            chapters = deduped.filter(function(item) {
                return !duration || item.start < duration;
            }).map(function(item, index, list) {
                return { start: item.start, end: list[index + 1] ? list[index + 1].start : duration, title: item.title };
            }).filter(function(item) {
                return !duration || item.end > item.start;
            });
        }

        function renderChapters() {
            var duration = getDuration();
            readChapters();
            chapterTrack.textContent = "";
            segmentParts = [];
            if (!duration || !chapters.length) {
                var segment = document.createElement("span");
                var fill = document.createElement("span");
                segment.className = "chapter";
                fill.className = "fill";
                segment.append(fill);
                chapterTrack.append(segment);
                segmentParts.push({ start: 0, end: duration || 1, element: segment, fill: fill });
                updateTimeline();
                return;
            }
            chapters.forEach(function(chapter) {
                var segment = document.createElement("span");
                var fill = document.createElement("span");
                var segmentDuration = Math.max(chapter.end - chapter.start, 0.01);
                segment.className = "chapter";
                fill.className = "fill";
                segment.style.setProperty("--chapter-grow", String(segmentDuration));
                segment.append(fill);
                chapterTrack.append(segment);
                segmentParts.push(Object.assign({}, chapter, { element: segment, fill: fill }));
            });
            updateTimeline();
        }

        function syncVideoRatio() {
            var width = video.videoWidth;
            var height = video.videoHeight;
            if (!width || !height) return;
            root.style.setProperty("--video-ratio", width + " / " + height);
            root.style.setProperty("--video-ratio-number", String(width / height));
        }

        function hasReadyFrame() {
            return Boolean(video.readyState >= 2 && video.videoWidth && video.videoHeight);
        }

        function syncMediaReadyState() {
            var isReady = hasReadyFrame();
            var isLoading = !isReady && !modal.hidden;
            if (video.readyState >= 1) syncVideoRatio();
            root.classList.toggle("is-media-ready", isReady);
            root.classList.toggle("is-loading", isLoading);
            root.setAttribute("aria-busy", String(isLoading));
            return isReady;
        }

        function getChapterAt(time) {
            for (var i = chapters.length - 1; i >= 0; i--) {
                if (time >= chapters[i].start) return chapters[i];
            }
            return chapters[0] || { title: "", start: 0, end: getDuration() };
        }

        function getVisualProgressPercent(time) {
            var duration = getDuration();
            var trackRect = chapterTrack.getBoundingClientRect();
            var fallback = duration ? (time / duration) * 100 : 0;
            if (!duration || !trackRect.width || !segmentParts.length) return fallback;
            var segment = segmentParts.find(function(part, index) {
                return time >= part.start && (time < part.end || index === segmentParts.length - 1);
            }) || segmentParts[0];
            var segmentRect = segment.element && segment.element.getBoundingClientRect();
            if (!segmentRect || !segmentRect.width) return fallback;
            var segmentDuration = Math.max(segment.end - segment.start, 0.01);
            var segmentProgress = clamp((time - segment.start) / segmentDuration, 0, 1);
            var x = segmentRect.left - trackRect.left + segmentRect.width * segmentProgress;
            return clamp((x / trackRect.width) * 100, 0, 100);
        }

        function updateTimeline(time) {
            var duration = getDuration();
            var renderTime = (time !== undefined && time !== null) ? time : (isDragging && pendingScrubTime !== null ? pendingScrubTime : video.currentTime);
            var current = clamp(renderTime || 0, 0, duration || 0);
            var percent = getVisualProgressPercent(current);
            scrubber.style.setProperty("--scrubber-left", percent + "%");
            segmentParts.forEach(function(segment) {
                var segmentDuration = Math.max(segment.end - segment.start, 0.01);
                var segmentPercent = clamp(((current - segment.start) / segmentDuration) * 100, 0, 100);
                segment.fill.style.setProperty("--chapter-progress", segmentPercent + "%");
            });
            if (currentTimeNode) currentTimeNode.textContent = formatTime(current);
            if (durationNode) durationNode.textContent = formatTime(duration);
            timeline.setAttribute("aria-valuemax", String(Math.floor(duration || 0)));
            timeline.setAttribute("aria-valuenow", String(Math.floor(current)));
            timeline.setAttribute("aria-valuetext", formatTime(current) + " of " + formatTime(duration));
        }

        function syncPlayState() {
            var isPlaying = isVideoPlaying();
            root.classList.toggle("is-playing", isPlaying);
            morphPlayIcon(isPlaying);
            playButton.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
            centerButton.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
            if (isPlaying && isPointerOverStage) { showChrome(true); } else { clearTimeout(chromeTimer); }
        }

        function syncVolumeState() {
            var volume = video.muted ? 0 : video.volume;
            var isMuted = video.muted || video.volume === 0;
            var volumeClass = volume <= 0.33 ? "is-volume-low" : volume <= 0.66 ? "is-volume-mid" : "is-volume-high";
            if (!video.muted && video.volume > 0) lastVolume = video.volume;
            root.classList.remove.apply(root.classList, volumeClasses);
            root.classList.toggle("is-muted", isMuted);
            if (!isMuted) root.classList.add(volumeClass);
            muteButton.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
            volumeInput.value = String(volume);
            volumeInput.style.setProperty("--volume-percent", (volume * 100) + "%");
        }

        function syncFullscreenState() {
            var isFullscreen = document.fullscreenElement === shell;
            root.classList.toggle("is-fullscreen", isFullscreen);
            fullscreenButton.setAttribute("aria-label", isFullscreen ? "Exit fullscreen" : "Enter fullscreen");
        }

        function supportsPictureInPicture() {
            var supportsStandard = document.pictureInPictureEnabled && typeof video.requestPictureInPicture === "function";
            var supportsWebkit = typeof video.webkitSetPresentationMode === "function" && typeof video.webkitSupportsPresentationMode === "function" && video.webkitSupportsPresentationMode("picture-in-picture");
            return supportsStandard || supportsWebkit;
        }

        function isPictureInPicture() {
            return document.pictureInPictureElement === video || video.webkitPresentationMode === "picture-in-picture";
        }

        function syncPictureInPictureState() {
            var isSupported = supportsPictureInPicture();
            var isActive = isPictureInPicture();
            pipButton.disabled = !isSupported;
            pipButton.setAttribute("aria-disabled", String(!isSupported));
            pipButton.setAttribute("aria-label", isActive ? "Exit picture in picture" : "Enter picture in picture");
            root.classList.toggle("is-pip", isActive);
        }

        function closeSpeedMenu() {
            speedMenu.hidden = true;
            speedButton.setAttribute("aria-expanded", "false");
        }

        function openSpeedMenu() {
            speedMenu.hidden = false;
            speedButton.setAttribute("aria-expanded", "true");
            showChrome(false);
        }

        function toggleSpeedMenu() {
            if (speedMenu.hidden) { openSpeedMenu(); } else { closeSpeedMenu(); }
        }

        function syncSpeedState(speed) {
            if (speed === undefined) speed = video.playbackRate;
            var nextSpeed = parseSpeed(speed) || 1;
            currentSpeed = nextSpeed;
            setPlaybackSpeed(nextSpeed, { includeDefault: true });
            syncSpeedOptions(nextSpeed);
        }

        function syncSpeedOptions(speed) {
            speedLabel.textContent = formatSpeed(speed);
            speedOptions.forEach(function(option) {
                var optionSpeed = parseSpeed(option.getAttribute("data-speed"));
                var isActive = optionSpeed === speed;
                option.classList.toggle("is-active", isActive);
                option.setAttribute("aria-pressed", String(isActive));
            });
        }

        function changePlaybackSpeed(speed) {
            var nextSpeed = parseSpeed(speed);
            if (!nextSpeed) return Promise.resolve();
            var wasPlaying = isVideoPlaying();
            var duration = getDuration();
            var currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            var restoreTime = duration ? clamp(currentTime + 0.001, 0, Math.max(duration - 0.001, 0)) : currentTime;
            if (wasPlaying) video.pause();
            currentSpeed = nextSpeed;
            setPlaybackSpeed(nextSpeed);
            syncSpeedOptions(nextSpeed);
            if (Number.isFinite(restoreTime)) {
                try { video.currentTime = restoreTime; } catch (e) {}
                updateTimeline(currentTime);
            }
            if (wasPlaying) {
                return video.play().catch(function() { syncPlayState(); });
            }
            return Promise.resolve();
        }

        function clearPulse() { pulse.classList.remove("show-play", "show-pause"); }

        function showPulse(type) {
            clearPulse();
            void pulse.offsetWidth;
            pulse.classList.add(type === "pause" ? "show-pause" : "show-play");
        }

        function togglePlay(opts) {
            opts = opts || {};
            if (video.paused || video.ended) {
                if (opts.showFeedback) showPulse("play");
                return video.play().catch(function() { syncPlayState(); });
            } else {
                if (opts.showFeedback) showPulse("pause");
                video.pause();
                return Promise.resolve();
            }
        }

        function onStageClick(event) {
            var interactive = event.target.closest && event.target.closest("button, input, .controls, [data-media-timeline]");
            if (interactive) return;
            var shouldUseTouchChrome = isTouchInteraction(event);
            if (shouldUseTouchChrome) {
                if (touchStageHadChrome) { hideTouchChrome(); } else { showTouchChrome(); }
                return;
            }
            showChrome();
            togglePlay({ showFeedback: true }).catch(syncPlayState).then(function() {
                if (shouldUseTouchChrome) showTouchChrome();
            });
        }

        function togglePictureInPicture() {
            if (!supportsPictureInPicture()) return Promise.resolve();
            if (document.pictureInPictureElement === video) return document.exitPictureInPicture();
            var exitFirst = document.pictureInPictureElement ? document.exitPictureInPicture() : Promise.resolve();
            return exitFirst.then(function() {
                if (document.pictureInPictureEnabled && typeof video.requestPictureInPicture === "function") {
                    return video.requestPictureInPicture();
                }
                if (typeof video.webkitSetPresentationMode === "function") {
                    video.webkitSetPresentationMode(video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture");
                }
            });
        }

        function toggleMute() {
            if (video.muted || video.volume === 0) { video.muted = false; video.volume = lastVolume || 0.8; } else { video.muted = true; }
            syncVolumeState();
        }

        function seekTo(time) {
            var duration = getDuration();
            if (!duration) return;
            video.currentTime = clamp(time, 0, duration);
            updateTimeline(video.currentTime);
        }

        function getTimelinePoint(event) {
            var duration = getDuration();
            var rect = timeline.getBoundingClientRect();
            var x = clamp(event.clientX - rect.left, 0, rect.width);
            var percent = rect.width ? x / rect.width : 0;
            return { x: x, percent: percent, time: duration * percent };
        }

        function markPreviewFallback() { root.classList.add("is-preview-fallback"); }

        function setHoveredChapter(time) {
            var activeSegment = segmentParts.find(function(part, index) {
                return time >= part.start && (time < part.end || index === segmentParts.length - 1);
            }) || null;
            segmentParts.forEach(function(part) {
                part.element.classList.toggle("is-hovered", part === activeSegment);
            });
        }

        function clearHoveredChapter() {
            segmentParts.forEach(function(part) { part.element.classList.remove("is-hovered"); });
        }

        function updatePreviewVideo(time) {
            if (!previewVideo || !Number.isFinite(time)) return;
            if (previewVideo.readyState < 1) return;
            cancelAnimationFrame(previewFrame);
            previewFrame = requestAnimationFrame(function() {
                try {
                    previewVideo.pause();
                    if (Math.abs(previewVideo.currentTime - time) > 0.12) {
                        previewVideo.currentTime = time;
                    }
                } catch (e) { markPreviewFallback(); }
            });
        }

        function showPreview(event, time) {
            if (modal.hidden || root.classList.contains("is-closing")) return;
            var duration = getDuration();
            if (!duration) return;
            var timelineRect = timeline.getBoundingClientRect();
            var wrapRect = timeline.parentElement.getBoundingClientRect();
            var previewWidth = (previewCard && previewCard.offsetWidth) || 236;
            var left = clamp(event.clientX - wrapRect.left, previewWidth / 2, wrapRect.width - previewWidth / 2);
            var chapter = getChapterAt(time);
            setHoveredChapter(time);
            if (!isTouchInteraction(event) && previewCard) {
                previewCard.style.left = left + "px";
            }
            if (previewTimeNode) previewTimeNode.textContent = formatTime(time);
            if (previewTitleNode) previewTitleNode.textContent = chapter.title;
            if (previewCard) previewCard.classList.toggle("has-title", Boolean(chapter.title.trim()));
            root.classList.add("has-preview");
            showChrome(false);
            if (!isTouchInteraction(event)) updatePreviewVideo(clamp(time, 0, duration));
            if (timelineRect.width) {
                timeline.style.setProperty("--preview-percent", (((event.clientX - timelineRect.left) / timelineRect.width) * 100) + "%");
            }
        }

        function hidePreview() {
            root.classList.remove("has-preview");
            clearHoveredChapter();
            scheduleChromeHide(300);
        }

        function setTriggersExpanded(isExpanded) {
            openButtons.forEach(function(button) {
                button.setAttribute("aria-expanded", String(isExpanded));
                button.classList.toggle("is-media-open", isExpanded);
            });
        }

        function openModal(trigger) {
            clearTimeout(closeTimer);
            clearTimeout(closeRevealTimer);
            loadMedia();
            activeBeforeOpen = trigger || document.activeElement;
            clearPulse();
            closeSpeedMenu();
            modal.hidden = false;
            root.classList.remove("is-close-ready", "is-closing");
            syncMediaReadyState();
            setTriggersExpanded(true);
            video.pause();
            showChrome(false);
            syncPlayState();
            requestAnimationFrame(function() {
                root.classList.add("is-player-open");
                updateTimeline();
            });
            closeRevealTimer = setTimeout(function() { root.classList.add("is-close-ready"); }, 130);
            setTimeout(function() {
                var focusTarget = hasReadyFrame() ? playButton : closeButtons.find(function(b) { return b.classList.contains("close"); });
                (focusTarget || playButton).focus({ preventScroll: true });
            }, 160);
        }

        function closeModal() {
            clearTimeout(closeTimer);
            clearTimeout(closeRevealTimer);
            beginClosingVisualState();
            var exitFullscreen = document.fullscreenElement === shell ? document.exitFullscreen().catch(function() {}) : Promise.resolve();
            return exitFullscreen.then(function() {
                video.pause();
                hidePreview();
                clearTimeout(chromeTimer);
                clearPulse();
                closeSpeedMenu();
                isPointerOverStage = false;
                isDragging = false;
                activePointerId = null;
                pendingScrubTime = null;
                resumeAfterScrub = false;
                root.classList.remove("is-player-open", "is-close-ready", "is-loading", "is-scrubbing", "is-chrome-visible");
                root.setAttribute("aria-busy", "false");
                setTriggersExpanded(false);
                closeTimer = setTimeout(function() {
                    modal.hidden = true;
                    root.classList.remove("is-closing");
                    if (activeBeforeOpen && document.contains(activeBeforeOpen)) {
                        activeBeforeOpen.focus({ preventScroll: true });
                    } else if (openButtons[0]) {
                        openButtons[0].focus({ preventScroll: true });
                    }
                }, 360);
            });
        }

        function trapFocus(event) {
            var focusables = Array.from(modal.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])')).filter(function(node) { return node.offsetParent !== null; });
            if (!focusables.length) return;
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }

        function onDocumentKeydown(event) {
            if (modal.hidden) return;
            var target = event.target;
            var isEditable = target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable);
            var isInteractive = target instanceof HTMLElement && target.closest("button, a, input, textarea, select, [role='button']");
            if (!isEditable && event.key.toLowerCase() === "m") { event.preventDefault(); event.stopImmediatePropagation(); toggleMute(); return; }
            if (!isEditable && !isInteractive && event.key === " ") {
                event.preventDefault(); event.stopImmediatePropagation();
                togglePlay().catch(syncPlayState).then(function() { if (isTouchInteraction()) showTouchChrome(); });
                return;
            }
            if (event.key === "Escape") {
                event.preventDefault(); event.stopImmediatePropagation();
                if (!speedMenu.hidden) { closeSpeedMenu(); speedButton.focus({ preventScroll: true }); return; }
                closeModal();
                return;
            }
            if (event.key === "Tab") { event.stopImmediatePropagation(); trapFocus(event); }
        }

        function onTimelineKeydown(event) {
            var duration = getDuration();
            if (!duration) return;
            var seekSmall = 5;
            var seekLarge = 15;
            var nextTime = null;
            if (event.key === "ArrowLeft") nextTime = video.currentTime - seekSmall;
            if (event.key === "ArrowRight") nextTime = video.currentTime + seekSmall;
            if (event.key === "ArrowDown") nextTime = video.currentTime - seekLarge;
            if (event.key === "ArrowUp") nextTime = video.currentTime + seekLarge;
            if (event.key === "Home") nextTime = 0;
            if (event.key === "End") nextTime = duration;
            if (nextTime !== null) { event.preventDefault(); seekTo(nextTime); }
        }

        function startScrub(event) {
            var duration = getDuration();
            if (!duration) return;
            var point = getTimelinePoint(event);
            activePointerId = event.pointerId;
            isDragging = true;
            pendingScrubTime = point.time;
            resumeAfterScrub = isVideoPlaying();
            if (resumeAfterScrub) video.pause();
            root.classList.add("is-scrubbing");
            showChrome(false);
            if (timeline.setPointerCapture) timeline.setPointerCapture(event.pointerId);
            updateTimeline(point.time);
            showPreview(event, point.time);
            event.preventDefault();
        }

        function moveScrub(event) {
            var duration = getDuration();
            if (!duration) return;
            if (event.pointerType === "touch" && !isDragging) return;
            var point = getTimelinePoint(event);
            if (isDragging) {
                if (event.pointerId !== activePointerId) return;
                pendingScrubTime = point.time;
                updateTimeline(point.time);
            }
            showPreview(event, point.time);
        }

        function endScrub(event) {
            if (!isDragging && pendingScrubTime === null) return;
            if (activePointerId !== null && event.pointerId !== activePointerId) return;
            var commitTime = pendingScrubTime;
            var shouldResume = resumeAfterScrub;
            isDragging = false;
            activePointerId = null;
            pendingScrubTime = null;
            resumeAfterScrub = false;
            root.classList.remove("is-scrubbing");
            if (commitTime !== null) seekTo(commitTime);
            if (event.pointerType === "touch") {
                root.classList.remove("has-preview");
                clearHoveredChapter();
                if (shouldResume) { video.play().catch(syncPlayState).then(showTouchChrome); } else { showTouchChrome(); }
                return;
            }
            if (shouldResume) video.play().catch(syncPlayState);
            scheduleChromeHide(300);
        }

        function onDocumentPointerDown(event) {
            if (modal.hidden || speedMenu.hidden) return;
            if (speedRoot.contains(event.target)) return;
            closeSpeedMenu();
        }

        function onWindowResize() { updateTimeline(); }

        function toggleFullscreen() {
            if (document.fullscreenElement === shell) return document.exitFullscreen();
            if (shell.requestFullscreen) return shell.requestFullscreen();
            if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); return Promise.resolve(); }
            return Promise.resolve();
        }

        openButtons.forEach(function(button) {
            button.addEventListener("pointerenter", loadMedia, { signal: signal });
            button.addEventListener("focus", loadMedia, { signal: signal });
            button.addEventListener("pointerdown", loadMedia, { signal: signal, passive: true });
            button.addEventListener("click", function() { openModal(button); }, { signal: signal });
        });
        closeButtons.forEach(function(button) {
            button.addEventListener("pointerdown", beginClosingVisualState, { signal: signal });
            button.addEventListener("click", closeModal, { signal: signal });
        });
        playButton.addEventListener("click", function() {
            var shouldUseTouchChrome = isTouchInteraction();
            if (shouldUseTouchChrome) showTouchChrome();
            togglePlay().catch(syncPlayState).then(function() { if (shouldUseTouchChrome) showTouchChrome(); });
        }, { signal: signal });
        centerButton.addEventListener("pointerup", function(event) {
            if (event.pointerType !== "touch") return;
            event.preventDefault();
            event.stopPropagation();
            lastCenterTouchToggle = performance.now();
            showTouchChrome();
            togglePlay().catch(syncPlayState).then(showTouchChrome);
        }, { signal: signal });
        centerButton.addEventListener("click", function(event) {
            event.stopPropagation();
            if (performance.now() - lastCenterTouchToggle < 500) return;
            showTouchChrome();
            togglePlay().catch(syncPlayState).then(showTouchChrome);
        }, { signal: signal });
        centerButton.addEventListener("pointerdown", function(event) { event.stopPropagation(); }, { signal: signal });
        muteButton.addEventListener("click", toggleMute, { signal: signal });
        speedButton.addEventListener("click", toggleSpeedMenu, { signal: signal });
        speedOptions.forEach(function(option) {
            option.addEventListener("click", function(event) {
                var shouldUseTouchChrome = isTouchInteraction(event);
                var speed = parseSpeed(option.getAttribute("data-speed"));
                event.preventDefault();
                event.stopPropagation();
                closeSpeedMenu();
                if (shouldUseTouchChrome) { showTouchChrome(); } else { speedButton.focus({ preventScroll: true }); }
                if (speed) { changePlaybackSpeed(speed).catch(syncPlayState).then(function() { if (shouldUseTouchChrome) showTouchChrome(); }); }
            }, { signal: signal });
        });
        pipButton.addEventListener("click", function() { togglePictureInPicture().catch(syncPictureInPictureState); }, { signal: signal });
        fullscreenButton.addEventListener("click", function() { toggleFullscreen().catch(syncFullscreenState); }, { signal: signal });
        volumeInput.addEventListener("input", function() {
            var volume = Number(volumeInput.value);
            video.volume = clamp(Number.isFinite(volume) ? volume : 1, 0, 1);
            video.muted = video.volume === 0;
            syncVolumeState();
        }, { signal: signal });

        video.addEventListener("loadedmetadata", function() { setPlaybackSpeed(currentSpeed, { includeDefault: true }); syncVideoRatio(); syncMediaReadyState(); renderChapters(); }, { signal: signal });
        video.addEventListener("loadeddata", syncMediaReadyState, { signal: signal });
        video.addEventListener("canplay", syncMediaReadyState, { signal: signal });
        video.addEventListener("durationchange", renderChapters, { signal: signal });
        video.addEventListener("timeupdate", function() { updateTimeline(); }, { signal: signal });
        video.addEventListener("play", syncPlayState, { signal: signal });
        video.addEventListener("pause", syncPlayState, { signal: signal });
        video.addEventListener("ended", syncPlayState, { signal: signal });
        video.addEventListener("volumechange", syncVolumeState, { signal: signal });
        video.addEventListener("enterpictureinpicture", syncPictureInPictureState, { signal: signal });
        video.addEventListener("leavepictureinpicture", syncPictureInPictureState, { signal: signal });
        video.addEventListener("webkitpresentationmodechanged", syncPictureInPictureState, { signal: signal });
        pulse.addEventListener("animationend", clearPulse, { signal: signal });
        previewVideo.addEventListener("error", markPreviewFallback, { signal: signal });

        stage.addEventListener("pointerdown", function(event) {
            if (event.pointerType !== "touch") return;
            touchStageHadChrome = root.classList.contains("is-chrome-visible");
        }, { signal: signal });
        stage.addEventListener("pointerenter", function(event) {
            isPointerOverStage = true;
            if (event.pointerType === "touch") { showTouchChrome(); return; }
            showChrome(isVideoPlaying());
        }, { signal: signal });
        stage.addEventListener("pointermove", function(event) {
            isPointerOverStage = true;
            if (event.pointerType === "touch") { showTouchChrome(); return; }
            showChrome(isVideoPlaying());
        }, { signal: signal });
        stage.addEventListener("pointerleave", function(event) {
            isPointerOverStage = false;
            if (event.pointerType === "touch") return;
            hidePreview();
            hideChrome();
        }, { signal: signal });
        stage.addEventListener("click", onStageClick, { signal: signal });
        root.addEventListener("pointerdown", function(event) {
            lastPointerWasTouch = event.pointerType === "touch";
            if (lastPointerWasTouch && event.target.closest && event.target.closest(".controls, .seek")) showTouchChrome();
        }, { signal: signal, capture: true });
        root.addEventListener("focusin", function(event) {
            if (event.target.closest && event.target.closest("[data-media-close]")) return;
            showChrome(false);
        }, { signal: signal });
        root.addEventListener("focusout", function(event) {
            if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
            scheduleChromeHide();
        }, { signal: signal });

        timeline.addEventListener("pointerdown", startScrub, { signal: signal });
        timeline.addEventListener("pointermove", moveScrub, { signal: signal });
        timeline.addEventListener("pointerleave", function() { if (!isDragging) hidePreview(); }, { signal: signal });
        timeline.addEventListener("pointerup", endScrub, { signal: signal });
        timeline.addEventListener("pointercancel", endScrub, { signal: signal });
        timeline.addEventListener("lostpointercapture", endScrub, { signal: signal });
        timeline.addEventListener("keydown", onTimelineKeydown, { signal: signal });

        document.addEventListener("keydown", onDocumentKeydown, { signal: signal, capture: true });
        document.addEventListener("pointerdown", onDocumentPointerDown, { signal: signal, capture: true });
        document.addEventListener("fullscreenchange", syncFullscreenState, { signal: signal });
        window.addEventListener("resize", onWindowResize, { signal: signal });

        syncSpeedState(currentSpeed);
        if (video.readyState >= 1) { syncVideoRatio(); renderChapters(); } else { updateTimeline(); }
        syncMediaReadyState();
        syncPlayState();
        syncVolumeState();
        syncFullscreenState();
        syncPictureInPictureState();

        cleanups.set(root, function() {
            clearTimeout(closeTimer);
            clearTimeout(closeRevealTimer);
            clearTimeout(chromeTimer);
            cancelAnimationFrame(previewFrame);
            cancelAnimationFrame(playIconFrame);
            controller.abort();
        });
    });
}
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CustomVideoPlayer({
  videoSrc,
  videoIosSrc,
  chapters = DEFAULT_CHAPTERS,
  defaultSpeed = 1.5,
  playerId = "demo-player",
}: CustomVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Evaluate media01 in global scope so it attaches to window
    // eslint-disable-next-line no-new-func
    const fn = new Function(MEDIA_JS + "\nreturn media01;")();
    if (rootRef.current) {
      fn(rootRef.current);
    }
    return () => {
      // Trigger cleanup via re-init on the same element (WeakMap pattern)
      // Actual abort happens inside the stored cleanup
      const w = window as typeof window & { media01?: { cleanups?: WeakMap<Element, () => void> } };
      if (rootRef.current && w.media01?.cleanups?.get(rootRef.current)) {
        w.media01.cleanups.get(rootRef.current)?.();
      }
    };
  }, []);

  const iosSrcAttr = videoIosSrc ? { "data-ios-src": videoIosSrc } : {};

  return (
    <>
      {/* Scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: MEDIA_CSS }} />

      {/* Opener button */}
      <button
        type="button"
        data-media-01-open={playerId}
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
        Open video player
      </button>

      {/* Player modal */}
      <div
        ref={rootRef}
        className="media-01"
        data-media-01-player={playerId}
        data-media-modal
        role="dialog"
        aria-modal="true"
        aria-label="Custom video player"
        hidden
      >
        {/* Backdrop */}
        <div className="backdrop" data-media-close aria-hidden="true" />

        <div className="frame">
          {/* Close button */}
          <button
            className="close"
            type="button"
            data-media-close
            aria-label="Close video player"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <section className="shell" data-media-shell>
            <div className="stage" data-media-stage>
              {/* Main video */}
              <video
                className="video"
                data-media-video
                data-default-speed={defaultSpeed}
                data-src={videoSrc}
                {...iosSrcAttr}
                preload="none"
                playsInline
              />

              {/* Loader */}
              <div className="loader" aria-hidden="true">
                <svg viewBox="0 0 19 19">
                  <path
                    d="M9.5 2.938v2.625
                      m0 7.875v2.624
                      M2.938 9.5h2.625
                      m7.875 0h2.624
                      M4.86 4.86l1.856 1.856
                      m5.569 5.568 1.856 1.856
                      m-9.28 0 1.855-1.856
                      m5.569-5.568L14.14 4.86"
                    strokeLinecap="round"
                    strokeWidth="1.875"
                  />
                </svg>
              </div>

              <div className="shade" aria-hidden="true" />

              {/* Pulse feedback */}
              <div className="pulse" data-media-pulse aria-hidden="true">
                <svg className="pulse-play" viewBox="0 0 36 36">
                  <path d="M11.45 8.68C9.7 7.78 7.7 9 7.7 10.96V25.04C7.7 27 9.7 28.22 11.45 27.32L23.95 20.86C25.96 19.82 27.9 19.12 27.9 18C27.9 16.88 25.96 16.18 23.95 15.14L11.45 8.68Z" />
                </svg>
                <svg className="pulse-pause" viewBox="0 0 36 36">
                  <rect x="10" y="8" width="6.5" height="20" rx="1.75" />
                  <rect x="19.5" y="8" width="6.5" height="20" rx="1.75" />
                </svg>
              </div>

              {/* Touch center toggle */}
              <button
                className="center-toggle"
                type="button"
                data-media-center-toggle
                aria-label="Play video"
              >
                <svg className="center-play" viewBox="0 0 36 36" aria-hidden="true">
                  <path d="M11.45 8.68C9.7 7.78 7.7 9 7.7 10.96V25.04C7.7 27 9.7 28.22 11.45 27.32L23.95 20.86C25.96 19.82 27.9 19.12 27.9 18C27.9 16.88 25.96 16.18 23.95 15.14L11.45 8.68Z" />
                </svg>
                <svg className="center-pause" viewBox="0 0 36 36" aria-hidden="true">
                  <rect x="10" y="8" width="6.5" height="20" rx="1.75" />
                  <rect x="19.5" y="8" width="6.5" height="20" rx="1.75" />
                </svg>
              </button>

              {/* Seek / timeline */}
              <div className="seek">
                {/* Preview card */}
                <div className="preview" data-media-preview-card aria-hidden="true">
                  <video
                    className="thumb"
                    data-media-preview-video
                    data-src={videoSrc}
                    {...iosSrcAttr}
                    preload="none"
                    playsInline
                    muted
                  />
                  <div className="meta">
                    <span data-media-preview-time>0:00</span>
                    <span data-media-preview-title>Opening</span>
                  </div>
                </div>

                {/* Timeline slider */}
                <div
                  className="timeline"
                  data-media-timeline
                  role="slider"
                  tabIndex={0}
                  aria-label="Seek video"
                  aria-valuemin={0}
                  aria-valuemax={0}
                  aria-valuenow={0}
                  aria-valuetext="0:00"
                >
                  <div className="track" data-media-chapter-track />
                  <div className="scrubber" data-media-scrubber />
                </div>
              </div>

              {/* Controls bar */}
              <div className="controls">
                {/* Play/Pause */}
                <button
                  className="control play"
                  type="button"
                  data-media-play
                  aria-label="Play video"
                >
                  <svg className="morph" viewBox="0 0 36 36" aria-hidden="true">
                    <defs>
                      <filter
                        id="media-01-round-icon"
                        data-media-round-filter
                        x="-18%"
                        y="-18%"
                        width="136%"
                        height="136%"
                        colorInterpolationFilters="sRGB"
                      >
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="blur" />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                        />
                      </filter>
                    </defs>
                    <path
                      data-media-play-path
                      filter="url(#media-01-round-icon)"
                      d="M 11 10 L 18 13.74 L 18 22.28 L 11 26 Z M 18 13.74 L 26 18 L 26 18 L 18 22.28 Z"
                    />
                  </svg>
                </button>

                {/* Volume */}
                <div className="volume">
                  <button
                    className="control mute"
                    type="button"
                    data-media-mute
                    aria-label="Mute video"
                  >
                    {/* Low */}
                    <svg className="volume-icon volume-low" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                    </svg>
                    {/* Mid */}
                    <svg className="volume-icon volume-mid" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                      <path d="M16 9a5 5 0 0 1 0 6" />
                    </svg>
                    {/* High */}
                    <svg className="volume-icon volume-high" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                      <path d="M16 9a5 5 0 0 1 0 6" />
                      <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                    </svg>
                    {/* Muted */}
                    <svg className="volume-icon muted" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                      <line x1="22" x2="16" y1="9" y2="15" />
                      <line x1="16" x2="22" y1="9" y2="15" />
                    </svg>
                  </button>
                  <input
                    className="range"
                    data-media-volume
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={1}
                    aria-label="Volume"
                  />
                </div>

                {/* Time */}
                <div className="time" aria-live="off">
                  <span data-media-current>0:00</span>
                  <span aria-hidden="true">/</span>
                  <span data-media-duration>0:00</span>
                </div>

                {/* Speed */}
                <div className="speed" data-media-speed>
                  <button
                    className="control speed-toggle"
                    type="button"
                    data-media-speed-toggle
                    aria-label="Playback speed"
                    aria-expanded="false"
                  >
                    <span data-media-speed-label>{defaultSpeed}x</span>
                  </button>
                  <div className="speed-menu" data-media-speed-menu hidden>
                    <button type="button" data-media-speed-option data-speed="1">1x</button>
                    <button type="button" data-media-speed-option data-speed="1.25">1.25x</button>
                    <button type="button" data-media-speed-option data-speed="1.5">1.5x</button>
                    <button type="button" data-media-speed-option data-speed="1.75">1.75x</button>
                    <button type="button" data-media-speed-option data-speed="2">2x</button>
                  </div>
                </div>

                {/* PiP */}
                <button
                  className="control pip"
                  type="button"
                  data-media-pip
                  aria-label="Enter picture in picture"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" />
                    <rect width="10" height="7" x="12" y="13" rx="2" />
                  </svg>
                </button>

                {/* Fullscreen */}
                <button
                  className="control full"
                  type="button"
                  data-media-fullscreen
                  aria-label="Enter fullscreen"
                >
                  <svg className="enter" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                  <svg className="exit" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hidden chapter list */}
            <ul className="chapters" hidden>
              {chapters.map((ch) => (
                <li
                  key={ch.start}
                  data-media-chapter
                  data-start={ch.start}
                  data-title={ch.title}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

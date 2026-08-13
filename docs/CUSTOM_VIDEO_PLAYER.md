Implement a dependency-free custom video player resource in an existing project. The source stack is vanilla HTML, SCSS/CSS, and JavaScript only. Do not add Plyr, Media Chrome, GSAP, hls.js, or any other package.

The player should open from a trigger button into a modal-style overlay. It should support a hosted video URL, lazy video loading, chaptered segmented timeline, hover scrub preview with a secondary muted video, touch-friendly scrub labels, volume/mute, playback speed menu, picture-in-picture, fullscreen, keyboard shortcuts, focus trapping, and close/backdrop/Escape behavior.

Compatibility boundary: this implementation is for normal hosted video files, preferably MP4 for broad desktop and mobile support. HLS / .m3u8 is not part of this resource. If the target project needs streaming playlists, stop and explain that the implementation needs an HLS layer before coding.

Core integration requirements:

- Keep the opener and player connected through matching values: `data-media-01-open="demo-player"` opens `data-media-01-player="demo-player"`.
- Preserve the `.media-01` player wrapper, the `data-media-*` hooks, and the hidden chapter list structure.
- The main video and preview video must use the same hosted URL in `data-src`.
- Keep the JavaScript in one named function: `function media01(scope = document)`.
- Call `media01()` once after DOM ready. For dynamically inserted markup, call `media01(container)`; the function uses a cleanup map to avoid duplicate listeners.
- Keep the video lazy-loaded with `preload="none"`; the script sets `src` from `data-src` on hover/focus/pointer intent or open.
- Default speed is controlled by `data-default-speed` on the main video.
- Chapters are authored as hidden `[data-media-chapter]` items with `data-start` in seconds and `data-title`.
- Do not debounce, throttle, or delay hover preview seeking. Keep `updatePreviewVideo()` near-verbatim: it should use `requestAnimationFrame` and set `previewVideo.currentTime` directly when the target time differs enough.
- Do not replace `previewVideo.currentTime = time` with `fastSeek()`. `fastSeek()` can jump to keyframes and make the hover preview feel behind the cursor.
- Do not add a separate embedded-player mode, alternate layout mode, or fullscreen override unless the user explicitly asks for it. Preserve the fullscreen CSS, variables, `:fullscreen` rules, and `is-fullscreen` state from this prompt.

## HTML

```html
<button
  type="button"
  data-media-01-open="demo-player"
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
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-video-icon lucide-video"
    ><path
      d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
    ></path><rect x="2" y="6" width="14" height="12" rx="2"
    ></rect></svg
  >
  Open video player
</button>

<div
  class="media-01"
  data-media-01-player="demo-player"
  data-media-modal
  role="dialog"
  aria-modal="true"
  aria-label="Custom video player"
  hidden
>
  <div
    class="backdrop"
    data-media-close
    aria-hidden="true"></div>

  <div class="frame">
    <button
      class="close"
      type="button"
      data-media-close
      aria-label="Close video player"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18"></path>
      </svg>
    </button>

    <section class="shell" data-media-shell>
      <div class="stage" data-media-stage>
        <video
          class="video"
          data-media-video
          data-default-speed="1.5"
          data-src="https://inspo-sec-9072.b-cdn.net/private/vidfinal-ios-optimized.mp4"
          preload="none"
          playsinline></video>

        <div class="loader" aria-hidden="true">
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
              stroke-linecap="round"
              stroke-width="1.875"></path>
          </svg>
        </div>

        <div class="shade" aria-hidden="true"></div>
        <div class="pulse" data-media-pulse aria-hidden="true">
          <svg class="pulse-play" viewBox="0 0 36 36">
            <path
              d="M11.45 8.68C9.7 7.78 7.7 9 7.7 10.96V25.04C7.7 27 9.7 28.22 11.45 27.32L23.95 20.86C25.96 19.82 27.9 19.12 27.9 18C27.9 16.88 25.96 16.18 23.95 15.14L11.45 8.68Z"
            ></path>
          </svg>
          <svg class="pulse-pause" viewBox="0 0 36 36">
            <rect
              x="10"
              y="8"
              width="6.5"
              height="20"
              rx="1.75"></rect>
            <rect
              x="19.5"
              y="8"
              width="6.5"
              height="20"
              rx="1.75"></rect>
          </svg>
        </div>

        <button
          class="center-toggle"
          type="button"
          data-media-center-toggle
          aria-label="Play video"
        >
          <svg
            class="center-play"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path
              d="M11.45 8.68C9.7 7.78 7.7 9 7.7 10.96V25.04C7.7 27 9.7 28.22 11.45 27.32L23.95 20.86C25.96 19.82 27.9 19.12 27.9 18C27.9 16.88 25.96 16.18 23.95 15.14L11.45 8.68Z"
            ></path>
          </svg>
          <svg
            class="center-pause"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <rect
              x="10"
              y="8"
              width="6.5"
              height="20"
              rx="1.75"></rect>
            <rect
              x="19.5"
              y="8"
              width="6.5"
              height="20"
              rx="1.75"></rect>
          </svg>
        </button>

        <div class="seek">
          <div
            class="preview"
            data-media-preview-card
            aria-hidden="true"
          >
            <video
              class="thumb"
              data-media-preview-video
              data-src="https://inspo-sec-9072.b-cdn.net/private/vidfinal-ios-optimized.mp4"
              preload="none"
              playsinline
              muted></video>
            <div class="meta">
              <span data-media-preview-time>0:00</span>
              <span data-media-preview-title>Opening</span
              >
            </div>
          </div>

          <div
            class="timeline"
            data-media-timeline
            role="slider"
            tabindex="0"
            aria-label="Seek video"
            aria-valuemin="0"
            aria-valuemax="0"
            aria-valuenow="0"
            aria-valuetext="0:00"
          >
            <div class="track" data-media-chapter-track>
            </div>
            <div class="scrubber" data-media-scrubber></div>
          </div>
        </div>

        <div class="controls">
          <button
            class="control play"
            type="button"
            data-media-play
            aria-label="Play video"
          >
            <svg
              class="morph"
              viewBox="0 0 36 36"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="media-01-round-icon"
                  data-media-round-filter
                  x="-18%"
                  y="-18%"
                  width="136%"
                  height="136%"
                  color-interpolation-filters="sRGB"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="0.7"
                    result="blur"></feGaussianBlur>
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                  ></feColorMatrix>
                </filter>
              </defs>
              <path
                data-media-play-path
                filter="url(#media-01-round-icon)"
                d="M 11 10 L 18 13.74 L 18 22.28 L 11 26 Z M 18 13.74 L 26 18 L 26 18 L 18 22.28 Z"
              ></path>
            </svg>
          </button>

          <div class="volume">
            <button
              class="control mute"
              type="button"
              data-media-mute
              aria-label="Mute video"
            >
              <svg
                class="volume-icon volume-low"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
                ></path>
              </svg>
              <svg
                class="volume-icon volume-mid"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
                ></path>
                <path d="M16 9a5 5 0 0 1 0 6"></path>
              </svg>
              <svg
                class="volume-icon volume-high"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
                ></path>
                <path d="M16 9a5 5 0 0 1 0 6"></path>
                <path
                  d="M19.364 18.364a9 9 0 0 0 0-12.728"
                ></path>
              </svg>
              <svg
                class="volume-icon muted"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
                ></path>
                <line x1="22" x2="16" y1="9" y2="15"
                ></line>
                <line x1="16" x2="22" y1="9" y2="15"
                ></line>
              </svg>
            </button>
            <input
              class="range"
              data-media-volume
              type="range"
              min="0"
              max="1"
              step="0.01"
              value="1"
              aria-label="Volume"
            />
          </div>

          <div class="time" aria-live="off">
            <span data-media-current>0:00</span>
            <span aria-hidden="true">/</span>
            <span data-media-duration>0:00</span>
          </div>

          <div class="speed" data-media-speed>
            <button
              class="control speed-toggle"
              type="button"
              data-media-speed-toggle
              aria-label="Playback speed"
              aria-expanded="false"
            >
              <span data-media-speed-label>1.5x</span>
            </button>
            <div
              class="speed-menu"
              data-media-speed-menu
              hidden
            >
              <button
                type="button"
                data-media-speed-option
                data-speed="1">1x</button
              >
              <button
                type="button"
                data-media-speed-option
                data-speed="1.25">1.25x</button
              >
              <button
                type="button"
                data-media-speed-option
                data-speed="1.5">1.5x</button
              >
              <button
                type="button"
                data-media-speed-option
                data-speed="1.75">1.75x</button
              >
              <button
                type="button"
                data-media-speed-option
                data-speed="2">2x</button
              >
            </div>
          </div>

          <button
            class="control pip"
            type="button"
            data-media-pip
            aria-label="Enter picture in picture"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"
              ></path>
              <rect
                width="10"
                height="7"
                x="12"
                y="13"
                rx="2"></rect>
            </svg>
          </button>

          <button
            class="control full"
            type="button"
            data-media-fullscreen
            aria-label="Enter fullscreen"
          >
            <svg
              class="enter"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
            </svg>
            <svg
              class="exit"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <ul class="chapters" hidden>
        <li
          data-media-chapter
          data-start="0"
          data-title="Intro"
        >
        </li>
        <li
          data-media-chapter
          data-start="9"
          data-title="Why Details"
        >
        </li>
        <li
          data-media-chapter
          data-start="45"
          data-title="Filtering"
        >
        </li>
        <li
          data-media-chapter
          data-start="72"
          data-title="Combining filters"
        >
        </li>
        <li
          data-media-chapter
          data-start="102"
          data-title="Saving inspo"
        >
        </li>
        <li
          data-media-chapter
          data-start="117"
          data-title="The vault"
        >
        </li>
        <li
          data-media-chapter
          data-start="161"
          data-title="Outro"
        >
        </li>
      </ul>
    </section>
  </div>
</div>
```

## SCSS

This is the canonical style implementation. If the target project only accepts CSS, compile or flatten the nesting while preserving selector specificity and state order.

```scss
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

  &[hidden] {
    display: none;
  }

  &.is-player-open {
    .backdrop {
      opacity: 1;
    }

    .shell {
      opacity: 1;
      transform: translateY(0) scale(1);
      clip-path: inset(0 round 12px);
    }
  }

  &.has-preview,
  &.is-scrubbing {
    .seek {
      .preview {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }
  }

  &.is-scrubbing {
    .video {
      filter: blur(3px) brightness(0.72);
      transform: scale(1);
    }
  }

  &:not(.is-scrubbing) {
    .timeline {
      &:hover,
      &:focus-visible {
        .scrubber {
          width: 14px;
          height: 14px;
        }
      }
    }
  }

  &.is-preview-fallback {
    .seek {
      .preview {
        width: 190px;

        .thumb {
          display: none;
        }
      }
    }
  }

  &.is-muted {
    .controls {
      .volume-icon {
        display: none;
      }

      .muted {
        display: block;
      }
    }
  }

  &.is-volume-low {
    .controls {
      .volume-icon {
        display: none;
      }

      .volume-low {
        display: block;
      }
    }
  }

  &.is-volume-mid {
    .controls {
      .volume-icon {
        display: none;
      }

      .volume-mid {
        display: block;
      }
    }
  }

  &.is-volume-high {
    .controls {
      .volume-icon {
        display: none;
      }

      .volume-high {
        display: block;
      }
    }
  }

  &.is-fullscreen {
    --bottom: 24px;
    --timeline-bottom: 58px;

    .controls {
      .enter {
        display: none;
      }

      .exit {
        display: block;
      }
    }
  }

  &:not(.is-chrome-visible):not(.has-preview):not(.is-scrubbing) {
    .shade,
    .seek,
    .controls {
      opacity: 0;
      pointer-events: none;
    }

    .seek,
    .controls {
      transform: translateY(6px);
    }
  }

  &.is-loading {
    .video {
      opacity: 0;
    }

    .loader {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    .shade,
    .seek,
    .controls {
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 360ms var(--ease-out-quart);
    cursor: default;
  }

  .frame {
    position: relative;
    z-index: 1;
    width: min(
      940px,
      100%,
      calc((100dvh - 48px) * var(--video-ratio-number, 1.7778))
    );
    aspect-ratio: var(--video-ratio, 16 / 9);
    max-height: calc(100dvh - 48px);
    transition:
      width 520ms var(--ease-out-expo),
      aspect-ratio 520ms var(--ease-out-expo);
  }

  .shell {
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

    &:fullscreen {
      width: 100vw;
      height: 100vh;
      max-width: none;
      border-radius: 0;
      corner-shape: var(--corner-shape);
      aspect-ratio: auto;

      .stage {
        height: 100vh;
      }

      .video {
        object-fit: contain;
      }
    }
  }

  .stage,
  .video {
    width: 100%;
    height: 100%;
  }

  .stage {
    position: relative;
    background: var(--black);
  }

  .video {
    object-fit: cover;
    opacity: 1;
    filter: blur(0) brightness(1);
    transform: scale(1);
    transition:
      opacity 280ms ease,
      filter 180ms ease,
      transform 180ms ease;
  }

  .loader {
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

    svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      animation: media-01-spin 900ms linear infinite;
    }
  }

  .shade {
    position: absolute;
    inset: auto 0 0;
    height: 52%;
    opacity: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.36) 28%,
      rgba(0, 0, 0, 0.88) 100%
    );
    transition: opacity 260ms ease;
  }

  .pulse {
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

    svg {
      width: 42px;
      height: 42px;
      fill: currentColor;
    }

    .pulse-play {
      transform: translateX(2px);
    }

    .pulse-pause {
      display: none;
    }

    &.show-play,
    &.show-pause {
      animation: media-01-pulse 1500ms var(--ease-out-expo) both;
    }

    &.show-pause {
      .pulse-play {
        display: none;
      }

      .pulse-pause {
        display: block;
      }
    }
  }

  .center-toggle {
    display: none;
  }

  .center-pause {
    display: none;
  }

  &.is-playing {
    .center-play {
      display: none;
    }

    .center-pause {
      display: block;
    }
  }

  @keyframes media-01-pulse {
    0% {
      opacity: 0;
      filter: blur(10px);
      transform: translate(-50%, -50%) scale(0.72);
    }

    32% {
      opacity: 1;
      filter: blur(0);
      transform: translate(-50%, -50%) scale(1);
    }

    72% {
      opacity: 1;
      filter: blur(0);
      transform: translate(-50%, -50%) scale(1);
    }

    100% {
      opacity: 0;
      filter: blur(0);
      transform: translate(-50%, -50%) scale(1.08);
    }
  }

  @keyframes media-01-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .close {
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

    &:hover {
      background: rgba(37, 37, 37, 0.598);
    }

    &:active {
      scale: 0.94;
    }

    svg {
      width: 18px;
      height: auto;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.1;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &.is-player-open.is-close-ready {
    .close {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0);
    }
  }

  &.is-closing {
    .shade,
    .seek,
    .controls {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: none;
    }

    .close {
      transition:
        background 180ms ease,
        scale 180ms ease;
    }
  }

  .seek {
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

    .timeline {
      position: relative;
      width: 100%;
      height: 18px;
      display: flex;
      align-items: center;
      cursor: pointer;
      touch-action: none;

      .track {
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

        .chapter {
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

          .fill {
            position: absolute;
            inset: 0 auto 0 0;
            width: var(--chapter-progress, 0%);
            border-radius: inherit;
            corner-shape: inherit;
            background: rgba(255, 255, 255, 0.76);
          }
        }
      }

      &:hover,
      &:focus-visible {
        .track {
          transform: scaleY(1.5);
        }

        .chapter:hover,
        .chapter.is-hovered {
          transform: scaleY(1.34);
        }
      }

      .scrubber {
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
    }

    .preview {
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

      .thumb {
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

      .meta {
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

        span:first-child {
          flex: 0 0 auto;
        }

        span:last-child {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.9);
        }
      }

      &:not(.has-title) {
        .meta {
          min-width: 0;
        }

        [data-media-preview-title] {
          display: none;
        }
      }
    }
  }

  &.is-scrubbing {
    .seek {
      .timeline {
        .scrubber {
          width: 17px;
          height: 17px;
        }
      }
    }
  }

  .controls {
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

    .control,
    .time,
    .volume,
    .speed {
      pointer-events: auto;
      background: transparent;
      box-shadow: none;
    }

    .control {
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

      svg {
        width: var(--icon);
        height: var(--icon);
        fill: currentColor;
      }

      &:hover {
        opacity: 1;
      }

      &:active {
        scale: 0.95;
      }

      &:disabled {
        opacity: 0.38;
        pointer-events: none;
      }
    }

    .play {
      position: relative;
      width: 30px;
      overflow: visible;

      svg {
        position: absolute;
        inset: 0;
        width: 31px;
        height: 31px;
        margin: auto;
      }
    }

    .morph {
      fill: currentColor;
      overflow: visible;
      transform: translateX(1px);
    }

    .volume-icon,
    .exit {
      display: none;
    }

    .volume-high {
      display: block;
    }

    .volume {
      width: var(--control);
      height: var(--control);
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 8px;
      corner-shape: var(--corner-shape);
      transition: width 260ms var(--ease-out-quart);

      &:hover,
      &:focus-within {
        width: var(--volume-open);
      }

      .control {
        background: transparent;
        box-shadow: none;
        backdrop-filter: none;
      }

      .range {
        width: var(--volume-range);
        height: 20px;
        margin: 0 0 0 var(--gap);
        opacity: 0;
        appearance: none;
        background: transparent;
        cursor: pointer;
        transition: opacity 180ms ease;

        &::-webkit-slider-runnable-track {
          height: 3px;
          border: 0;
          border-radius: 999px;
          corner-shape: var(--corner-shape);
          background: linear-gradient(
            90deg,
            var(--white) 0 var(--volume-percent, 100%),
            rgba(255, 255, 255, 0.42)
              var(--volume-percent, 100%) 100%
          );
        }

        &::-webkit-slider-thumb {
          width: 10px;
          height: 10px;
          margin-top: -3.5px;
          appearance: none;
          border: 0;
          border-radius: 999px;
          corner-shape: var(--corner-shape);
          background: var(--white);
        }

        &::-moz-range-track {
          height: 3px;
          border: 0;
          border-radius: 999px;
          corner-shape: var(--corner-shape);
          background: linear-gradient(
            90deg,
            var(--white) 0 var(--volume-percent, 100%),
            rgba(255, 255, 255, 0.42)
              var(--volume-percent, 100%) 100%
          );
        }

        &::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border: 0;
          border-radius: 999px;
          corner-shape: var(--corner-shape);
          background: var(--white);
        }
      }

      &:hover .range,
      &:focus-within .range {
        opacity: 1;
      }
    }

    .time {
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

    .speed {
      position: relative;
      margin-left: auto;
    }

    .pip {
      margin-right: 2px;
    }

    .speed-toggle {
      width: auto;
      min-width: 42px;
      padding: 0 4px;
      font-size: var(--time-size);
      font-weight: 450;
      font-variant-numeric: tabular-nums;
    }

    .speed-menu {
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

      &[hidden] {
        display: none;
      }

      button {
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

        &:hover,
        &.is-active {
          background: rgba(255, 255, 255, 0.16);
          color: var(--white);
        }
      }
    }

    .mute svg,
    .pip svg,
    .full svg {
      fill: none;
      stroke: currentColor;
      stroke-width: var(--icon-stroke);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .pip svg {
      width: calc(var(--icon) - 1px);
      height: calc(var(--icon) - 1px);
      stroke-width: 1.85;
    }

    .full svg {
      width: calc(var(--icon) - 2px);
      height: calc(var(--icon) - 2px);
    }
  }

  @media (max-width: 760px) {
    --control: 30px;
    --gap: 8px;
    --icon: 20px;
    --time-size: 14px;
    --time-width: 98px;
    --inset: 16px;
    --bottom: 14px;
    --timeline-bottom: 48px;

    padding: 14px;

    .frame {
      width: min(
        100%,
        calc((100dvh - 28px) * var(--video-ratio-number, 1.7778))
      );
      max-height: calc(100dvh - 28px);
      aspect-ratio: var(--video-ratio, 16 / 9);
    }

    .seek {
      height: 30px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    &.is-chrome-visible:not(.is-loading):not(.has-preview):not(
        .is-scrubbing
      ) {
      .center-toggle {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
    }

    .pulse {
      width: 58px;
      height: 58px;

      svg {
        width: 30px;
        height: 30px;
      }
    }

    .center-toggle {
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

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        border-radius: inherit;
        background: rgba(86, 86, 86, 0.42);
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
      }

      svg {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 30px;
        height: 30px;
        margin: auto;
        fill: currentColor;
      }

      .center-play {
        transform: translateX(2px);
      }
    }

    .seek {
      .preview {
        left: 50% !important;
        bottom: clamp(74px, 18vh, 132px);
        width: max-content;
        max-width: min(560px, calc(100vw - 48px));

        .thumb {
          display: none;
        }

        .meta {
          position: static;
          max-width: 100%;
          padding: 10px 16px 11px;
          gap: 10px;
          background: rgba(86, 86, 86, 0.28);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          transform: none;
        }
      }
    }

    .controls {
      .play,
      .volume,
      .pip {
        display: none;
      }

      .full {
        margin-left: 4px;
      }

      .range {
        display: none;
      }

      .volume:hover,
      .volume:focus-within {
        width: var(--control);
      }
    }
  }
}
```

## JavaScript

```js
function media01(scope = document) {
    const roots = scope.matches?.("[data-media-01-player]")
        ? [scope]
        : [...scope.querySelectorAll("[data-media-01-player]")];
    const cleanups = media01.cleanups || (media01.cleanups = new WeakMap());
    const triggerScope = scope === document ? document : scope.ownerDocument || document;

    roots.forEach((root, rootIndex) => {
        cleanups.get(root)?.();

        const playerId = root.getAttribute("data-media-01-player") || "";
        const openButtons = [...triggerScope.querySelectorAll("[data-media-01-open]")].filter(
            (button) => button.getAttribute("data-media-01-open") === playerId,
        );
        const modal = root.matches("[data-media-modal]")
            ? root
            : root.querySelector("[data-media-modal]");
        const shell = root.querySelector("[data-media-shell]");
        const stage = root.querySelector("[data-media-stage]");
        const video = root.querySelector("[data-media-video]");
        const previewVideo = root.querySelector("[data-media-preview-video]");
        const playButton = root.querySelector("[data-media-play]");
        const muteButton = root.querySelector("[data-media-mute]");
        const volumeInput = root.querySelector("[data-media-volume]");
        const speedRoot = root.querySelector("[data-media-speed]");
        const speedButton = root.querySelector("[data-media-speed-toggle]");
        const speedMenu = root.querySelector("[data-media-speed-menu]");
        const speedLabel = root.querySelector("[data-media-speed-label]");
        const speedOptions = [...root.querySelectorAll("[data-media-speed-option]")];
        const pipButton = root.querySelector("[data-media-pip]");
        const fullscreenButton = root.querySelector("[data-media-fullscreen]");
        const centerButton = root.querySelector("[data-media-center-toggle]");
        const currentTimeNode = root.querySelector("[data-media-current]");
        const durationNode = root.querySelector("[data-media-duration]");
        const timeline = root.querySelector("[data-media-timeline]");
        const chapterTrack = root.querySelector("[data-media-chapter-track]");
        const scrubber = root.querySelector("[data-media-scrubber]");
        const previewCard = root.querySelector("[data-media-preview-card]");
        const previewTimeNode = root.querySelector("[data-media-preview-time]");
        const previewTitleNode = root.querySelector("[data-media-preview-title]");
        const closeButtons = [...root.querySelectorAll("[data-media-close]")];
        const playPath = root.querySelector("[data-media-play-path]");
        const roundFilter = root.querySelector("[data-media-round-filter]");
        const pulse = root.querySelector("[data-media-pulse]");

        if (
            !modal ||
            !shell ||
            !stage ||
            !video ||
            !previewVideo ||
            !playButton ||
            !muteButton ||
            !volumeInput ||
            !speedRoot ||
            !speedButton ||
            !speedMenu ||
            !speedLabel ||
            !speedOptions.length ||
            !pipButton ||
            !fullscreenButton ||
            !centerButton ||
            !timeline ||
            !chapterTrack ||
            !scrubber ||
            !pulse
        ) {
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;
        let activeBeforeOpen = null;
        let closeTimer = 0;
        let closeRevealTimer = 0;
        let chromeTimer = 0;
        let previewFrame = 0;
        let isPointerOverStage = false;
        let isDragging = false;
        let activePointerId = null;
        let pendingScrubTime = null;
        let resumeAfterScrub = false;
        let lastPointerWasTouch = false;
        let touchStageHadChrome = false;
        let lastCenterTouchToggle = 0;
        let lastVolume = Number(volumeInput.value) || 1;
        let chapters = [];
        let segmentParts = [];
        let playIconFrame = 0;
        let playIconProgress = 0;
        let playIconTarget = null;
        let isMediaLoaded = false;
        let currentSpeed = parseSpeed(video.getAttribute("data-default-speed")) || 1;
        const volumeClasses = ["is-volume-low", "is-volume-mid", "is-volume-high"];

        const playIconShapes = {
            play: [
                [
                    [11, 10],
                    [18, 13.74],
                    [18, 22.28],
                    [11, 26],
                ],
                [
                    [18, 13.74],
                    [26, 18],
                    [26, 18],
                    [18, 22.28],
                ],
            ],
            pause: [
                [
                    [11, 10],
                    [17, 10],
                    [17, 26],
                    [11, 26],
                ],
                [
                    [20, 10],
                    [26, 10],
                    [26, 26],
                    [20, 26],
                ],
            ],
        };

        if (roundFilter && playPath) {
            const safeId = (playerId || `player-${rootIndex}`).replace(/[^a-zA-Z0-9_-]/g, "-");
            const filterId = `media-01-round-icon-${safeId}`;

            roundFilter.id = filterId;
            playPath.setAttribute("filter", `url(#${filterId})`);
        }

        previewVideo.muted = true;
        previewVideo.playsInline = true;

        function shouldUseIosSource() {
            return (
                /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
            );
        }

        function getMediaSource(media) {
            const source = media.getAttribute("data-src");
            const iosSource = media.getAttribute("data-ios-src");

            return shouldUseIosSource() && iosSource ? iosSource : source;
        }

        function loadMedia() {
            if (isMediaLoaded) return;
            isMediaLoaded = true;

            [
                [video, "auto"],
                [previewVideo, "metadata"],
            ].forEach(([media, preload]) => {
                const source = getMediaSource(media);

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

            const total = Math.max(0, Math.floor(value));
            const hours = Math.floor(total / 3600);
            const minutes = Math.floor((total % 3600) / 60);
            const seconds = total % 60;
            const paddedSeconds = String(seconds).padStart(2, "0");

            if (hours > 0) {
                return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
            }

            return `${minutes}:${paddedSeconds}`;
        }

        function parseSpeed(value) {
            const speed = Number(value);
            return Number.isFinite(speed) && speed > 0 ? speed : null;
        }

        function formatSpeed(value) {
            return `${Number(value.toFixed(2))}x`;
        }

        function setPlaybackSpeed(speed, { includeDefault = false } = {}) {
            try {
                if (includeDefault) {
                    video.defaultPlaybackRate = speed;
                }

                video.preservesPitch = true;
                video.webkitPreservesPitch = true;
            } catch {
                // Ignore unsupported media properties.
            }

            video.playbackRate = speed;
        }

        function isVideoPlaying() {
            return !video.paused && !video.ended;
        }

        function isTouchInteraction(event = null) {
            return event?.pointerType === "touch" || lastPointerWasTouch;
        }

        function hideChrome({ allowInside = false, clearPreview = false } = {}) {
            if (clearPreview) {
                root.classList.remove("has-preview");
            }

            if (
                isDragging ||
                (!allowInside && isPointerOverStage) ||
                !speedMenu.hidden ||
                root.classList.contains("has-preview")
            ) {
                return;
            }

            root.classList.remove("is-chrome-visible");
        }

        function scheduleChromeHide(delay = 0, options = {}) {
            clearTimeout(chromeTimer);

            if (delay <= 0) {
                hideChrome(options);
                return;
            }

            chromeTimer = setTimeout(() => hideChrome(options), delay);
        }

        function showChrome(shouldAutoHide = false) {
            clearTimeout(chromeTimer);

            if (modal.hidden || root.classList.contains("is-closing")) return;

            root.classList.add("is-chrome-visible");

            if (shouldAutoHide && isVideoPlaying()) {
                scheduleChromeHide(4000, {
                    allowInside: true,
                    clearPreview: true,
                });
            }
        }

        function showTouchChrome() {
            showChrome(false);

            scheduleChromeHide(3000, {
                allowInside: true,
                clearPreview: true,
            });
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
            const lines = points
                .map((point, index) => {
                    const command = index === 0 ? "M" : "L";
                    return `${command} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`;
                })
                .join(" ");

            return `${lines} Z`;
        }

        function renderPlayIcon(progress) {
            if (!playPath) return;

            const subpaths = playIconShapes.play.map((playPoints, pathIndex) => {
                const pausePoints = playIconShapes.pause[pathIndex];
                const points = playPoints.map((point, pointIndex) => {
                    const pausePoint = pausePoints[pointIndex];

                    return [
                        point[0] + (pausePoint[0] - point[0]) * progress,
                        point[1] + (pausePoint[1] - point[1]) * progress,
                    ];
                });

                return getSubpath(points);
            });

            playPath.setAttribute("d", subpaths.join(" "));
        }

        function morphPlayIcon(isPlaying) {
            const target = isPlaying ? 1 : 0;

            if (playIconTarget === target) return;
            playIconTarget = target;
            cancelAnimationFrame(playIconFrame);

            const startProgress = playIconProgress;
            const distance = target - startProgress;
            const startTime = performance.now();
            const duration = 240;

            function tick(now) {
                const elapsed = Math.min((now - startTime) / duration, 1);
                const eased = easeOutQuart(elapsed);

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
            const duration = getDuration();
            const data = [...root.querySelectorAll("[data-media-chapter]")]
                .map((item) => ({
                    start: Number(item.getAttribute("data-start")),
                    title: item.getAttribute("data-title") || "",
                }))
                .filter((item) => Number.isFinite(item.start) && item.start >= 0)
                .sort((left, right) => left.start - right.start);

            if (!data.length || data[0].start > 0) {
                data.unshift({ start: 0, title: "" });
            }

            const deduped = data.filter((item, index, list) => {
                return index === 0 || item.start !== list[index - 1].start;
            });

            chapters = deduped
                .filter((item) => !duration || item.start < duration)
                .map((item, index, list) => ({
                    start: item.start,
                    end: list[index + 1]?.start ?? duration,
                    title: item.title,
                }))
                .filter((item) => !duration || item.end > item.start);
        }

        function renderChapters() {
            const duration = getDuration();

            readChapters();
            chapterTrack.textContent = "";
            segmentParts = [];

            if (!duration || !chapters.length) {
                const segment = document.createElement("span");
                const fill = document.createElement("span");

                segment.className = "chapter";
                fill.className = "fill";
                segment.append(fill);
                chapterTrack.append(segment);
                segmentParts.push({ start: 0, end: duration || 1, element: segment, fill });
                updateTimeline();
                return;
            }

            chapters.forEach((chapter) => {
                const segment = document.createElement("span");
                const fill = document.createElement("span");
                const segmentDuration = Math.max(chapter.end - chapter.start, 0.01);

                segment.className = "chapter";
                fill.className = "fill";
                segment.style.setProperty("--chapter-grow", String(segmentDuration));
                segment.append(fill);
                chapterTrack.append(segment);
                segmentParts.push({ ...chapter, element: segment, fill });
            });

            updateTimeline();
        }

        function syncVideoRatio() {
            const width = video.videoWidth;
            const height = video.videoHeight;

            if (!width || !height) return;

            root.style.setProperty("--video-ratio", `${width} / ${height}`);
            root.style.setProperty("--video-ratio-number", String(width / height));
        }

        function hasReadyFrame() {
            return Boolean(video.readyState >= 2 && video.videoWidth && video.videoHeight);
        }

        function syncMediaReadyState() {
            const isReady = hasReadyFrame();
            const isLoading = !isReady && !modal.hidden;

            if (video.readyState >= 1) {
                syncVideoRatio();
            }

            root.classList.toggle("is-media-ready", isReady);
            root.classList.toggle("is-loading", isLoading);
            root.setAttribute("aria-busy", String(isLoading));

            return isReady;
        }

        function getChapterAt(time) {
            for (let index = chapters.length - 1; index >= 0; index -= 1) {
                if (time >= chapters[index].start) {
                    return chapters[index];
                }
            }

            return chapters[0] || {
                title: "",
                start: 0,
                end: getDuration(),
            };
        }

        function getVisualProgressPercent(time) {
            const duration = getDuration();
            const trackRect = chapterTrack.getBoundingClientRect();
            const fallback = duration ? (time / duration) * 100 : 0;

            if (!duration || !trackRect.width || !segmentParts.length) {
                return fallback;
            }

            const segment =
                segmentParts.find((part, index) => {
                    const isLast = index === segmentParts.length - 1;

                    return time >= part.start && (time < part.end || isLast);
                }) || segmentParts[0];
            const segmentRect = segment.element?.getBoundingClientRect();

            if (!segmentRect?.width) {
                return fallback;
            }

            const segmentDuration = Math.max(segment.end - segment.start, 0.01);
            const segmentProgress = clamp((time - segment.start) / segmentDuration, 0, 1);
            const x = segmentRect.left - trackRect.left + segmentRect.width * segmentProgress;

            return clamp((x / trackRect.width) * 100, 0, 100);
        }

        function updateTimeline(time) {
            const duration = getDuration();
            const renderTime =
                time ??
                (isDragging && pendingScrubTime !== null
                    ? pendingScrubTime
                    : video.currentTime);
            const current = clamp(renderTime || 0, 0, duration || 0);
            const percent = getVisualProgressPercent(current);

            scrubber.style.setProperty("--scrubber-left", `${percent}%`);

            segmentParts.forEach((segment) => {
                const segmentDuration = Math.max(segment.end - segment.start, 0.01);
                const segmentPercent = clamp(
                    ((current - segment.start) / segmentDuration) * 100,
                    0,
                    100,
                );

                segment.fill.style.setProperty("--chapter-progress", `${segmentPercent}%`);
            });

            if (currentTimeNode) currentTimeNode.textContent = formatTime(current);
            if (durationNode) durationNode.textContent = formatTime(duration);

            timeline.setAttribute("aria-valuemax", String(Math.floor(duration || 0)));
            timeline.setAttribute("aria-valuenow", String(Math.floor(current)));
            timeline.setAttribute(
                "aria-valuetext",
                `${formatTime(current)} of ${formatTime(duration)}`,
            );
        }

        function syncPlayState() {
            const isPlaying = isVideoPlaying();

            root.classList.toggle("is-playing", isPlaying);
            morphPlayIcon(isPlaying);
            playButton.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
            centerButton.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");

            if (isPlaying && isPointerOverStage) {
                showChrome(true);
            } else {
                clearTimeout(chromeTimer);
            }
        }

        function syncVolumeState() {
            const volume = video.muted ? 0 : video.volume;
            const isMuted = video.muted || video.volume === 0;
            const volumeClass =
                volume <= 0.33
                    ? "is-volume-low"
                    : volume <= 0.66
                        ? "is-volume-mid"
                        : "is-volume-high";

            if (!video.muted && video.volume > 0) {
                lastVolume = video.volume;
            }

            root.classList.remove(...volumeClasses);
            root.classList.toggle("is-muted", isMuted);
            if (!isMuted) {
                root.classList.add(volumeClass);
            }
            muteButton.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
            volumeInput.value = String(volume);
            volumeInput.style.setProperty("--volume-percent", `${volume * 100}%`);
        }

        function syncFullscreenState() {
            const isFullscreen = document.fullscreenElement === shell;

            root.classList.toggle("is-fullscreen", isFullscreen);
            fullscreenButton.setAttribute(
                "aria-label",
                isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
            );
        }

        function supportsPictureInPicture() {
            const supportsStandard =
                document.pictureInPictureEnabled && typeof video.requestPictureInPicture === "function";
            const supportsWebkit =
                typeof video.webkitSetPresentationMode === "function" &&
                typeof video.webkitSupportsPresentationMode === "function" &&
                video.webkitSupportsPresentationMode("picture-in-picture");

            return supportsStandard || supportsWebkit;
        }

        function isPictureInPicture() {
            return (
                document.pictureInPictureElement === video ||
                video.webkitPresentationMode === "picture-in-picture"
            );
        }

        function syncPictureInPictureState() {
            const isSupported = supportsPictureInPicture();
            const isActive = isPictureInPicture();

            pipButton.disabled = !isSupported;
            pipButton.setAttribute("aria-disabled", String(!isSupported));
            pipButton.setAttribute(
                "aria-label",
                isActive ? "Exit picture in picture" : "Enter picture in picture",
            );
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
            if (speedMenu.hidden) {
                openSpeedMenu();
            } else {
                closeSpeedMenu();
            }
        }

        function syncSpeedState(speed = video.playbackRate) {
            const nextSpeed = parseSpeed(speed) || 1;

            currentSpeed = nextSpeed;
            setPlaybackSpeed(nextSpeed, { includeDefault: true });
            syncSpeedOptions(nextSpeed);
        }

        function syncSpeedOptions(speed) {
            speedLabel.textContent = formatSpeed(speed);
            speedOptions.forEach((option) => {
                const optionSpeed = parseSpeed(option.getAttribute("data-speed"));
                const isActive = optionSpeed === speed;

                option.classList.toggle("is-active", isActive);
                option.setAttribute("aria-pressed", String(isActive));
            });
        }

        async function changePlaybackSpeed(speed) {
            const nextSpeed = parseSpeed(speed);
            if (!nextSpeed) return;

            const wasPlaying = isVideoPlaying();
            const duration = getDuration();
            const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
            const restoreTime = duration
                ? clamp(currentTime + 0.001, 0, Math.max(duration - 0.001, 0))
                : currentTime;

            if (wasPlaying) {
                video.pause();
            }

            currentSpeed = nextSpeed;
            setPlaybackSpeed(nextSpeed);
            syncSpeedOptions(nextSpeed);

            if (Number.isFinite(restoreTime)) {
                try {
                    video.currentTime = restoreTime;
                } catch {
                    // Ignore seek errors while media metadata is still settling.
                }

                updateTimeline(currentTime);
            }

            if (wasPlaying) {
                try {
                    await video.play();
                } catch {
                    syncPlayState();
                }
            }
        }

        function clearPulse() {
            pulse.classList.remove("show-play", "show-pause");
        }

        function showPulse(type) {
            clearPulse();
            void pulse.offsetWidth;
            pulse.classList.add(type === "pause" ? "show-pause" : "show-play");
        }

        async function togglePlay({ showFeedback = false } = {}) {
            if (video.paused || video.ended) {
                if (showFeedback) showPulse("play");

                try {
                    await video.play();
                } catch {
                    syncPlayState();
                }
            } else {
                if (showFeedback) showPulse("pause");
                video.pause();
            }
        }

        function onStageClick(event) {
            const interactive = event.target.closest?.(
                "button, input, .controls, [data-media-timeline]",
            );

            if (interactive) return;

            const shouldUseTouchChrome = isTouchInteraction(event);

            if (shouldUseTouchChrome) {
                if (touchStageHadChrome) {
                    hideTouchChrome();
                } else {
                    showTouchChrome();
                }

                return;
            }

            showChrome();
            togglePlay({ showFeedback: true })
                .catch(syncPlayState)
                .finally(() => {
                    if (shouldUseTouchChrome) showTouchChrome();
                });
        }

        async function togglePictureInPicture() {
            if (!supportsPictureInPicture()) return;

            if (document.pictureInPictureElement === video) {
                await document.exitPictureInPicture();
                return;
            }

            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }

            if (
                document.pictureInPictureEnabled &&
                typeof video.requestPictureInPicture === "function"
            ) {
                await video.requestPictureInPicture();
                return;
            }

            if (typeof video.webkitSetPresentationMode === "function") {
                video.webkitSetPresentationMode(
                    video.webkitPresentationMode === "picture-in-picture"
                        ? "inline"
                        : "picture-in-picture",
                );
            }
        }

        function toggleMute() {
            if (video.muted || video.volume === 0) {
                video.muted = false;
                video.volume = lastVolume || 0.8;
            } else {
                video.muted = true;
            }

            syncVolumeState();
        }

        function seekTo(time) {
            const duration = getDuration();
            if (!duration) return;

            video.currentTime = clamp(time, 0, duration);
            updateTimeline(video.currentTime);
        }

        function getTimelinePoint(event) {
            const duration = getDuration();
            const rect = timeline.getBoundingClientRect();
            const x = clamp(event.clientX - rect.left, 0, rect.width);
            const percent = rect.width ? x / rect.width : 0;

            return {
                x,
                percent,
                time: duration * percent,
            };
        }

        function markPreviewFallback() {
            root.classList.add("is-preview-fallback");
        }

        function setHoveredChapter(time) {
            const activeSegment =
                segmentParts.find((part, index) => {
                    const isLast = index === segmentParts.length - 1;
                    return time >= part.start && (time < part.end || isLast);
                }) || null;

            segmentParts.forEach((part) => {
                part.element.classList.toggle("is-hovered", part === activeSegment);
            });
        }

        function clearHoveredChapter() {
            segmentParts.forEach((part) => {
                part.element.classList.remove("is-hovered");
            });
        }

        function updatePreviewVideo(time) {
            if (!previewVideo || !Number.isFinite(time)) return;
            if (previewVideo.readyState < 1) return;

            cancelAnimationFrame(previewFrame);
            previewFrame = requestAnimationFrame(() => {
                try {
                    previewVideo.pause();

                    if (Math.abs(previewVideo.currentTime - time) > 0.12) {
                        previewVideo.currentTime = time;
                    }
                } catch {
                    markPreviewFallback();
                }
            });
        }

        function showPreview(event, time) {
            if (modal.hidden || root.classList.contains("is-closing")) return;

            const duration = getDuration();
            if (!duration) return;

            const timelineRect = timeline.getBoundingClientRect();
            const wrapRect = timeline.parentElement.getBoundingClientRect();
            const previewWidth = previewCard?.offsetWidth || 236;
            const left = clamp(
                event.clientX - wrapRect.left,
                previewWidth / 2,
                wrapRect.width - previewWidth / 2,
            );
            const chapter = getChapterAt(time);
            setHoveredChapter(time);

            if (!isTouchInteraction(event) && previewCard) {
                previewCard.style.left = `${left}px`;
            }

            if (previewTimeNode) previewTimeNode.textContent = formatTime(time);
            if (previewTitleNode) previewTitleNode.textContent = chapter.title;
            if (previewCard) {
                previewCard.classList.toggle("has-title", Boolean(chapter.title.trim()));
            }

            root.classList.add("has-preview");
            showChrome(false);
            if (!isTouchInteraction(event)) {
                updatePreviewVideo(clamp(time, 0, duration));
            }

            if (timelineRect.width) {
                timeline.style.setProperty(
                    "--preview-percent",
                    `${((event.clientX - timelineRect.left) / timelineRect.width) * 100}%`,
                );
            }
        }

        function hidePreview() {
            root.classList.remove("has-preview");
            clearHoveredChapter();
            scheduleChromeHide(300);
        }

        function setTriggersExpanded(isExpanded) {
            openButtons.forEach((button) => {
                button.setAttribute("aria-expanded", String(isExpanded));
                button.classList.toggle("is-media-open", isExpanded);
            });
        }

        function openModal(trigger = null) {
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

            requestAnimationFrame(() => {
                root.classList.add("is-player-open");
                updateTimeline();
            });

            closeRevealTimer = setTimeout(() => {
                root.classList.add("is-close-ready");
            }, 130);

            setTimeout(() => {
                const focusTarget =
                    hasReadyFrame() ? playButton : closeButtons.find((button) => button.classList.contains("close"));

                (focusTarget || playButton).focus({ preventScroll: true });
            }, 160);
        }

        async function closeModal() {
            clearTimeout(closeTimer);
            clearTimeout(closeRevealTimer);
            beginClosingVisualState();

            if (document.fullscreenElement === shell) {
                try {
                    await document.exitFullscreen();
                } catch {
                    // Ignore fullscreen exit errors; the modal can still close.
                }
            }

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
            root.classList.remove(
                "is-player-open",
                "is-close-ready",
                "is-loading",
                "is-scrubbing",
                "is-chrome-visible",
            );
            root.setAttribute("aria-busy", "false");
            setTriggersExpanded(false);

            closeTimer = setTimeout(() => {
                modal.hidden = true;
                root.classList.remove("is-closing");

                if (activeBeforeOpen && document.contains(activeBeforeOpen)) {
                    activeBeforeOpen.focus({ preventScroll: true });
                } else if (openButtons[0]) {
                    openButtons[0].focus({ preventScroll: true });
                }
            }, 360);
        }

        function trapFocus(event) {
            const focusables = [
                ...modal.querySelectorAll(
                    'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
                ),
            ].filter((node) => node.offsetParent !== null);

            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        function onDocumentKeydown(event) {
            if (modal.hidden) return;

            const target = event.target;
            const isEditable =
                target instanceof HTMLElement &&
                (target.matches("input, textarea, select") || target.isContentEditable);
            const isInteractive =
                target instanceof HTMLElement &&
                target.closest("button, a, input, textarea, select, [role='button']");

            if (!isEditable && event.key.toLowerCase() === "m") {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggleMute();
                return;
            }

            if (!isEditable && !isInteractive && event.key === " ") {
                event.preventDefault();
                event.stopImmediatePropagation();
                togglePlay()
                    .catch(syncPlayState)
                    .finally(() => {
                        if (isTouchInteraction()) showTouchChrome();
                    });
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                event.stopImmediatePropagation();

                if (!speedMenu.hidden) {
                    closeSpeedMenu();
                    speedButton.focus({ preventScroll: true });
                    return;
                }

                closeModal();
                return;
            }

            if (event.key === "Tab") {
                event.stopImmediatePropagation();
                trapFocus(event);
            }
        }

        function onTimelineKeydown(event) {
            const duration = getDuration();
            if (!duration) return;

            const seekSmall = 5;
            const seekLarge = 15;
            let nextTime = null;

            if (event.key === "ArrowLeft") nextTime = video.currentTime - seekSmall;
            if (event.key === "ArrowRight") nextTime = video.currentTime + seekSmall;
            if (event.key === "ArrowDown") nextTime = video.currentTime - seekLarge;
            if (event.key === "ArrowUp") nextTime = video.currentTime + seekLarge;
            if (event.key === "Home") nextTime = 0;
            if (event.key === "End") nextTime = duration;

            if (nextTime !== null) {
                event.preventDefault();
                seekTo(nextTime);
            }
        }

        function startScrub(event) {
            const duration = getDuration();
            if (!duration) return;

            const point = getTimelinePoint(event);

            activePointerId = event.pointerId;
            isDragging = true;
            pendingScrubTime = point.time;
            resumeAfterScrub = isVideoPlaying();

            if (resumeAfterScrub) {
                video.pause();
            }

            root.classList.add("is-scrubbing");
            showChrome(false);
            timeline.setPointerCapture?.(event.pointerId);
            updateTimeline(point.time);
            showPreview(event, point.time);
            event.preventDefault();
        }

        function moveScrub(event) {
            const duration = getDuration();
            if (!duration) return;
            if (event.pointerType === "touch" && !isDragging) return;

            const point = getTimelinePoint(event);

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

            const commitTime = pendingScrubTime;
            const shouldResume = resumeAfterScrub;

            isDragging = false;
            activePointerId = null;
            pendingScrubTime = null;
            resumeAfterScrub = false;
            root.classList.remove("is-scrubbing");

            if (commitTime !== null) {
                seekTo(commitTime);
            }

            if (event.pointerType === "touch") {
                root.classList.remove("has-preview");
                clearHoveredChapter();

                if (shouldResume) {
                    video
                        .play()
                        .catch(syncPlayState)
                        .finally(showTouchChrome);
                } else {
                    showTouchChrome();
                }

                return;
            }

            if (shouldResume) {
                video.play().catch(syncPlayState);
            }

            scheduleChromeHide(300);
        }

        function onDocumentPointerDown(event) {
            if (modal.hidden || speedMenu.hidden) return;
            if (speedRoot.contains(event.target)) return;

            closeSpeedMenu();
        }

        function onWindowResize() {
            updateTimeline();
        }

        async function toggleFullscreen() {
            if (document.fullscreenElement === shell) {
                await document.exitFullscreen();
                return;
            }

            if (shell.requestFullscreen) {
                await shell.requestFullscreen();
                return;
            }

            if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        }

        openButtons.forEach((button) => {
            button.addEventListener("pointerenter", loadMedia, { signal });
            button.addEventListener("focus", loadMedia, { signal });
            button.addEventListener("pointerdown", loadMedia, { signal, passive: true });
            button.addEventListener("click", () => openModal(button), { signal });
        });
        closeButtons.forEach((button) => {
            button.addEventListener("pointerdown", beginClosingVisualState, { signal });
            button.addEventListener("click", closeModal, { signal });
        });
        playButton.addEventListener(
            "click",
            () => {
                const shouldUseTouchChrome = isTouchInteraction();

                if (shouldUseTouchChrome) showTouchChrome();

                togglePlay()
                    .catch(syncPlayState)
                    .finally(() => {
                        if (shouldUseTouchChrome) showTouchChrome();
                    });
            },
            { signal },
        );
        centerButton.addEventListener(
            "pointerup",
            (event) => {
                if (event.pointerType !== "touch") return;

                event.preventDefault();
                event.stopPropagation();
                lastCenterTouchToggle = performance.now();
                showTouchChrome();

                togglePlay()
                    .catch(syncPlayState)
                    .finally(showTouchChrome);
            },
            { signal },
        );
        centerButton.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();

                if (performance.now() - lastCenterTouchToggle < 500) return;

                showTouchChrome();
                togglePlay()
                    .catch(syncPlayState)
                    .finally(showTouchChrome);
            },
            { signal },
        );
        centerButton.addEventListener("pointerdown", (event) => event.stopPropagation(), {
            signal,
        });
        muteButton.addEventListener("click", toggleMute, { signal });
        speedButton.addEventListener("click", toggleSpeedMenu, { signal });
        speedOptions.forEach((option) => {
            option.addEventListener(
                "click",
                (event) => {
                    const shouldUseTouchChrome = isTouchInteraction(event);
                    const speed = parseSpeed(option.getAttribute("data-speed"));

                    event.preventDefault();
                    event.stopPropagation();
                    closeSpeedMenu();

                    if (shouldUseTouchChrome) {
                        showTouchChrome();
                    } else {
                        speedButton.focus({ preventScroll: true });
                    }

                    if (speed) {
                        changePlaybackSpeed(speed)
                            .catch(syncPlayState)
                            .finally(() => {
                                if (shouldUseTouchChrome) showTouchChrome();
                            });
                    }
                },
                { signal },
            );
        });
        pipButton.addEventListener(
            "click",
            () => {
                togglePictureInPicture().catch(syncPictureInPictureState);
            },
            { signal },
        );
        fullscreenButton.addEventListener(
            "click",
            () => {
                toggleFullscreen().catch(syncFullscreenState);
            },
            { signal },
        );

        volumeInput.addEventListener(
            "input",
            () => {
                const volume = Number(volumeInput.value);

                video.volume = clamp(Number.isFinite(volume) ? volume : 1, 0, 1);
                video.muted = video.volume === 0;
                syncVolumeState();
            },
            { signal },
        );

        video.addEventListener(
            "loadedmetadata",
            () => {
                setPlaybackSpeed(currentSpeed, { includeDefault: true });
                syncVideoRatio();
                syncMediaReadyState();
                renderChapters();
            },
            { signal },
        );
        video.addEventListener("loadeddata", syncMediaReadyState, { signal });
        video.addEventListener("canplay", syncMediaReadyState, { signal });
        video.addEventListener("durationchange", renderChapters, { signal });
        video.addEventListener("timeupdate", () => updateTimeline(), { signal });
        video.addEventListener("play", syncPlayState, { signal });
        video.addEventListener("pause", syncPlayState, { signal });
        video.addEventListener("ended", syncPlayState, { signal });
        video.addEventListener("volumechange", syncVolumeState, { signal });
        video.addEventListener("enterpictureinpicture", syncPictureInPictureState, { signal });
        video.addEventListener("leavepictureinpicture", syncPictureInPictureState, { signal });
        video.addEventListener("webkitpresentationmodechanged", syncPictureInPictureState, {
            signal,
        });
        pulse.addEventListener("animationend", clearPulse, { signal });
        previewVideo.addEventListener("error", markPreviewFallback, { signal });

        stage.addEventListener(
            "pointerdown",
            (event) => {
                if (event.pointerType !== "touch") return;

                touchStageHadChrome = root.classList.contains("is-chrome-visible");
            },
            { signal },
        );
        stage.addEventListener(
            "pointerenter",
            (event) => {
                isPointerOverStage = true;

                if (event.pointerType === "touch") {
                    showTouchChrome();
                    return;
                }

                showChrome(isVideoPlaying());
            },
            { signal },
        );
        stage.addEventListener(
            "pointermove",
            (event) => {
                isPointerOverStage = true;

                if (event.pointerType === "touch") {
                    showTouchChrome();
                    return;
                }

                showChrome(isVideoPlaying());
            },
            { signal },
        );
        stage.addEventListener(
            "pointerleave",
            (event) => {
                isPointerOverStage = false;

                if (event.pointerType === "touch") return;

                hidePreview();
                hideChrome();
            },
            { signal },
        );
        stage.addEventListener("click", onStageClick, { signal });
        root.addEventListener(
            "pointerdown",
            (event) => {
                lastPointerWasTouch = event.pointerType === "touch";

                if (
                    lastPointerWasTouch &&
                    event.target.closest?.(".controls, .seek")
                ) {
                    showTouchChrome();
                }
            },
            { signal, capture: true },
        );
        root.addEventListener(
            "focusin",
            (event) => {
                if (event.target.closest?.("[data-media-close]")) return;
                showChrome(false);
            },
            { signal },
        );
        root.addEventListener(
            "focusout",
            (event) => {
                if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) {
                    return;
                }

                scheduleChromeHide();
            },
            { signal },
        );

        timeline.addEventListener("pointerdown", startScrub, { signal });
        timeline.addEventListener("pointermove", moveScrub, { signal });
        timeline.addEventListener(
            "pointerleave",
            () => {
                if (!isDragging) hidePreview();
            },
            { signal },
        );
        timeline.addEventListener("pointerup", endScrub, { signal });
        timeline.addEventListener("pointercancel", endScrub, { signal });
        timeline.addEventListener("lostpointercapture", endScrub, { signal });
        timeline.addEventListener("keydown", onTimelineKeydown, { signal });

        document.addEventListener("keydown", onDocumentKeydown, {
            signal,
            capture: true,
        });
        document.addEventListener("pointerdown", onDocumentPointerDown, {
            signal,
            capture: true,
        });
        document.addEventListener("fullscreenchange", syncFullscreenState, { signal });
        window.addEventListener("resize", onWindowResize, { signal });

        syncSpeedState(currentSpeed);

        if (video.readyState >= 1) {
            syncVideoRatio();
            renderChapters();
        } else {
            updateTimeline();
        }

        syncMediaReadyState();

        syncPlayState();
        syncVolumeState();
        syncFullscreenState();
        syncPictureInPictureState();

        cleanups.set(root, () => {
            clearTimeout(closeTimer);
            clearTimeout(closeRevealTimer);
            clearTimeout(chromeTimer);
            cancelAnimationFrame(previewFrame);
            cancelAnimationFrame(playIconFrame);
            controller.abort();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => media01());
```

## Adaptation notes

Replace the two `data-src` values with the user's hosted video URL. If they have an iOS-specific fallback file, add `data-ios-src` to both video elements; the script already checks that attribute.

To add multiple players, duplicate the opener + player markup and give each pair a unique matching ID value, for example `data-media-01-open="product-demo"` and `data-media-01-player="product-demo"`.

To edit chapters, only change the hidden `<li data-media-chapter ...>` items. Keep start times sorted in ascending order.

If porting to React, Vue, Svelte, Astro islands, or another component system, run `media01(rootElement)` in the mounted lifecycle and call the stored cleanup by re-running `media01(rootElement)` before replacing the same DOM. Keep the CSS global enough to style runtime-created chapter segments: `.chapter`, `.fill`, and the player state classes are created or toggled by JavaScript.
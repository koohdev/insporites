---
title: "Click Sound Provider"
description: "A React Context provider that plays a subtle tap sound on every button, link, or role='button' click across the entire app. Drop-in global audio feedback, zero per-component wiring."
category: "Providers"
publishedAt: "2026-08-12"
updatedAt: "2026-08-12"
license: "MIT"
---

# Click Sound Provider

> A React Context provider that plays a subtle tap sound on every `button`, `a`, or `role="button"` click across the entire app. Drop-in global audio feedback — zero per-component wiring.

## Dependencies

- `use-sound`

```bash
npm install use-sound
```

## Sound Asset

Place the audio file in your public directory:

```
public/
└── sounds/
    └── soft-tap.wav
```

## Usage

Wrap your root layout (or `_app.tsx`) with `ClickSoundProvider`. Every interactive element inside it automatically gets the tap sound.

```tsx
// app/layout.tsx  (or pages/_app.tsx)
import { ClickSoundProvider } from "@/components/click-sound-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClickSoundProvider>
          {children}
        </ClickSoundProvider>
      </body>
    </html>
  );
}
```

## Component

```tsx
"use client";

import React, { createContext, useContext, useEffect } from "react";
import useSound from "use-sound";

interface ClickSoundContextType {
  playClick: () => void;
}

const ClickSoundContext = createContext<ClickSoundContextType>({
  playClick: () => {},
});

export function ClickSoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [playSoftTap] = useSound("/sounds/soft-tap.wav", { volume: 0.35 });

  const playClick = () => {
    try {
      playSoftTap();
    } catch {
      // Audio playback fallback
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest("button, a, [role='button']");
      if (clickable) {
        playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [playSoftTap]);

  return (
    <ClickSoundContext.Provider value={{ playClick }}>
      {children}
    </ClickSoundContext.Provider>
  );
}

export function useClickSound() {
  return useContext(ClickSoundContext);
}
```

## Manual Trigger

If you need to fire the click sound programmatically (e.g. after a form submit, keyboard shortcut, or custom interaction), consume the context hook:

```tsx
import { useClickSound } from "@/components/click-sound-provider";

export function MyButton() {
  const { playClick } = useClickSound();

  return (
    <button onClick={playClick}>
      Do Something
    </button>
  );
}
```

## API Reference

### ClickSoundProvider

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | Yes | App subtree that gets automatic click sounds |

### useClickSound

Returns `{ playClick: () => void }` — call `playClick()` to trigger the sound imperatively.

## Customisation

| What | How |
| --- | --- |
| Sound file | Replace `/sounds/soft-tap.wav` in the `useSound` call |
| Volume | Adjust the `volume` option (default `0.35`, range `0`–`1`) |
| Target selector | Edit the `closest("button, a, [role='button']")` selector in `handleGlobalClick` |

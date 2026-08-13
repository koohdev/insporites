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

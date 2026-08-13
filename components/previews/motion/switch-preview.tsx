"use client";

import { useState } from "react";
import { useCardTheme } from "@/components/component-card";
import { Switch } from "@/components/motion/switch";
import { cn } from "@/lib/utils";

export function SwitchPreview() {
  const cardTheme = useCardTheme();
  const isDark = cardTheme === "dark";

  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4 gap-6", isDark ? "dark" : "")}>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          label="Enable push notifications"
        />
        <Switch
          checked={sound}
          onCheckedChange={setSound}
          label="Sound effects"
        />
        <Switch
          checked
          disabled
          onCheckedChange={() => {}}
          label="Disabled toggle"
        />
      </div>
    </div>
  );
}

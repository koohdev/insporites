"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Mobile Kinetic Scroll Fix: Guard resize events by width only
    // Viewport height shifts (address bar show/hide) must not break kinetic scroll
    let lastWidth = window.innerWidth;
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidth) return; // Ignore height shifts
      lastWidth = currentWidth;

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

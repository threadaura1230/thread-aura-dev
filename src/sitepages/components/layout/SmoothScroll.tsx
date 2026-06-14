"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth scroll on admin pages
    if (pathname?.startsWith("/admin")) {
      return;
    }

    // Initialize Lenis for smooth, human-like inertial scrolling
    const lenis = new Lenis({
      duration: 1.2, // More responsive scroll duration (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    // Reset scroll to top on path change
    window.scrollTo(0, 0);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}


"use client";

import { useEffect, useState } from "react";

/**
 * Viewport width, matching the breakpoints used by the source design
 * (`narrow` < 900, `mob` < 640). Starts at the design's 1280px reference so the
 * server render and first client render agree, then syncs on mount.
 */
export function useViewport() {
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { width, narrow: width < 900, mob: width < 640 };
}

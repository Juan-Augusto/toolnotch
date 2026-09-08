"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures that navigating between pages resets scroll to the top of the viewport.
 */
export default function AppScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

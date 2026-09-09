"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

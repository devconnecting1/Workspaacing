"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

export function ScrollReset() {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (lastPathname.current === pathname) {
      return;
    }

    lastPathname.current = pathname;

    const htmlElement = document.documentElement;
    const previousScrollBehavior = htmlElement.style.scrollBehavior;

    htmlElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    htmlElement.style.scrollBehavior = previousScrollBehavior;
  }, [pathname]);

  return null;
}

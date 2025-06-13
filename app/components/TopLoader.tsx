// components/TopLoader.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // Simulate slight delay for smooth transition
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 100); // adjust if needed

    return () => {
    //   clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}

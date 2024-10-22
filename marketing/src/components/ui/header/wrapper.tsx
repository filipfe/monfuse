"use client";

import { cn } from "@/utils/cn";
import { Fragment, useEffect, useState } from "react";

export default function Wrapper({ children }: { children: React.ReactNode[] }) {
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const onScroll = (_e: Event) => setIsDown(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Fragment>
      <div className={cn("px-6 py-4 bg-primary-dark")}>
        <div
          className={cn(
            "max-w-7xl mx-auto flex items-center justify-between h-14 rounded-lg px-1 border border-white/10 [&_nav>a]:text-white [&_a]:text-white bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]"
          )}
        >
          {children}
        </div>
      </div>
      <div
        className={cn(
          "px-6 fixed z-50 top-0 right-0 left-0 transition-transform",
          isDown ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div
          className={cn(
            "max-w-7xl bg-white shadow-lg shadow-primary-dark/10 [&_nav>a]:text-foreground [&_a]:text-foreground mx-auto flex items-center justify-between h-14 rounded-b-lg border bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] px-1"
          )}
        >
          {children}
        </div>
      </div>
    </Fragment>
  );
}

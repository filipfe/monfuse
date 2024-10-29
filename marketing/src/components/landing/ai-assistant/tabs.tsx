"use client";

import { Tabs } from "@/components/ui/tabs";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function AIAssistantTabs({ children }: { children: ReactNode }) {
  const timerRef = useRef<number | null>(null);
  const [tab, setTab] = useState<"context" | "message" | "response">("context");

  useEffect(() => {
    timerRef.current = window.setTimeout(
      () =>
        setTab((prev) =>
          prev === "context"
            ? "message"
            : prev === "message"
            ? "response"
            : "context"
        ),
      4000
    );
    return () => {
      timerRef.current && window.clearTimeout(timerRef.current);
    };
  }, [tab]);

  return (
    <Tabs
      className="mx-auto my-6 sm:my-12 h-full grid lg:grid-cols-[2fr_3fr] gap-10 items-center"
      value={tab}
      onValueChange={(value) =>
        setTab(value as "context" | "message" | "response")
      }
    >
      {children}
    </Tabs>
  );
}

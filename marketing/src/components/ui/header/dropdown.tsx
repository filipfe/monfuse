"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode, useRef, useState } from "react";
import { useFocusWithin } from "react-aria";

export default function DropdownLink({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: (e) => setIsExpanded(true),
    onBlurWithin: () => setIsExpanded(false),
  });
  return (
    <li
      {...focusWithinProps}
      className={cn("inline-block relative py-3 group")}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link
        className="text-sm font-medium px-6 py-3 peer"
        href="#"
        aria-haspopup="true"
        aria-expanded={isExpanded}
      >
        {title}
        <ChevronRight
          className={cn(
            "transition-transform inline-block ml-2 mb-0.5",
            isExpanded ? "rotate-90" : "rotate-0"
          )}
          size={12}
          strokeWidth={2}
        />
      </Link>
      <div
        className={cn(
          "min-w-max transition-all absolute top-full left-1/2 -translate-x-1/2",
          isExpanded
            ? // ? "group-hover:opacity-100 peer-focus:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto peer-focus:opacity-100 group-hover:pointer-events-auto"
              "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsExpanded(false)}
      >
        {children}
      </div>
    </li>
  );
}

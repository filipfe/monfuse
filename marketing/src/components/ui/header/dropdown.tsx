"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useFocusWithin } from "react-aria";

export default function DropdownLink({
  title,
  children,
  isMobile,
}: {
  title: string;
  children: ReactNode;
  isMobile?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: (e) => setIsExpanded(true),
    onBlurWithin: () => setIsExpanded(false),
  });
  return (
    <li
      {...(isMobile ? {} : focusWithinProps)}
      className={cn(
        "max-sm:my-2.5 sm:inline-block lg:relative sm:py-3 lg:group"
      )}
      {...(!isMobile
        ? {
            onMouseEnter: () => setIsExpanded(true),
            onMouseLeave: () => setIsExpanded(false),
          }
        : {})}
    >
      {isMobile ? (
        <h3>
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls="nav-menu"
            className="text-sm font-medium p-1 w-full peer flex items-center justify-between"
            onClick={() => setIsExpanded((prev) => !prev)}
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
          </button>
        </h3>
      ) : (
        <Link
          className="text-sm font-medium px-1 sm:px-3.5 lg:px-7 py-1 sm:py-3 peer flex items-center justify-between"
          href="#"
          aria-expanded={isExpanded}
          aria-haspopup="true"
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
      )}
      <div
        id="nav-menu"
        role="region"
        className={cn(
          "sm:min-w-max max-sm:grid transition-all sm:absolute sm:left-6 lg:left-0 sm:top-full sm:-translate-y-4 lg:translate-y-0 xl:left-1/2 xl:-translate-x-1/2",
          isExpanded
            ? // ? "group-hover:opacity-100 peer-focus:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto peer-focus:opacity-100 group-hover:pointer-events-auto"
              "grid-rows-[1fr] sm:opacity-100 sm:pointer-events-auto"
            : "grid-rows-[0fr] sm:opacity-0 sm:pointer-events-none"
        )}
        {...(isMobile
          ? focusWithinProps
          : { onClick: () => setIsExpanded(false) })}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </li>
  );
}

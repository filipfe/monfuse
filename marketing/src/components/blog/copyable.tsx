"use client";

import { useEffect, useRef, useState } from "react";

export default function Copyable({ content }: { content: string }) {
  const timerRef = useRef<number>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    timerRef.current = window.setTimeout(() => setCopied(false), 4000);
    return () => {
      timerRef.current && window.clearTimeout(timerRef.current);
    };
  }, [copied]);

  return (
    <span className="relative flex items-center max-w-max">
      <span className="block py-3 px-4 bg-light border pr-24 rounded-md">
        {content}
      </span>
      <button
        className="border h-8 w-8 rounded absolute right-2 grid place-content-center"
        onClick={() => {
          navigator.clipboard.writeText(content);
          setCopied(true);
        }}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-copy"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
        )}
      </button>
    </span>
  );
}

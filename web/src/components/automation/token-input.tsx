"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function TokenInput({
  token,
  dict,
}: {
  token: string;
  dict: { label: string };
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (!copied) return;
    timeout.current = window.setTimeout(() => setCopied(false), 5000);
    return () => {
      timeout.current && window.clearTimeout(timeout.current);
    };
  }, [copied]);

  return (
    <div className="relative flex items-center flex-1">
      <Input
        type="text"
        autoComplete="off"
        value={token}
        readOnly
        label={dict.label}
        onClick={() => navigator.clipboard.writeText(token)}
      />
      <Button
        size="icon"
        variant="outline"
        className="absolute right-2"
        onClick={() => {
          navigator.clipboard.writeText(token);
          setCopied(true);
        }}
      >
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      </Button>
    </div>
  );
}

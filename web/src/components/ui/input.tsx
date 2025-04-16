import * as React from "react";

import { cn } from "@/utils/cn";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex flex-col justify-center w-full rounded-md border bg-light px-3 py-1.5 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none md:text-sm",
          props.disabled && "opacity-50"
        )}
        htmlFor={props.id}
      >
        {label && (
          <span className="text-xs text-foreground/75 select-none pointer-events-none">
            {label}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "focus-visible:outline-none w-full bg-light file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // "flex h-9 w-full rounded-md border bg-light px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </label>
    );
  }
);
Input.displayName = "Input";

export { Input };

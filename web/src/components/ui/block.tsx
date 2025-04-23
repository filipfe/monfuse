import { cn } from "@/utils/cn";
import React, { HTMLAttributes } from "react";

type Props = {
  title?: string | React.ReactNode;
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mobileRadius?: boolean;
  hideTitleMobile?: boolean;
  description?: string;
  titleClassName?: string;
};

export default function Block({
  children,
  cta,
  className,
  mobileRadius,
  description,
  title,
  titleClassName,
  hideTitleMobile,
}: Props) {
  return (
    <div
      className={cn(
        "bg-white px-6 sm:px-10 gap-4 flex flex-col",
        title ? "pt-5 pb-6 sm:py-8" : "py-6 sm:py-8",
        className,
        mobileRadius
          ? "rounded-md border"
          : "border-y sm:border-x sm:rounded-md"
      )}
    >
      {title && (
        <div
          className={cn(
            "flex items-center gap-4 justify-between h-8",
            titleClassName
          )}
        >
          {typeof title === "string" ? (
            <h3
              className={`sm:text-lg text-base ${
                hideTitleMobile ? "hidden sm:block" : "block"
              }`}
            >
              {title}
            </h3>
          ) : (
            title
          )}
          {cta}
        </div>
      )}
      {description && (
        <p className="-mt-3 text-sm text-font/60">{description}</p>
      )}
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string;
  endContent?: React.ReactNode;
}

export function Section({
  title,
  className,
  children,
  wrapperClassName,
  endContent,
  ...props
}: SectionProps) {
  return (
    <div
      className={cn(
        "first:border-t-0 first:pt-0 border-t py-4 flex flex-col gap-4",
        wrapperClassName
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        {title && <h4 className="text-sm">{title}</h4>}
        {endContent}
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}

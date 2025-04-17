import { LucideIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "./button";
import { cn } from "@/utils/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: LucideIcon;
  cta?: {
    title: string;
    href: string;
    className?: string;
    onClick?: () => void;
  };
}

export default function Empty({ cta, icon: Icon, title, className }: Props) {
  return (
    <div
      className={cn(
        "text-center flex-1 col-span-full justify-center flex flex-col items-center gap-3",
        className
      )}
    >
      {Icon && <Icon size={20} className="text-font/60" />}
      {title && <p className="text-sm text-font/80">{title}</p>}
      {cta &&
        (cta.onClick ? (
          <Button
            variant="outline"
            size="sm"
            className={cta.className}
            onClick={cta.onClick}
          >
            <PlusIcon size={14} />
            {cta.title}
          </Button>
        ) : (
          <Button variant="outline" size="sm" className={cta.className} asChild>
            <Link href={cta.href}>{cta.title}</Link>
          </Button>
        ))}
    </div>
  );
}

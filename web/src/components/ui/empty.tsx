import { Button, cn } from "@nextui-org/react";
import { LucideIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";

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
            variant="flat"
            radius="md"
            size="sm"
            disableRipple
            startContent={<PlusIcon size={14} />}
            className={cn("bg-light border text-font", cta.className)}
            onPress={cta.onClick}
          >
            {cta.title}
          </Button>
        ) : (
          <Link href={cta.href}>
            <Button
              as="div"
              variant="flat"
              radius="md"
              size="sm"
              disableRipple
              startContent={<PlusIcon size={14} />}
              className={cn("bg-light border text-font", cta.className)}
            >
              {cta.title}
            </Button>
          </Link>
        ))}
    </div>
  );
}

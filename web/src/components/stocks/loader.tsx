import { Skeleton } from "@heroui/react";
import Block from "../ui/block";
import { ReactNode } from "react";

type Props = {
  title?: string;
  cta?: ReactNode;
  className?: string;
  records?: number;
};

export default function Loader({ title, cta, className, records = 4 }: Props) {
  return (
    <Block
      className={className}
      title={
        title || (
          <Skeleton className="h-6 sm:h-7 rounded-full w-full max-w-28" />
        )
      }
      cta={
        cta || <Skeleton className="h-4 sm:h-5 rounded-full w-full max-w-16" />
      }
    >
      <Skeleton className="h-8 sm:h-9 rounded-full w-full mb-4" />
      {Array.from(Array(records)).map((_, k) => (
        <Skeleton
          className={`h-4 sm:h-5 rounded-full w-full ${
            k > 4 ? "hidden sm:block" : ""
          }`}
          key={`loader-${k}`}
        />
      ))}
    </Block>
  );
}

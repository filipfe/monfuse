"use client";

import { useRef } from "react";
import useOutsideObserver from "@/hooks/useOutsideObserver";
import Menu from "./menu";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";
import { Progress } from "../ui/progress";

interface Props extends Pick<Settings, "language"> {
  dict: Dict["private"]["goals"]["list"]["goal"];
  goal: Goal;
}

export default function GoalRef({ dict, goal, language }: Props) {
  const { title, price, currency, deadline, total_paid } = goal;
  const formRef = useRef<HTMLFormElement>(null);

  useOutsideObserver(formRef, () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  );

  return (
    <div className="bg-primary rounded-lg max-h-max">
      <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col min-w-64 relative gap-1">
        <div className="absolute right-4 top-4">
          <Menu dict={dict.menu} goal={goal} />
        </div>
        <small className="text-white/60 text-tiny">
          {deadline
            ? new Intl.DateTimeFormat(language, {
                dateStyle: "short",
              }).format(new Date(deadline))
            : dict["no-deadline"]}
        </small>
        <h3 className="text-white font-medium leading-tight line-clamp-1 text-lg">
          {title}
        </h3>
        <div className="h-10 flex items-end">
          <strong className="text-3xl font-bold text-white">
            <NumberFormat
              currency={currency}
              language_code={language}
              amount={total_paid}
              notation="compact"
            />
          </strong>
          <sub className="mb-2 ml-1.5 text-white text-sm">
            /{" "}
            <NumberFormat
              currency={currency}
              language_code={language}
              amount={price}
              notation="compact"
            />
          </sub>
        </div>
        <div className="my-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[80%] text-white/60">{dict.collected}</span>
            <span className="text-[80%] text-white/80">
              {Math.floor((total_paid / price) * 100)}%
            </span>
          </div>
          <Progress
            variant="secondary"
            value={(total_paid / price) * 100}
            className="h-1 bg-white/40"
          />
        </div>
      </div>
    </div>
  );
}

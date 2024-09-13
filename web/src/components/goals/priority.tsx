"use client";

import { cn } from "@nextui-org/react";
import Block from "../ui/block";
import Empty from "../ui/empty";
import numberFormat from "@/utils/formatters/currency";

export default function Priority({ goal }: { goal?: Goal }) {
  const sum = goal
    ? goal.payments.reduce((prev, { amount }) => prev + amount, 0)
    : 0;

  const percentage = Math.min(Math.max(sum / (goal?.price || sum), 0), 1); // clamp percentage between 0 and 1
  // Arc properties
  const radius = 45; // radius of the semicircle
  const circumference = Math.PI * radius; // circumference of the full semicircle
  const offset = circumference * (1 - percentage);

  return (
    <Block title="Priorytet">
      {goal ? (
        <div className="relative w-full pb-[50%] overflow-visible">
          <svg
            viewBox="-5 -5 110 60" /* Expand viewBox to add padding around the edges */
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* <path
            d="M 5,50 A 45,45 0 0 1 95,50 L 95,50 Q 50,50 5,50 Z"
            className={
              percentage >= 0.5
                ? percentage >= 0.9
                  ? "fill-danger/10"
                  : "fill-warning/10"
                : "fill-primary/10"
            }
          /> */}
            {/* Background Circle (incomplete circle) */}
            <path
              d="M 5,50 A 45,45 0 0 1 95,50" /* Slightly adjust start and end points */
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8" /* Decrease stroke width */
              strokeLinecap="round" /* Make the background circle's edges rounded */
            />
            {/* Progress Circle */}
            <path
              d="M 5,50 A 45,45 0 0 1 95,50" /* Slightly adjust start and end points */
              fill="none"
              stroke="#177981"
              strokeWidth="8" /* Decrease stroke width */
              strokeLinecap="round" /* Make the progress circle's edges rounded */
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          {/* Text in the middle of the semicircle */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 flex flex-col items-center gap-3",
              percentage >= 0.9 && "text-danger"
            )}
          >
            <h3 className="text-2xl font-bold">{goal.title}</h3>
            <h5 className="text-sm font-medium text-center">
              {numberFormat(goal.currency, sum)} /{" "}
              {numberFormat(goal.currency, goal.price)}
            </h5>
            <h4 className="text-2xl font-bold">
              {Math.round(percentage * 100)}%
            </h4>
          </div>
        </div>
      ) : (
        <Empty title="Brak priorytetu" />
      )}
    </Block>
  );
}

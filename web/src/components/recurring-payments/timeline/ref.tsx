"use client";

import { Divider } from "@heroui/react";
import { useState } from "react";

type Props = {
  date: string;
  isToday: boolean;
  incomes: TimelinePayment[];
  expenses: TimelinePayment[];
};

export default function Ref({ date, isToday, incomes, expenses }: Props) {
  const day = new Date(date).getDate();
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    flipped: false,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const tooltipWidth = 160;

    const flipped = e.clientX + tooltipWidth > window.innerWidth;
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      flipped,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      flipped: false,
    });
  };

  return (
    <div
      className={`group cursor-pointer hover:bg-light flex flex-col items-center justify-end gap-2 p-2 rounded-lg h-full ${
        isToday && "bg-light border"
      }`}
      //   onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center justify-end gap-1">
        <div
          className={`flex items-center justify-center rounded-full bg-opacity-20 border-2 ${
            isToday ? "size-8" : "size-6 text-xs"
          } ${
            incomes.length > 0
              ? "bg-primary border-primary text-primary"
              : "bg-neutral-200 border-neutral-200 text-neutral-200"
          }  font-bold`}
        >
          {incomes.length}
        </div>
        <div
          className={`flex items-center justify-center rounded-full bg-opacity-20 border-2 ${
            isToday ? "size-8" : "size-6 text-xs"
          } ${
            expenses.length > 0
              ? "bg-secondary border-secondary text-secondary"
              : "bg-neutral-200 border-neutral-200 text-neutral-200"
          } font-bold`}
        >
          {expenses.length}
        </div>
      </div>
      <Divider className={isToday ? "w-14" : "w-10"} />
      <span
        className={
          isToday
            ? "font-bold"
            : "font-medium text-font/50 group-hover:text-font"
        }
      >
        {isToday ? "Today" : day}
      </span>
      {tooltip.visible && (
        <div
          className="absolute flex flex-col gap-2 p-3 rounded-md bg-white border-font/10 border min-w-44 shadow-lg shadow-font/5"
          style={{
            top: tooltip.y + 20,
            left: tooltip.flipped ? tooltip.x - 150 : tooltip.x + 10,
          }}
        >
          <strong>{date}</strong>
          <Divider />
          <div className="flex flex-col">
            <div>
              <span>{`Incomes: ${incomes.length}`}</span>
              {/* <div>
                {incomes.map((payment) => (
                  <div className="flex flex-col">
                    <span>{payment.title}</span>
                    <span>
                      {payment.amount} {payment.currency}
                    </span>
                  </div>
                ))}
              </div> */}
            </div>
            <div>
              <span>{`Expenses: ${expenses.length}`}</span>
              {/* <div>
                {expenses.map((payment) => (
                  <div className="flex flex-col">
                    <span>{payment.title}</span>
                    <span>
                      {payment.amount} {payment.currency}
                    </span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

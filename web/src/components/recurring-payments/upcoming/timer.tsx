"use client";

import { useUpcomingPayments } from "@/lib/recurring-payments/queries";
import dateFormat from "@/utils/formatters/dateFormat";
import { intervalToDuration } from "date-fns";
import { useEffect, useRef, useState } from "react";

function getTimeRemaining(datetime: string, timezone: string) {
  const nowInTimezone = dateFormat(new Date(), timezone);
  const targetDateInTimezone = dateFormat(datetime, timezone);

  const now = new Date(nowInTimezone).getTime();
  const target = new Date(targetDateInTimezone).getTime();

  const timeDiff = target - now;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = String(Math.floor((timeDiff / (1000 * 60 * 60)) % 24)).padStart(
    2,
    "0"
  );
  const minutes = String(Math.floor((timeDiff / 1000 / 60) % 60)).padStart(
    2,
    "0"
  );

  return { days, hours, minutes };
}

type Props = {
  timezone: string;
  paymentDatetime: string;
};

export default function Timer({ timezone, paymentDatetime }: Props) {
  const timeoutRef = useRef<number>();
  console.log(paymentDatetime);
  const { mutate } = useUpcomingPayments(timezone);
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(paymentDatetime, timezone)
    // intervalToDuration()
  );

  useEffect(() => {
    if (timeRemaining.days < 0) {
      mutate();
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      const updatedTime = getTimeRemaining(paymentDatetime, timezone);
      setTimeRemaining(updatedTime);
    }, 60000);

    return () => {
      timeoutRef.current && window.clearTimeout(timeoutRef.current);
    };
  }, [paymentDatetime, timeRemaining.minutes]);

  const renderTimeUnit = (value: string | number, unit: string) => (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="border-1 bg-light rounded-md w-full h-12 grid place-content-center">
        <span>{value}</span>
      </div>
      <span className="text-sm text-font/75">{unit}</span>
    </div>
  );

  return (
    <div className="flex items-start gap-2 w-full">
      {renderTimeUnit(timeRemaining.days, "days")}
      <span className="relative top-3">:</span>
      {renderTimeUnit(timeRemaining.hours, "hours")}
      <span className="relative top-3">:</span>
      {renderTimeUnit(timeRemaining.minutes, "minutes")}
    </div>
  );
}

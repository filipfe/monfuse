"use client";

import { Dict } from "@/const/dict";
import { useUpcomingPayments } from "@/lib/recurring-payments/queries";
import dateFormat from "@/utils/formatters/dateFormat";
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
  dict: Dict["private"]["operations"]["recurring-payments"]["upcoming"]["timer"];
};

export default function Timer({ timezone, paymentDatetime, dict }: Props) {
  const timeoutRef = useRef<number>(undefined);
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
    <div className="border bg-white rounded-md w-full h-12 flex items-center justify-center flex-1 gap-1">
      <span>{value}</span>
      <span className="text-xs text-font/50 mt-0.5">
        {dict[unit as keyof typeof dict]}
      </span>
    </div>
  );

  return (
    <div className="flex items-start gap-2 w-full">
      {timeRemaining.days > 0 && (
        <>
          {renderTimeUnit(timeRemaining.days, "days")}
          <span className="relative top-3">:</span>
        </>
      )}
      {renderTimeUnit(timeRemaining.hours, "hours")}
      {timeRemaining.days === 0 && (
        <>
          <span className="relative top-3">:</span>
          {renderTimeUnit(timeRemaining.minutes, "minutes")}
        </>
      )}
    </div>
  );
}

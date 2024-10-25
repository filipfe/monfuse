"use client";

import dateFormat from "@/utils/formatters/dateFormat";
import { useEffect, useState } from "react";

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
  const seconds = String(Math.floor((timeDiff / 1000) % 60)).padStart(2, "0");

  return { days, hours, minutes, seconds };
}

type Props = {
  timezone: string;
  paymentDatetime: string;
  onExpire: () => void;
};

export default function Timer({ timezone, paymentDatetime, onExpire }: Props) {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(paymentDatetime, timezone)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTime = getTimeRemaining(paymentDatetime, timezone);
      setTimeRemaining(updatedTime);

      if (timeRemaining.days < 0) {
        clearInterval(intervalId);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [paymentDatetime]);

  const renderTimeUnit = (unit: string | number) => {
    return <span className="border-1 bg-light rounded-md p-0.5">{unit}</span>;
  };

  return (
    <strong>
      {renderTimeUnit(timeRemaining.days)}:{renderTimeUnit(timeRemaining.hours)}
      :{renderTimeUnit(timeRemaining.minutes)}:
      {renderTimeUnit(timeRemaining.seconds)}
    </strong>
  );
}

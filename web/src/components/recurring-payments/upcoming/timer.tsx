"use client";

import { useEffect, useState } from "react";

function getTimeRemaining(paymentDate: Date) {
  const now = new Date().getTime();
  const timeDiff = new Date(paymentDate).getTime() - now;

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

export default function Timer({ paymentDate }: { paymentDate: string }) {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(new Date(paymentDate))
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining(new Date(paymentDate)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [paymentDate]);

  if (timeRemaining.days < 0) {
    return <span>Payment date passed</span>;
  }

  return (
    <strong>
      {timeRemaining.days}:{timeRemaining.hours}:{timeRemaining.minutes}:
      {timeRemaining.seconds}
    </strong>
  );
}

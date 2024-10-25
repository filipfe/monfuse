"use client";

import Block from "@/components/ui/block";
import { getUpcomingPayments } from "@/lib/recurring-payments/actions";
import Timer from "./timer";
import Ref from "./ref";
import Empty from "@/components/ui/empty";
import { useEffect, useState } from "react";

export default function Upcoming({ timezone }: { timezone: string }) {
  const [payments, setPayments] = useState<UpcomingPayment[]>([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const fetchPayments = async () => {
    const { results } = await getUpcomingPayments(timezone);
    setPayments(results);
    setRefreshKey(Date.now());
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Block title="Nadchodzące" className="row-span-1">
      {payments.length > 0 ? (
        <div className="flex">
          {payments.map((payment) => (
            <div
              key={`${payment.id}-${refreshKey}`}
              className="flex flex-col gap-2 max-w-1/3 w-1/3"
            >
              <Timer
                timezone={timezone}
                paymentDatetime={payment.payment_datetime}
                onExpire={fetchPayments}
              />
              <Ref payment={payment} />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="Brak nadchodzących płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )}
    </Block>
  );
}

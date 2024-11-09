"use client";

import Block from "@/components/ui/block";
import Ref from "./ref";
import { useUpcomingPayments } from "@/lib/recurring-payments/queries";
import Empty from "@/components/ui/empty";
import { Coins } from "lucide-react";
import { Dict } from "@/const/dict";

export default function Upcoming({
  timezone,
  dict,
}: {
  timezone: string;
  dict: Dict["private"]["operations"]["recurring-payments"]["upcoming"];
}) {
  const { data: payments } = useUpcomingPayments(timezone);

  return (
    <Block title={dict.title} className="2xl:min-h-48">
      <div className="flex flex-col lg:grid grid-cols-3">
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <Ref
              dict={dict.timer}
              timezone={timezone}
              payment={payment}
              key={payment.id}
            />
          ))
        ) : (
          <Empty icon={Coins} title="Brak nadchodzących płatności!" />
        )}
      </div>
    </Block>
    // <Block title="Nadchodzące" className="row-span-1">
    //   {payments.length > 0 ? (
    //     <div className="flex">
    //       {payments.map((payment) => (
    //         <div
    //           key={`${payment.id}-${refreshKey}`}
    //           className="flex flex-col gap-2 max-w-1/3 w-1/3"
    //         >
    //           <Timer
    //             timezone={timezone}
    //             paymentDatetime={payment.payment_datetime}
    //             onExpire={fetchPayments}
    //           />
    //           <Ref payment={payment} />
    //         </div>
    //       ))}
    //     </div>
    //   ) : (
    //     <Empty
    //       title="Brak nadchodzących płatności!"
    //       cta={{
    //         title: "Dodaj płatność cykliczną",
    //         href: "/recurring-payments/add",
    //       }}
    //     />
    //   )}
    // </Block>
  );
}

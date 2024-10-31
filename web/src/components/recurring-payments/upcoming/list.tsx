"use client";

import Block from "@/components/ui/block";
import Ref from "./ref";
import { useUpcomingPayments } from "@/lib/recurring-payments/queries";
import Empty from "@/components/ui/empty";
import { Coins } from "lucide-react";

export default function Upcoming({ timezone }: { timezone: string }) {
  const { data: payments } = useUpcomingPayments(timezone);

  return (
    <Block title="Nadchodzące" className="2xl:min-h-48">
      <div className="flex flex-col lg:grid grid-cols-3">
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <Ref timezone={timezone} payment={payment} key={payment.id} />
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

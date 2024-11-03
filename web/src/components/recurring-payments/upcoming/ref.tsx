import NumberFormat from "@/utils/formatters/currency";
import { Coins, Wallet2 } from "lucide-react";
import Timer from "./timer";

export default function Ref({
  payment,
  timezone,
}: {
  payment: UpcomingPayment;
  timezone: string;
}) {
  return (
    <div className="flex flex-col gap-2 items-center py-6 border-b last:border-b-0 first:pt-0 lg:py-0 last:pb-0 lg:border-b-0 lg:px-6 first:pl-0 last:pr-0 lg:border-r last:border-0">
      <span className="text-sm text-font/75 truncate">{payment.title}</span>
      <strong className="flex items-center gap-2">
        {payment.type === "income" ? (
          <Wallet2 size={14} color="#177981" />
        ) : (
          <Coins size={14} color="#fdbb2d" />
        )}{" "}
        <NumberFormat
          amount={payment.amount}
          currency={payment.currency}
          signDisplay="always"
        />
      </strong>
      <Timer timezone={timezone} paymentDatetime={payment.payment_datetime} />
    </div>
  );
}

import NumberFormat from "@/utils/formatters/currency";
import { Coins, Wallet2 } from "lucide-react";
import Timer from "./timer";
import { Dict } from "@/const/dict";

export default function Ref({
  payment,
  timezone,
  dict,
}: {
  payment: UpcomingPayment;
  timezone: string;
  dict: Dict["private"]["operations"]["recurring-payments"]["upcoming"]["timer"];
}) {
  return (
    <div className="flex flex-col bg-light border rounded-md gap-2 items-center py-4 px-6">
      <h5 className="text-sm text-font/75 truncate flex items-center gap-2">
        {payment.type === "income" ? (
          <Wallet2 size={14} color="#177981" />
        ) : (
          <Coins size={14} color="#fdbb2d" />
        )}{" "}
        {payment.title}
      </h5>
      <strong className="flex items-center gap-2 mb-2">
        <NumberFormat
          amount={
            payment.type === "income" ? payment.amount : -1 * payment.amount
          }
          currency={payment.currency}
          signDisplay="always"
        />
      </strong>
      <Timer
        dict={dict}
        timezone={timezone}
        paymentDatetime={payment.payment_datetime}
      />
    </div>
  );
}

import { toZonedTime } from "date-fns-tz";
import { Coins, MoreVertical, Wallet2 } from "lucide-react";
import Dropdown from "./dropdown";
import NumberFormat from "@/utils/formatters/currency";

export default async function Ref({
  payment,
  settings,
}: {
  payment: Payment;
  settings: Settings;
}) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b last:border-b-0">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-font/75 truncate">{payment.title}</span>
        <strong className="flex items-center gap-2">
          {payment.type === "income" ? (
            <Wallet2 size={14} color="#177981" />
          ) : (
            <Coins size={14} color="#fdbb2d" />
          )}{" "}
          <NumberFormat
            amount={
              payment.type === "income" ? payment.amount : -1 * payment.amount
            }
            currency={payment.currency}
            signDisplay="always"
          />
        </strong>
      </div>
      {/* <div className="flex items-center gap-2"> */}
      <span className="text-sm text-font/60">
        {new Intl.DateTimeFormat(settings.language, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(toZonedTime(payment.issued_at, settings.timezone))}
      </span>
      {/* <Dropdown {...payment} /> */}
      {/* </div> */}
    </div>
  );
}

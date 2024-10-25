import { Divider } from "@nextui-org/react";
import { formatDistance } from "date-fns";
import { Coins, Wallet2 } from "lucide-react";
import * as locales from "date-fns/locale";
import dateFormat from "@/utils/formatters/dateFormat";

export default async function Ref({ payment }: { payment: Payment }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-font/50 truncate">{payment.title}</span>
          <strong className="flex items-center gap-1">
            {payment.type === "income" ? (
              <Wallet2 size={14} color="#177981" />
            ) : (
              <Coins size={14} color="#fdbb2d" />
            )}{" "}
            {payment.type === "income" ? "+" : "-"}
            {payment.amount} {payment.currency}
          </strong>
        </div>
        <span>
          {formatDistance(payment.issued_at, dateFormat(new Date(), "UTC"), {
            addSuffix: true,
            locale: locales["en" as keyof typeof locales],
            includeSeconds: false,
          })}
        </span>
      </div>
      <Divider />
    </div>
  );
}

import { Coins, Wallet2 } from "lucide-react";

export default async function Ref({
  payment,
}: {
  payment: TimelinePayment & { type: "income" | "expense" };
}) {
  return (
    <li className="flex flex-col">
      <span className="text-sm text-font/50">{payment.title}</span>
      <span className="flex items-center gap-1">
        {payment.type === "income" ? (
          <Wallet2 size={14} color="#177981" />
        ) : (
          <Coins size={14} color="#fdbb2d" />
        )}{" "}
        {payment.amount} {payment.currency}
      </span>
    </li>
  );
}

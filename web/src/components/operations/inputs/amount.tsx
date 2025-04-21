import { Input } from "@/components/ui/input";
import formatAmount from "@/utils/operations/format-amount";
import { useState } from "react";

type Props = {
  label: string;
  defaultValue?: string;
};

export default function AmountInput({ label, defaultValue }: Props) {
  const [amount, setAmount] = useState(defaultValue || "");

  return (
    <Input
      name="amount"
      label={label}
      placeholder="0.00"
      required
      value={amount}
      onBlur={(e) => {
        const float = parseFloat(amount);
        if (!isNaN(float)) {
          setAmount(float == 0 ? "" : float.toString());
        }
      }}
      onChange={(e) => setAmount(formatAmount(e.target.value))}
    />
  );
}

"use client";

import formatAmount from "@/utils/operations/format-amount";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import { addGoalPayment } from "@/lib/goals/actions";
import NumberFormat from "@/utils/formatters/currency";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dict } from "@/const/dict";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { addGoalPayment } from "@/lib/goals/queries";

type Props = {
  goal: Goal;
  paid: number;
  dict: Dict["private"]["goals"]["payments"]["form"];
};

export default function PaymentPopover({ goal, paid, dict }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(paid.toString());

  function onOpenChange(open: boolean) {
    if (open || !inputValue || inputValue === paid.toString()) return;
    const amount = parseFloat(inputValue);
    if (goal.total_paid - paid + amount > goal.price) {
      toast.custom((t) => (
        <Toast {...t} type="error" message="Kwota przekracza cenę celu!" />
      ));
      setInputValue(paid.toString());
      return;
    }
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  }

  const onSubmit = (formData: FormData) =>
    startTransition(async () => {
      const { error } = await addGoalPayment(formData);
      if (error) {
        toast.custom((t) => (
          <Toast {...t} type="error" message={dict._error} />
        ));
      } else {
        toast.custom((t) => (
          <Toast {...t} type="success" message={dict._success} />
        ));
      }
    });

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className="w-full bg-light border rounded-md px-4 py-2">
          <NumberFormat
            currency={goal.currency}
            amount={parseFloat(inputValue)}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <form ref={formRef} action={onSubmit}>
          <AmountInput
            max={goal.price - goal.total_paid + paid}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            dict={dict.amount}
          />
          <input type="hidden" name="goal_id" value={goal.id} />
          <input type="hidden" name="amount" value={inputValue} />
        </form>
      </PopoverContent>
    </Popover>
  );
}

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  max: number;
  dict: {
    label: string;
  };
};

const AmountInput = ({ value, onChange, dict, max }: InputProps) => {
  return (
    <div className="flex items-center relative">
      <Input
        autoFocus
        label={dict.label}
        name="amount"
        value={value}
        onChange={(e) => {
          const formattedAmount = formatAmount(e.target.value);
          if (parseFloat(formattedAmount) > max) return;
          onChange(formattedAmount);
        }}
      />
      <Button
        size="sm"
        className="absolute right-2 min-w-12 z-10"
        onClick={() => onChange(formatAmount(max.toString()))}
      >
        100%
      </Button>
    </div>
  );
};

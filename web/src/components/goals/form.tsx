"use client";

import formatAmount from "@/utils/operations/format-amount";
import { useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block from "../ui/block";
import Toast from "../ui/toast";
import { addGoal } from "@/lib/goals/actions";
import { Button } from "../ui/button";
import { Hatch } from "ldrs/react";
import { Input } from "../ui/input";
import { Dict } from "@/const/dict";

interface NewGoal
  extends Omit<
    Goal,
    "id" | "total_paid" | "price" | "total_paid" | "is_priority"
  > {
  price: string;
}

const defaultRecord: NewGoal = {
  title: "",
  price: "",
  currency: "",
};

type Props = {
  defaultCurrency: Settings["currency"];
  dict: Dict["private"]["goals"]["add"];
};

export default function GoalForm({ defaultCurrency, dict }: Props) {
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewGoal>({
    ...defaultRecord,
    currency: defaultCurrency,
  });

  return (
    <Block title={dict.title} className="w-full max-w-2xl">
      <form
        action={(formData) =>
          startTransition(async () => {
            const { error } = await addGoal(formData);
            if (error) {
              toast.custom((t) => (
                <Toast {...t} type="error" message={dict.form._error} />
              ));
            }
          })
        }
        className="flex flex-col md:grid grid-cols-2 gap-4"
      >
        <Input
          name="title"
          label={dict.form.title.label}
          placeholder={dict.form.title.placeholder}
          required
          value={singleRecord.title}
          onChange={(e) =>
            setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          name="amount"
          label={dict.form.amount.label}
          placeholder="0.00"
          required
          value={singleRecord.price}
          onBlur={(_) => {
            const value = parseFloat(singleRecord.price);
            !isNaN(value) &&
              setSingleRecord((prev) => ({
                ...prev,
                price: value === 0 ? "" : value.toString(),
              }));
          }}
          onChange={(e) => {
            setSingleRecord((prev) => ({
              ...prev,
              price: formatAmount(e.target.value),
            }));
          }}
        />
        <UniversalSelect
          name="currency"
          required
          label={dict.form.currency.label}
          value={singleRecord.currency}
          elements={CURRENCIES}
          onValueChange={(value) => {
            setSingleRecord((prev) => ({
              ...prev,
              currency: value,
            }));
          }}
        />
        <Input
          name="deadline"
          label={dict.form.deadline.label}
          type="date"
          value={singleRecord.deadline}
          onChange={(e) =>
            setSingleRecord((prev) => ({
              ...prev,
              deadline: e.target.value,
            }))
          }
        />
        {/* <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="description"
          label="Opis"
          placeholder="Miejsce zamieszkania"
          value={singleRecord.description}
          onChange={(e) =>
            setSingleRecord((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        /> */}
        <div className="col-span-2 flex justify-end mt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Hatch size={12} stroke={1.5} color="#FFF" />
            ) : (
              <CheckIcon size={16} />
            )}
            {dict.form._submit}
          </Button>
        </div>
        <input type="hidden" value={JSON.stringify(singleRecord)} name="data" />
        <input type="hidden" value="goal" name="type" />
      </form>
    </Block>
  );
}

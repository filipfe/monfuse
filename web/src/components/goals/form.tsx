"use client";

import { Button, Input, Spinner } from "@heroui/react";
import formatAmount from "@/utils/operations/format-amount";
import { useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block from "../ui/block";
import Toast from "../ui/toast";
import { addGoal } from "@/lib/goals/actions";

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

export default function GoalForm({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewGoal>({
    ...defaultRecord,
    currency: defaultCurrency,
  });

  return (
    <Block title="Nowy cel" className="w-full max-w-2xl">
      <form
        action={(formData) =>
          startTransition(async () => {
            const { error } = await addGoal(formData);
            if (error) {
              toast.custom((t) => (
                <Toast
                  {...t}
                  type="error"
                  message="Wystąpił błąd przy dodawaniu celu"
                />
              ));
            }
          })
        }
        className="flex flex-col md:grid grid-cols-2 gap-4"
      >
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="title"
          label="Tytuł"
          placeholder="Mieszkanie"
          isRequired
          value={singleRecord.title}
          onChange={(e) =>
            setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="amount"
          label="Kwota"
          placeholder="0.00"
          isRequired
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
          label="Waluta"
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
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="deadline"
          label="Termin ostateczny"
          placeholder="24.01.2024"
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
          <Button color="primary" type="submit" isDisabled={isPending}>
            {isPending ? (
              <Spinner color="white" size="sm" />
            ) : (
              <CheckIcon size={16} />
            )}
            Zapisz
          </Button>
        </div>
        <input type="hidden" value={JSON.stringify(singleRecord)} name="data" />
        <input type="hidden" value="goal" name="type" />
      </form>
    </Block>
  );
}

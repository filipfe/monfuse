import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { Input, Textarea } from "@nextui-org/react";
import LabelInput from "./label";
import AmountInput from "./amount";
import { format, parseISO } from "date-fns";
import { Dict } from "@/const/dict";
import { useSettings } from "@/lib/general/queries";
import { toZonedTime } from "date-fns-tz";

interface Props {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"]["modal"]["edit"]["form"];
  type: OperationType;
  initialValue?: Operation;
  defaultCurrency?: string;
  withLabel?: boolean;
}

export default function Manual({
  dict,
  type,
  initialValue,
  defaultCurrency,
  withLabel,
}: Props) {
  const { data: settings } = useSettings();
  const currency = initialValue?.currency || defaultCurrency;

  const issuedAtDate = initialValue?.issued_at
    ? parseISO(initialValue.issued_at)
    : new Date();
  const zonedDate = toZonedTime(issuedAtDate, settings?.timezone || "UTC");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          className="col-span-2 md:col-span-1"
          classNames={{ inputWrapper: "!bg-light border shadow-none" }}
          name="title"
          label={dict.title.label}
          placeholder={dict.title.placeholder}
          isRequired
          required
          defaultValue={initialValue?.title}
        />
        <AmountInput
          label={dict.amount.label}
          defaultValue={initialValue?.amount}
        />
        <UniversalSelect
          name="currency"
          label={dict.currency.label}
          elements={CURRENCIES}
          required
          isRequired
          defaultSelectedKeys={currency ? [currency] : []}
        />
        <Input
          className="col-span-2 md:col-span-1"
          classNames={{ inputWrapper: "!bg-light border shadow-none" }}
          name="issued_at"
          label={dict["issued-at"].label}
          placeholder="24.01.2024"
          type="date"
          defaultValue={format(zonedDate, "yyyy-MM-dd")}
        />
        {/* <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light border shadow-none" }}
          name="description"
          label="Opis"
          placeholder="Wynagrodzenie za luty"
          defaultValue={initialValue?.description}
        /> */}
        {type === "expense" && withLabel && (
          <div className="w-full col-span-2">
            <LabelInput
              dict={dict.label}
              className="border shadow-none"
              defaultValue={initialValue?.label}
            />
          </div>
        )}
      </div>
      <input type="hidden" name="type" value={type} />
      {initialValue && (
        <input type="hidden" name="id" value={initialValue.id} />
      )}
    </>
  );
}

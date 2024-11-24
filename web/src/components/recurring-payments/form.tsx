"use client";

import {
  Button,
  DateInput,
  Input,
  Spinner,
  TimeInput,
} from "@nextui-org/react";
import formatAmount from "@/utils/operations/format-amount";
import { useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block, { Section } from "../ui/block";
import { format } from "date-fns";
import toast from "@/utils/toast";
import { addRecurringPayment } from "@/lib/recurring-payments/actions";
import { CalendarDate, parseDate, parseTime } from "@internationalized/date";
import { useSearchParams } from "next/navigation";
import { Dict } from "@/const/dict";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

interface NewRecurringPayment
  extends Partial<Omit<TimelinePayment, "id" | "amount">> {
  amount: string;
  type?: "income" | "expense";
  start_date: CalendarDate;
  interval_amount: string;
  interval_unit: string;
}

const defaultRecord: Omit<NewRecurringPayment, "currency"> = {
  title: "",
  amount: "",
  start_date: parseDate(format(tomorrow, "yyyy-MM-dd")),
  interval_amount: "1",
  interval_unit: "month",
};

const getInitialDate = (str: string | null) => {
  if (!str) return defaultRecord.start_date;
  try {
    return parseDate(str);
  } catch (err) {
    return defaultRecord.start_date;
  }
};

export default function RecurringPaymentForm({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"]["add"];
}) {
  const searchParams = useSearchParams();
  const [hour, setHour] = useState(0);
  const initialDate = searchParams.get("date");
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewRecurringPayment>({
    ...defaultRecord,
    currency: settings.currency,
    start_date: getInitialDate(initialDate),
  });
  const [isStartTimeInvalid, setIsStartTimeInvalid] = useState(false);

  return (
    <Block title={dict.title} className="w-full max-w-4xl">
      <form
        action={(formData) =>
          startTransition(async () => {
            if (!singleRecord.start_date) return setIsStartTimeInvalid(true);
            const res = await addRecurringPayment(formData);
            if (res?.error) {
              toast({
                type: "error",
                message: dict._error,
              });
            }
          })
        }
      >
        <Section
          title={dict.data.title}
          className="flex flex-col md:grid grid-cols-2 gap-4"
          wrapperClassName="pb-6"
        >
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="title"
            label={dict.data.form.title.label}
            placeholder={dict.data.form.title.placeholder}
            isRequired
            required
            value={singleRecord.title}
            onChange={(e) =>
              setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="amount"
            label={dict.data.form.amount.label}
            placeholder={dict.data.form.amount.placeholder}
            isRequired
            required
            value={singleRecord.amount}
            onBlur={(_) => {
              const value = parseFloat(singleRecord.amount);
              !isNaN(value) &&
                setSingleRecord((prev) => ({
                  ...prev,
                  amount: value === 0 ? "" : value.toString(),
                }));
            }}
            onChange={(e) => {
              setSingleRecord((prev) => ({
                ...prev,
                amount: formatAmount(e.target.value),
              }));
            }}
          />
          <UniversalSelect
            name="currency"
            label={dict.data.form.currency.label}
            placeholder={dict.data.form.currency.placeholder}
            required
            isRequired
            selectedKeys={singleRecord.currency ? [singleRecord.currency] : []}
            elements={CURRENCIES}
            disallowEmptySelection
            onChange={(e) =>
              setSingleRecord((prev) => ({ ...prev, currency: e.target.value }))
            }
          />
          <UniversalSelect
            name="type"
            label={dict.data.form.type.label}
            placeholder={dict.data.form.type.placeholder}
            isRequired
            required
            selectedKeys={singleRecord.type ? [singleRecord.type] : []}
            elements={[
              { name: "Przychód", value: "income" },
              { name: "Wydatek", value: "expense" },
            ]}
            disallowEmptySelection
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                type: e.target.value as "income" | "expense",
              }))
            }
          />
        </Section>
        <Section
          title={dict.interval.title}
          className="grid grid-cols-[88px_1fr_112px] gap-4"
        >
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="interval_amount"
            label={dict.interval.form.amount.label}
            placeholder="1"
            isRequired
            required
            value={singleRecord.interval_amount}
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                interval_amount: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
          <div className="col-span-2">
            <UniversalSelect
              name="interval_unit"
              label={dict.interval.form.unit.label}
              isRequired
              required
              selectedKeys={
                singleRecord.interval_unit ? [singleRecord.interval_unit] : []
              }
              elements={[
                { name: dict.interval.form.unit.options.day, value: "day" },
                { name: dict.interval.form.unit.options.week, value: "week" },
                { name: dict.interval.form.unit.options.month, value: "month" },
              ]}
              placeholder={dict.interval.form.unit.placeholder}
              disallowEmptySelection
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  interval_unit: e.target.value,
                }))
              }
            />
          </div>
          <DateInput
            granularity="day"
            className="col-span-2"
            classNames={{
              inputWrapper: "!bg-light shadow-none border",
              segment:
                "focus:border-font focus:shadow-none focus:bg-transparent rounded-none border-b border-transparent",
            }}
            isRequired
            isInvalid={isStartTimeInvalid || undefined}
            label={dict.interval.form.date.label}
            value={singleRecord.start_date}
            minValue={parseDate(format(tomorrow, "yyyy-MM-dd"))}
            onChange={(date) => {
              setIsStartTimeInvalid(false);
              date &&
                setSingleRecord((prev) => ({ ...prev, start_date: date }));
            }}
          />
          <TimeInput
            label={dict.interval.form.hour.label}
            value={parseTime(`${hour < 10 ? "0" + hour : hour}:00`)}
            hourCycle={24}
            onChange={(value) => setHour(value.hour)}
            classNames={{
              inputWrapper: "border shadow-none !bg-light",
              segment:
                "focus:border-font focus:shadow-none focus:bg-transparent rounded-none border-b border-transparent",
            }}
          />
          {/* TODO: replace with the actual input */}
          <input
            type="hidden"
            name="interval_amount"
            value={singleRecord.interval_amount}
          />
          <input
            type="hidden"
            name="start_datetime"
            value={`${singleRecord.start_date.year}-${singleRecord.start_date.month}-${singleRecord.start_date.day}T${hour}:00:00Z`}
          />
        </Section>
        <div className="col-span-2 flex justify-end mt-4">
          <Button
            disableRipple
            color="primary"
            type="submit"
            isDisabled={isPending}
          >
            {isPending ? (
              <Spinner color="white" size="sm" />
            ) : (
              <CheckIcon size={16} />
            )}
            {dict._submit}
          </Button>
        </div>
      </form>
    </Block>
  );
}

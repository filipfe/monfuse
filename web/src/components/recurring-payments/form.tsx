"use client";

import { Button, DateInput, Input, Spinner, TimeInput } from "@heroui/react";
import formatAmount from "@/utils/operations/format-amount";
import { useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block, { Section } from "../ui/block";
import toast from "@/utils/toast";
import { addRecurringPayment } from "@/lib/recurring-payments/actions";
import {
  CalendarDate,
  now,
  parseDate,
  parseTime,
} from "@internationalized/date";
import { useSearchParams } from "next/navigation";
import { Dict } from "@/const/dict";
import Link from "next/link";
import { useTimezoneSelect } from "react-timezone-select";

interface NewRecurringPayment
  extends Partial<Omit<TimelinePayment, "id" | "amount">> {
  amount: string;
  type?: "income" | "expense";
  start_date: CalendarDate;
  interval_amount: string;
  interval_unit: string;
}

const isDateTimeValid = (
  date: CalendarDate,
  hour: number,
  timezone: string
) => {
  const nowDateTime = now(timezone);

  if (date.year < nowDateTime.year) return false;

  if (date.year === nowDateTime.year && date.month < nowDateTime.month)
    return false;

  if (
    date.year === nowDateTime.year &&
    date.month === nowDateTime.month &&
    date.day < nowDateTime.day
  )
    return false;

  if (
    date.year === nowDateTime.year &&
    date.month === nowDateTime.month &&
    date.day === nowDateTime.day &&
    hour < nowDateTime.hour
  )
    return false;

  return true;
};

export default function RecurringPaymentForm({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"]["add"];
}) {
  const { parseTimezone } = useTimezoneSelect({});
  const { offset } = parseTimezone(settings.timezone);
  const today = now(settings.timezone);
  const defaultStartDate =
    today.hour === 23
      ? new CalendarDate(today.year, today.month, today.day + 1)
      : new CalendarDate(today.year, today.month, today.day);
  const searchParams = useSearchParams();
  const [hour, setHour] = useState(today.hour === 23 ? 0 : today.hour + 1);
  const initialDate = searchParams.get("date");
  const [isPending, startTransition] = useTransition();
  const defaultRecord: Omit<NewRecurringPayment, "currency"> = {
    title: "",
    amount: "",
    start_date: defaultStartDate,
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
  const [singleRecord, setSingleRecord] = useState<NewRecurringPayment>({
    ...defaultRecord,
    currency: settings.currency,
    start_date: getInitialDate(initialDate),
  });
  const [isStartTimeInvalid, setIsStartTimeInvalid] = useState(false);

  return (
    <Block title={dict.title} className="w-full max-w-3xl">
      <form
        action={(formData) => {
          if (
            !singleRecord.start_date ||
            !isDateTimeValid(singleRecord.start_date, hour, settings.timezone)
          )
            return setIsStartTimeInvalid(true);
          startTransition(async () => {
            const res = await addRecurringPayment(formData);
            if (res?.error) {
              toast({
                type: "error",
                message: dict._error,
              });
            }
          });
        }}
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
          endContent={
            <p className="text-sm">
              {typeof offset === "number" && (
                <span className="text-font/75">
                  GMT
                  {new Intl.NumberFormat(settings.language, {
                    signDisplay: "always",
                  }).format(offset)}
                </span>
              )}{" "}
              <Link
                className="font-medium text-primary underline ml-2"
                href="/settings/preferences"
              >
                {dict.interval["change-timezone"].link}
              </Link>
            </p>
          }
          className="grid grid-cols-[88px_2fr_1fr] gap-4"
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
            minValue={defaultStartDate}
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
            minValue={parseTime(
              `${
                today.hour + 1 < 10
                  ? `0${today.hour + 1}`
                  : today.hour === 23
                  ? "00"
                  : today.hour + 1
              }:00`
            )}
            onChange={(value) => value && setHour(value.hour)}
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

"use client";

import { cn, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import {
  CustomComponents,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
// import "react-day-picker/style.css";
import { ChevronLeft, ChevronRight, Coins, Plus, Wallet2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { format, startOfWeek } from "date-fns";
import {
  useActivePayments,
  useCalendarRecords,
} from "@/lib/recurring-payments/queries";
import Link from "next/link";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";

type Props = {
  settings: Settings;
  dict: Dict["private"]["operations"]["recurring-payments"]["calendar"];
  page: number;
};

const classNames = getDefaultClassNames();

export default function Calendar({ settings, dict, page }: Props) {
  const { data: activePayments, isLoading: areActivePaymentsLoading } =
    useActivePayments(page);
  const currentDate = toZonedTime(new Date(), settings.timezone);
  const [monthDate, setMonthDate] = useState(currentDate);
  const {
    data: results,
    mutate,
    isLoading,
  } = useCalendarRecords(
    settings.timezone,
    monthDate.getMonth(),
    monthDate.getFullYear()
  );

  const components = useMemo<Partial<CustomComponents>>(
    () => ({
      MonthGrid: (props) => (
        <div className="relative">
          <table
            {...props}
            className={cn(props.className, isLoading && "opacity-0")}
          ></table>
          {isLoading && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2">
              <l-hatch />
            </div>
          )}
        </div>
      ),
      CaptionLabel: (props) => (
        <span {...props}>
          {new Intl.DateTimeFormat(settings.language, {
            month: "long",
            year: "numeric",
          }).format(monthDate)}
        </span>
      ),
      DayButton: ({ day, modifiers, children, ...props }) => {
        const result = results?.find(
          (record) => record.date === format(day.date, "yyyy-MM-dd")
        );
        return (
          <Popover offset={-2}>
            <PopoverTrigger
              {...props}
              className={cn(
                props.className,
                classNames.day_button,
                "text-center py-3 h-12 rounded cursor-pointer group-data-[outside=true]/day:opacity-40",
                format(currentDate, "yyyy-MM-dd") ===
                  format(day.date, "yyyy-MM-dd") && "bg-light border"
              )}
              role="button"
            >
              <div className="flex flex-col items-center gap-1">
                {children}
                {result && (
                  <div className="flex items-center gap-1">
                    {result.incomes.length > 0 && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                    {result.expenses.length > 0 && (
                      <div className="bg-secondary h-2 w-2 rounded-full" />
                    )}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2 flex flex-col gap-1">
                <h4 className="text-sm font-medium text-center">
                  {new Intl.DateTimeFormat(settings.language, {
                    day: "numeric",
                    weekday: "long",
                    month: "long",
                    year: "numeric",
                  }).format(day.date)}
                </h4>
                <div>
                  {result &&
                    (result.incomes.length > 0 ||
                      result.expenses.length > 0) && (
                      <div className="flex flex-col gap-2 my-2">
                        {result.incomes.map((income) => (
                          <PopoverPayment
                            payment={income as Payment}
                            type="income"
                            key={income.id}
                          />
                        ))}
                        {result.expenses.map((expense) => (
                          <PopoverPayment
                            payment={expense as Payment}
                            type="expense"
                            key={expense.id}
                          />
                        ))}
                      </div>
                    )}
                </div>
                {day.date.getTime() > currentDate.getTime() && (
                  <Link
                    href={`/recurring-payments/add?date=${format(
                      day.date,
                      "yyyy-MM-dd"
                    )}`}
                    className="flex items-center gap-2 px-4 py-2 border bg-light rounded-md w-full"
                  >
                    <Plus className="shrink-0" size={16} />
                    <div className="flex flex-col items-start">
                      <h4 className="text-small">{dict.popup.add.title}</h4>
                      <p className="text-tiny">{dict.popup.add.description}</p>
                    </div>
                  </Link>
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      NextMonthButton: (props) => (
        <div className="grid place-content-center col-start-7 col-end-8">
          <button
            {...props}
            className={cn(
              props.className,
              "h-8 w-8 border bg-light rounded flex items-center justify-center"
            )}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ),
      PreviousMonthButton: (props) => (
        <div className="grid place-content-center">
          <button
            {...props}
            className={cn(
              props.className,
              "h-8 w-8 border bg-light rounded flex items-center justify-center"
            )}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      ),
      Weekdays: (props) => (
        <thead>
          <tr {...props}>
            {Array.from(Array(7)).map((_, i) => {
              const date = startOfWeek(new Date(), { weekStartsOn: 1 });
              date.setDate(date.getDate() + i);
              const weekday = new Intl.DateTimeFormat(settings.language, {
                weekday: "short",
              }).format(date);
              return (
                <th
                  className="text-sm pt-4 pb-2 font-normal text-font/80"
                  key={weekday}
                >
                  {weekday}
                </th>
              );
            })}
          </tr>
        </thead>
      ),
    }),
    [isLoading, results]
  );

  useEffect(() => {
    if (areActivePaymentsLoading || !activePayments) return;
    mutate();
  }, [areActivePaymentsLoading, page, activePayments]);

  return (
    <DayPicker
      mode="single"
      showOutsideDays
      defaultMonth={currentDate}
      timeZone={settings.timezone}
      onMonthChange={(date) => setMonthDate(date)}
      classNames={{
        months: "flex flex-col relative",
        month_caption:
          "flex justify-center pt-1 relative items-center text-center font-medium",
        caption_label: "text-sm sm:text-base font-medium",
        nav: "absolute z-10 left-0 top-0 right-0 grid grid-cols-7",
        root: "bg-white sm:rounded-md border px-4 py-6 w-full min-w-0 self-start row-start-1 row-end-3 col-start-2 col-end-3",
        month_grid: "w-full table-fixed border-separate border-spacing-y-2",
        day: "group/day font-medium text-sm",
        button_next: "col-start-7 col-end-8 flex items-center justify-center",
      }}
      components={components}
    />
  );
}

const PopoverPayment = ({
  payment,
  type,
}: {
  payment: Payment;
  type: "income" | "expense";
}) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      {type === "income" ? (
        <Wallet2 className="text-primary" size={14} />
      ) : (
        <Coins className="text-secondary" size={14} />
      )}
      <h5 className="max-w-32 text-sm text-ellipsis overflow-hidden whitespace-nowrap">
        {payment.title}
      </h5>
    </div>
    <h6 className="font-medium">
      <NumberFormat
        amount={type === "income" ? payment.amount : -1 * payment.amount}
        currency={payment.currency}
        signDisplay="always"
      />
    </h6>
  </div>
);

// <Dropdown>
//   <Tooltip
//     offset={-4}
//     closeDelay={0}
//     content={
//       <div className="px-1 py-2">
//         <div className="text-small font-bold">
//           {new Intl.DateTimeFormat(settings.language, {
//             day: "numeric",
//             weekday: "long",
//             year: "numeric",
//           }).format(day.date)}
//         </div>
//       </div>
//     }
//   >
//     <div>
//       <DropdownTrigger
//         {...props}
//         className={cn(
//           props.className,
//           classNames.day_button,
//           "text-center py-3 bg-light border rounded cursor-pointer group-data-[outside=true]/day:opacity-40"
//         )}
//         role="button"
//       />
//     </div>
//   </Tooltip>
//   <DropdownMenu variant="faded">
//     <DropdownItem
//       className="data-[hover=true]:transition-none"
//       startContent={<Plus size={16} />}
//       description="Nowa płatność cykliczna"
//       href={`/recurring-payments/add?date=${format(
//         day.date,
//         "yyyy-MM-dd"
//       )}`}
//     >
//       Dodaj płatność
//     </DropdownItem>
//   </DropdownMenu>
// </Dropdown>

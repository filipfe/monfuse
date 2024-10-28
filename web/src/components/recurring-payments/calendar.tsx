"use client";

import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Calendar as Clndr,
  Tooltip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
// import "react-day-picker/style.css";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { format, startOfWeek } from "date-fns";

const classNames = getDefaultClassNames();

export default function Calendar({ settings }: { settings: Settings }) {
  const defaultMonth = toZonedTime(new Date(), settings.timezone);
  const [month, setMonth] = useState(defaultMonth.getMonth());

  return (
    // <Clndr
    //   isReadOnly
    //   classNames={{
    //     base: "shadow-none rounded-md border w-full [&>div]:!w-full bg-white pb-4",
    //     content: "!w-full",
    //     grid: "table-fixed",
    //     headerWrapper: "grid grid-cols-7 xl:px-1",
    //     header: "col-span-5",
    //     gridHeader: "shadow-none",
    //     gridHeaderRow: "px-4 xl:px-1",
    //     gridBody: "bg-white",
    //     gridHeaderCell: "w-full",
    //     cell: "w-full text-center [&>span]:w-full",
    //     gridBodyRow: "px-4 xl:px-1",
    //     gridWrapper: "pb-0",
    //     prevButton: "w-full",
    //     nextButton: "w-full",
    //   }}
    // ></Clndr>
    <DayPicker
      mode="single"
      showOutsideDays
      defaultMonth={defaultMonth}
      timeZone={settings.timezone}
      onMonthChange={(date) => setMonth(date.getMonth())}
      classNames={{
        months: "flex flex-col relative",
        month_caption:
          "flex justify-center pt-1 relative items-center text-center font-medium",
        caption_label: "text-sm sm:text-base font-medium",
        nav: "absolute z-10 left-0 top-0 right-0 grid grid-cols-7",
        root: "bg-white rounded-md border p-6 w-full min-w-0 self-start",
        month_grid: "w-full table-fixed border-separate border-spacing-2",
        day: "group/day font-medium text-sm",
        button_next: "col-start-7 col-end-8 flex items-center justify-center",
      }}
      components={{
        CaptionLabel: (props) => {
          const date = toZonedTime(new Date(), settings.timezone);
          date.setMonth(month);
          return (
            <span {...props}>
              {new Intl.DateTimeFormat(settings.language, {
                month: "long",
                year: "numeric",
              }).format(date)}
            </span>
          );
        },
        DayButton: ({ day, modifiers, ...props }) => (
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
          <Popover offset={-2}>
            <PopoverTrigger
              {...props}
              className={cn(
                props.className,
                classNames.day_button,
                "text-center py-3 rounded cursor-pointer group-data-[outside=true]/day:opacity-40"
              )}
              role="button"
            />
            <PopoverContent>
              <div className="px-1 py-2">
                <h4 className="text-sm font-medium text-center">
                  {new Intl.DateTimeFormat(settings.language, {
                    day: "numeric",
                    weekday: "long",
                    year: "numeric",
                  }).format(day.date)}
                </h4>
                <form action="">
                  <button className="flex items-center gap-2 px-2 py-1 hover:bg-light rounded">
                    <Plus className="shrink-0" size={16} />
                    <div className="flex flex-col items-start">
                      <h4 className="text-sm">Dodaj płatność</h4>
                      <p className="text-sm">Nowa płatność</p>
                    </div>
                  </button>
                </form>
              </div>
            </PopoverContent>
          </Popover>
        ),
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
      }}
    />
  );
}

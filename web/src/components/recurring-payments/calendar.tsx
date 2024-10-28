"use client";

import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Calendar as Clndr,
} from "@nextui-org/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
// import "react-day-picker/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toZonedTime } from "date-fns-tz";

const classNames = getDefaultClassNames();

export default function Calendar({ settings }: { settings: Settings }) {
  const [monthDate, setMonthDate] = useState<Date>(
    toZonedTime(new Date(), settings.timezone)
  );
  console.log(monthDate);
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
      timeZone={settings.timezone}
      onMonthChange={(date) => setMonthDate(date)}
      classNames={{
        months: "flex flex-col relative",
        month: "space-y-4",
        month_caption:
          "flex justify-center pt-1 relative items-center text-center font-medium",
        caption_label: "text-sm sm:text-base font-medium",
        nav: "absolute z-10 left-0 top-0 right-0 grid grid-cols-7",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        root: "bg-white rounded-md border p-6 w-full min-w-0 self-start",
        month_grid: "w-full table-fixed border-separate border-spacing-2",
        day: "group/day font-medium text-sm",
        weekday: "text-font/60 font-normal pb-2",
        button_next: "col-start-7 col-end-8 flex items-center justify-center",
      }}
      components={{
        CaptionLabel: (props) => (
          <span {...props}>
            {new Intl.DateTimeFormat(settings.language, {
              month: "long",
              year: "numeric",
            }).format(monthDate)}
          </span>
        ),
        DayButton: ({ day, modifiers, ...props }) => (
          <Dropdown>
            <DropdownTrigger
              {...props}
              className={cn(
                props.className,
                classNames.day_button,
                "text-center py-2 bg-light border rounded cursor-pointer group-data-[outside=true]/day:opacity-40"
              )}
              role="button"
            />
            <DropdownMenu>
              <DropdownItem></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ),
        NextMonthButton: (props) => (
          <div className="grid place-content-center col-start-7 col-end-8">
            <button
              {...props}
              className={cn(
                props.className,
                "h-7 w-7 border bg-light rounded flex items-center justify-center"
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
                "h-7 w-7 border bg-light rounded flex items-center justify-center"
              )}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        ),
      }}
    />
  );
}

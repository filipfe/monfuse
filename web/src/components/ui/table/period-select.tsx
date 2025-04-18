import { PeriodContext } from "@/app/(private)/(sidebar)/(operations)/providers";
import { Dict } from "@/const/dict";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Badge, DateValue, RangeCalendar, RangeValue } from "@heroui/react";
import { CalendarDaysIcon, ListRestartIcon } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

type Props = {
  dict: {
    reset: string;
  };
};

export default function PeriodSelect({ dict }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { period, setPeriod } = useContext(PeriodContext);
  const numberOfParams = Object.values(period).filter(Boolean).length;

  const onChange = ({ start, end }: RangeValue<DateValue>) => {
    setIsOpen(false);
    setPeriod({
      from: `${start.year}-${start.month < 10 ? "0" : ""}${start.month}-${
        start.day < 10 ? "0" : ""
      }${start.day}`,
      to: `${end.year}-${end.month < 10 ? "0" : ""}${end.month}-${
        end.day < 10 ? "0" : ""
      }${end.day}`,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative h-10 w-10">
          <CalendarDaysIcon size={16} />
          {numberOfParams > 0 && (
            <div className="absolute w-6 h-6 text-sm border-2 border-white bg-primary flex items-center justify-center text-primary-foreground rounded-full -right-2 -top-2">
              1
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-0 min-w-max">
        <RangeCalendar
          showShadow={false}
          // @ts-ignore
          value={
            numberOfParams === 2
              ? { start: parseDate(period.from), end: parseDate(period.to) }
              : undefined
          }
          onChange={onChange}
          classNames={{
            base: "!bg-white !shadow-none border min-w-max",
            gridHeader: "!shadow-none",
            title: "select-none",
            cell: "text-sm",
          }}
          maxValue={today(getLocalTimeZone())}
          bottomContent={
            (period.from || period.to) && (
              <div className="grid grid-cols-1 pb-2 px-2">
                <Button
                  variant="outline"
                  disabled={period.from === "" || period.to === ""}
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setPeriod({ from: "", to: "" });
                  }}
                >
                  <ListRestartIcon size={15} strokeWidth={2} /> {dict.reset}
                </Button>
              </div>
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
}

// const onChange = (range?: DateRange) => {
//   if (!range) return;
//   const { from, to } = range;
//   if (!from || !to) return;
//   setIsOpen(false);
//   setPeriod({
//     from: format(from, "yyyy-MM-dd"),
//     to: format(to, "yyyy-MM-dd"),
//   });
// };

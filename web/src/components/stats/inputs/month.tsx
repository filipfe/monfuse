import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabledKeys: string[];
};

export default function MonthInput({ value, onChange, disabledKeys }: Props) {
  const { settings } = useContext(StatsFilterContext);
  const formatter = new Intl.DateTimeFormat(settings.language, {
    month: "long",
  });

  return (
    <Select
      name="month"
      value={value.toString()}
      onValueChange={(value) => onChange(parseInt(value))}
    >
      <SelectTrigger size="sm" className="min-w-32 sm:min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from(Array(12)).map((_, k) => {
          const date = new Date();
          date.setDate(1);
          date.setMonth(k);
          const month = formatter.format(date);
          return (
            <SelectItem
              disabled={disabledKeys.includes(k.toString())}
              value={k.toString()}
              key={k.toString()}
            >
              {month.charAt(0).toUpperCase() + month.substring(1)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

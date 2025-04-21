import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { now } from "@internationalized/date";
import { useContext } from "react";

type Props = {
  value?: number;
  onChange: (value: number) => void;
};

export default function YearInput({ value, onChange }: Props) {
  const {
    settings: { timezone },
  } = useContext(StatsFilterContext);
  const { year } = now(timezone);
  return (
    <Select
      name="year"
      value={value?.toString()}
      onValueChange={(value) => onChange(parseInt(value))}
    >
      <SelectTrigger size="sm" className="min-w-20 sm:min-w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from(Array(year - 2023 + 1)).map((_, k) => (
          <SelectItem value={(k + 2023).toString()} key={(k + 2023).toString()}>
            {(k + 2023).toString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

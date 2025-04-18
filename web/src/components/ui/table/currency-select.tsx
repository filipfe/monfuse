"use client";

import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../select";

interface Props extends Partial<State> {
  className?: string;
  hideAll?: boolean;
  defaultValue?: string;
  required?: boolean;
  dict: {
    label: string;
    default?: string;
  };
}

export default function CurrencySelect({
  dict,
  value,
  onChange,
  className,
  hideAll,
  required,
  defaultValue,
}: Props) {
  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger
        required={required}
        label={dict.label}
        className={className}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {!hideAll && <SelectItem value="*">{dict.default}</SelectItem>}
        {CURRENCIES.map((curr) => (
          <SelectItem value={curr} key={curr}>
            {curr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

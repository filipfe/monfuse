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
import { useEffect, useState } from "react";

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
  value: forcedValue,
  onChange,
  className,
  hideAll,
  required,
  defaultValue,
}: Props) {
  const [value, setValue] = useState(defaultValue || forcedValue);

  useEffect(() => {
    if (!forcedValue) return;
    setValue(forcedValue);
  }, [forcedValue]);

  const onValueChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
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
      <input type="hidden" name="currency" value={value} />
    </>
  );
}
